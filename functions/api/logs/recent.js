// Cloudflare Pages Function: GET /api/logs/recent?limit=500
// Returns demo PII events with proper CORS.

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "*",
  "Content-Type": "application/json; charset=utf-8",
};

export const onRequestOptions = async () =>
  new Response(null, { status: 204, headers: CORS });

function demoData(limit = 20) {
  const now = Date.now();
  const base = [
    {
      detections: ["pii.email", "pii.phone"],
      action: "sanitized",
      status: "success",
      redacted_count: 2,
      llm_provider: "Claude 3.5 Sonnet",
      compliance_impact: "GDPR",
      cost_of_breach_prevented: 5200,
    },
    {
      detections: ["pii.ssn", "pii.address"],
      action: "blocked",
      status: "success",
      redacted_count: 2,
      llm_provider: "GPT-4",
      compliance_impact: "HIPAA",
      cost_of_breach_prevented: 8500,
    },
    {
      detections: ["pii.credit_card"],
      action: "sanitized",
      status: "success",
      redacted_count: 1,
      llm_provider: "Gemini 1.5",
      compliance_impact: "PCI-DSS",
      cost_of_breach_prevented: 12000,
    },
  ];

  const out = [];
  for (let i = 0; i < limit; i++) {
    const b = base[i % base.length];
    out.push({
      id: i + 1,
      timestamp: new Date(now - i * 7 * 60_000).toISOString(),
      ...b,
    });
  }
  return { data: out };
}

export const onRequestGet = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const limit = Math.max(
      1,
      Math.min(500, parseInt(url.searchParams.get("limit") || "20", 10))
    );

    // If you later want to proxy a real API, swap demoData(limit) with a fetch to your Worker.
    const payload = demoData(limit);
    return new Response(JSON.stringify(payload), { headers: CORS });
  } catch (e) {
    return new Response(JSON.stringify({ error: "internal_error" }), {
      status: 500,
      headers: CORS,
    });
  }
};
