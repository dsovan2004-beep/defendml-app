import React, { useState } from "react";
import RequireAuth from "../../components/RequireAuth";
import Navigation from "../../components/Navigation";
import { UserRole } from "../../types/roles";

export default function ProtectedUsersUpload() {
  return (
    <RequireAuth role={UserRole.SUPER_ADMIN}>
      <UsersUploadPage />
    </RequireAuth>
  );
}

function UsersUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string>("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) {
      setStatus("Please choose a CSV file.");
      return;
    }
    setStatus("Uploading…");

    // TODO: wire to your API endpoint for bulk import
    // const formData = new FormData();
    // formData.append("file", file);
    // const res = await fetch("/api/admin/users/upload", { method: "POST", body: formData });

    setTimeout(() => setStatus("✅ Uploaded (demo stub)"), 800); // stub UX
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-[#0A0A0A] text-white">
        <div className="max-w-3xl mx-auto px-6 py-10">
          <h1 className="text-2xl font-bold mb-2">Users Upload (CSV)</h1>
          <p className="text-[#A0A0A0] mb-6">
            Admin-only. Upload a CSV to bulk-create users and assign roles.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="p-6 rounded-xl border border-white/10 bg-white/5">
              <label className="block text-sm mb-2">CSV file</label>
              <input
                type="file"
                accept=".csv"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="block w-full text-sm file:mr-4 file:rounded-lg
                           file:border-0 file:bg-red-600 file:px-4 file:py-2
                           file:text-white hover:file:bg-red-500 cursor-pointer"
              />
              <p className="text-xs text-[#A0A0A0] mt-2">
                Expected headers: <code>email,name,role</code>
              </p>
            </div>

            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-500 font-medium"
            >
              Upload CSV
            </button>

            {status && <div className="text-sm text-[#F5F5F5]">{status}</div>}
          </form>
        </div>
      </div>
    </>
  );
}
