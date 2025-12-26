// /lib/analysis/remediation-generator.ts
// Generates remediation recommendations for CUSTOMER AI systems based on DefendML's attack results

import Anthropic from "@anthropic-ai/sdk";
import { createClient } from '@supabase/supabase-js';
import type { AttackIntelligence } from './attack-intelligence';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface RemediationPlaybook {
  priority: "IMMEDIATE" | "SHORT_TERM" | "LONG_TERM";
  effort_hours: number;
  root_cause: string;
  attack_vector: string;
  remediation_steps: Array<{
    step: number;
    action: string;
    details: string;
  }>;
  code_snippet: string;
  test_cases: string[];
  deployment_notes: string;
}

// ============================================================================
// PRIORITY CALCULATION
// ============================================================================

function calculatePriority(intel: AttackIntelligence): "IMMEDIATE" | "SHORT_TERM" | "LONG_TERM" {
  // IMMEDIATE: CRITICAL severity OR success rate > 50% (TARGET's defenses are severely compromised)
  if (intel.severity === "CRITICAL" || intel.success_rate > 50) {
    return "IMMEDIATE";
  }
  
  // SHORT_TERM: HIGH severity OR success rate 20-50% (TARGET has significant gaps)
  if (intel.severity === "HIGH" || intel.success_rate >= 20) {
    return "SHORT_TERM";
  }
  
  // LONG_TERM: Everything else
  return "LONG_TERM";
}

// ============================================================================
// GENERATE REMEDIATION PLAYBOOK FOR CUSTOMER
// ============================================================================

export async function generateRemediationPlaybook(
  intel: AttackIntelligence
): Promise<RemediationPlaybook> {
  
  console.log(`[Remediation] Generating customer remediation playbook for ${intel.technique_name}`);
  
  const priority = calculatePriority(intel);
  
  const prompt = `You are DefendML's AI security advisor generating remediation guidance for a CUSTOMER's AI system.

DefendML executed red team attacks against the CUSTOMER's AI system. Here are the results:

ATTACK TECHNIQUE USED BY DEFENDML:
- Technique: ${intel.technique_name} (${intel.mitre_atlas_id})
- Category: ${intel.category}
- Severity: ${intel.severity}
- Attack Success Rate: ${intel.success_rate.toFixed(1)}% (DefendML's attacks bypassed customer defenses)
- Total Attack Attempts: ${intel.attempts}
- Successful Bypasses: ${intel.successes} (customer's system FAILED to block these)

CUSTOMER'S DEFENSE LAYER ANALYSIS:
${Object.entries(intel.layer_breakdown)
  .map(([layer, count]) => `- ${layer}: Blocked ${count} of DefendML's attack attempts`)
  .join('\n')}

EVASION TECHNIQUES DEFENDML USED:
${intel.evasion_variants.length > 0 
  ? intel.evasion_variants.map(v => `- ${v}`).join('\n')
  : '- Standard attack vectors (no evasion needed)'}

SAMPLE ATTACK PROMPTS THAT SUCCEEDED:
${intel.sample_prompts.slice(0, 3).map((p, i) => `${i+1}. "${p.slice(0, 150)}${p.length > 150 ? '...' : ''}"`).join('\n')}

Generate a remediation playbook for the CUSTOMER to fix THEIR AI system's vulnerabilities.

Return JSON in this exact structure:
{
  "effort_hours": <integer between 1-40>,
  "root_cause": "<2-3 sentence explanation of why CUSTOMER's defenses failed>",
  "attack_vector": "<1-2 sentence description of how DefendML's attacks succeeded>",
  "remediation_steps": [
    {
      "step": 1,
      "action": "<what CUSTOMER needs to do>",
      "details": "<how CUSTOMER should implement it>"
    }
  ],
  "code_snippet": "<TypeScript/Python code for CUSTOMER to strengthen THEIR AI defense architecture>",
  "test_cases": ["<how CUSTOMER can verify their fixes work against similar attacks>"],
  "deployment_notes": "<rollout strategy for CUSTOMER's engineering team>"
}

CRITICAL GUIDELINES:
- This is advice for the CUSTOMER to fix THEIR system (not DefendML)
- Provide 3-5 remediation steps the CUSTOMER should implement
- Code should help CUSTOMER add defense layers: input validation, content filtering, output sanitization
- Effort estimate: IMMEDIATE (4-8h), SHORT_TERM (8-24h), LONG_TERM (24-40h)
- Test cases should use variations of DefendML's attack prompts above
- Be specific and actionable - CUSTOMER's engineers will implement this
- Frame everything as "TARGET should..." or "CUSTOMER must..." (not "DefendML should...")

Return ONLY the JSON object, no additional text.`;

  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4000,
      messages: [{
        role: "user",
        content: prompt
      }]
    });
    
    const content = response.content[0];
    if (content.type !== "text") {
      throw new Error("Expected text response from Claude");
    }
    
    // Extract JSON from response
    const jsonMatch = content.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('[Remediation] No JSON found in response:', content.text);
      throw new Error("No JSON found in Claude response");
    }
    
    const parsed = JSON.parse(jsonMatch[0]);
    
    const playbook: RemediationPlaybook = {
      priority,
      effort_hours: parsed.effort_hours,
      root_cause: parsed.root_cause,
      attack_vector: parsed.attack_vector,
      remediation_steps: parsed.remediation_steps,
      code_snippet: parsed.code_snippet,
      test_cases: parsed.test_cases,
      deployment_notes: parsed.deployment_notes
    };
    
    console.log(`[Remediation] Generated ${priority} priority playbook for customer (${playbook.effort_hours}h effort)`);
    
    return playbook;
    
  } catch (error) {
    console.error('[Remediation] Failed to generate customer playbook:', error);
    throw error;
  }
}

// ============================================================================
// GENERATE ALL PLAYBOOKS FOR CUSTOMER
// ============================================================================

export async function generateAllPlaybooks(
  report_id: string,
  intelligence: AttackIntelligence[]
): Promise<void> {
  
  console.log(`[Remediation] Generating customer remediation playbooks for ${intelligence.length} attack techniques`);
  
  // Prioritize by risk: CRITICAL severity first, then by attack success rate
  const prioritized = intelligence
    .filter(i => i.success_rate > 5) // Only generate for techniques with >5% success (attacks that bypassed customer defenses)
    .sort((a, b) => {
      // Sort by severity first
      const severityOrder: Record<string, number> = {
        'CRITICAL': 0,
        'HIGH': 1,
        'MEDIUM': 2,
        'LOW': 3
      };
      
      if (severityOrder[a.severity] !== severityOrder[b.severity]) {
        return severityOrder[a.severity] - severityOrder[b.severity];
      }
      
      // Then by attack success rate (higher = more urgent for customer to fix)
      return b.success_rate - a.success_rate;
    });
  
  let generated = 0;
  let failed = 0;
  
  for (const intel of prioritized) {
    try {
      const playbook = await generateRemediationPlaybook(intel);
      
      // Get attack_intel_id from database
      const { data: attackIntel } = await supabase
        .from('attack_intelligence')
        .select('id')
        .eq('report_id', report_id)
        .eq('technique_id', intel.technique_id)
        .single();
      
      if (!attackIntel) {
        console.error(`[Remediation] No attack_intelligence record found for technique ${intel.technique_id}`);
        failed++;
        continue;
      }
      
      // Store playbook for customer
      const { error } = await supabase
        .from('remediation_playbooks')
        .insert({
          attack_intel_id: attackIntel.id,
          priority: playbook.priority,
          effort_hours: playbook.effort_hours,
          root_cause: playbook.root_cause,
          attack_vector: playbook.attack_vector,
          remediation_steps: playbook.remediation_steps,
          code_snippet: playbook.code_snippet,
          test_cases: playbook.test_cases,
          deployment_notes: playbook.deployment_notes
        });
      
      if (error) {
        console.error(`[Remediation] Failed to store customer playbook:`, error);
        failed++;
      } else {
        generated++;
        console.log(`✅ Generated customer remediation for ${intel.technique_name} (${playbook.priority})`);
      }
      
      // Rate limit: Wait 1s between requests to avoid hitting Claude API limits
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.error(`❌ Failed to generate customer playbook for ${intel.technique_name}:`, error);
      failed++;
    }
  }
  
  console.log(`[Remediation] Complete: ${generated} customer playbooks generated, ${failed} failed`);
}

// ============================================================================
// QUERY FUNCTIONS
// ============================================================================

export async function getRemediationPlaybook(
  attack_intel_id: string
): Promise<RemediationPlaybook | null> {
  
  const { data, error } = await supabase
    .from('remediation_playbooks')
    .select('*')
    .eq('attack_intel_id', attack_intel_id)
    .single();
  
  if (error || !data) {
    return null;
  }
  
  return {
    priority: data.priority,
    effort_hours: data.effort_hours,
    root_cause: data.root_cause,
    attack_vector: data.attack_vector,
    remediation_steps: data.remediation_steps,
    code_snippet: data.code_snippet,
    test_cases: data.test_cases,
    deployment_notes: data.deployment_notes
  };
}
