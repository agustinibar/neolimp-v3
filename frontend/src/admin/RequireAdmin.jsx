// src/admin/RequireAdmin.jsx
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

function Screen({ title, subtitle }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
        {subtitle ? <p className="mt-2 text-sm text-gray-600">{subtitle}</p> : null}
      </div>
    </div>
  );
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

  if (loading) return <Screen title="Cargando..." subtitle="Verificando sesión." />;
  if (!user) return <Navigate to="/admin/login" replace />;

  const email = (user.email || "").toLowerCase();
  if (whitelist.length > 0 && !whitelist.includes(email)) {
    return (
      <Screen
        title="No autorizado"
        subtitle="Tu usuario no está habilitado para acceder a este panel."
      />
    );
  }

  return children;
}