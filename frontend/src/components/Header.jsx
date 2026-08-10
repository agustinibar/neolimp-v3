import React, { useState } from 'react';
import { Menu, Phone, X } from 'lucide-react';
import { SALES_PHONE_HREF } from '@/config/contact';
import { trackGoogleAdsContactConversion } from '@/utils/googleAds';

const links = [
  ['Servicios', 'servicios'],
  ['Experiencia', 'experiencia'],
  ['Cómo trabajamos', 'proceso'],
  ['Contacto', 'contacto'],
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const goTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setOpen(false);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 lg:px-8" aria-label="Navegación principal">
        <button onClick={() => goTo('inicio')} className="rounded-md" aria-label="Ir al inicio">
          <img src="/fotos_nimp/neolimplogo.webp" alt="Neolimp Servicios" className="h-12 w-auto" width="224" height="80" />
        </button>
        <div className="hidden items-center gap-7 lg:flex">
          {links.map(([label, id]) => <button key={id} onClick={() => goTo(id)} className="text-sm font-semibold text-slate-700 hover:text-blue-800">{label}</button>)}
          <a href={SALES_PHONE_HREF} onClick={() => trackGoogleAdsContactConversion('header-phone')} className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-blue-800 px-4 font-semibold text-blue-800"><Phone size={18} /> Llamar</a>
          <button onClick={() => goTo('contacto')} className="min-h-11 rounded-lg bg-blue-800 px-5 font-semibold text-white hover:bg-blue-900">Solicitar presupuesto</button>
        </div>
        <button onClick={() => setOpen(!open)} className="grid min-h-11 min-w-11 place-items-center rounded-lg text-slate-800 lg:hidden" aria-expanded={open} aria-label={open ? 'Cerrar menú' : 'Abrir menú'}>{open ? <X /> : <Menu />}</button>
      </nav>
      {open && <div className="border-t border-slate-200 bg-white px-4 py-4 lg:hidden">{links.map(([label, id]) => <button key={id} onClick={() => goTo(id)} className="block min-h-12 w-full border-b border-slate-100 text-left font-semibold text-slate-700">{label}</button>)}<button onClick={() => goTo('contacto')} className="mt-4 min-h-12 w-full rounded-lg bg-blue-800 font-semibold text-white">Solicitar presupuesto</button></div>}
    </header>
  );
}
