import React from 'react';
import { MessageCircle } from 'lucide-react';
import FloatingCTAButton from '../components/ui/FloatingCTAButton';

const WhatsAppButton = () => {
  const handleWhatsAppClick = () => {
    const phoneNumber = '+5491130180606';
    const message = encodeURIComponent('Hola! Me gustaría solicitar información sobre sus servicios de limpieza.');
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  return (
    <FloatingCTAButton
      label="Consultá por WhatsApp"
      onClick={handleWhatsAppClick}
      icon={<MessageCircle size={28} className="text-white" />}
      wrapperClassName="fixed bottom-6 right-6 z-50 flex items-center gap-3"
      className="
        w-16 h-16 rounded-full
        bg-gradient-to-br from-green-400 to-green-600
        shadow-2xl flex items-center justify-center
        hover:shadow-green-500/50 transition-shadow
      "
    />
  );
};

export default WhatsAppButton;
