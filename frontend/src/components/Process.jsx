import React from 'react';
import { ClipboardList, MapPinned, PhoneCall, Settings2 } from 'lucide-react';

const steps = [
  [PhoneCall, '1', 'Primera conversación', 'Nos contás el tipo de instalación, ubicación, horarios y necesidad principal.'],
  [MapPinned, '2', 'Relevamiento', 'Se coordinan los datos necesarios para dimensionar superficies, frecuencia y exigencias.'],
  [ClipboardList, '3', 'Propuesta de servicio', 'Recibís un alcance definido para evaluar la tercerización de limpieza.'],
  [Settings2, '4', 'Coordinación operativa', 'Una vez acordado el servicio, se organiza la puesta en marcha según la operación.'],
];

export default function Process() {
  const toContact = () => document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' });
  return <section id="proceso" className="bg-white py-16 md:py-24"><div className="mx-auto max-w-7xl px-4 lg:px-8"><div className="max-w-3xl"><p className="text-sm font-bold uppercase tracking-[.16em] text-blue-800">Cómo empezar</p><h2 className="mt-3 text-3xl font-extrabold text-slate-950 md:text-4xl">Del contacto a una propuesta clara</h2><p className="mt-4 text-lg leading-8 text-slate-600">Un proceso simple para que compras u operaciones pueda evaluar el servicio sin perder tiempo.</p></div><ol className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">{steps.map(([Icon, number, title, text]) => <li key={number} className="rounded-xl border border-slate-200 p-6"><div className="flex items-center justify-between"><Icon className="text-blue-800" /><span className="text-3xl font-black text-slate-200">{number}</span></div><h3 className="mt-5 text-lg font-bold text-slate-950">{title}</h3><p className="mt-2 leading-7 text-slate-600">{text}</p></li>)}</ol><button onClick={toContact} className="mt-8 min-h-12 rounded-lg bg-blue-800 px-6 font-bold text-white hover:bg-blue-900">Coordinar un relevamiento</button></div></section>;
}
