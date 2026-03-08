/**
 * src/lib/productConstants.ts
 *
 * Single source of truth for all public-facing DefendML product numbers.
 * Import this file in landing pages and marketing components instead of
 * hardcoding numbers. Updating here propagates everywhere on next build.
 *
 * RULES (per CLAUDE.md):
 *  - NEVER use "255 scenarios" — always 295
 *  - NEVER use "40 prompts" — always 100 per scan
 *  - NEVER say "compliance" — say "coverage" or "evidence"
 *  - NEVER say "The Only" or make zero-competitor claims
 */

export const PRODUCT = {
  /** Total attack scenarios in the library */
  attackLibrarySize: 295,

  /** Prompts executed per production scan (randomly selected) */
  scanPromptCount: 100,

  /** ASL-3 safety-standard coverage rate (used in stats bar and pricing) */
  aslCoverage: '96.5%',
  aslCoverageLabel: '96.5% ASL-3 Coverage',

  /** Number of security frameworks mapped in every scan */
  frameworkCount: 6,

  /** Human-readable list of the 6 frameworks */
  frameworks: [
    'OWASP LLM Top 10',
    'NIST AI RMF',
    'MITRE ATLAS',
    'ASL-3',
    'SOC 2 / ISO 27001',
    'EU AI Act',
  ] as const,

  /** Evidence delivery window */
  deliveryHours: 24,
  deliveryLabel: '24hr',

  /** Affordability comparison vs platforms */
  affordabilityLabel: '10–80×',

  /** Official pricing (per CLAUDE.md — never price per prompt) */
  pricing: {
    free: '$0',
    pilot: '$2,500',
    standard: '$4,999',
    growth: '$9,999',
  },
} as const;

export type ProductFramework = typeof PRODUCT.frameworks[number];
