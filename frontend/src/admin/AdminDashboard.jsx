// src/admin/AdminDashboard.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  collection,
  query,
  orderBy,
  limit,
  where,
  getDocs,
  startAfter,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase/config";

const BRAND = { blue: "#1E41AF", green: "#22BE62" };

const STATUS_LABELS = {
  consulta_real: "Consulta real",
  sospechoso: "Sospechoso",
  spam: "Spam",
  busca_trabajo: "Busca trabajo",
};

const STATUS_OPTIONS = [
  { value: "", label: "Sin etiqueta" },
  { value: "consulta_real", label: "Consulta real" },
  { value: "sospechoso", label: "Sospechoso" },
  { value: "spam", label: "Spam" },
  { value: "busca_trabajo", label: "Busca trabajo" },
];

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

function Badge({ status }) {
  const label = STATUS_LABELS[status] || status || "Sin etiqueta";
  const styles = {
    consulta_real: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    sospechoso: "bg-amber-50 text-amber-700 ring-amber-200",
    spam: "bg-rose-50 text-rose-700 ring-rose-200",
    busca_trabajo: "bg-slate-50 text-slate-700 ring-slate-200",
    "": "bg-gray-50 text-gray-700 ring-gray-200",
    null: "bg-gray-50 text-gray-700 ring-gray-200",
    undefined: "bg-gray-50 text-gray-700 ring-gray-200",
  };
  const k = status ?? "";
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset whitespace-nowrap",
        styles[k] || "bg-gray-50 text-gray-700 ring-gray-200"
      )}
      title={label}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-60" />
      {label}
    </span>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="text-xs font-medium text-gray-500">{label}</div>
      <div className="mt-1 text-2xl font-semibold tracking-tight text-gray-900">
        {value}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  // UI
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortDir, setSortDir] = useState("desc"); // "desc" nuevas primero, "asc" viejas primero

  // Data + paginación
  const PAGE_SIZE = 50;
  const [items, setItems] = useState([]);
  const [lastDoc, setLastDoc] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [loadingFirst, setLoadingFirst] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  // Status edit
  const [savingId, setSavingId] = useState(null);

  function buildBaseQuery() {
    const ref = collection(db, "contactMessages");

    // Base: orden por fecha (processedAt)
    if (statusFilter === "all") {
      return query(ref, orderBy("processedAt", sortDir));
    }

    // Filtrado por etiqueta (requiere índice compuesto en algunos casos)
    return query(ref, where("status", "==", statusFilter), orderBy("processedAt", sortDir));
  }

  async function loadFirstPage() {
    setLoadingFirst(true);
    try {
      const baseQ = buildBaseQuery();
      const snap = await getDocs(query(baseQ, limit(PAGE_SIZE)));

      const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setItems(docs);

      const last = snap.docs[snap.docs.length - 1] || null;
      setLastDoc(last);

      // Si trajo menos que PAGE_SIZE => no hay más
      setHasMore(snap.docs.length === PAGE_SIZE);
    } catch (e) {
      console.error("loadFirstPage error:", e);
      alert("Error cargando mensajes. Revisá índices/permisos.");
      setItems([]);
      setLastDoc(null);
      setHasMore(false);
    } finally {
      setLoadingFirst(false);
    }
  }

  async function loadMore() {
    if (!hasMore || loadingMore || !lastDoc) return;

    setLoadingMore(true);
    try {
      const baseQ = buildBaseQuery();
      const snap = await getDocs(query(baseQ, startAfter(lastDoc), limit(PAGE_SIZE)));

      const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setItems((prev) => [...prev, ...docs]);

      const last = snap.docs[snap.docs.length - 1] || null;
      setLastDoc(last);

      setHasMore(snap.docs.length === PAGE_SIZE);
    } catch (e) {
      console.error("loadMore error:", e);
      alert("Error cargando más mensajes.");
    } finally {
      setLoadingMore(false);
    }
  }

  // Cuando cambia filtro u orden -> reset + primera página
  useEffect(() => {
    setItems([]);
    setLastDoc(null);
    setHasMore(true);
    loadFirstPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, sortDir]);

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
        status: x.status ?? "",
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

  const counts = useMemo(() => {
    const base = { sin: 0, consulta_real: 0, sospechoso: 0, spam: 0, busca_trabajo: 0 };
    for (const r of rows) {
      if (!r.status) base.sin += 1;
      else if (base[r.status] !== undefined) base[r.status] += 1;
    }
    return base;
  }, [rows]);

  async function setStatus(id, nextStatus) {
    try {
      setSavingId(id);
      await updateDoc(doc(db, "contactMessages", id), {
        status: nextStatus || null,
        statusUpdatedAt: new Date().toISOString(),
      });
      // Refrescamos solo UI local (sin recargar todo)
      setItems((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: nextStatus || null } : p))
      );
    } catch (e) {
      console.error("update status error:", e);
      alert("No se pudo actualizar la etiqueta. Revisá reglas de Firestore.");
    } finally {
      setSavingId(null);
    }
  }

  const filterLabel =
    statusFilter === "all" ? "Todos" : STATUS_LABELS[statusFilter] || statusFilter;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-2">
                <span className="h-3 w-3 rounded-full" style={{ background: BRAND.green }} />
                <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
                  Admin · Neolimp
                </h1>
              </div>
              <p className="mt-1 text-sm text-gray-600">
                Historial paginado — Filtro:{" "}
                <span className="font-medium text-gray-800">{filterLabel}</span> · Orden:{" "}
                <span className="font-medium text-gray-800">
                  {sortDir === "desc" ? "Más nuevas" : "Más viejas"}
                </span>
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
              <div className="inline-flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Etiqueta</span>
                <select
                  className="h-10 rounded-xl border border-gray-200 bg-white px-3 text-sm shadow-sm outline-none focus:ring-2"
                  style={{ outlineColor: BRAND.blue }}
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

              <button
                onClick={() => setSortDir((d) => (d === "desc" ? "asc" : "desc"))}
                className="h-10 rounded-xl border border-gray-200 bg-white px-4 text-sm font-semibold shadow-sm hover:bg-gray-50"
              >
                Fecha: {sortDir === "desc" ? "Más nuevas" : "Más viejas"}
              </button>

              <button
                onClick={loadFirstPage}
                className="h-10 rounded-xl px-4 text-sm font-semibold text-white shadow-sm"
                style={{ background: BRAND.blue }}
                disabled={loadingFirst}
              >
                {loadingFirst ? "Cargando..." : "Actualizar"}
              </button>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <StatCard label="Cargados en pantalla" value={rows.length} />
            <StatCard label="Sin etiqueta" value={counts.sin} />
            <StatCard label="Consulta real" value={counts.consulta_real} />
            <StatCard label="Sospechoso" value={counts.sospechoso} />
            <StatCard label="Spam" value={counts.spam} />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-6">
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 z-10 bg-gray-50">
                <tr className="text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
                  <th className="px-4 py-3">Etiqueta</th>
                  <th className="px-4 py-3">Fecha</th>
                  <th className="px-4 py-3">Nombre</th>
                  <th className="px-4 py-3">Empresa</th>
                  <th className="px-4 py-3">Servicio</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Teléfono</th>
                  <th className="px-4 py-3">Mensaje</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {rows.map((r) => (
                  <tr key={r.id} className="align-top hover:bg-gray-50/60">
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-2">
                        <Badge status={r.status} />
                        <div className="flex items-center gap-2">
                          <select
                            value={r.status}
                            onChange={(e) => setStatus(r.id, e.target.value)}
                            disabled={savingId === r.id}
                            className="h-9 w-[190px] rounded-xl border border-gray-200 bg-white px-2 text-xs shadow-sm outline-none focus:ring-2 disabled:opacity-60"
                            style={{ outlineColor: BRAND.green }}
                          >
                            {STATUS_OPTIONS.map((o) => (
                              <option key={o.value} value={o.value}>
                                {o.label}
                              </option>
                            ))}
                          </select>

                          <button
                            onClick={() => setStatus(r.id, "")}
                            disabled={savingId === r.id}
                            className="h-9 rounded-xl border border-gray-200 bg-white px-3 text-xs font-semibold text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-60"
                            title="Quitar etiqueta"
                          >
                            Quitar
                          </button>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap text-gray-700">{r.created}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-900">{r.nombre}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-700">{r.empresa}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-700">{r.servicio}</td>

                    <td className="px-4 py-3 whitespace-nowrap">
                      <a
                        className="underline decoration-gray-300 underline-offset-4 hover:decoration-gray-500"
                        style={{ color: BRAND.blue }}
                        href={`mailto:${r.email}`}
                      >
                        {r.email}
                      </a>
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap text-gray-700">{r.telefono}</td>

                    <td className="px-4 py-3 min-w-[420px]">
                      <div className="text-gray-800 line-clamp-2">{r.mensaje || "—"}</div>
                      <div className="mt-1 text-xs text-gray-500">
                        ID: <span className="font-mono">{r.id}</span>
                      </div>
                    </td>
                  </tr>
                ))}

                {rows.length === 0 && !loadingFirst && (
                  <tr>
                    <td className="p-8 text-center text-gray-600" colSpan={8}>
                      No hay registros para mostrar.
                    </td>
                  </tr>
                )}

                {loadingFirst && (
                  <tr>
                    <td className="p-8 text-center text-gray-600" colSpan={8}>
                      Cargando...
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Paginación */}
          <div className="flex items-center justify-between gap-3 border-t border-gray-200 px-4 py-3">
            <div className="text-xs text-gray-500">
              Mostrando <b>{rows.length}</b> (páginas de {PAGE_SIZE})
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={loadMore}
                disabled={!hasMore || loadingMore || loadingFirst}
                className="h-10 rounded-xl px-4 text-sm font-semibold text-white shadow-sm disabled:opacity-60"
                style={{ background: BRAND.green }}
              >
                {loadingMore ? "Cargando..." : hasMore ? "Cargar más" : "No hay más"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}