// src/admin/AdminDashboard.jsx
import React, { useEffect, useMemo, useState } from "react";
import { collection, onSnapshot, orderBy, query, limit, where } from "firebase/firestore";
import { db } from "../firebase/config";

const STATUS_LABELS = {
  consulta_real: "Consulta real",
  sospechoso: "Sospechoso",
  spam: "Spam",
  busca_trabajo: "Busca trabajo",
};

function Badge({ status }) {
  const label = STATUS_LABELS[status] || status || "-";
  const base = "px-2 py-1 rounded-full text-xs border";
  // sin colores fijos “locos”: lo dejo simple
  return <span className={base}>{label}</span>;
}

export default function AdminDashboard() {
  const [items, setItems] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const ref = collection(db, "contactMessages");

    const q =
      statusFilter === "all"
        ? query(ref, orderBy("processedAt", "desc"), limit(200))
        : query(ref, where("status", "==", statusFilter), orderBy("processedAt", "desc"), limit(200));

    const unsub = onSnapshot(
      q,
      (snap) => {
        const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setItems(rows);
      },
      (err) => {
        console.error("Firestore onSnapshot error:", err);
      }
    );

    return () => unsub();
  }, [statusFilter]);

  const total = items.length;

  const rows = useMemo(() => {
    return items.map((x) => {
      const created =
        x.createdAt
          ? new Date(x.createdAt).toLocaleString("es-AR")
          : x.processedAt?.toDate
            ? x.processedAt.toDate().toLocaleString("es-AR")
            : "-";

      return {
        id: x.id,
        status: x.status,
        score: x.score ?? "-",
        nombre: x.nombre || "-",
        empresa: x.empresa || "-",
        email: x.email || "-",
        telefono: x.telefono || "-",
        servicio: x.servicio || "-",
        created,
        mensaje: x.mensaje || "",
      };
    });
  }, [items]);

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard Admin</h1>
          <p className="text-sm text-gray-600 mt-1">
            Mensajes guardados en <code>contactMessages</code> — {total} visibles (máx. 200).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm">Estado</label>
          <select
            className="border rounded-lg px-2 py-1"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Todos</option>
            <option value="consulta_real">consulta_real</option>
            <option value="sospechoso">sospechoso</option>
            <option value="spam">spam</option>
            <option value="busca_trabajo">busca_trabajo</option>
          </select>
        </div>
      </div>

      <div className="mt-6 overflow-auto border rounded-xl">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr className="text-left">
              <th className="p-3">Estado</th>
              <th className="p-3">Score</th>
              <th className="p-3">Fecha</th>
              <th className="p-3">Nombre</th>
              <th className="p-3">Empresa</th>
              <th className="p-3">Servicio</th>
              <th className="p-3">Email</th>
              <th className="p-3">Teléfono</th>
              <th className="p-3">Mensaje</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t align-top">
                <td className="p-3"><Badge status={r.status} /></td>
                <td className="p-3">{r.score}</td>
                <td className="p-3 whitespace-nowrap">{r.created}</td>
                <td className="p-3 whitespace-nowrap">{r.nombre}</td>
                <td className="p-3 whitespace-nowrap">{r.empresa}</td>
                <td className="p-3 whitespace-nowrap">{r.servicio}</td>
                <td className="p-3 whitespace-nowrap">{r.email}</td>
                <td className="p-3 whitespace-nowrap">{r.telefono}</td>
                <td className="p-3 min-w-[360px]">
                  <div className="line-clamp-3">{r.mensaje}</div>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td className="p-6 text-gray-600" colSpan={9}>
                  No hay registros para mostrar.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
