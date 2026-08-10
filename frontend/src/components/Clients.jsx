import React, { useState } from 'react';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

const logos = [
  ['/fotos_nimp/TZ.webp', 'Terminal Zárate'],
  ['/fotos_nimp/Boshoku.webp', 'Toyota Boshoku'],
  ['/fotos_nimp/Bayer-Logo.webp', 'Bayer'],
  ['/fotos_nimp/clinicadelta.webp', 'Clínica Delta'],
  ['/fotos_nimp/cinemarklogo.webp', 'Cinemark'],
  ['/fotos_nimp/austin.webp', 'Austin Powder'],
];

const faqs = [
  ['¿Cómo se prepara un presupuesto?', 'Se releva el tipo de instalación, áreas, frecuencia, horarios y requerimientos operativos. Con esa información se define el alcance de la propuesta.'],
  ['¿Pueden trabajar sin interrumpir la operación?', 'La frecuencia y los horarios se coordinan según la actividad de cada cliente, incluyendo esquemas por turnos cuando el servicio lo requiere.'],
  ['¿Trabajan con servicios permanentes y puntuales?', 'El sitio actual informa modalidades de mantenimiento y también intervenciones programadas. La disponibilidad se confirma al analizar cada solicitud.'],
  ['¿Qué zonas atienden?', 'La sede informada se encuentra en Campana, Buenos Aires. La cobertura de cada proyecto se confirma con el equipo comercial según ubicación y alcance.'],
];

export default function Clients() {
  const [open, setOpen] = useState(0);
  return (
    <section id="experiencia" className="bg-slate-50 py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="max-w-3xl"><p className="text-sm font-bold uppercase tracking-[.16em] text-blue-800">Experiencia visible</p><h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950 md:text-4xl">Referencias presentes en el trabajo de Neolimp</h2><p className="mt-4 text-lg leading-8 text-slate-600">El repositorio institucional de Neolimp presenta estas organizaciones y un caso dedicado a Terminal Zárate.</p></div>
        <div className="mt-9 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6" aria-label="Organizaciones presentadas por Neolimp">{logos.map(([src, alt]) => <div key={alt} className="grid min-h-28 place-items-center rounded-lg border border-slate-200 bg-white p-4"><img src={src} alt={alt} className="max-h-14 max-w-full object-contain" width="180" height="70" loading="lazy" /></div>)}</div>
        <article className="mt-10 grid overflow-hidden rounded-xl border border-slate-200 bg-white md:grid-cols-2">
          <img src="/fotos_nimp/TZ.webp" alt="Terminal Zárate, caso presentado por Neolimp" className="h-full min-h-72 w-full object-cover" width="800" height="600" loading="lazy" />
          <div className="p-7 md:p-10"><p className="text-sm font-bold uppercase tracking-[.14em] text-green-700">Caso de experiencia</p><h3 className="mt-3 text-2xl font-bold text-slate-950">Terminal Zárate</h3><p className="mt-4 leading-7 text-slate-600">Conocé el contexto operativo y el abordaje presentado por Neolimp para una instalación industrial. Sin promesas genéricas: una referencia concreta para evaluar capacidad y metodología.</p><Link to="/blog01" className="mt-6 inline-flex min-h-11 items-center gap-2 font-bold text-blue-800">Ver caso completo <ArrowRight size={18} /></Link></div>
        </article>
        <div className="mt-14 grid gap-10 lg:grid-cols-[.8fr_1.2fr]">
          <div><h2 className="text-3xl font-extrabold text-slate-950">Preguntas antes de contratar</h2><p className="mt-4 leading-7 text-slate-600">Información práctica para responsables de compras, facilities y operaciones.</p></div>
          <div className="divide-y divide-slate-200 border-y border-slate-200">{faqs.map(([q, a], index) => <div key={q}><button onClick={() => setOpen(open === index ? -1 : index)} className="flex min-h-16 w-full items-center justify-between gap-4 py-4 text-left font-bold text-slate-900" aria-expanded={open === index}>{q}<ChevronDown className={`shrink-0 transition-transform ${open === index ? 'rotate-180' : ''}`} /></button>{open === index && <p className="pb-5 leading-7 text-slate-600">{a}</p>}</div>)}</div>
        </div>
      </div>
    </section>
  );
}
