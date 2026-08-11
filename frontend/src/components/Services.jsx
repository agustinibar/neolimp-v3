import React from 'react';
import { ArrowRight, Building2, Factory, HeartPulse, Landmark } from 'lucide-react';

const services = [
  { icon: Factory, title: 'Limpieza industrial', audience: 'Plantas, fábricas, depósitos y centros logísticos.', text: 'Un servicio planificado según áreas, turnos, exigencias operativas y protocolos del establecimiento.', image: '/fotos_nimp/industrias.webp' },
  { icon: Building2, title: 'Limpieza corporativa', audience: 'Oficinas, bancos y espacios de trabajo.', text: 'Mantenimiento profesional de puestos, circulaciones, sanitarios y áreas comunes sin interferir con la actividad.', image: '/fotos_nimp/banc.webp' },
  { icon: HeartPulse, title: 'Instituciones de salud', audience: 'Clínicas, sanatorios e instalaciones asistenciales.', text: 'Rutinas de limpieza y desinfección adaptadas a sectores con requerimientos sanitarios específicos.', image: '/fotos_nimp/clinicas.webp' },
  { icon: Landmark, title: 'Instituciones y espacios comunes', audience: 'Clubes, organizaciones y barrios privados.', text: 'Cobertura de áreas de circulación, instalaciones, sanitarios y sectores compartidos.', image: '/fotos_nimp/images.webp' },
];

export default function Services() {
  const toContact = () => document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' });
  return (
    <section id="servicios" className="bg-white py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[.16em] text-blue-800">Servicios para empresas</p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950 md:text-4xl">Una propuesta de limpieza acorde a cada operación</h2>
          <p className="mt-4 text-lg leading-8 text-slate-600">El alcance se define según el tipo de instalación, las superficies, horarios, frecuencia y necesidades de cada organización.</p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {services.map((service) => <article key={service.title} className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <img src={service.image} alt={`${service.title} para ${service.audience}`} className="h-52 w-full object-cover" width="800" height="420" loading="lazy" decoding="async" />
            <div className="p-6">
              <service.icon className="text-blue-800" size={28} aria-hidden="true" />
              <h3 className="mt-4 text-xl font-bold text-slate-950">{service.title}</h3>
              <p className="mt-2 font-semibold text-slate-700">{service.audience}</p>
              <p className="mt-3 leading-7 text-slate-600">{service.text}</p>
              <button onClick={toContact} className="mt-5 inline-flex min-h-11 items-center gap-2 font-bold text-blue-800 hover:text-blue-950">Cotizar este servicio <ArrowRight size={18} /></button>
            </div>
          </article>)}
        </div>
        <div className="mt-10 flex flex-col items-start justify-between gap-5 rounded-xl bg-slate-900 p-6 text-white md:flex-row md:items-center md:p-8">
          <div><h3 className="text-xl font-bold">¿Tu instalación requiere un alcance particular?</h3><p className="mt-2 text-slate-300">Coordinemos un relevamiento para entender la operación antes de cotizar.</p></div>
          <button onClick={toContact} className="min-h-12 shrink-0 rounded-lg bg-white px-5 font-bold text-slate-950">Coordinar una visita</button>
        </div>
      </div>
    </section>
  );
}
