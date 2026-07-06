# Security, Compliance & Governance — Bổ sung (Nhóm C)

> Domain 5 (14%). Các standards (ISO/OWASP/GenAI Security Scoping Matrix) đã học ở phần khác — phần này bổ sung các **AWS services** cho Security (Task 5.1) và Governance/Compliance (Task 5.2). Nhớ: exam hỏi "service NÀO cho việc GÌ", nên nắm chắc trigger keyword của từng service.

---

## PHẦN A — SECURITY (Task 5.1)

### AWS IAM (Identity and Access Management)
**What it is:** Dịch vụ quản lý *ai được truy cập cái gì* trên AWS — xác thực (authentication) và phân quyền (authorization) cho users, groups, roles trên mọi AWS resource. Miễn phí, global.

**Exam-relevant points:**
- **Roles** = danh tính tạm thời, cấp quyền qua *assume role* (không có mật khẩu/long-term key). Cách ĐÚNG để một service (vd SageMaker, Lambda, Bedrock) truy cập service khác (vd S3) — không nhúng credentials.
- **Policies** = tài liệu JSON định nghĩa permissions (Allow/Deny + Action + Resource + Condition). Identity-based (gắn vào user/role) hoặc resource-based (gắn vào resource như S3 bucket).
- **Least privilege** = chỉ cấp đúng quyền tối thiểu cần thiết. Nguyên tắc bảo mật cốt lõi của exam.
- IAM lo *access control*, KHÔNG lo mã hóa dữ liệu (đó là KMS).
- Áp dụng AI/ML: gán IAM role cho SageMaker notebook để đọc training data trong S3; giới hạn ai gọi được Bedrock model.

**Chọn khi...:** "control access to AWS resources", "grant a service permission to access another", "least privilege", "who can do what", "temporary credentials for a workload".

---

### AWS KMS (Key Management Service) + Encryption in transit (TLS)
**What it is:** KMS tạo và quản lý encryption keys để **mã hóa dữ liệu at rest**. TLS/SSL mã hóa dữ liệu **in transit** (đang truyền trên mạng).

**Exam-relevant points:**
- **Encryption at rest** (dữ liệu lưu trữ, vd trong S3, EBS, SageMaker, Bedrock) → dùng **KMS** keys. Tích hợp sẵn với hầu hết service AWS.
- **Encryption in transit** (dữ liệu di chuyển giữa client ↔ service) → dùng **TLS (HTTPS)**.
- KMS: customer-managed keys (CMK) cho phép bạn kiểm soát key, audit việc dùng key qua CloudTrail.
- Bảo vệ training data, model artifacts, prompts/completions bằng cách bật mã hóa.
- **Đừng nhầm:** KMS ≠ Secrets Manager. KMS = quản lý encryption **keys**; Secrets Manager = lưu & tự động xoay vòng **secrets** (mật khẩu DB, API keys).

**Chọn khi...:** "encrypt data at rest" → KMS; "protect data as it travels / in transit" → TLS; "manage encryption keys".

---

### Amazon Macie
**What it is:** Dịch vụ dùng ML để **tự động phát hiện, phân loại và bảo vệ dữ liệu nhạy cảm (PII) trong Amazon S3**.

**Exam-relevant points:**
- Chuyên biệt cho **S3** — quét bucket để tìm PII (số CMND, thẻ tín dụng, thông tin sức khỏe...).
- Cảnh báo về bucket cấu hình sai (public, không mã hóa).
- Quan trọng cho AI/ML: kiểm tra training dataset trong S3 không chứa PII rò rỉ trước khi fine-tune.
- **Đừng nhầm:**
  - **Macie** = tìm **dữ liệu nhạy cảm/PII trong S3** (data-centric).
  - **Inspector** = quét **lỗ hổng phần mềm** (EC2, container, Lambda).
  - **GuardDuty** = phát hiện **hành vi đe dọa/threat** (mối đe dọa đang xảy ra) — *ngoài scope exam nhưng hay làm distractor*.

**Chọn khi...:** "discover / classify / protect sensitive data or PII", "find PII in S3".

---

### AWS PrivateLink
**What it is:** Cung cấp **private connectivity** giữa VPC và các AWS service (hoặc SaaS) mà **traffic không đi qua public internet**.

**Exam-relevant points:**
- Traffic đi trong mạng AWS, không phơi ra internet → giảm bề mặt tấn công (infrastructure protection).
- Dùng để gọi Bedrock, SageMaker endpoint, S3... một cách riêng tư từ trong VPC.
- Interface VPC endpoint = cách triển khai PrivateLink.
- **Đừng nhầm:** PrivateLink = giữ traffic *private/off the public internet*. Khác IAM (access control) và KMS (encryption).

**Chọn khi...:** "keep traffic off the public internet", "private connectivity to a service", "access Bedrock/SageMaker privately from a VPC".

---

### AWS Shared Responsibility Model
**What it is:** Mô hình phân chia trách nhiệm bảo mật: **AWS lo security *của* cloud**, **customer lo security *trong* cloud**.

**Exam-relevant points:**
- **AWS chịu trách nhiệm ("of the cloud"):** hardware, hạ tầng vật lý, mạng, các managed service — vd bảo mật hạ tầng chạy Bedrock/SageMaker.
- **Customer chịu trách nhiệm ("in the cloud"):** dữ liệu của mình, IAM cấu hình quyền, mã hóa, cấu hình network, quản lý ai truy cập model & data.
- Áp dụng AI/ML: AWS bảo mật nền tảng Bedrock; **bạn** chịu trách nhiệm phân quyền IAM, mã hóa training data, quản lý prompt/output, chất lượng & quyền riêng tư của dữ liệu.
- Với managed AI service (Bedrock), phần khách hàng lo ít hơn nhưng **vẫn luôn giữ trách nhiệm về DỮ LIỆU và ACCESS**.

**Chọn khi...:** "who is responsible for X — AWS or customer", "security *of* vs *in* the cloud". Nhớ: **data + access luôn là của customer**.

---

### Data security concepts (khái niệm cần nắm)
| Khái niệm | Nghĩa & cue exam |
|---|---|
| **Data lineage** | Nguồn gốc & lịch sử biến đổi của dữ liệu — dữ liệu đến từ đâu, đã qua xử lý gì. Cho *source citation / documenting data origins*. |
| **Data cataloging** | Kiểm kê & tổ chức metadata của tài sản dữ liệu (vd **AWS Glue Data Catalog**) để biết mình có dữ liệu gì, ở đâu. |
| **Prompt injection** | Tấn công nhồi chỉ dẫn độc hại vào prompt để "hijack" model làm việc ngoài ý muốn/bỏ qua guardrails. Phòng bằng input validation + **Guardrails for Amazon Bedrock**. |
| **Threat detection** | Phát hiện hoạt động đáng ngờ/độc hại (GuardDuty là ví dụ điển hình). |
| **Vulnerability management** | Tìm & vá lỗ hổng phần mềm/cấu hình → **Amazon Inspector**. |
| **Infrastructure protection** | Bảo vệ ranh giới mạng & compute: VPC, security groups, PrivateLink, WAF. |
| **Encryption at rest / in transit** | at rest = KMS; in transit = TLS. |

**Source citation / data origin (5.1):** dùng **data lineage + data cataloging + SageMaker Model Cards** để tài liệu hóa nguồn gốc dữ liệu và mô hình.

---

## PHẦN B — GOVERNANCE & COMPLIANCE (Task 5.2)

### AWS Config
**What it is:** **Đánh giá, ghi lại (record) và audit cấu hình** của AWS resources theo thời gian, và kiểm tra chúng có tuân thủ rules/compliance không.

**Exam-relevant points:**
- Trả lời câu hỏi: "**Resource của tôi được cấu hình NHƯ THẾ NÀO, và có tuân thủ không?**"
- Ghi lại configuration history & thay đổi cấu hình theo thời gian.
- Config Rules tự động đánh giá compliance (vd "mọi S3 bucket phải mã hóa").
- **Đừng nhầm (rất hay hỏi):**
  - **Config** = trạng thái/cấu hình *resource* & compliance của nó.
  - **CloudTrail** = ghi log *ai đã gọi API nào, khi nào* (hành động).
  - Nhớ: Config = "**cấu hình cái gì**", CloudTrail = "**ai làm gì**".

**Chọn khi...:** "assess/record/audit resource configuration", "is my resource compliant with config rules", "configuration change history".

---

### Amazon Inspector
**What it is:** Dịch vụ **tự động quét lỗ hổng bảo mật (vulnerability scanning)** cho workload — EC2, container images (ECR), Lambda.

**Exam-relevant points:**
- Tự động, liên tục phát hiện CVE/lỗ hổng phần mềm & network exposure.
- Cho **vulnerability management** trong hạ tầng chạy AI/ML.
- **Đừng nhầm:** Inspector = **lỗ hổng phần mềm/CVE**; Macie = **PII trong S3**; Config = **cấu hình sai lệch/compliance**.

**Chọn khi...:** "automated vulnerability scanning", "find CVEs / software vulnerabilities in EC2/containers/Lambda".

---

### AWS Audit Manager
**What it is:** **Tự động thu thập bằng chứng (evidence)** về việc sử dụng AWS và **ánh xạ (map) vào các compliance frameworks** (SOC, PCI, GDPR, ISO...) để chuẩn bị audit.

**Exam-relevant points:**
- Liên tục thu thập evidence, giúp bạn *sẵn sàng cho kỳ audit* của chính tổ chức mình.
- Có framework dựng sẵn + tùy chỉnh; giảm công thu thập bằng chứng thủ công.
- **Đừng nhầm (hay hỏi):**
  - **Audit Manager** = thu thập **bằng chứng về workload CỦA BẠN** để audit theo framework.
  - **AWS Artifact** = tải **báo cáo compliance của CHÍNH AWS** (AWS đã được chứng nhận).
  - Câu thần chú: Audit Manager = *your evidence*; Artifact = *AWS's reports*.

**Chọn khi...:** "collect evidence for an audit", "map controls to a compliance framework", "continuously audit my own usage".

---

### AWS Artifact
**What it is:** Cổng **tự phục vụ để tải các báo cáo compliance của AWS** (SOC 1/2/3, ISO, PCI DSS...) và quản lý agreements.

**Exam-relevant points:**
- Nơi lấy bằng chứng rằng **AWS** tuân thủ các chuẩn — đưa cho auditor/khách hàng của bạn.
- KHÔNG đánh giá tài nguyên của bạn — chỉ là kho tài liệu của AWS.
- **Đừng nhầm:** cần **báo cáo SOC/ISO của AWS để tải về** → Artifact. Cần **tự thu thập evidence** → Audit Manager.

**Chọn khi...:** "download AWS SOC / ISO / PCI compliance reports", "get AWS's audit reports/certifications".

---

### AWS CloudTrail
**What it is:** Ghi log **mọi API call / hoạt động** trong tài khoản AWS — audit trail đầy đủ về *ai, làm gì, khi nào, từ đâu*.

**Exam-relevant points:**
- Cốt lõi cho **audit / accountability / forensics**. Ghi lại API calls (console, CLI, SDK).
- Dùng để truy vết ai gọi Bedrock, ai sửa IAM policy, ai truy cập S3...
- Log lưu vào S3 (có thể mã hóa KMS) → phục vụ retention & compliance.
- **Đừng nhầm:**
  - **CloudTrail** = log *API activity* (ai làm gì) — audit trail.
  - **CloudWatch** = *metrics/logs & monitoring* hiệu năng, cảnh báo (operational, không phải audit trail).
  - **Config** = trạng thái cấu hình resource.

**Chọn khi...:** "log API activity", "audit trail", "who called which API and when", "track user actions for compliance".

---

### AWS Trusted Advisor
**What it is:** Kiểm tra tự động, đưa **khuyến nghị best-practice** theo 5 trụ: cost optimization, performance, security, fault tolerance, service limits.

**Exam-relevant points:**
- Gợi ý khắc phục theo best practice (vd bucket S3 public, MFA chưa bật, quota sắp đầy).
- Là công cụ *recommendation/checks*, không phải kho tài liệu hay log.
- **Đừng nhầm:** Trusted Advisor = **checks & khuyến nghị real-time** trên tài khoản; Well-Architected Tool = **review kiến trúc theo bảng câu hỏi/workload**.

**Chọn khi...:** "best-practice checks / recommendations", "optimize cost, security, performance, fault tolerance, service limits".

---

### AWS Well-Architected Tool
**What it is:** Công cụ **review kiến trúc workload** dựa trên AWS Well-Architected Framework (các pillar: Operational Excellence, Security, Reliability, Performance Efficiency, Cost Optimization, Sustainability).

**Exam-relevant points:**
- Bạn trả lời bộ câu hỏi → tool chỉ ra rủi ro & cải tiến cho *thiết kế* workload.
- Mang tính *đánh giá thiết kế/governance*, không phải quét tự động như Trusted Advisor.

**Chọn khi...:** "review my workload/architecture against best-practice pillars", "evaluate architecture design".

---

### AWS Budgets & AWS Cost Explorer (cost governance)
**What it is:** Hai công cụ quản trị chi phí. **Cost Explorer** = phân tích & trực quan hóa chi phí *đã qua* + dự báo. **Budgets** = đặt ngưỡng chi phí/usage và **cảnh báo khi vượt**.

**Exam-relevant points:**
- **Cost Explorer** → *phân tích/hiểu* xu hướng chi tiêu (vd chi phí token Bedrock, inference SageMaker theo thời gian).
- **Budgets** → *đặt giới hạn + alert chủ động* khi chi phí/usage vượt ngưỡng.
- Cost governance cho AI/ML: theo dõi chi phí inference/token, tránh vượt ngân sách.
- **Đừng nhầm:** Cost Explorer = *analyze/visualize* (nhìn lại + forecast); Budgets = *set limit + alert* (chủ động cảnh báo).

**Chọn khi...:** "get alerted when spending exceeds a threshold" → Budgets; "analyze/visualize/forecast past spend" → Cost Explorer.

---

### Compliance standards
| Chuẩn | Ý nghĩa cho exam |
|---|---|
| **ISO** (International Organization for Standardization) | Bộ chuẩn quốc tế. Vd **ISO/IEC 27001** (information security). |
| **ISO/IEC 42001** | Chuẩn quốc tế **đầu tiên cho AI Management System (AIMS)** — quản trị việc phát triển & dùng AI có trách nhiệm. AWS đã đạt chứng nhận. Cue: "AI management system standard". |
| **SOC** (System and Organization Controls) | Báo cáo SOC 1/2/3 về kiểm soát nội bộ của nhà cung cấp dịch vụ. Tải qua **AWS Artifact**. |
| **Algorithm accountability laws** | Luật yêu cầu minh bạch/công bằng/không thiên vị & chịu trách nhiệm cho hệ thống ra quyết định tự động (vd EU AI Act). Cue: "regulation requiring transparency/fairness/accountability of algorithms". |

---

### Data governance strategies
| Chiến lược | Nghĩa & cue exam |
|---|---|
| **Data lifecycle** | Quản lý dữ liệu từ tạo → dùng → lưu trữ → xóa (vd S3 Lifecycle chuyển sang Glacier rồi hết hạn). |
| **Logging** | Ghi log hoạt động & truy cập (CloudTrail, CloudWatch) để audit & giám sát. |
| **Residency** | **Data residency** = dữ liệu phải nằm trong region/quốc gia cụ thể (chọn AWS Region phù hợp để tuân thủ luật địa phương). |
| **Retention** | Giữ dữ liệu bao lâu theo yêu cầu pháp lý/compliance rồi mới xóa. |
| **Monitoring / observation** | Theo dõi liên tục hệ thống, dữ liệu, model để phát hiện bất thường/drift. |

**Governance protocols (5.2):** policies, review cadence, governance frameworks (vd **Generative AI Security Scoping Matrix**), transparency standards, team training — đã học ở phần chuẩn.

---

## CHEAT — service nào cho việc gì?

| Việc cần làm | Service | 
|---|---|
| Ghi log API call / audit trail (ai làm gì, khi nào) | **AWS CloudTrail** |
| Đánh giá & ghi lại **cấu hình** resource + compliance rules | **AWS Config** |
| Phát hiện / bảo vệ **PII trong S3** | **Amazon Macie** |
| **Quét lỗ hổng** (CVE) EC2/container/Lambda | **Amazon Inspector** |
| Tải **báo cáo SOC/ISO của AWS** | **AWS Artifact** |
| **Thu thập evidence** & map vào framework để audit *của bạn* | **AWS Audit Manager** |
| **Khuyến nghị best-practice** (cost/security/perf/limits) | **AWS Trusted Advisor** |
| **Review kiến trúc** theo 6 pillar | **AWS Well-Architected Tool** |
| **Cảnh báo khi vượt ngân sách** | **AWS Budgets** |
| **Phân tích/visualize chi phí** đã qua + forecast | **AWS Cost Explorer** |
| Kiểm soát **ai truy cập gì** (roles, least privilege) | **AWS IAM** |
| **Mã hóa at rest** / quản lý keys | **AWS KMS** |
| **Mã hóa in transit** | **TLS / HTTPS** |
| Lưu & xoay vòng **secrets** (mật khẩu, API key) | **AWS Secrets Manager** |
| Giữ traffic **private, off public internet** | **AWS PrivateLink** |
| Monitor metrics/logs & cảnh báo **vận hành** | **Amazon CloudWatch** |

### Cặp DỄ NHẦM — nhớ nhanh
- **Config vs CloudTrail:** Config = *cấu hình resource* (state); CloudTrail = *API activity* (ai làm gì).
- **CloudTrail vs CloudWatch:** CloudTrail = audit *API calls*; CloudWatch = *monitoring* metrics/logs vận hành.
- **Macie vs Inspector vs GuardDuty:** Macie = *PII trong S3*; Inspector = *lỗ hổng phần mềm*; GuardDuty = *threat detection* (hành vi độc hại).
- **Artifact vs Audit Manager:** Artifact = tải *báo cáo của AWS*; Audit Manager = thu thập *evidence của bạn*.
- **Trusted Advisor vs Well-Architected Tool:** Trusted Advisor = *checks tự động + khuyến nghị*; WA Tool = *review thiết kế kiến trúc*.
- **KMS vs Secrets Manager:** KMS = *encryption keys*; Secrets Manager = *secrets (mật khẩu/API key) + auto-rotate*.
- **Budgets vs Cost Explorer:** Budgets = *đặt ngưỡng + alert*; Cost Explorer = *phân tích/visualize/forecast*.
