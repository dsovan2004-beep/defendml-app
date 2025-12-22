// /lib/analysis/attack-intelligence.ts

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface RedTeamResult {
  prompt_id: string;
  prompt: string;
  category: string;          // "CBRN Threat", "Jailbreak", etc.
  decision: "BLOCK" | "FLAG" | "ALLOW";
  layer_stopped: string | null;     // "L1", "L2", "L3", "L4", null if ALLOW
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface AttackIntelligence {
  technique_id: string;
  technique_name: string;
  mitre_atlas_id: string;
  category: string;
  severity: string;
  attempts: number;
  successes: number;
  success_rate: number;
  first_seen: Date;
  last_seen: Date;
  layer_breakdown: {
    L1: number;
    L2: number;
    L3: number;
    L4: number;
  };
  evasion_variants: string[];
  sample_prompts: string[];
}

// ============================================================================
// CATEGORY TO MITRE ATLAS MAPPING
// ============================================================================

const CATEGORY_TO_MITRE: Record<string, string> = {
  "CBRN Threat": "AML.T0015.001",
  "Jailbreak": "AML.T0043.001",
  "Jailbreak Attempt": "AML.T0043.002",
  "PII Leak": "AML.T0020.001",
  "PII": "AML.T0020.001",
  "Hate Speech": "AML.T0040.001",
  "Violence": "AML.T0040.001",
  "Self-harm": "AML.T0040.001",
  "Sexual Content": "AML.T0040.001",
  "Fraud": "AML.T0018.001",
  "Malware": "AML.T0043.002",
  "Illegal Activity": "AML.T0040.001",
  "Policy Violation": "AML.T0040.001",
};

async function mapCategoryToTechnique(category: string): Promise<any> {
  const mitre_id = CATEGORY_TO_MITRE[category] || "AML.T0043.001";
  
  const { data, error } = await supabase
    .from('attack_techniques')
    .select('*')
    .eq('mitre_atlas_id', mitre_id)
    .single();
  
  if (error) {
    console.error(`Failed to map category ${category}:`, error);
    // Fallback to generic jailbreak
    const { data: fallback } = await supabase
      .from('attack_techniques')
      .select('*')
      .eq('mitre_atlas_id', 'AML.T0043.001')
      .single();
    return fallback;
  }
  
  return data;
}

// ============================================================================
// EVASION DETECTION
// ============================================================================

function detectEvasionTechniques(prompts: string[]): string[] {
  const variants = new Set<string>();
  
  for (const prompt of prompts) {
    const lower = prompt.toLowerCase();
    
    // Base64 encoding detection
    const base64Pattern = /^[A-Za-z0-9+/]{20,}={0,2}$/;
    if (base64Pattern.test(prompt.replace(/\s/g, ''))) {
      variants.add("Base64 Encoding");
    }
    
    // ROT13/Caesar cipher detection
    const hasUnusualChars = /[^a-zA-Z0-9\s.,!?'"()-]/.test(prompt);
    if (hasUnusualChars) {
      variants.add("Character Substitution");
    }
    
    // Unicode obfuscation
    if (/[\u0300-\u036f\u1ab0-\u1aff\u1dc0-\u1dff]/.test(prompt)) {
      variants.add("Unicode Obfuscation");
    }
    
    // Context confusion keywords
    const contextConfusion = [
      "forget previous", "ignore instructions", "new instructions",
      "hypothetical", "roleplay", "pretend", "imagine"
    ];
    if (contextConfusion.some(phrase => lower.includes(phrase))) {
      variants.add("Context Confusion");
    }
    
    // Synonym substitution indicators (unusual word choices)
    const synonymPatterns = [
      /craft|produce|generate/i,
      /acquire|obtain|procure/i,
      /construct|assemble|build/i
    ];
    if (synonymPatterns.some(pattern => pattern.test(prompt))) {
      variants.add("Synonym Substitution");
    }
    
    // Obfuscation via spacing
    if (/[a-z]\s+[a-z]\s+[a-z]/i.test(prompt)) {
      variants.add("Character Spacing");
    }
  }
  
  return Array.from(variants);
}

// ============================================================================
// SAMPLE PROMPT SELECTION
// ============================================================================

function selectSamplePrompts(results: RedTeamResult[], maxCount: number = 5): string[] {
  // Prioritize successful attacks first, then representative failures
  const successes = results.filter(r => r.decision === "ALLOW");
  const failures = results.filter(r => r.decision !== "ALLOW");
  
  const samples: string[] = [];
  
  // Add up to 3 successful attacks
  samples.push(...successes.slice(0, 3).map(r => r.prompt));
  
  // Fill remaining with failures
  const remaining = maxCount - samples.length;
  if (remaining > 0) {
    samples.push(...failures.slice(0, remaining).map(r => r.prompt));
  }
  
  return samples;
}

// ============================================================================
// MAIN ANALYSIS FUNCTION
// ============================================================================

export async function analyzeAttackIntelligence(
  report_id: string,
  results: RedTeamResult[]
): Promise<AttackIntelligence[]> {
  
  console.log(`[Attack Intelligence] Analyzing ${results.length} results for report ${report_id}`);
  
  // Group results by attack technique
  const techniqueMap = new Map<string, {
    technique: any;
    attempts: RedTeamResult[];
    successes: RedTeamResult[];
  }>();
  
  for (const result of results) {
    const technique = await mapCategoryToTechnique(result.category);
    
    if (!techniqueMap.has(technique.id)) {
      techniqueMap.set(technique.id, {
        technique,
        attempts: [],
        successes: []
      });
    }
    
    const bucket = techniqueMap.get(technique.id)!;
    bucket.attempts.push(result);
    
    // Success = bypassed all 4 layers
    if (result.decision === "ALLOW") {
      bucket.successes.push(result);
    }
  }
  
  // Generate intelligence per technique
  const intelligence: AttackIntelligence[] = [];
  
  for (const [technique_id, data] of techniqueMap) {
    const { technique, attempts, successes } = data;
    
    // Analyze which layers stopped attacks
    const layer_breakdown = {
      L1: 0,
      L2: 0,
      L3: 0,
      L4: 0
    };
    
    for (const result of attempts) {
      if (result.layer_stopped) {
        const layer = result.layer_stopped as keyof typeof layer_breakdown;
        layer_breakdown[layer]++;
      }
    }
    
    // Detect evasion variants
    const all_prompts = attempts.map(r => r.prompt);
    const evasion_variants = detectEvasionTechniques(all_prompts);
    
    // Select sample prompts
    const sample_prompts = selectSamplePrompts(attempts, 5);
    
    // Calculate timestamps
    const timestamps = attempts.map(r => r.timestamp);
    const first_seen = new Date(Math.min(...timestamps.map(t => t.getTime())));
    const last_seen = new Date(Math.max(...timestamps.map(t => t.getTime())));
    
    const intel: AttackIntelligence = {
      technique_id,
      technique_name: technique.technique_name,
      mitre_atlas_id: technique.mitre_atlas_id,
      category: technique.category,
      severity: technique.severity,
      attempts: attempts.length,
      successes: successes.length,
      success_rate: (successes.length / attempts.length) * 100,
      first_seen,
      last_seen,
      layer_breakdown,
      evasion_variants,
      sample_prompts
    };
    
    intelligence.push(intel);
  }
  
  // Store in database
  await storeAttackIntelligence(report_id, intelligence);
  
  console.log(`[Attack Intelligence] Generated ${intelligence.length} intelligence records`);
  
  return intelligence;
}

// ============================================================================
// DATABASE STORAGE
// ============================================================================

async function storeAttackIntelligence(
  report_id: string,
  intelligence: AttackIntelligence[]
): Promise<void> {
  
  const records = intelligence.map(intel => ({
    report_id,
    technique_id: intel.technique_id,
    attempts: intel.attempts,
    successes: intel.successes,
    first_seen: intel.first_seen.toISOString(),
    last_seen: intel.last_seen.toISOString(),
    layer_breakdown: intel.layer_breakdown,
    evasion_variants: intel.evasion_variants,
    sample_prompts: intel.sample_prompts,
  }));
  
  const { error } = await supabase
    .from('attack_intelligence')
    .upsert(records, {
      onConflict: 'report_id,technique_id'
    });
  
  if (error) {
    console.error('[Attack Intelligence] Failed to store:', error);
    throw error;
  }
  
  console.log(`[Attack Intelligence] Stored ${records.length} records for report ${report_id}`);
}

// ============================================================================
// QUERY FUNCTIONS
// ============================================================================

export async function getAttackIntelligence(
  report_id: string
): Promise<AttackIntelligence[]> {
  
  const { data, error } = await supabase
    .from('attack_intelligence')
    .select(`
      *,
      technique:attack_techniques(*)
    `)
    .eq('report_id', report_id)
    .order('success_rate', { ascending: false });
  
  if (error) {
    console.error('[Attack Intelligence] Query failed:', error);
    return [];
  }
  
  return data.map((row: any) => ({
    technique_id: row.technique_id,
    technique_name: row.technique.technique_name,
    mitre_atlas_id: row.technique.mitre_atlas_id,
    category: row.technique.category,
    severity: row.technique.severity,
    attempts: row.attempts,
    successes: row.successes,
    success_rate: row.success_rate,
    first_seen: new Date(row.first_seen),
    last_seen: new Date(row.last_seen),
    layer_breakdown: row.layer_breakdown,
    evasion_variants: row.evasion_variants,
    sample_prompts: row.sample_prompts,
  }));
}
