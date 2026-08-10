import React from 'react';
import { MessageCircle } from 'lucide-react';
import FloatingCTAButton from '@/components/ui/FloatingCTAButton';
import { getWhatsAppUrl } from '@/config/contact';
import { trackGoogleAdsContactConversion } from '@/utils/googleAds';

export default function WhatsAppButton() {
  const handleClick = () => {
    trackGoogleAdsContactConversion('whatsapp');
    window.open(getWhatsAppUrl(), '_blank', 'noopener,noreferrer');
  };
  return <FloatingCTAButton label="Consultar por WhatsApp" onClick={handleClick} icon={<MessageCircle size={26} className="text-white" />} wrapperClassName="hidden md:flex fixed bottom-6 right-6 z-50 items-center gap-3" className="grid h-14 w-14 place-items-center rounded-full bg-green-600 shadow-xl hover:bg-green-700" />;
}
