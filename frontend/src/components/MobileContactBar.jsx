import React from 'react';
import { MessageCircle, Phone } from 'lucide-react';
import { SALES_PHONE_HREF, getWhatsAppUrl } from '@/config/contact';
import { trackGoogleAdsContactConversion } from '@/utils/googleAds';

export default function MobileContactBar() {
  return <aside className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-2 gap-2 border-t border-slate-200 bg-white p-2 pb-[max(.5rem,env(safe-area-inset-bottom))] shadow-[0_-4px_18px_rgba(0,0,0,.12)] md:hidden" aria-label="Contacto comercial rápido"><a href={SALES_PHONE_HREF} onClick={() => trackGoogleAdsContactConversion('mobile-phone')} className="flex min-h-12 items-center justify-center gap-2 rounded-lg bg-blue-800 px-3 font-bold text-white"><Phone size={20} /> Llamar</a><a href={getWhatsAppUrl()} target="_blank" rel="noopener noreferrer" onClick={() => trackGoogleAdsContactConversion('mobile-whatsapp')} className="flex min-h-12 items-center justify-center gap-2 rounded-lg bg-green-600 px-3 font-bold text-white"><MessageCircle size={20} /> WhatsApp</a></aside>;
}
