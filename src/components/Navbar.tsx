import React, { useState, useEffect } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { MessageCircle, Menu, X, Building2, PhoneCall, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import { ShimmerButton } from './ui/ShimmerButton';

interface NavbarProps {
  currentRoute: string;
  navigate: (route: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentRoute, navigate }) => {
  const { settings } = useSettings();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Início', route: '/' },
    { label: 'Imóveis', route: '/imoveis' },
    { label: 'Lançamentos', route: '/lancamentos' },
    { label: 'Sobre Sávio', route: '/sobre' },
    { label: 'Contato', route: '/contato' },
  ];

  const cleanWhatsapp = (settings.whatsapp || '').replace(/\D/g, '');
  const whatsappUrl = `https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(
    'Olá Sávio! Acessei o site oficial e gostaria de atendimento sobre imóveis de alto padrão.'
  )}`;

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        scrolled
          ? 'bg-[#0B2B20]/95 backdrop-blur-md shadow-md py-2 sm:py-2.5 text-white border-b border-[#1A4535]'
          : 'bg-[#0B2B20] text-white py-2.5 sm:py-3 border-b border-[#153D2F]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand / Logo */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-3 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C8A251] rounded-xl group shrink-0 py-0.5"
        >
          {settings.logoUrl ? (
            <img
              src={settings.logoUrl}
              alt={settings.commercialName || 'Sávio Imóveis'}
              className="h-10 sm:h-11 w-auto object-contain bg-transparent group-hover:scale-105 transition-transform drop-shadow-[0_2px_10px_rgba(200,162,81,0.25)]"
            />
          ) : (
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#C8A251] to-[#E2C481] flex items-center justify-center text-[#0B2B20] font-bold font-editorial text-xl shadow-md group-hover:scale-105 transition-transform">
              S
            </div>
          )}
          <div>
            <span className="font-editorial text-lg sm:text-xl font-bold tracking-wider text-white block">
              {settings.commercialName || 'SÁVIO IMÓVEIS'}
            </span>
            <span className="text-[#C8A251] font-normal text-[10px] sm:text-xs tracking-widest uppercase block">
              Assessoria & Alto Padrão
            </span>
          </div>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-3">
          {navLinks.map((link) => {
            const isActive = currentRoute === link.route;
            return (
              <button
                key={link.route}
                onClick={() => navigate(link.route)}
                className={`relative px-3.5 py-2 text-xs lg:text-sm font-medium tracking-wide transition-all ${
                  isActive
                    ? 'text-[#C8A251] font-semibold'
                    : 'text-gray-300 hover:text-[#C8A251]'
                }`}
              >
                <span>{link.label}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-[#C8A251] rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Direct Action Buttons */}
        <div className="hidden sm:flex items-center gap-3">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-wider font-semibold text-[#0B2B20] bg-[#C8A251] hover:bg-[#D4AF37] rounded-md transition-all shadow-md active:scale-95"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>Falar com Sávio</span>
          </a>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-gray-200 hover:text-white p-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#C8A251]"
          aria-label="Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6 text-[#C8A251]" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#0A261C] border-b border-[#1A4535] px-4 pt-4 pb-6 space-y-2 shadow-2xl"
          >
            <div className="flex flex-col gap-1.5">
              {navLinks.map((link) => (
                <button
                  key={link.route}
                  onClick={() => {
                    navigate(link.route);
                    setMobileMenuOpen(false);
                  }}
                  className={`text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    currentRoute === link.route
                      ? 'bg-[#153D2F] text-[#C8A251] font-semibold border border-[#C8A251]/30'
                      : 'text-gray-200 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {link.label}
                </button>
              ))}

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="mt-3 flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20BA5A] text-white font-bold py-3 rounded-lg text-xs uppercase tracking-wider shadow-lg transition-all"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Atendimento WhatsApp</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
