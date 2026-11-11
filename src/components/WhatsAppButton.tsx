import React from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { MessageCircle } from 'lucide-react';
import { trackEvent } from '../lib/analytics';

interface WhatsAppButtonProps {
  customMessage?: string;
  propertyCode?: string;
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({ customMessage, propertyCode }) => {
  const { settings } = useSettings();

  const cleanNumber = (settings.whatsapp || '').replace(/\D/g, '');
  const defaultText = propertyCode
    ? `Olá Sávio! Gostaria de mais informações sobre o imóvel ${propertyCode} anunciado no site.`
    : 'Olá Sávio! Gostaria de atendimento exclusivo sobre imóveis de alto padrão anunciados no seu portal.';

  const messageText = customMessage || defaultText;
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(messageText)}`;

  const handleClick = () => {
    trackEvent('whatsapp_click', {
      targetId: propertyCode || 'floating_cta',
      targetTitle: 'Botão Flutuante de WhatsApp',
    });
  };

  return (
    <aside aria-label="Atendimento Rápido" className="fixed bottom-6 right-6 z-40 flex items-center group">
      <div className="hidden sm:block mr-3 px-3 py-1.5 rounded-full bg-slate-900/90 text-slate-200 border border-amber-500/30 text-xs font-medium shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
        Falar com Sávio no WhatsApp
      </div>
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        className="relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-600 via-emerald-500 to-amber-500 text-white shadow-2xl shadow-emerald-500/30 hover:scale-110 active:scale-95 transition-all focus:outline-none"
        aria-label="Atendimento via WhatsApp"
      >
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-400 rounded-full animate-ping" />
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-400 rounded-full border-2 border-slate-900" />
        <MessageCircle className="w-7 h-7 fill-white" />
      </a>
    </aside>
  );
};
