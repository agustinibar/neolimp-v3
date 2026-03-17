// src/admin/AdminLogin.jsx
import React, { useMemo, useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/config";

const BRAND = { blue: "#1E41AF", green: "#22BE62" };

function parseWhitelist() {
  const raw = import.meta.env.VITE_ADMIN_EMAILS || "agustinibarperrotta@gmail.com";
  return raw.split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);
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

  if (whitelist.length > 0 && !whitelist.includes(eNorm)) {
    setErr("No autorizado para acceder al panel.");
    return;
  }

  try {
    setLoading(true);

    console.log("Intentando login con:", eNorm);
    console.log("Whitelist:", whitelist);
    console.log("Auth instance:", auth);

    await signInWithEmailAndPassword(auth, eNorm, password);
    navigate("/admin", { replace: true });
  } catch (error) {
    console.error("Firebase login error:", error);
    console.error("Code:", error.code);
    console.error("Message:", error.message);

    switch (error.code) {
      case "auth/user-not-found":
        setErr("El usuario no existe.");
        break;
      case "auth/wrong-password":
        setErr("La contraseña es incorrecta.");
        break;
      case "auth/invalid-credential":
        setErr("Credenciales inválidas.");
        break;
      case "auth/operation-not-allowed":
        setErr("Email/password no está habilitado en Firebase.");
        break;
      case "auth/too-many-requests":
        setErr("Demasiados intentos. Probá más tarde.");
        break;
      default:
        setErr(`Error de autenticación: ${error.code || "desconocido"}`);
    }
  } finally {
    setLoading(false);
  }
}

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-gray-200 px-6 py-5">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full" style={{ background: BRAND.green }} />
            <h1 className="text-xl font-semibold tracking-tight text-gray-900">Admin · Neolimp</h1>
          </div>
          <p className="mt-1 text-sm text-gray-600">Ingresá con tu email y contraseña.</p>
        </div>

        <form onSubmit={onSubmit} className="px-6 py-6 space-y-3">
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600">Email</label>
            <input
              className="w-full h-11 rounded-xl border border-gray-200 bg-white px-3 text-sm shadow-sm outline-none focus:ring-2"
              style={{ outlineColor: BRAND.blue }}
              placeholder="tu@empresa.com"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600">Contraseña</label>
            <input
              className="w-full h-11 rounded-xl border border-gray-200 bg-white px-3 text-sm shadow-sm outline-none focus:ring-2"
              style={{ outlineColor: BRAND.blue }}
              placeholder="••••••••"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {err && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
              {err}
            </div>
          )}

          <button
            disabled={loading}
            className="w-full h-11 rounded-xl text-white text-sm font-semibold shadow-sm disabled:opacity-60"
            style={{ background: BRAND.blue }}
            type="submit"
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </button>

          {whitelist.length > 0 && (
            <p className="pt-2 text-xs text-gray-500">Acceso restringido por whitelist.</p>
          )}
        </form>
      </div>
    </div>
  );
}