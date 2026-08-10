import React from 'react';
import { ArrowRight, CheckCircle2, MessageCircle, Phone } from 'lucide-react';
import { SALES_PHONE_HREF, getWhatsAppUrl } from '@/config/contact';
import { trackGoogleAdsContactConversion } from '@/utils/googleAds';

export default function Hero() {
  const toContact = () => document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' });
  return (
    <section id="inicio" className="overflow-hidden bg-slate-50 pt-20">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:py-16 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:px-8 lg:py-20">
        <div>
          <p className="mb-4 text-sm font-bold uppercase tracking-[.16em] text-blue-800">Servicios de limpieza para organizaciones</p>
          <h1 className="max-w-3xl text-4xl font-extrabold leading-[1.08] tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">Limpieza industrial y corporativa para empresas</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">Tercerización de limpieza para plantas, depósitos, centros logísticos, oficinas e instituciones. Coordinamos un relevamiento para definir alcance, frecuencia y modalidad de trabajo.</p>
          <ul className="mt-6 grid gap-3 text-sm font-medium text-slate-700 sm:grid-cols-2" aria-label="Características del servicio">
            {['Plan según cada instalación', 'Supervisión del servicio', 'Personal y equipamiento profesional', 'Cobertura coordinada según proyecto'].map((item) => <li key={item} className="flex items-center gap-2"><CheckCircle2 className="shrink-0 text-green-600" size={20} />{item}</li>)}
          </ul>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button onClick={toContact} className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-lg bg-blue-800 px-6 py-3.5 text-base font-bold text-white hover:bg-blue-900">Solicitar presupuesto <ArrowRight size={19} /></button>
            <a href={getWhatsAppUrl()} target="_blank" rel="noopener noreferrer" onClick={() => trackGoogleAdsContactConversion('hero-whatsapp')} className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-lg border-2 border-green-600 px-6 py-3 text-base font-bold text-green-700 hover:bg-green-50"><MessageCircle size={20} /> Consultar por WhatsApp</a>
          </div>
          <a href={SALES_PHONE_HREF} onClick={() => trackGoogleAdsContactConversion('hero-phone')} className="mt-5 inline-flex min-h-11 items-center gap-2 font-semibold text-slate-700 underline decoration-slate-300 underline-offset-4 hover:text-blue-800"><Phone size={18} /> ¿Preferís hablar? Llamar ahora</a>
        </div>
        <div className="relative">
          <img src="/fotos_nimp/industrias.webp" alt="Servicio profesional de limpieza industrial en una planta" className="aspect-[4/3] w-full rounded-2xl object-cover shadow-xl" width="1200" height="900" fetchPriority="high" />
          <div className="relative mx-4 -mt-8 rounded-xl border border-slate-200 bg-white p-5 shadow-lg sm:mx-8">
            <p className="font-bold text-slate-950">¿Necesitás cotizar una instalación?</p>
            <p className="mt-1 text-sm leading-6 text-slate-600">Contanos el tipo de espacio, ubicación y frecuencia. El equipo comercial coordina los próximos pasos.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
