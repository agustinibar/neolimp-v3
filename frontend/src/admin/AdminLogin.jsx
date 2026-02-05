import React, { useMemo, useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/config";

function parseWhitelist() {
  const raw = import.meta.env.VITE_ADMIN_EMAILS || "";
  return raw
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

export default function AdminLogin() {
  const navigate = useNavigate();
  const whitelist = useMemo(() => parseWhitelist(), []);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");

    const eNorm = email.trim().toLowerCase();
    if (!eNorm || !password) {
      setErr("Completá email y contraseña.");
      return;
    }

    // ✅ whitelist por env
    if (whitelist.length > 0 && !whitelist.includes(eNorm)) {
      setErr("No autorizado para acceder al panel.");
      return;
    }

    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, eNorm, password);
      navigate("/admin", { replace: true });
    } catch (error) {
      console.error(error);
      setErr("Credenciales inválidas o usuario no existe.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-6">
      <div className="w-full max-w-sm border rounded-xl p-6">
        <h1 className="text-xl font-semibold">Admin Neolimp</h1>
        <p className="text-sm text-gray-600 mt-2">Ingresá con email y contraseña.</p>

        <form onSubmit={onSubmit} className="mt-6 space-y-3">
          <input
            className="w-full border rounded-lg px-3 py-2"
            placeholder="Email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="w-full border rounded-lg px-3 py-2"
            placeholder="Contraseña"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {err && <div className="text-sm text-red-600">{err}</div>}

          <button
            disabled={loading}
            className="w-full rounded-lg bg-black text-white py-2 disabled:opacity-60"
            type="submit"
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>

        {whitelist.length > 0 && (
          <p className="text-xs text-gray-500 mt-4">
            Acceso restringido por whitelist.
          </p>
        )}
      </div>
    </div>
  );
}
