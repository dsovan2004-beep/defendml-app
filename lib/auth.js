// Simple client-side auth helper (in-memory with sessionStorage fallback)
let _token = null;
const KEY = "defendml.jwt";

export function getApiBase() {
  // Next.js exposes NEXT_PUBLIC_* to the browser
  return process.env.NEXT_PUBLIC_API_BASE || "";
}

export function getToken() {
  if (_token) return _token;
  if (typeof window !== "undefined") {
    _token = sessionStorage.getItem(KEY);
  }
  return _token;
}

export function setToken(t) {
  _token = t || null;
  if (typeof window !== "undefined") {
    if (t) sessionStorage.setItem(KEY, t);
    else sessionStorage.removeItem(KEY);
  }
}

export async function login(email, password) {
  const res = await fetch(`${getApiBase()}/auth/login`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  if (!res.ok || !data?.token) {
    throw new Error(data?.error || "Login failed");
  }
  setToken(data.token);
  return data;
}

export function logout() {
  setToken(null);
}

export async function verify() {
  const t = getToken();
  if (!t) return { ok: false };
  const res = await fetch(`${getApiBase()}/auth/verify`, {
    headers: { authorization: `Bearer ${t}` },
  });
  return res.json().catch(() => ({ ok: false }));
}
