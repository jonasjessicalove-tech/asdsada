import React from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { Shield, Award, Users, CheckCircle, Instagram, MessageCircle, MapPin, Phone, Mail, Sparkles } from 'lucide-react';

interface AboutPageProps {
  navigate: (route: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ navigate }) => {
  const { settings } = useSettings();

  const cleanWhatsapp = (settings.whatsapp || '').replace(/\D/g, '');
  const directWhatsappUrl = `https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(
    'Olá Sávio! Gostaria de conversar sobre uma consultoria imobiliária personalizada.'
  )}`;

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1A2621]">
      {/* Header Banner in Noble Green #0B2B20 */}
      <section className="bg-[#0B2B20] text-white pt-32 pb-16 px-4 sm:px-6 lg:px-8 border-b border-[#153D2F] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#C8A251_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        <div className="max-w-4xl mx-auto relative z-10 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#C8A251]/15 border border-[#C8A251]/30 text-[#C8A251] text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Perfil Profissional Oficial</span>
          </div>
          <h1 className="font-editorial text-3xl sm:text-5xl font-bold text-white tracking-tight">
            Sobre o Corretor {settings.brokerName || 'Sávio'}
          </h1>
          <p className="font-editorial text-base sm:text-xl text-gray-200 max-w-2xl mx-auto italic leading-relaxed">
            "A excelência no mercado imobiliário não está apenas no metro quadrado, mas na confiança construída e na exclusividade de cada negociação."
          </p>
        </div>
      </section>

      {/* Profile & Biography Section */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {/* Profile Card in Clean White */}
        <div className="bg-white rounded-2xl border border-gray-200/90 p-8 sm:p-12 grid grid-cols-1 md:grid-cols-12 gap-10 items-center shadow-sm">
          <div className="md:col-span-5 relative">
            <div className="rounded-2xl overflow-hidden border-2 border-[#C8A251]/30 shadow-lg bg-gray-100 aspect-[4/5] sm:aspect-[3/4] max-h-[500px]">
              <img
                src={settings.avatarUrl || 'https://i.postimg.cc/V6v7JDFN/Selfie-no-escritorio-da-Imoveis-com-Savio.png'}
                alt={settings.brokerName || 'Sávio no escritório Imóveis com Sávio'}
                className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="mt-4 p-3 rounded-xl bg-[#F8F9FA] border border-gray-200 text-center">
              <span className="text-xs uppercase tracking-wider text-[#0B2B20] font-bold block">
                {settings.creci || 'CRECI em homologação'}
              </span>
              <span className="text-[11px] text-gray-500">Registro Profissional</span>
            </div>
          </div>

          <div className="md:col-span-7 space-y-5">
            <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#0B2B20]">
              Posicionamento & Filosofia de Trabalho
            </h2>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed font-light">
              {settings.bio}
            </p>
            <p className="text-sm text-gray-600 leading-relaxed font-light">
              {settings.aboutExperience}
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              <a
                href={settings.instagramUrl || 'https://www.instagram.com/imoveiscomsavio/'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-pink-50 border border-pink-200 text-pink-700 text-xs font-semibold hover:bg-pink-100 transition-all shadow-sm"
              >
                <Instagram className="w-4 h-4 text-pink-600" />
                <span>Instagram Oficial @imoveiscomsavio</span>
              </a>

              <a
                href={directWhatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20BA5A] text-white text-xs font-bold shadow-sm transition-all"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Contato Direto no WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        {/* Pillars Grid */}
        <div className="space-y-6">
          <h2 className="font-editorial text-2xl font-bold text-[#0B2B20] text-center">
            Nossos Pilares de Atuação
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl border border-gray-200/90 p-6 space-y-3 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-[#0B2B20]/10 text-[#0B2B20] flex items-center justify-center">
                <Shield className="w-6 h-6 text-[#C8A251]" />
              </div>
              <h3 className="font-editorial text-lg font-bold text-[#0B2B20]">Sigilo & Discrição</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Tratamento estritamente confidencial para todas as informações financeiras e patrimoniais de nossos clientes e famílias.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200/90 p-6 space-y-3 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-[#0B2B20]/10 text-[#0B2B20] flex items-center justify-center">
                <Award className="w-6 h-6 text-[#C8A251]" />
              </div>
              <h3 className="font-editorial text-lg font-bold text-[#0B2B20]">Seleção Ativa</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Filtramos o mercado exaustivamente para apresentar apenas propriedades com valor arquitetônico singular e documentação cristalina.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200/90 p-6 space-y-3 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-[#0B2B20]/10 text-[#0B2B20] flex items-center justify-center">
                <Users className="w-6 h-6 text-[#C8A251]" />
              </div>
              <h3 className="font-editorial text-lg font-bold text-[#0B2B20]">Assessoria Completa</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Acompanhamento jurídico, bancário e notarial de ponta a ponta, assegurando uma transação pacífica e juridicamente perfeita.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
