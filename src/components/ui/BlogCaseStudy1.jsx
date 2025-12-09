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

const BlogCaseStudy1 = ({ onBack }) => {
  // Reading progress bar
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ container: containerRef });
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 20, restDelta: 0.001 });

  const [copied, setCopied] = useState("");
  const navigate = useNavigate();

  // HANDLERS =========

  // Comparte usando Web Share si está disponible; si no, copia el enlace (fallback)
  const handleShare = async (id) => {
    const shareUrl = anchor(id);
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Caso de Estudio: Terminal Zárate",
          text: "Cómo Neolimp transformó una operación industrial en 72 horas.",
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

  // Intents específicos para plataformas
  const openShareIntent = (platform, id) => {
    const url = anchor(id);
    const text = encodeURIComponent(
      "Caso de Estudio: Terminal Zárate — Cómo Neolimp transformó una operación industrial en 72 horas."
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

  const cover = "/fotos_nimp/TZ.png";
  const shots = ["/fotos_nimp/industrias.jpg", "/fotos_nimp/maquinaria.jpeg", "/fotos_nimp/empleados.jpeg"];

  const toc = [
    { id: "resumen", label: "Resumen" },
    { id: "desafio", label: "El Desafío" },
    { id: "plan", label: "Plan de Acción" },
    { id: "ejecucion", label: "Ejecución" },
    { id: "resultados", label: "Resultados" },
    { id: "testimonio", label: "Testimonio" },
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

          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight">Caso de Estudio: Terminal Zárate</h1>
          <p className="text-white/90 mt-3 text-lg md:text-xl max-w-3xl">
            Cómo Neolimp organizó, ejecutó y controló una limpieza industrial integral en 72 horas, sin frenar la
            operación del cliente.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-5 text-white/80">
            <div className="inline-flex items-center gap-2">
              <Clock size={18} /> 6 min de lectura
            </div>

            {/* Botón Compartir (ícono + texto dentro) */}
            <button
              onClick={() => handleShare("resumen")}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/30 bg-white/10 hover:bg-white/20 cursor-pointer transition"
              aria-label="Compartir caso de estudio"
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
        <Img src={cover} alt="Terminal Zárate" className="shadow-xl ring-1 ring-black/5" />
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
              En Terminal Zárate (puerto logístico), el cliente necesitaba un servicio de limpieza industrial intensivo
              sin detener la operación diaria. El objetivo: recuperar estándares visuales, sanitarios y de seguridad en
              áreas de alto tránsito, con maquinaria pesada y protocolos estrictos.
            </p>
            <ul>
              <li>
                <strong>Duración:</strong> 72 horas (ventanas operativas escalonadas)
              </li>
              <li>
                <strong>Equipo:</strong> 18 especialistas + supervisor HSE
              </li>
              <li>
                <strong>Áreas:</strong> depósitos, oficinas, zona de carga/descarga, sanitarios
              </li>
              <li>
                <strong>Resultado:</strong> satisfacción del cliente 9.7/10 y reducción de reclamos internos
              </li>
            </ul>
          </Section>

          <Section id="desafio" title="El Desafío">
            <p>
              Alta circulación de personal y maquinaria, suciedad adherida por polvo de carga, y sanitarios
              subutilizados en horas pico. Había que ejecutar por <em>ventanas</em> para no frenar la operación ni
              comprometer la seguridad.
            </p>
            <Img src={shots[0]} alt="Área industrial" className="mt-4" />
          </Section>

          <Section id="plan" title="Plan de Acción">
            <ol>
              <li>
                <strong>Relevamiento técnico</strong> + matriz de riesgos.
              </li>
              <li>
                <strong>Secuenciación</strong> por zonas (piso, sanitarios, oficinas, exteriores).
              </li>
              <li>
                <strong>Dotación y horarios</strong> rotativos para cubrir 24/7 sin interferir.
              </li>
              <li>
                <strong>Químicos certificados</strong> (fichas técnicas y MSDS) y checklists de calidad.
              </li>
            </ol>
            <div className="grid md:grid-cols-3 gap-4 mt-4">
              <Img src={shots[1]} alt="Maquinaria" />
              <Img src="/fotos_nimp/escalinatas.jpg" alt="Escalinatas" />
              <Img src="/fotos_nimp/clinicas.jpg" alt="Superficies sanitarias" />
            </div>
          </Section>

          <Section id="ejecucion" title="Ejecución">
            <p>
              Implementamos un esquema “células de trabajo” con roles definidos (operario, maquinista, reponedor,
              supervisor HSE). Control por QR de tareas, registros fotográficos “antes/después” y checklist de
              liberación por área.
            </p>
            <ul>
              <li>Lavado y desengrase con hidrolavadora a 120 bar.</li>
              <li>Aspirado industrial de partículas en depósitos.</li>
              <li>Desinfección de alto toque con amonios cuaternarios.</li>
              <li>Señalización temporal y control de derrames.</li>
            </ul>
            <Img src={shots[2]} alt="Equipo en operación" className="mt-4" />
          </Section>

          <Section id="resultados" title="Resultados">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-green-50 p-5 rounded-xl border">
                <p className="text-3xl font-extrabold">-32%</p>
                <p className="text-sm text-slate-600">reclamos internos por limpieza</p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-green-50 p-5 rounded-xl border">
                <p className="text-3xl font-extrabold">+41%</p>
                <p className="text-sm text-slate-600">percepción de higiene (encuesta)</p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-green-50 p-5 rounded-xl border">
                <p className="text-3xl font-extrabold">0</p>
                <p className="text-sm text-slate-600">incidentes reportados</p>
              </div>
            </div>
          </Section>

          <Section id="testimonio" title="Testimonio">
            <div className="relative p-6 bg-slate-50 border rounded-xl">
              <div className="absolute right-6 top-6 text-slate-300">
                <Quote size={48} />
              </div>
              <p className="italic">
                “Neolimp coordinó con nuestro equipo operativo sin frenar un solo turno. La diferencia se vio en 48
                horas. Vamos a extender el contrato.”
              </p>
              <p className="mt-3 font-semibold">Jefe de Operaciones – Terminal Zárate</p>
            </div>
          </Section>

          <Section id="faq" title="Preguntas Frecuentes">
            <details className="mb-3">
              <summary className="font-semibold cursor-pointer">¿Cómo trabajan sin frenar la operación?</summary>
              <p>Planificamos por ventanas y zonas, con señalización y supervisión HSE.</p>
            </details>
            <details className="mb-3">
              <summary className="font-semibold cursor-pointer">¿Qué químicos usan?</summary>
              <p>Productos certificados con MSDS, amigables con superficies y personal.</p>
            </details>
            <details>
              <summary className="font-semibold cursor-pointer">¿Pueden hacerlo en fin de semana o nocturno?</summary>
              <p>Sí, adaptamos dotación y horarios a la necesidad operativa.</p>
            </details>
          </Section>

          {/* CTA */}
          <div className="bg-gradient-to-r from-blue-800 to-green-500 text-white p-6 md:p-10 rounded-2xl">
            <h3 className="text-2xl md:text-3xl font-bold">¿Querés un plan a medida?</h3>
            <p className="opacity-90 mt-2">Te enviamos una propuesta en 24 hs sin costo.</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <a href="/" className="px-5 py-3 bg-white text-blue-700 rounded-xl font-semibold">
                Solicitar presupuesto
              </a>

              {/* Copiar enlace (SIEMPRE copia) */}
              <button
                onClick={() => handleCopy("resumen")}
                className="px-5 py-3 bg-white/10 border border-white/30 rounded-xl inline-flex items-center gap-2 hover:bg-white/20 cursor-pointer transition"
                type="button"
              >
                <LinkIcon size={18} />
                {copied === "resumen" ? "¡Copiado!" : "Copiar enlace"}
              </button>

              {/* Compartir (Web Share / fallback a copiar) */}
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

export default BlogCaseStudy1;
