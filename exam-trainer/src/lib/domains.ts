import type { Domain } from '../types';

export const DOMAIN_NAMES: Record<Domain, string> = {
  1: 'Fundamentals of AI & ML',
  2: 'Fundamentals of Generative AI',
  3: 'Applications of Foundation Models',
  4: 'Guidelines for Responsible AI',
  5: 'Security, Compliance & Governance',
};

export const DOMAIN_WEIGHT: Record<Domain, number> = {
  1: 0.20, 2: 0.24, 3: 0.28, 4: 0.14, 5: 0.14,
};

// Questions per domain in a 65-question exam (from the official weights, rounded to 65).
export const EXAM_SIZE = 65;
export const EXAM_PER_DOMAIN: Record<Domain, number> = { 1: 13, 2: 16, 3: 18, 4: 9, 5: 9 };
export const EXAM_MINUTES = 90;
export const PASS_SCALED = 700; // 100..1000 scale

export const ALL_DOMAINS: Domain[] = [1, 2, 3, 4, 5];
