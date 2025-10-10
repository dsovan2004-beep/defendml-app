import { useState } from "react";

export default function Tester() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleScan = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://defendml-api.dsovan2004.workers.dev/api/scan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Origin": "https://app.defendml.com"
        },
        body: JSON.stringify({ text: input })
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setResult({ error: "Failed to connect to API" });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <h1 className="text-2xl font-semibold mb-4 text-gray-900">DefendML Tester</h1>
      <textarea
        className="w-full max-w-lg p-3 border rounded-lg mb-4"
        rows={5}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter text to scan..."
      />
      <button
        onClick={handleScan}
        disabled={loading}
        className="px-6 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:opacity-50"
      >
        {loading ? "Scanning..." : "Run Scan"}
      </button>

      {result && (
        <div className="mt-6 w-full max-w-lg bg-white shadow rounded-lg p-4">
          <pre className="text-sm text-gray-700 overflow-x-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
