import React, { useState } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { Mail, Phone, MapPin, MessageCircle, Clock, Instagram, Send, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { trackEvent } from '../lib/analytics';

export const ContactPage: React.FC = () => {
  const { settings, submitLead } = useSettings();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const cleanWhatsapp = (settings.whatsapp || '').replace(/\D/g, '');
  const directWhatsappUrl = `https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(
    'Olá Sávio! Entrei em contato pela página Fale Conosco do site oficial.'
  )}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    setIsSubmitting(true);
    try {
      await submitLead({
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        interestType: 'informacao',
        message: message.trim(),
        origin: 'Página de Contato Oficial',
        pageUrl: window.location.href,
      });

      trackEvent('lead_submit', { targetTitle: 'Formulário Contato' });

      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#0B2B20', '#C8A251', '#25D366']
      });

      setIsSuccess(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1A2621]">
      {/* Header Banner in Noble Green #0B2B20 */}
      <section className="bg-[#0B2B20] text-white pt-32 pb-16 px-4 sm:px-6 lg:px-8 border-b border-[#153D2F] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#C8A251_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        <div className="max-w-3xl mx-auto relative z-10 text-center">
          <span className="text-[#C8A251] text-xs uppercase tracking-widest font-semibold block mb-2">
            Canais Oficiais de Atendimento
          </span>
          <h1 className="font-editorial text-3xl sm:text-5xl font-bold text-white mb-4 tracking-tight">
            Entre em Contato
          </h1>
          <p className="text-sm sm:text-base text-gray-300 leading-relaxed font-light">
            Estamos prontos para atender você com exclusividade, discrição e agilidade.
          </p>
        </div>
      </section>

      {/* Main Form and Info */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Info cards (Left) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-6 sm:p-8 rounded-2xl bg-white border border-gray-200/90 space-y-4 shadow-sm">
              <h3 className="font-editorial text-xl font-bold text-[#0B2B20]">
                Atendimento Direto
              </h3>

              <div className="space-y-4 text-sm text-gray-700">
                <a
                  href={directWhatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 hover:bg-emerald-100 transition-all font-semibold shadow-sm"
                >
                  <MessageCircle className="w-5 h-5 fill-emerald-600 text-emerald-600 shrink-0" />
                  <div>
                    <div className="text-[11px] text-emerald-700 uppercase tracking-wider font-bold">WhatsApp Prioritário</div>
                    <div className="text-sm">{settings.whatsapp || '(Defina no Painel)'}</div>
                  </div>
                </a>

                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#F8F9FA] border border-gray-200">
                  <Phone className="w-5 h-5 text-[#C8A251] shrink-0" />
                  <div>
                    <div className="text-[11px] text-gray-500 uppercase tracking-wider">Telefone Comercial</div>
                    <div className="font-medium text-[#1A2621]">{settings.phone || '(Configure no Painel Admin)'}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#F8F9FA] border border-gray-200">
                  <Mail className="w-5 h-5 text-[#C8A251] shrink-0" />
                  <div>
                    <div className="text-[11px] text-gray-500 uppercase tracking-wider">E-mail Comercial</div>
                    <div className="truncate font-medium text-[#1A2621]">{settings.email || 'contato@imoveiscomsavio.com.br'}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#F8F9FA] border border-gray-200">
                  <MapPin className="w-5 h-5 text-[#C8A251] shrink-0" />
                  <div>
                    <div className="text-[11px] text-gray-500 uppercase tracking-wider">Endereço / Região</div>
                    <div className="text-xs font-medium text-[#1A2621]">{settings.address || 'Atendimento com horário agendado'}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#F8F9FA] border border-gray-200">
                  <Clock className="w-5 h-5 text-[#C8A251] shrink-0" />
                  <div>
                    <div className="text-[11px] text-gray-500 uppercase tracking-wider">Horários</div>
                    <div className="text-xs font-medium text-[#1A2621]">Segunda a Sábado, das 08h às 20h (Plantão sob demanda)</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-gray-200 text-xs text-gray-600 flex items-center justify-between shadow-sm">
              <span>Siga o perfil oficial:</span>
              <a
                href={settings.instagramUrl || 'https://www.instagram.com/imoveiscomsavio/'}
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-600 font-semibold flex items-center gap-1 hover:underline"
              >
                <Instagram className="w-3.5 h-3.5" />
                <span>@imoveiscomsavio</span>
              </a>
            </div>
          </div>

          {/* Form (Right) */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-gray-200/90 p-8 shadow-sm">
            <h3 className="font-editorial text-2xl font-bold text-[#0B2B20] mb-2">
              Envie uma Mensagem
            </h3>
            <p className="text-xs text-gray-600 mb-6">
              Preencha os campos abaixo e entraremos em contato com a brevidade que seu tempo exige.
            </p>

            {!isSuccess ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-600 font-medium mb-1">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Seu nome"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F8F9FA] border border-gray-300 text-sm text-[#1A2621] outline-none focus:border-[#0B2B20] transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-600 font-medium mb-1">
                      WhatsApp ou Celular *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="(00) 00000-0000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#F8F9FA] border border-gray-300 text-sm text-[#1A2621] outline-none focus:border-[#0B2B20] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-600 font-medium mb-1">
                      E-mail (opcional)
                    </label>
                    <input
                      type="email"
                      placeholder="seuemail@exemplo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#F8F9FA] border border-gray-300 text-sm text-[#1A2621] outline-none focus:border-[#0B2B20] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-600 font-medium mb-1">
                    Como podemos lhe ajudar?
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Descreva seu interesse, região desejada ou perfil do imóvel..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F8F9FA] border border-gray-300 text-sm text-[#1A2621] outline-none focus:border-[#0B2B20] transition-colors resize-none placeholder:text-gray-400"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 bg-[#0B2B20] hover:bg-[#133F30] text-[#C8A251] font-bold py-3 rounded-xl text-sm transition-all shadow-sm disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Enviando dados...' : 'Enviar Mensagem'}</span>
                </button>
              </form>
            ) : (
              <div className="py-8 text-center space-y-4">
                <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto" />
                <h4 className="font-editorial text-2xl font-bold text-[#0B2B20]">
                  Mensagem Enviada!
                </h4>
                <p className="text-sm text-gray-600 max-w-md mx-auto">
                  Agradecemos seu contato. O corretor Sávio responderá em breve através do WhatsApp fornecido.
                </p>
                <button
                  onClick={() => setIsSuccess(false)}
                  className="px-6 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-xs font-semibold text-gray-700"
                >
                  Enviar Outra Mensagem
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
