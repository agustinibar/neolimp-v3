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

const anchor = (id) => {
  const url = new URL(window.location.href);
  url.hash = id || "";
  return url.toString();
};

const BlogCaseStudy3 = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ container: containerRef });
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 20, restDelta: 0.001 });

  const [copied, setCopied] = useState("");
  const navigate = useNavigate();

  // ===== HANDLERS =====
  const handleShare = async (id) => {
    const shareUrl = anchor(id);
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Cómo Mantener Sanatorios Seguros y Limpios: Guía Completa",
          text: "Protocolos esenciales para mantener ambientes hospitalarios seguros y libres de contaminación.",
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

  const openShareIntent = (platform, id) => {
    const url = anchor(id);
    const text = encodeURIComponent(
      "Cómo Mantener Sanatorios Seguros y Limpios — Protocolos esenciales para ambientes hospitalarios seguros."
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

  const cover = "/fotos_nimp/clinicas.jpg";
  const shots = ["/fotos_nimp/empleados.jpeg", "/fotos_nimp/maquinaria.jpeg", "/fotos_nimp/hotel.jpg"];

  const toc = [
    { id: "resumen", label: "Resumen" },
    { id: "protocolos", label: "Protocolos Sanitarios" },
    { id: "higiene", label: "Higiene y Desinfección" },
    { id: "control", label: "Control de Infecciones" },
    { id: "implementacion", label: "Implementación en Sanatorios" },
    { id: "resultados", label: "Resultados y Beneficios" },
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
            Cómo Mantener Sanatorios Seguros y Limpios: Guía Completa
          </h1>
          <p className="text-white/90 mt-3 text-lg md:text-xl max-w-3xl">
            Protocolos sanitarios esenciales para mantener ambientes hospitalarios seguros y libres de contaminación.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-5 text-white/80">
            <div className="inline-flex items-center gap-2">
              <Clock size={18} /> 6 min de lectura
            </div>

            {/* Compartir */}
            <button
              onClick={() => handleShare("resumen")}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/30 bg-white/10 hover:bg-white/20 cursor-pointer transition"
              aria-label="Compartir artículo"
              type="button"
            >
              <Share2 size={18} />
              <span>Compartir</span>
            </button>

            {/* Intents */}
            <button
              onClick={() => openShareIntent("whatsapp", "resumen")}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/30 bg-white/10 hover:bg-white/20 cursor-pointer transition"
              type="button"
            >
              <span className="text-[13px] font-semibold">WhatsApp</span>
            </button>

            <button
              onClick={() => openShareIntent("linkedin", "resumen")}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/30 bg-white/10 hover:bg-white/20 cursor-pointer transition"
              type="button"
            >
              <span className="text-[13px] font-semibold">LinkedIn</span>
            </button>
          </div>
        </div>
      </div>

      {/* Cover */}
      <div className="max-w-5xl mx-auto px-4 md:px-6 -mt-8 relative z-10">
        <Img src={cover} alt="Sanatorio limpio y seguro" className="shadow-xl ring-1 ring-black/5" />
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
              La limpieza hospitalaria requiere protocolos más estrictos que cualquier otro entorno. Un error puede
              afectar directamente la salud de los pacientes. Esta guía resume las mejores prácticas para mantener
              sanatorios limpios, seguros y conformes con normativas sanitarias vigentes.
            </p>
            <ul>
              <li><strong>Fecha:</strong> 5 Marzo 2024</li>
              <li><strong>Ámbitos:</strong> quirófanos, salas de espera, sanitarios, laboratorios, pasillos</li>
              <li><strong>Objetivos:</strong> bioseguridad, trazabilidad, cumplimiento, confort</li>
            </ul>
          </Section>

          <Section id="protocolos" title="Protocolos Sanitarios">
            <ul>
              <li>Desinfección por etapas: limpieza, enjuague, desinfección, control visual.</li>
              <li>Uso de amonios cuaternarios de 5ta generación.</li>
              <li>Relevamiento y validación de superficies críticas.</li>
              <li>Fichas técnicas y MSDS actualizadas.</li>
            </ul>
            <Img src={shots[0]} alt="Equipo médico limpiando" className="mt-4" />
          </Section>

          <Section id="higiene" title="Higiene y Desinfección">
            <p>
              Cada superficie requiere un tratamiento específico: pisos vinílicos, acero inoxidable, cristales,
              mobiliario hospitalario. Se trabaja con materiales descartables y paños de microfibra codificados por
              color para evitar contaminación cruzada.
            </p>
          </Section>

          <Section id="control" title="Control de Infecciones">
            <p>
              Los registros fotográficos y los checklists de control diario son fundamentales para garantizar la
              trazabilidad. Supervisores HSE revisan temperatura de agua, concentración de químicos y orden de tareas.
            </p>
            <Img src={shots[1]} alt="Control sanitario" className="mt-4" />
          </Section>

          <Section id="implementacion" title="Implementación en Sanatorios">
            <p>
              Se establecen turnos rotativos, auditorías cruzadas y protocolos ante emergencias (derrames, aislamientos,
              riesgos biológicos). Cada área tiene asignado un responsable operativo.
            </p>
          </Section>

          <Section id="resultados" title="Resultados y Beneficios">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-green-50 p-5 rounded-xl border">
                <p className="text-3xl font-extrabold">-45%</p>
                <p className="text-sm text-slate-600">reducción en infecciones cruzadas</p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-green-50 p-5 rounded-xl border">
                <p className="text-3xl font-extrabold">+60%</p>
                <p className="text-sm text-slate-600">satisfacción del personal médico</p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-green-50 p-5 rounded-xl border">
                <p className="text-3xl font-extrabold">0</p>
                <p className="text-sm text-slate-600">incidentes sanitarios</p>
              </div>
            </div>
          </Section>

          <Section id="faq" title="Preguntas Frecuentes">
            <details className="mb-3">
              <summary className="font-semibold cursor-pointer">¿Usan productos hospitalarios aprobados?</summary>
              <p>Sí, utilizamos productos certificados por ANMAT y de grado hospitalario.</p>
            </details>
            <details className="mb-3">
              <summary className="font-semibold cursor-pointer">¿Cómo evitan la contaminación cruzada?</summary>
              <p>Mediante codificación por color, materiales descartables y protocolos de separación por área.</p>
            </details>
            <details>
              <summary className="font-semibold cursor-pointer">¿Se puede auditar el servicio?</summary>
              <p>Sí, entregamos registros, fichas y reportes con trazabilidad completa.</p>
            </details>
          </Section>

          {/* CTA */}
          <div className="bg-gradient-to-r from-blue-800 to-green-500 text-white p-6 md:p-10 rounded-2xl">
            <h3 className="text-2xl md:text-3xl font-bold">¿Querés un plan sanitario a medida?</h3>
            <p className="opacity-90 mt-2">Te enviamos una propuesta en 24 hs sin costo.</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <a href="#contacto" className="px-5 py-3 bg-white text-blue-700 rounded-xl font-semibold">
                Solicitar presupuesto
              </a>

              <button
                onClick={() => handleCopy("resumen")}
                className="px-5 py-3 bg-white/10 border border-white/30 rounded-xl inline-flex items-center gap-2 hover:bg-white/20 cursor-pointer transition"
                type="button"
              >
                <LinkIcon size={18} />
                {copied === "resumen" ? "¡Copiado!" : "Copiar enlace"}
              </button>

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

export default BlogCaseStudy3;
