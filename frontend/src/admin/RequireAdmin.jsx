import React, { useEffect, useMemo, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { Navigate } from "react-router-dom";
import { auth } from "../firebase/config";

function parseWhitelist() {
  const raw = import.meta.env.VITE_ADMIN_EMAILS || "";
  return raw
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

export default function RequireAdmin({ children }) {
  const whitelist = useMemo(() => parseWhitelist(), []);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  if (loading) return <div className="p-6">Cargando...</div>;
  if (!user) return <Navigate to="/admin/login" replace />;

  const email = (user.email || "").toLowerCase();
  if (whitelist.length > 0 && !whitelist.includes(email)) {
    return <div className="p-6">No autorizado.</div>;
  }

  return children;
}
