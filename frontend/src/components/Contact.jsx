import React, { useRef, useState } from 'react';
import { Clock, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { SALES_PHONE_DISPLAY, SALES_PHONE_HREF, getWhatsAppUrl } from '@/config/contact';
import { trackGoogleAdsContactConversion } from '@/utils/googleAds';

const API_URL = import.meta.env.VITE_CONTACT_API_URL || 'https://neolimp-v3.onrender.com';
const fieldClass = 'mt-1.5 min-h-12 w-full rounded-lg border border-slate-300 bg-white px-4 text-base text-slate-900 outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-200';

export default function Contact() {
  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState(null);
  const formRef = useRef(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSending(true);
    setStatus(null);
    const formEl = formRef.current;
    const formData = new FormData(formEl || event.currentTarget);
    const payload = {
      nombre: formData.get('nombre')?.toString().trim(),
      empresa: formData.get('empresa')?.toString().trim(),
      email: formData.get('email')?.toString().trim(),
      telefono: formData.get('telefono')?.toString().trim(),
      servicio: formData.get('servicio')?.toString().trim(),
      mensaje: formData.get('mensaje')?.toString().trim(),
      origen: 'web-neolimp-contacto',
      website: formData.get('website')?.toString().trim(),
    };
    try {
      const response = await fetch(`${API_URL}/contact`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const data = await response.json().catch(() => null);
      if (!response.ok || !data?.ok) throw new Error(data?.error || 'Error enviando');
      formEl?.reset();
      setStatus('success');
      trackGoogleAdsContactConversion('contact-form-success');
    } catch (error) {
      console.error('Error enviando al backend:', error);
      setStatus('error');
    } finally {
      setIsSending(false);
    }
  };

  return <section id="contacto" className="bg-slate-950 py-16 text-white md:py-24"><div className="mx-auto grid max-w-7xl gap-10 px-4 lg:grid-cols-[.8fr_1.2fr] lg:px-8">
    <div><p className="text-sm font-bold uppercase tracking-[.16em] text-green-400">Contacto comercial</p><h2 className="mt-3 text-3xl font-extrabold md:text-4xl">Solicitá un presupuesto para tu empresa</h2><p className="mt-5 max-w-xl leading-8 text-slate-300">Compartinos los datos básicos de la instalación. Si preferís una respuesta directa, llamanos o escribinos por WhatsApp.</p>
      <div className="mt-8 grid gap-3"><a href={SALES_PHONE_HREF} onClick={() => trackGoogleAdsContactConversion('contact-phone')} className="flex min-h-14 items-center gap-3 rounded-lg border border-slate-700 px-4 font-bold hover:border-blue-400"><Phone className="text-blue-400" /> {SALES_PHONE_DISPLAY}</a><a href={getWhatsAppUrl()} target="_blank" rel="noopener noreferrer" onClick={() => trackGoogleAdsContactConversion('contact-whatsapp')} className="flex min-h-14 items-center gap-3 rounded-lg border border-slate-700 px-4 font-bold hover:border-green-400"><MessageCircle className="text-green-400" /> Consultar por WhatsApp</a></div>
      <ul className="mt-8 space-y-4 text-sm text-slate-300"><li className="flex gap-3"><MapPin className="shrink-0 text-slate-400" size={20} /> Lavalle 463, Campana, Buenos Aires</li><li className="flex gap-3"><Mail className="shrink-0 text-slate-400" size={20} /> neolimpsrl@gmail.com</li><li className="flex gap-3"><Clock className="shrink-0 text-slate-400" size={20} /> Lun–Vie 8:00–18:00 · Sáb 9:00–13:00</li></ul>
    </div>
    <div className="rounded-2xl bg-white p-5 text-slate-900 shadow-2xl sm:p-8"><h3 className="text-2xl font-bold">Contanos sobre la instalación</h3><p className="mt-2 text-sm leading-6 text-slate-600">Los campos marcados con * son obligatorios.</p>
      <form ref={formRef} onSubmit={handleSubmit} className="mt-6 space-y-5">
        <div className="absolute -left-[9999px]" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
        <div className="grid gap-5 sm:grid-cols-2"><label className="text-sm font-semibold" htmlFor="nombre">Nombre y apellido *<input id="nombre" name="nombre" autoComplete="name" required className={fieldClass} /></label><label className="text-sm font-semibold" htmlFor="empresa">Empresa<input id="empresa" name="empresa" autoComplete="organization" className={fieldClass} /></label></div>
        <div className="grid gap-5 sm:grid-cols-2"><label className="text-sm font-semibold" htmlFor="email">Email *<input id="email" name="email" type="email" autoComplete="email" required className={fieldClass} /></label><label className="text-sm font-semibold" htmlFor="telefono">Teléfono / WhatsApp *<input id="telefono" name="telefono" type="tel" inputMode="tel" autoComplete="tel" required className={fieldClass} /></label></div>
        <label className="block text-sm font-semibold" htmlFor="servicio">Tipo de servicio<select id="servicio" name="servicio" defaultValue="" className={fieldClass}><option value="" disabled>Seleccioná una opción</option><option value="industrial">Industrial / plantas / depósitos</option><option value="oficinas">Oficinas y espacios corporativos</option><option value="salud">Clínicas y sanatorios</option><option value="consorcios">Consorcios y edificios</option><option value="clubes">Clubes y espacios comunes</option><option value="municipios">Municipios / organismos públicos</option><option value="otro">Otro</option></select></label>
        <label className="block text-sm font-semibold" htmlFor="mensaje">¿Qué necesitás cotizar? *<textarea id="mensaje" name="mensaje" rows="4" required className={`${fieldClass} py-3`} placeholder="Tipo de instalación, ubicación, superficie aproximada, frecuencia u horarios." /></label>
        <button type="submit" disabled={isSending} className="min-h-[52px] w-full rounded-lg bg-blue-800 px-6 py-3.5 font-bold text-white hover:bg-blue-900 disabled:cursor-wait disabled:opacity-60">{isSending ? 'Enviando solicitud…' : 'Solicitar presupuesto'}</button>
        {status === 'success' && <p role="status" aria-live="polite" className="rounded-lg bg-green-50 p-4 text-sm font-semibold text-green-800">Solicitud enviada. El equipo de Neolimp se pondrá en contacto.</p>}{status === 'error' && <p role="alert" className="rounded-lg bg-red-50 p-4 text-sm font-semibold text-red-800">No pudimos enviar la solicitud. Intentá nuevamente o contactanos por teléfono o WhatsApp.</p>}
      </form>
    </div>
  </div></section>;
}
