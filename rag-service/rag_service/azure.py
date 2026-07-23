"""Azure OpenAI client factories.

Thin, cached wrappers around ``langchain-openai`` so the rest of the service never
constructs clients directly. Timeouts and retries come from central config.
"""

from __future__ import annotations

import functools

from langchain_openai import AzureChatOpenAI, AzureOpenAIEmbeddings

from .config import get_settings


@functools.lru_cache(maxsize=1)
def get_chat_model() -> AzureChatOpenAI:
    """Chat model used by every LangGraph node.

    ``temperature`` is left unset so we do not send an unsupported value to
    deployments that only accept the default. Non-streaming responses carry
    ``usage_metadata`` automatically; the streaming path requests usage via
    ``stream_options`` (see :func:`get_streaming_chat_model`).
    """
    s = get_settings()
    return AzureChatOpenAI(
        azure_deployment=s.azure_chat_deployment,
        azure_endpoint=s.azure_openai_endpoint,
        api_key=s.azure_openai_api_key,
        api_version=s.azure_openai_api_version,
        timeout=s.request_timeout,
        max_retries=s.max_retries,
    )


@functools.lru_cache(maxsize=1)
def get_streaming_chat_model() -> AzureChatOpenAI:
    """Chat model tuned for token streaming that also reports token usage.

    ``stream_options={"include_usage": True}`` makes Azure/OpenAI emit a final
    usage chunk during streaming so cost accounting stays accurate on the SSE path.
    """
    s = get_settings()
    return AzureChatOpenAI(
        azure_deployment=s.azure_chat_deployment,
        azure_endpoint=s.azure_openai_endpoint,
        api_key=s.azure_openai_api_key,
        api_version=s.azure_openai_api_version,
        timeout=s.request_timeout,
        max_retries=s.max_retries,
        model_kwargs={"stream_options": {"include_usage": True}},
    )


@functools.lru_cache(maxsize=1)
def get_embeddings() -> AzureOpenAIEmbeddings:
    s = get_settings()
    return AzureOpenAIEmbeddings(
        azure_deployment=s.azure_embed_deployment,
        azure_endpoint=s.azure_openai_endpoint,
        api_key=s.azure_openai_api_key,
        api_version=s.azure_openai_api_version,
        timeout=s.request_timeout,
        max_retries=s.max_retries,
    )


def reset_caches() -> None:
    """Clear cached clients (used by tests after monkeypatching settings)."""
    get_chat_model.cache_clear()
    get_streaming_chat_model.cache_clear()
    get_embeddings.cache_clear()
