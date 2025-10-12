import { useEffect, useState } from "react";
import { verify } from "../lib/auth";

export default function RequireAuth({ children, role }) {
  const [ok, setOk] = useState(false);

  useEffect(() => {
    let mounted = true;
    verify().then(v => {
      if (!mounted) return;
      if (!v?.ok) {
        window.location.replace("/login");
        return;
      }
      if (role && !(v?.user?.roles || []).includes(role)) {
        window.location.replace("/login");
        return;
      }
      setOk(true);
    });
    return () => { mounted = false; };
  }, [role]);

  if (!ok) return null; // or a spinner
  return children;
}
