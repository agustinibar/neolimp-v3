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

const BRAND = {
  blue: "#1E41AF",
  green: "#22BE62",
  emerald: "#10B981",
  amber: "#F59E0B",
  red: "#EF4444",
  slate: "#0F172A",
  indigo: "#4F46E5",
};

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

const ADS_METRICS = {
  updatedAt: "16 mar 2026 · 18:40 hs",
  rangeLabel: "Últimos 16 días",
  cards: [
    {
      label: "Clics",
      value: "3",
      delta: "+50%",
      tone: "blue",
    },
    {
      label: "Impresiones",
      value: "45",
      delta: "+18%",
      tone: "red",
    },
    {
      label: "CPC medio",
      value: "85,13 $",
      delta: "-12%",
      tone: "green",
    },
    {
      label: "Costo",
      value: "255 $",
      delta: "+9%",
      tone: "amber",
    },
  ],
  campaigns: [
    {
      name: "Neolimp | Búsqueda",
      status: "Activa",
      impressions: 45,
      clicks: 3,
      ctr: "6,67%",
      cost: "255,38 ARS",
    },
    {
      name: "Servicios industriales | Segmento custom",
      status: "Activa",
      impressions: 27,
      clicks: 2,
      ctr: "7,40%",
      cost: "180,00 ARS",
    },
    {
      name: "Limpieza para empresas | Remarketing",
      status: "En revisión",
      impressions: 12,
      clicks: 0,
      ctr: "0,00%",
      cost: "0,00 ARS",
    },
  ],
  demographics: [
    { label: "Hombres 35-44", intensity: 90 },
    { label: "Hombres 45-54", intensity: 70 },
    { label: "Mujeres 35-44", intensity: 100 },
    { label: "Mujeres 45-54", intensity: 85 },
    { label: "Mujeres 55-64", intensity: 60 },
    { label: "+65", intensity: 35 },
  ],
  keywords: [
    { keyword: "servicio de limpieza", cost: "255,38 ARS", clicks: 3, ctr: "6,98%" },
    { keyword: "empresa limpieza", cost: "0,00 ARS", clicks: 0, ctr: "0,00%" },
    { keyword: "empresa de limpieza", cost: "0,00 ARS", clicks: 0, ctr: "0,00%" },
    { keyword: "limpieza para empresas", cost: "0,00 ARS", clicks: 0, ctr: "0,00%" },
    { keyword: "servicio de limpieza industrial", cost: "0,00 ARS", clicks: 0, ctr: "0,00%" },
  ],
  funnel: [
    { label: "Impresiones", value: 45 },
    { label: "Clics", value: 3 },
    { label: "Consultas", value: 2 },
    { label: "Oportunidades", value: 1 },
  ],
};

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

function toneClasses(tone) {
  const map = {
    blue: "bg-blue-600 text-white",
    red: "bg-red-500 text-white",
    green: "bg-emerald-500 text-white",
    amber: "bg-amber-400 text-slate-950",
    slate: "bg-slate-900 text-white",
    white: "bg-white text-slate-900",
  };
  return map[tone] || map.white;
}

function cardRing(tone) {
  const map = {
    blue: "ring-blue-200",
    red: "ring-red-200",
    green: "ring-emerald-200",
    amber: "ring-amber-200",
    slate: "ring-slate-200",
  };
  return map[tone] || "ring-slate-200";
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

function Surface({ children, className = "" }) {
  return (
    <div className={cx("rounded-3xl border border-slate-200 bg-white shadow-sm", className)}>
      {children}
    </div>
  );
}

function SectionHeader({ eyebrow, title, subtitle, actions }) {
  return (
    <div className="flex flex-col gap-4 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        {eyebrow ? (
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
            {eyebrow}
          </div>
        ) : null}
        <h2 className="mt-1 text-lg font-semibold tracking-tight text-slate-900">{title}</h2>
        {subtitle ? <p className="mt-1 text-sm text-slate-500">{subtitle}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}

function KpiCard({ label, value, delta, tone }) {
  return (
    <div
      className={cx(
        "rounded-3xl p-5 shadow-sm ring-1",
        toneClasses(tone),
        cardRing(tone)
      )}
    >
      <div className="text-xs font-medium opacity-90">{label}</div>
      <div className="mt-2 text-3xl font-bold tracking-tight">{value}</div>
      <div className="mt-3 inline-flex rounded-full bg-white/15 px-2.5 py-1 text-xs font-medium backdrop-blur">
        {delta}
      </div>
    </div>
  );
}

function BillingOverviewCard() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-sm font-medium text-slate-600">Fondos disponibles</div>
              <div className="mt-2 text-4xl font-semibold tracking-tight text-slate-900">
                99.691,32 ARS
              </div>
            </div>
            <button
              type="button"
              className="rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
              aria-label="Opciones"
            >
              ⋮
            </button>
          </div>

          <div className="mt-3 flex items-center gap-3">
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-sm font-medium text-slate-600">Último pago</div>
              <div className="mt-2 flex items-start gap-4">
                <div className="text-4xl font-semibold tracking-tight text-slate-900">16 mar</div>
                <div className="pt-1 text-sm text-slate-600">
                  <div>100.000,00 ARS</div>
                  <div>Pago manual</div>
                </div>
              </div>
            </div>
            <button
              type="button"
              className="rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
              aria-label="Opciones"
            >
              ⋮
            </button>
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-slate-200 bg-white px-5 py-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="text-sm font-medium text-slate-700">marzo (mes actual)</div>

          <div className="flex items-center gap-8">
            <div className="text-right">
              <div className="text-xs font-medium text-slate-500">Costo neto</div>
              <div className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
                308,75 ARS
              </div>
            </div>

            <div className="text-right">
              <div className="text-xs font-medium text-slate-500">Pagos</div>
              <div className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
                100.000,00 ARS
              </div>
            </div>

            <button
              type="button"
              className="rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
              aria-label="Expandir"
            >
              ˅
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoStat({ label, value, help }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</div>
      <div className="mt-2 text-2xl font-bold tracking-tight text-slate-900">{value}</div>
      {help ? <div className="mt-1 text-xs text-slate-500">{help}</div> : null}
    </div>
  );
}

function DemographicHeatmap() {
  const cells = [
    0, 0, 60, 55, 20, 0,
    0, 0, 100, 90, 65, 35,
  ];

  return (
    <div className="grid grid-cols-6 gap-2">
      {cells.map((value, i) => (
        <div
          key={i}
          className="aspect-square rounded-xl border border-blue-100"
          style={{
            background:
              value === 0
                ? "#F8FAFC"
                : `rgba(37, 99, 235, ${Math.max(value / 120, 0.15)})`,
          }}
        />
      ))}
    </div>
  );
}

function MessagesStatCard({ label, value, accent = "slate" }) {
  const styles = {
    slate: "from-slate-50 to-white border-slate-200 text-slate-900",
    blue: "from-blue-50 to-white border-blue-200 text-blue-900",
    green: "from-emerald-50 to-white border-emerald-200 text-emerald-900",
    amber: "from-amber-50 to-white border-amber-200 text-amber-900",
    red: "from-rose-50 to-white border-rose-200 text-rose-900",
  };

  return (
    <div className={cx("rounded-3xl border bg-gradient-to-br p-4 shadow-sm", styles[accent])}>
      <div className="text-xs font-medium text-slate-500">{label}</div>
      <div className="mt-2 text-3xl font-bold tracking-tight">{value}</div>
    </div>
  );
}

export default function AdminDashboard() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortDir, setSortDir] = useState("desc");

  const PAGE_SIZE = 50;
  const [items, setItems] = useState([]);
  const [lastDoc, setLastDoc] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [loadingFirst, setLoadingFirst] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const [savingId, setSavingId] = useState(null);

  function buildBaseQuery() {
    const ref = collection(db, "contactMessages");

    if (statusFilter === "all") {
      return query(ref, orderBy("processedAt", sortDir));
    }

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
    const base = {
      sin: 0,
      consulta_real: 0,
      sospechoso: 0,
      spam: 0,
      busca_trabajo: 0,
    };

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

  const totalVisibleMessages = rows.length;
  const realLeads = counts.consulta_real;
  const suspiciousLeads = counts.sospechoso;
  const spamLeads = counts.spam;

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 overflow-hidden rounded-[32px] bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 p-6 text-white shadow-xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Panel ejecutivo · Neolimp
              </div>

              <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                Dashboard administrativo y comercial
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
                Visualizá campañas, señales de rendimiento, métricas de referencia y el historial
                de mensajes desde Firebase en un solo lugar, sin alterar la funcionalidad actual.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {ADS_METRICS.cards.map((card) => (
                <KpiCard
                  key={card.label}
                  label={card.label}
                  value={card.value}
                  delta={card.delta}
                  tone={card.tone}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-[1.5fr_1fr]">
          <BillingOverviewCard />

          <Surface className="overflow-hidden">
            <SectionHeader
              eyebrow="Resumen"
              title="Estado del panel"
              subtitle={`Datos comerciales hardcodeados actualizados manualmente cada 48 hs · ${ADS_METRICS.updatedAt}`}
            />
            <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">
              <InfoStat label="Ventana analizada" value={ADS_METRICS.rangeLabel} />
              <InfoStat label="Campañas visibles" value={ADS_METRICS.campaigns.length} />
              <InfoStat label="Palabras clave" value={ADS_METRICS.keywords.length} />
              <InfoStat label="Fuente operativa" value="Firebase + GoogleAdsAPI" />
            </div>
          </Surface>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Surface className="overflow-hidden lg:col-span-2">
            <SectionHeader
              eyebrow="Campañas"
              title="Resumen de campañas"
              subtitle="Bloque visual estilo Google Ads con datos editables manualmente"
            />

            <div className="overflow-auto">
              <table className="w-full min-w-[720px] text-sm">
                <thead className="bg-slate-50">
                  <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <th className="px-5 py-4">Campaña</th>
                    <th className="px-5 py-4">Estado</th>
                    <th className="px-5 py-4">Impresiones</th>
                    <th className="px-5 py-4">Clics</th>
                    <th className="px-5 py-4">CTR</th>
                    <th className="px-5 py-4">Costo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {ADS_METRICS.campaigns.map((campaign) => (
                    <tr key={campaign.name} className="hover:bg-slate-50/80">
                      <td className="px-5 py-4 font-medium text-slate-900">{campaign.name}</td>
                      <td className="px-5 py-4">
                        <span
                          className={cx(
                            "inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset",
                            campaign.status === "Activa"
                              ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                              : "bg-amber-50 text-amber-700 ring-amber-200"
                          )}
                        >
                          {campaign.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-slate-700">{campaign.impressions}</td>
                      <td className="px-5 py-4 text-slate-700">{campaign.clicks}</td>
                      <td className="px-5 py-4 text-slate-700">{campaign.ctr}</td>
                      <td className="px-5 py-4 text-slate-700">{campaign.cost}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Surface>

          <Surface className="overflow-hidden">
            <SectionHeader
              eyebrow="Embudo"
              title="Conversión estimada"
              subtitle="Referencia comercial cargada manualmente"
            />
            <div className="space-y-4 p-5">
              {ADS_METRICS.funnel.map((step, index) => (
                <div key={step.label}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-700">{step.label}</span>
                    <span className="text-slate-500">{step.value}</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-600 to-emerald-500"
                      style={{
                        width: `${Math.max(
                          15,
                          (step.value / ADS_METRICS.funnel[0].value) * 100
                        )}%`,
                      }}
                    />
                  </div>
                  {index < ADS_METRICS.funnel.length - 1 ? (
                    <div className="mt-2 text-xs text-slate-400">↓</div>
                  ) : null}
                </div>
              ))}
            </div>
          </Surface>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Surface className="overflow-hidden">
            <SectionHeader
              eyebrow="Audiencias"
              title="Grupos demográficos"
              subtitle="Panel visual de referencia por edad y sexo"
            />
            <div className="grid gap-6 p-5 md:grid-cols-[1fr_1.2fr]">
              <div className="space-y-3">
                {ADS_METRICS.demographics.map((item) => (
                  <div key={item.label}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="text-slate-700">{item.label}</span>
                      <span className="text-slate-500">{item.intensity}%</span>
                    </div>
                    <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-blue-500"
                        style={{ width: `${item.intensity}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <div className="mb-3 text-sm font-medium text-slate-700">Mapa de intensidad</div>
                <DemographicHeatmap />
                <div className="mt-3 text-xs text-slate-500">
                  Según el 64% de las impresiones cuyo sexo y edad se conocen.
                </div>
              </div>
            </div>
          </Surface>

          <Surface className="overflow-hidden">
            <SectionHeader
              eyebrow="Palabras clave"
              title="Rendimiento de keywords"
              subtitle="Bloque hardcodeado para simular una vista real de Ads"
            />
            <div className="overflow-auto">
              <table className="w-full min-w-[560px] text-sm">
                <thead className="bg-slate-50">
                  <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <th className="px-5 py-4">Keyword</th>
                    <th className="px-5 py-4">Costo</th>
                    <th className="px-5 py-4">Clics</th>
                    <th className="px-5 py-4">CTR</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {ADS_METRICS.keywords.map((item) => (
                    <tr key={item.keyword} className="hover:bg-slate-50/80">
                      <td className="px-5 py-4 text-slate-900">{item.keyword}</td>
                      <td className="px-5 py-4 text-slate-700">{item.cost}</td>
                      <td className="px-5 py-4 text-slate-700">{item.clicks}</td>
                      <td className="px-5 py-4 text-slate-700">{item.ctr}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Surface>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <MessagesStatCard label="Cargados en pantalla" value={totalVisibleMessages} accent="blue" />
          <MessagesStatCard label="Sin etiqueta" value={counts.sin} accent="slate" />
          <MessagesStatCard label="Consulta real" value={realLeads} accent="green" />
          <MessagesStatCard label="Sospechoso" value={suspiciousLeads} accent="amber" />
          <MessagesStatCard label="Spam" value={spamLeads} accent="red" />
        </div>

        <Surface className="overflow-hidden">
          <SectionHeader
            eyebrow="Operación"
            title="Mensajes de contacto"
            subtitle={`Historial paginado desde Firebase · Filtro: ${filterLabel} · Orden: ${
              sortDir === "desc" ? "Más nuevas" : "Más viejas"
            }`}
            actions={
              <>
                <div className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
                  <span className="text-sm font-medium text-slate-700">Etiqueta</span>
                  <select
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2"
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
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                >
                  Fecha: {sortDir === "desc" ? "Más nuevas" : "Más viejas"}
                </button>

                <button
                  onClick={loadFirstPage}
                  className="rounded-2xl px-4 py-2 text-sm font-semibold text-white shadow-sm transition"
                  style={{ background: BRAND.blue }}
                  disabled={loadingFirst}
                >
                  {loadingFirst ? "Cargando..." : "Actualizar"}
                </button>
              </>
            }
          />

          <div className="overflow-auto">
            <table className="w-full min-w-[1220px] text-sm">
              <thead className="sticky top-0 z-10 bg-slate-50">
                <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <th className="px-4 py-4">Etiqueta</th>
                  <th className="px-4 py-4">Fecha</th>
                  <th className="px-4 py-4">Nombre</th>
                  <th className="px-4 py-4">Empresa</th>
                  <th className="px-4 py-4">Servicio</th>
                  <th className="px-4 py-4">Email</th>
                  <th className="px-4 py-4">Teléfono</th>
                  <th className="px-4 py-4">Mensaje</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {rows.map((r) => (
                  <tr key={r.id} className="align-top transition hover:bg-slate-50/70">
                    <td className="px-4 py-4">
                      <div className="flex min-w-[220px] flex-col gap-2">
                        <Badge status={r.status} />

                        <div className="flex items-center gap-2">
                          <select
                            value={r.status}
                            onChange={(e) => setStatus(r.id, e.target.value)}
                            disabled={savingId === r.id}
                            className="h-10 w-[190px] rounded-xl border border-slate-200 bg-white px-3 text-xs shadow-sm outline-none focus:ring-2 disabled:opacity-60"
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
                            className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-60"
                            title="Quitar etiqueta"
                          >
                            Quitar
                          </button>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4 whitespace-nowrap text-slate-700">{r.created}</td>
                    <td className="px-4 py-4 whitespace-nowrap font-medium text-slate-900">
                      {r.nombre}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-slate-700">{r.empresa}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-slate-700">{r.servicio}</td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <a
                        className="font-medium underline decoration-slate-300 underline-offset-4 hover:decoration-slate-500"
                        style={{ color: BRAND.blue }}
                        href={`mailto:${r.email}`}
                      >
                        {r.email}
                      </a>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-slate-700">{r.telefono}</td>
                    <td className="min-w-[420px] px-4 py-4">
                      <div className="max-w-[520px] text-slate-800 line-clamp-2">
                        {r.mensaje || "—"}
                      </div>
                      <div className="mt-1 text-xs text-slate-500">
                        ID: <span className="font-mono">{r.id}</span>
                      </div>
                    </td>
                  </tr>
                ))}

                {rows.length === 0 && !loadingFirst && (
                  <tr>
                    <td className="p-10 text-center text-slate-500" colSpan={8}>
                      No hay registros para mostrar.
                    </td>
                  </tr>
                )}

                {loadingFirst && (
                  <tr>
                    <td className="p-10 text-center text-slate-500" colSpan={8}>
                      Cargando...
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-3 border-t border-slate-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-slate-500">
              Mostrando <span className="font-semibold text-slate-800">{rows.length}</span> registros
              en pantalla · páginas de {PAGE_SIZE}
            </div>

            <button
              onClick={loadMore}
              disabled={!hasMore || loadingMore || loadingFirst}
              className="rounded-2xl px-4 py-2 text-sm font-semibold text-white shadow-sm disabled:opacity-60"
              style={{ background: BRAND.green }}
            >
              {loadingMore ? "Cargando..." : hasMore ? "Cargar más" : "No hay más"}
            </button>
          </div>
        </Surface>
      </div>
    </div>
  );
}