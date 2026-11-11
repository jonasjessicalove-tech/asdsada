import React, { useState } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { LeadInterest } from '../types';
import { X, CheckCircle2, MessageCircle, Send, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { trackEvent } from '../lib/analytics';

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyTitle?: string;
  propertyId?: string;
  propertyCode?: string;
  defaultInterest?: LeadInterest;
}

export const LeadModal: React.FC<LeadModalProps> = ({
  isOpen,
  onClose,
  propertyTitle,
  propertyId,
  propertyCode,
  defaultInterest = 'visita'
}) => {
  const { submitLead, settings } = useSettings();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [interestType, setInterestType] = useState<LeadInterest>(defaultInterest);
  const [message, setMessage] = useState(
    propertyTitle
      ? `Olá Sávio, tenho interesse no imóvel "${propertyTitle}"${propertyCode ? ` (Cód: ${propertyCode})` : ''} e gostaria de receber mais detalhes.`
      : 'Olá Sávio, gostaria de agendar uma consulta sobre imóveis de alto padrão.'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    setIsSubmitting(true);
    try {
      await submitLead({
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        interestType,
        propertyId,
        propertyTitle,
        message: message.trim(),
        origin: 'Formulário Modal de Interesse',
        pageUrl: window.location.href,
        campaign: new URLSearchParams(window.location.search).get('utm_campaign') || undefined,
      });

      trackEvent('lead_submit', {
        targetId: propertyId,
        targetTitle: propertyTitle || 'Lead Form',
      });

      // Celebration confetti
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#0B2B20', '#C8A251', '#25D366']
      });

      setIsSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const cleanWhatsapp = (settings.whatsapp || '').replace(/\D/g, '');
  const directWhatsappUrl = `https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(
    `Olá Sávio! Sou ${name || 'um cliente do site'}. ${message}`
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white border-2 border-[#C8A251]/40 rounded-2xl p-6 sm:p-8 shadow-2xl text-[#1A2621] max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSubmitted ? (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="p-1.5 rounded-md bg-[#0B2B20]/10 text-[#0B2B20]">
                <Sparkles className="w-4 h-4 text-[#C8A251]" />
              </span>
              <span className="text-xs uppercase tracking-widest text-[#0B2B20] font-semibold">
                Atendimento Personalizado
              </span>
            </div>

            <h3 className="font-editorial text-xl sm:text-2xl font-bold text-[#0B2B20] mb-1">
              Agendar Visita ou Consultoria
            </h3>
            <p className="text-sm text-gray-600 mb-6 leading-relaxed">
              {propertyTitle
                ? `Preencha para receber atendimento prioritário sobre: ${propertyTitle}`
                : 'Converse com Sávio para ter acesso às melhores oportunidades imobiliárias.'}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-700 font-semibold mb-1">
                  Seu Nome Completo *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Roberto Albuquerque"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F8F9FA] border border-gray-300 focus:border-[#0B2B20] focus:ring-1 focus:ring-[#0B2B20] text-sm text-[#1A2621] outline-none transition-all placeholder:text-gray-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-700 font-semibold mb-1">
                    WhatsApp ou Celular *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="(00) 00000-0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F8F9FA] border border-gray-300 focus:border-[#0B2B20] focus:ring-1 focus:ring-[#0B2B20] text-sm text-[#1A2621] outline-none transition-all placeholder:text-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-700 font-semibold mb-1">
                    E-mail
                  </label>
                  <input
                    type="email"
                    placeholder="seuemail@exemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F8F9FA] border border-gray-300 focus:border-[#0B2B20] focus:ring-1 focus:ring-[#0B2B20] text-sm text-[#1A2621] outline-none transition-all placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-700 font-semibold mb-1">
                  Objetivo Principal
                </label>
                <select
                  value={interestType}
                  onChange={(e) => setInterestType(e.target.value as LeadInterest)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F8F9FA] border border-gray-300 focus:border-[#0B2B20] focus:ring-1 focus:ring-[#0B2B20] text-sm text-[#1A2621] outline-none transition-all"
                >
                  <option value="visita">Agendar Visita ao Imóvel</option>
                  <option value="comprar">Comprar Imóvel de Alto Padrão</option>
                  <option value="alugar">Alugar Imóvel</option>
                  <option value="vender">Quero Vender Meu Imóvel com Sávio</option>
                  <option value="investir">Investimento Imobiliário</option>
                  <option value="informacao">Apenas tirar dúvidas gerais</option>
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-700 font-semibold mb-1">
                  Mensagem Adicional
                </label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F8F9FA] border border-gray-300 focus:border-[#0B2B20] focus:ring-1 focus:ring-[#0B2B20] text-sm text-[#1A2621] outline-none transition-all placeholder:text-gray-400 resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 bg-[#0B2B20] hover:bg-[#133F30] text-[#C8A251] font-bold py-3.5 rounded-xl text-sm transition-all shadow-md disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Registrando solicitação...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Enviar Solicitação Prioritária</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="text-center py-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="font-editorial text-2xl font-bold text-[#0B2B20] mb-2">
              Solicitação Recebida com Sucesso!
            </h3>
            <p className="text-sm text-gray-600 mb-6 leading-relaxed">
              Obrigado, <strong className="text-[#0B2B20]">{name}</strong>. Seus dados foram encaminhados com prioridade para o corretor Sávio, que entrará em contato em breve.
            </p>

            <div className="space-y-3">
              <a
                href={directWhatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20BA5A] text-white font-bold py-3.5 rounded-xl text-sm shadow-md transition-all"
              >
                <MessageCircle className="w-5 h-5 fill-white" />
                <span>Conversar Agora no WhatsApp de Sávio</span>
              </a>

              <button
                onClick={() => {
                  setIsSubmitted(false);
                  onClose();
                }}
                className="w-full py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold transition-colors"
              >
                Fechar Janela
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
