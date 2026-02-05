import React from 'react';
import { Phone } from 'lucide-react';
import FloatingCTAButton from '../components/ui/FloatingCTAButton';

const CallButton = () => {
  const handleCallClick = () => {
    window.location.href = 'tel:+5491124650609';
  };

  return (
    <FloatingCTAButton
      label="Llamanos ahora"
      onClick={handleCallClick}
      icon={<Phone size={28} className="text-white" />}
      wrapperClassName="fixed bottom-24 right-6 z-50 flex items-center gap-3"
      className="
        w-16 h-16 rounded-full
        bg-gradient-to-br from-blue-500 to-blue-700
        shadow-2xl flex items-center justify-center
        hover:shadow-blue-500/50 transition-shadow
      "
    />
  );
};

export default CallButton;
