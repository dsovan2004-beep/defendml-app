import { useState, useEffect } from "react";
import { login, verify, getApiBase } from "../lib/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("admin@defendml.com");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    // If already logged in, bounce to home (or /metrics)
    verify().then(v => { if (v?.ok) window.location.replace("/"); });
  }, []);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await login(email, password);
      // Optional sanity check
      const v = await verify();
      if (v?.ok) {
        window.location.replace("/"); // change to /metrics if you prefer
      } else {
        setError("Token verify failed");
      }
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{maxWidth: 360, margin: "64px auto", fontFamily: "system-ui"}}>
      <h1>Sign in</h1>
      <p style={{color:"#666", fontSize:14}}>API: {getApiBase()}</p>
      <form onSubmit={onSubmit}>
        <label style={{display:"block", marginTop:12}}>
          Email
          <input
            value={email}
            onChange={e=>setEmail(e.target.value)}
            type="email"
            required
            style={{width:"100%", padding:8, marginTop:4}}
          />
        </label>
        <label style={{display:"block", marginTop:12}}>
          Password
          <input
            value={password}
            onChange={e=>setPassword(e.target.value)}
            type="password"
            required
            style={{width:"100%", padding:8, marginTop:4}}
          />
        </label>
        {error && <div style={{color:"crimson", marginTop:12}}>{error}</div>}
        <button
          type="submit"
          disabled={busy}
          style={{marginTop:16, padding:"8px 12px"}}
        >
          {busy ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
