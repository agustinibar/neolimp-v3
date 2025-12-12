import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { ArrowLeft, Clock, Share2, Link as LinkIcon, Quote } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

const Img = ({ src, alt, className = "" }) => (
  <img src={src} alt={alt} loading="lazy" className={`rounded-xl w-full ${className}`} />
);

const Section = ({ id, title, children }) => (
  <section id={id} className="scroll-mt-28">
    <h2 className="text-2xl md:text-3xl font-bold mb-4">{title}</h2>
    <div className="prose prose-slate max-w-none prose-headings:scroll-mt-28">
      {children}
    </div>
  </section>
);

// Construye una URL con hash (#id)
const anchor = (id) => {
  const url = new URL(window.location.href);
  url.hash = id || "";
  return url.toString();
};

const BlogCaseStudy2 = ({ onBack }) => {
  // Reading progress bar
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ container: containerRef });
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 20, restDelta: 0.001 });

  const [copied, setCopied] = useState("");
  const navigate = useNavigate();

  // HANDLERS ====

  // Comparte usando Web Share si está disponible; si no, copia el enlace (fallback)
  const handleShare = async (id) => {
    const shareUrl = anchor(id);
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Limpieza Industrial en Campana: Protocolos y Mejores Prácticas",
          text: "Conoce los estándares que garantizan seguridad y eficiencia en plantas de producción.",
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        toast({ title: "🔗 Enlace copiado", description: "Se copió el enlace al portapapeles." });
      }
    } catch (err) {
      if (err?.name !== "AbortError") {
        toast({ title: "Error al compartir", description: "No se pudo completar la acción." });
      }
    }
  };

  // Copia SIEMPRE (no usa Web Share)
  const handleCopy = async (id) => {
    const link = anchor(id);
    try {
      await navigator.clipboard.writeText(link);
      setCopied(id);
      toast({ title: "🔗 Enlace copiado", description: "Se copió el enlace al portapapeles." });
      setTimeout(() => setCopied(""), 1200);
    } catch {
      toast({ title: "Error al copiar", description: "No se pudo copiar el enlace." });
    }
  };

  // Intents opcionales para compartir directo
  const openShareIntent = (platform, id) => {
    const url = anchor(id);
    const text = encodeURIComponent(
      "Limpieza Industrial en Campana — Protocolos y Mejores Prácticas."
    );
    const encodedUrl = encodeURIComponent(url);

    let intent = "";
    if (platform === "whatsapp") {
      intent = `https://wa.me/?text=${text}%20${encodedUrl}`;
    } else if (platform === "linkedin") {
      intent = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
    }
    if (intent) window.open(intent, "_blank", "noopener,noreferrer");
  };

  useEffect(() => {
    if (containerRef.current) containerRef.current.scrollTo({ top: 0 });
  }, []);

  // Imágenes (usa tus assets públicos)
  const cover = "/fotos_nimp/industrias.jpg";
  const shots = ["/fotos_nimp/maquinaria.jpeg", "/fotos_nimp/empleados.jpeg", "/fotos_nimp/escalinatas.jpg"];

  const toc = [
    { id: "resumen", label: "Resumen" },
    { id: "protocolos", label: "Protocolos Clave" },
    { id: "mejores-practicas", label: "Mejores Prácticas" },
    { id: "seguridad", label: "Seguridad y HSE" },
    { id: "implementacion", label: "Implementación en Planta" },
    { id: "resultados", label: "Resultados Esperados" },
    { id: "faq", label: "Preguntas Frecuentes" },
  ];

  return (
    <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Reading progress */}
      <motion.div
        style={{ scaleX }}
        className="fixed left-0 right-0 top-0 h-1 origin-left bg-gradient-to-r from-blue-600 to-green-500 z-40"
      />

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-green-600 text-white p-6 md:p-10">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <button
              className="inline-flex items-center gap-2 text-white/90 hover:text-white transition"
              onClick={() => navigate(-1)}
              type="button"
            >
              <ArrowLeft size={20} /> Volver
            </button>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight">
            Limpieza Industrial en Campana: Protocolos y Mejores Prácticas
          </h1>
          <p className="text-white/90 mt-3 text-lg md:text-xl max-w-3xl">
            Conoce los estándares de limpieza industrial que garantizan seguridad y eficiencia en plantas de producción.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-5 text-white/80">
            <div className="inline-flex items-center gap-2">
              <Clock size={18} /> 6 min de lectura
            </div>

            {/* Botón Compartir */}
            <button
              onClick={() => handleShare("resumen")}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/30 bg-white/10 hover:bg-white/20 cursor-pointer transition"
              aria-label="Compartir artículo"
              type="button"
            >
              <Share2 size={18} />
              <span>Compartir</span>
            </button>

            {/* Intents opcionales */}
            <button
              onClick={() => openShareIntent("whatsapp", "resumen")}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/30 bg-white/10 hover:bg-white/20 cursor-pointer transition"
              type="button"
              aria-label="Compartir en WhatsApp"
              title="Compartir en WhatsApp"
            >
              <span className="text-[13px] font-semibold">WhatsApp</span>
            </button>

            <button
              onClick={() => openShareIntent("linkedin", "resumen")}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/30 bg-white/10 hover:bg-white/20 cursor-pointer transition"
              type="button"
              aria-label="Compartir en LinkedIn"
              title="Compartir en LinkedIn"
            >
              <span className="text-[13px] font-semibold">LinkedIn</span>
            </button>
          </div>
        </div>
      </div>

      {/* Cover */}
      <div className="max-w-5xl mx-auto px-4 md:px-6 -mt-8 relative z-10">
        <Img src={cover} alt="Limpieza industrial en Campana" className="shadow-xl ring-1 ring-black/5" />
      </div>

      {/* Content */}
      <div
        className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-[220px,1fr] gap-8 px-4 md:px-6 py-10"
        ref={containerRef}
      >
        {/* TOC */}
        <aside className="hidden md:block sticky top-24 self-start">
          <nav className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <p className="text-xs uppercase font-semibold text-slate-500 mb-3">Contenido</p>
            <ul className="space-y-2">
              {toc.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className="text-slate-700 hover:text-blue-700 text-sm inline-flex items-center gap-2"
                    onClick={(e) => {
                      e.preventDefault();
                      document.querySelector(`#${item.id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
                    }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Article */}
        <article className="space-y-10">
          <Section id="resumen" title="Resumen">
            <p>
              Este artículo resume los protocolos esenciales de limpieza industrial en Campana, con foco en seguridad,
              continuidad operativa y eficiencia. Ofrece una guía práctica para áreas de producción, depósitos y
              servicios auxiliares.
            </p>
            <ul>
              <li><strong>Fecha:</strong> 10 Marzo 2024</li>
              <li><strong>Ámbitos:</strong> líneas de producción, depósitos, exteriores, sanitarios</li>
              <li><strong>Objetivos:</strong> seguridad, cumplimiento, eficiencia, reducción de paradas</li>
            </ul>
          </Section>

          <Section id="protocolos" title="Protocolos Clave">
            <ol>
              <li><strong>Clasificación de zonas</strong>: limpias, controladas y restringidas.</li>
              <li><strong>Fichas técnicas y MSDS</strong> para todos los químicos.</li>
              <li><strong>POEs</strong> por superficie: pisos, paredes, cintas, tableros, sanitarios.</li>
              <li><strong>Checklists</strong> de apertura/cierre y liberación por área.</li>
              <li><strong>Gestión de residuos</strong> (peligrosos/no peligrosos) y trazabilidad.</li>
            </ol>
            <div className="grid md:grid-cols-3 gap-4 mt-4">
              <Img src={shots[0]} alt="Maquinaria industrial" />
              <Img src={shots[1]} alt="Equipo de trabajo" />
              <Img src={shots[2]} alt="Escalinatas y acceso" />
            </div>
          </Section>

          <Section id="mejores-practicas" title="Mejores Prácticas">
            <ul>
              <li>Programar por <em>ventanas operativas</em> (no interferir con producción).</li>
              <li>Uso de EPIs y señalización temporal durante tareas húmedas.</li>
              <li>Registro fotográfico “antes/después” y evidencias de calidad.</li>
              <li>Rotación de dotación para coberturas 24/7 sin fatiga.</li>
            </ul>
          </Section>

          <Section id="seguridad" title="Seguridad y HSE">
            <p>
              La seguridad es el eje: permisos de trabajo, bloqueo/etiquetado (LOTO), control de derrames, plan de
              emergencias y capacitación continua. Supervisión HSE con auditorías internas.
            </p>
          </Section>

          <Section id="implementacion" title="Implementación en Planta">
            <p>
              Comienza con relevamiento técnico, mapa de zonas, estimación de tiempos y recursos. Se definen turnos,
              responsables y KPIs (tiempo por zona, incidentes, no conformidades).
            </p>
          </Section>

          <Section id="resultados" title="Resultados Esperados">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-green-50 p-5 rounded-xl border">
                <p className="text-3xl font-extrabold">-25%</p>
                <p className="text-sm text-slate-600">tiempos improductivos por higiene</p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-green-50 p-5 rounded-xl border">
                <p className="text-3xl font-extrabold">+30%</p>
                <p className="text-sm text-slate-600">percepción de orden y limpieza</p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-green-50 p-5 rounded-xl border">
                <p className="text-3xl font-extrabold">0</p>
                <p className="text-sm text-slate-600">incidentes por tareas de limpieza</p>
              </div>
            </div>
          </Section>

          <Section id="faq" title="Preguntas Frecuentes">
            <details className="mb-3">
              <summary className="font-semibold cursor-pointer">¿Interfiere con la producción?</summary>
              <p>Planificamos por ventanas y zonas; el objetivo es cero impacto en la línea.</p>
            </details>
            <details className="mb-3">
              <summary className="font-semibold cursor-pointer">¿Qué certificaciones manejan?</summary>
              <p>MSDS, POEs, checklists de calidad y trazabilidad de residuos.</p>
            </details>
            <details>
              <summary className="font-semibold cursor-pointer">¿Pueden operar nocturno o fines de semana?</summary>
              <p>Sí, adecuamos dotación y turnos a la necesidad operativa.</p>
            </details>
          </Section>

          {/* CTA */}
          <div className="bg-gradient-to-r from-blue-800 to-green-500 text-white p-6 md:p-10 rounded-2xl">
            <h3 className="text-2xl md:text-3xl font-bold">¿Querés un plan industrial a medida?</h3>
            <p className="opacity-90 mt-2">Te enviamos una propuesta en 24 hs sin costo.</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <a href="#contacto" className="px-5 py-3 bg-white text-blue-700 rounded-xl font-semibold">
                Solicitar presupuesto
              </a>

              {/* Copiar enlace */}
              <button
                onClick={() => handleCopy("resumen")}
                className="px-5 py-3 bg-white/10 border border-white/30 rounded-xl inline-flex items-center gap-2 hover:bg-white/20 cursor-pointer transition"
                type="button"
              >
                <LinkIcon size={18} />
                {copied === "resumen" ? "¡Copiado!" : "Copiar enlace"}
              </button>

              {/* Compartir */}
              <button
                onClick={() => handleShare("resumen")}
                className="px-5 py-3 bg-white/10 border border-white/30 rounded-xl inline-flex items-center gap-2 hover:bg-white/20 cursor-pointer transition"
                type="button"
              >
                <Share2 size={18} />
                Compartir
              </button>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default BlogCaseStudy2;
