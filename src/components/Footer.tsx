import React from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { Instagram, Phone, Mail, MapPin, Shield, Lock, ArrowUpRight } from 'lucide-react';

interface FooterProps {
  navigate: (route: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ navigate }) => {
  const { settings } = useSettings();

  const cleanWhatsapp = (settings.whatsapp || '').replace(/\D/g, '');
  const whatsappUrl = `https://wa.me/${cleanWhatsapp}`;

  return (
    <footer className="bg-[#071C15] border-t border-[#153D2F] text-gray-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand & Slogan */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              {settings.logoUrl ? (
                <img
                  src={settings.logoUrl}
                  alt={settings.commercialName || 'Sávio Imóveis'}
                  className="h-11 w-auto object-contain bg-transparent drop-shadow-[0_2px_10px_rgba(200,162,81,0.25)]"
                />
              ) : (
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#C8A251] to-[#E2C481] flex items-center justify-center text-[#0B2B20] font-bold font-editorial text-lg shadow-md">
                  S
                </div>
              )}
              <span className="font-editorial text-lg font-bold tracking-wider text-white">
                {settings.commercialName || 'SÁVIO IMÓVEIS'}
              </span>
            </div>
            <p className="text-sm leading-relaxed text-gray-400">
              {settings.bio || 'Consultoria imobiliária personalizada, compra, venda, locação e intermediação com clareza, presença e confiança.'}
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#123024] border border-[#C8A251]/30 text-xs text-[#C8A251]">
              <Shield className="w-3.5 h-3.5 text-[#C8A251]" />
              <span>{settings.creci || 'CRECI em homologação'}</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4 border-b border-[#1A4535] pb-2">
              Navegação
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => { navigate('/'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="text-gray-400 hover:text-[#C8A251] transition-colors"
                >
                  Página Inicial
                </button>
              </li>
              <li>
                <button
                  onClick={() => { navigate('/imoveis'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="text-gray-400 hover:text-[#C8A251] transition-colors"
                >
                  Catálogo de Imóveis
                </button>
              </li>
              <li>
                <button
                  onClick={() => { navigate('/lancamentos'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="text-gray-400 hover:text-[#C8A251] transition-colors"
                >
                  Empreendimentos & Lançamentos
                </button>
              </li>
              <li>
                <button
                  onClick={() => { navigate('/sobre'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="text-gray-400 hover:text-[#C8A251] transition-colors"
                >
                  Sobre o Corretor
                </button>
              </li>
              <li>
                <button
                  onClick={() => { navigate('/contato'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="text-gray-400 hover:text-[#C8A251] transition-colors"
                >
                  Fale Conosco
                </button>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4 border-b border-[#1A4535] pb-2">
              Tipologias
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => { navigate('/imoveis?tipo=casa'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="text-gray-400 hover:text-[#C8A251] transition-colors"
                >
                  Casas & Mansões em Condomínio
                </button>
              </li>
              <li>
                <button
                  onClick={() => { navigate('/imoveis?tipo=cobertura'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="text-gray-400 hover:text-[#C8A251] transition-colors"
                >
                  Coberturas com Piscina Privativa
                </button>
              </li>
              <li>
                <button
                  onClick={() => { navigate('/imoveis?tipo=apartamento'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="text-gray-400 hover:text-[#C8A251] transition-colors"
                >
                  Apartamentos Nobres
                </button>
              </li>
              <li>
                <button
                  onClick={() => { navigate('/imoveis?finalidade=aluguel'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="text-gray-400 hover:text-[#C8A251] transition-colors"
                >
                  Locações Selecionadas
                </button>
              </li>
            </ul>
          </div>

          {/* Contact & Socials */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4 border-b border-[#1A4535] pb-2">
              Canais Oficiais
            </h4>
            <p className="flex items-center gap-2.5 text-sm text-gray-300">
              <Phone className="w-4 h-4 text-[#C8A251] shrink-0" />
              <span>{settings.phone || '(Configure no Painel Admin)'}</span>
            </p>
            <p className="flex items-center gap-2.5 text-sm text-gray-300">
              <Mail className="w-4 h-4 text-[#C8A251] shrink-0" />
              <span className="truncate">{settings.email || 'contato@imoveiscomsavio.com.br'}</span>
            </p>
            <p className="flex items-start gap-2.5 text-sm text-gray-300">
              <MapPin className="w-4 h-4 text-[#C8A251] shrink-0 mt-0.5" />
              <span className="text-xs leading-relaxed">{settings.address || 'Atendimento com horário agendado'}</span>
            </p>
            <div className="pt-2 flex items-center gap-3">
              <a
                href={settings.instagramUrl || 'https://www.instagram.com/imoveiscomsavio/'}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#123024] hover:bg-[#C8A251] hover:text-[#0B2B20] text-gray-300 flex items-center justify-center transition-all"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#123024] hover:bg-[#25D366] hover:text-white text-gray-300 flex items-center justify-center transition-all"
                aria-label="WhatsApp"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#123024] pt-8 flex flex-col items-center justify-center gap-4 text-xs text-gray-500">
          <p className="text-center">
            &copy; {new Date().getFullYear()} {settings.commercialName || 'Imóveis com Sávio'}. Todos os direitos reservados.
            {settings.confirmationNotice && (
              <span className="block mt-1 text-[11px] text-gray-600">
                {settings.confirmationNotice}
              </span>
            )}
          </p>

          {/* Discreet Centered Admin Link */}
          <div className="pt-2">
            <button
              onClick={() => {
                navigate('/admin');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-gray-500 hover:text-[#C8A251] transition-colors text-[11px] underline underline-offset-4 tracking-wider focus:outline-none focus:text-[#C8A251]"
            >
              <span>Painel Admin</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
