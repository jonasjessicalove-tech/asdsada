import React, { useState, useEffect } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { PropertyCard } from '../components/PropertyCard';
import { FinancingSimulator } from '../components/FinancingSimulator';
import { Property, LeadInterest } from '../types';
import {
  Search,
  Building,
  ShieldCheck,
  Award,
  Sparkles,
  ArrowRight,
  MessageCircle,
  Home,
  CheckCircle,
  MapPin,
  TrendingUp,
  KeyRound,
  FileCheck2,
  Users,
  ChevronLeft,
  ChevronRight,
  Building2,
  Pause,
  Play
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { trackEvent } from '../lib/analytics';
import { NumberTicker } from '../components/ui/NumberTicker';

interface HomePageProps {
  navigate: (route: string) => void;
  onOpenLeadModal: (property?: Property, defaultInterest?: LeadInterest) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ navigate, onOpenLeadModal }) => {
  const { settings, properties, developments } = useSettings();

  // Quick Search States
  const [filterType, setFilterType] = useState<string>('todos');
  const [filterPurpose, setFilterPurpose] = useState<string>('venda');
  const [filterLocation, setFilterLocation] = useState<string>('');

  const featuredProperties = properties.filter((p) => p.published && p.featured);
  const showcaseProperties = featuredProperties.length > 0 ? featuredProperties : properties.filter((p) => p.published);

  const cleanWhatsapp = (settings.whatsapp || '').replace(/\D/g, '');
  const directWhatsappUrl = `https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(
    'Olá Sávio! Acessei o site oficial e gostaria de conversar sobre oportunidades imobiliárias.'
  )}`;

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (filterPurpose && filterPurpose !== 'todos') params.set('finalidade', filterPurpose);
    if (filterType && filterType !== 'todos') params.set('tipo', filterType);
    if (filterLocation.trim()) params.set('busca', filterLocation.trim());
    navigate(`/imoveis?${params.toString()}`);
  };

  // Dynamic Hero Slides from Developments and Properties
  const heroSlides = React.useMemo(() => {
    const list: Array<{
      image: string;
      title: string;
      location: string;
      tag: string;
      area: string;
      link: string;
      slug?: string;
    }> = [];

    // Add developments
    developments.forEach((dev) => {
      if (dev.images && dev.images.length > 0) {
        list.push({
          image: dev.images[0],
          title: dev.name,
          location: `${dev.neighborhood}, ${dev.city} • ${dev.developer}`,
          tag: dev.status === 'lancamento' ? 'Lançamento Exclusivo' : 'Empreendimento de Luxo',
          area: dev.typologies || 'Plantas Exclusivas',
          link: '/lancamentos',
        });
      }
    });

    // Add properties
    properties.filter((p) => p.published).forEach((prop) => {
      list.push({
        image: prop.mainImage,
        title: prop.title,
        location: `${prop.neighborhood}, ${prop.city}`,
        tag: prop.propertyType === 'casa' ? 'Mansão de Alto Padrão' : prop.propertyType === 'cobertura' ? 'Cobertura Nobre' : 'Residência Selecionada',
        area: `${prop.area} m² • ${prop.bedrooms} quartos`,
        link: `/imovel/${prop.slug}`,
        slug: prop.slug,
      });
    });

    // Fallback if empty
    if (list.length === 0) {
      list.push({
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=85',
        title: 'Mansão Contemporânea com Borda Infinita',
        location: 'Alphaville, São Paulo',
        tag: 'Destaque Residencial',
        area: '980 m² • 5 suítes',
        link: '/imoveis',
      });
    }

    return list;
  }, [developments, properties]);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Automatic slide rotation every 5 seconds
  useEffect(() => {
    if (heroSlides.length <= 1 || !isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroSlides.length, isAutoPlaying]);

  const activeHeroSlide = heroSlides[currentSlide] || heroSlides[0];

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1A2621]">
      {/* 1. CINEMATIC HERO (TFT CORRETOR IMOBILIÁRIO STYLE) */}
      <section className="relative min-h-[90vh] lg:min-h-[94vh] flex items-center justify-center bg-[#071C15] overflow-hidden -mt-4 text-white">
        {/* Background Image Slideshow with overlay */}
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="sync">
            <motion.div
              key={activeHeroSlide?.image || currentSlide}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: 'easeInOut' }}
              className="absolute inset-0 w-full h-full"
            >
              <img
                src={activeHeroSlide?.image}
                alt={activeHeroSlide?.title}
                className="w-full h-full object-cover"
              />
            </motion.div>
          </AnimatePresence>

          {/* Deep Forest Green gradient scrim for contrast */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#071C15] via-[#071C15]/90 to-[#071C15]/60 z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#071C15] via-transparent to-black/40 z-10" />
        </div>

        {/* Hero Content Container */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-28 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Presentation & Copy */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Kicker with · separators */}
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#C8A251]">
                <span>Imóveis com Sávio</span>
                <span aria-hidden="true" className="text-gray-400">·</span>
                <span>Assessoria Imobiliária</span>
                <span aria-hidden="true" className="text-gray-400">·</span>
                <span>Alto Padrão</span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.12] font-editorial text-balance">
                Seu próximo endereço começa com uma boa escolha.
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-gray-300 leading-relaxed max-w-2xl font-light">
                Comprar, vender ou alugar um imóvel merece atenção aos detalhes. Conte com atendimento consultivo, transparência jurídica e acompanhamento dedicado em cada etapa.
              </p>

              {/* Primary Actions Row */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => navigate('/imoveis')}
                  className="px-6 py-3.5 text-xs uppercase tracking-wider font-semibold text-[#0B2B20] bg-[#C8A251] hover:bg-[#D4AF37] rounded-md transition-all shadow-lg hover:shadow-xl active:scale-95 cursor-pointer"
                >
                  Encontrar meu imóvel
                </button>

                <button
                  onClick={() => onOpenLeadModal(undefined, 'vender')}
                  className="px-6 py-3.5 text-xs uppercase tracking-wider font-semibold text-white bg-transparent hover:bg-white/10 border border-white/40 rounded-md transition-all active:scale-95 cursor-pointer"
                >
                  Quero vender meu imóvel
                </button>

                <a
                  href={directWhatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3.5 text-xs uppercase tracking-wider font-semibold text-white bg-[#25D366] hover:bg-[#20BA5A] rounded-md transition-all shadow-md active:scale-95"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Falar com Sávio</span>
                </a>
              </div>

              {/* Sub-bar: Institutional Quote & Marker */}
              <div className="pt-6 border-t border-white/15 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-gray-300">
                <span className="italic text-[#E2C481]">
                  “Um bom negócio começa com informação clara e termina com confiança.”
                </span>
                <span className="text-gray-400">·</span>
                <span className="text-gray-300">Atendimento Consultivo Direto</span>
              </div>
            </div>

            {/* Right Column: Featured Showcase Card */}
            <div className="lg:col-span-5">
              <div
                onClick={() => navigate(activeHeroSlide.link)}
                className="group cursor-pointer rounded-2xl bg-black/40 hover:bg-black/60 border border-white/20 p-6 backdrop-blur-md shadow-2xl transition-all duration-300 transform hover:-translate-y-1 text-left"
              >
                <div className="flex items-center justify-between text-xs mb-3">
                  <span className="px-2.5 py-1 rounded bg-[#C8A251] text-[#0B2B20] font-bold text-[10px] uppercase tracking-wider">
                    {activeHeroSlide.tag}
                  </span>
                  <span className="text-gray-300 text-[11px] font-mono flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#C8A251]" />
                    <span>Empreendimento em Destaque</span>
                  </span>
                </div>

                <div className="relative aspect-[16/10] rounded-xl overflow-hidden mb-4 border border-white/10 bg-slate-900">
                  <img
                    src={activeHeroSlide.image}
                    alt={activeHeroSlide.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                  {/* Watermark Logo */}
                  {settings.logoUrl && (
                    <div className="absolute bottom-3 right-3 opacity-90 pointer-events-none select-none z-10 transition-opacity filter drop-shadow-[0_2px_6px_rgba(0,0,0,0.7)]">
                      <img
                        src={settings.logoUrl}
                        alt="Marca d'água"
                        className="w-20 sm:w-24 h-auto object-contain"
                      />
                    </div>
                  )}

                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <p className="text-xs text-[#C8A251] font-semibold">{activeHeroSlide.location}</p>
                    <h4 className="text-base font-bold font-editorial line-clamp-1">{activeHeroSlide.title}</h4>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div>
                    <span className="text-[11px] text-gray-400 block">Diferenciais</span>
                    <span className="text-xs font-semibold text-white">{activeHeroSlide.area}</span>
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#C8A251] group-hover:text-white transition">
                    <span>Conhecer detalhes</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>

              {/* Slide Carousel Controls */}
              <div className="mt-6 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                    className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition text-xs flex items-center gap-1 cursor-pointer"
                    title={isAutoPlaying ? 'Pausar rotação' : 'Iniciar rotação'}
                  >
                    {isAutoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  </button>
                  <span className="text-xs text-gray-300">
                    Imóvel {currentSlide + 1} de {heroSlides.length}: <strong className="text-white">{activeHeroSlide.title}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  {heroSlides.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentSlide(idx)}
                      className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                        idx === currentSlide ? 'w-8 bg-[#C8A251]' : 'w-2 bg-white/30 hover:bg-white/60'
                      }`}
                      aria-label={`Slide ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FLOATING QUICK SEARCH (TFT STYLE - WHITE CARD -MT-16) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200/90 p-6 lg:p-8 backdrop-blur-md text-left">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#0B2B20] font-editorial flex items-center gap-2">
              <Search className="w-5 h-5 text-[#C8A251]" />
              <span>Buscar Imóveis Disponíveis</span>
            </h2>
            <span className="text-xs text-gray-500 hidden sm:inline">
              Filtros integrados ao catálogo em tempo real
            </span>
          </div>

          <form onSubmit={handleQuickSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                Finalidade
              </label>
              <select
                value={filterPurpose}
                onChange={(e) => setFilterPurpose(e.target.value)}
                className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B2B20] text-gray-800"
              >
                <option value="todos">Todas as finalidades</option>
                <option value="venda">Comprar (Venda)</option>
                <option value="aluguel">Alugar (Locação)</option>
                <option value="lancamento">Lançamentos</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                Tipo de Imóvel
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B2B20] text-gray-800"
              >
                <option value="todos">Todos os tipos</option>
                <option value="casa">Casas & Mansões</option>
                <option value="apartamento">Apartamentos</option>
                <option value="cobertura">Coberturas</option>
                <option value="terreno">Terrenos em Condomínio</option>
                <option value="comercial">Comercial</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                Bairro ou Cidade
              </label>
              <input
                type="text"
                placeholder="Ex: Alphaville, Jardins, Itaim, Belo Horizonte..."
                value={filterLocation}
                onChange={(e) => setFilterLocation(e.target.value)}
                className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B2B20] text-gray-800 placeholder:text-gray-400"
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-[#0B2B20] hover:bg-[#134636] text-white font-semibold py-2.5 rounded-lg text-sm transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <Search className="w-4 h-4 text-[#C8A251]" />
                <span>Buscar Imóveis</span>
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* 3. NUMBERS & CREDIBILITY STRIP */}
      <section className="py-12 mt-12 bg-[#F1F4F2] border-y border-gray-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            <div className="p-4 border-r border-gray-300/80 last:border-none">
              <span className="font-editorial text-3xl sm:text-4xl font-bold text-[#0B2B20] block mb-1">
                <NumberTicker value={properties.length > 0 ? properties.length : 24} />+
              </span>
              <span className="text-xs uppercase tracking-wider text-gray-600 font-medium">
                Imóveis Catalogados
              </span>
            </div>
            <div className="p-4 border-r border-gray-300/80 last:border-none">
              <span className="font-editorial text-3xl sm:text-4xl font-bold text-[#0B2B20] block mb-1">
                <NumberTicker value={100} />%
              </span>
              <span className="text-xs uppercase tracking-wider text-gray-600 font-medium">
                Atendimento Personalizado
              </span>
            </div>
            <div className="p-4 border-r border-gray-300/80 last:border-none">
              <span className="font-editorial text-3xl sm:text-4xl font-bold text-[#0B2B20] block mb-1">
                Segurança
              </span>
              <span className="text-xs uppercase tracking-wider text-gray-600 font-medium">
                Assessoria Jurídica Rigorosa
              </span>
            </div>
            <div className="p-4">
              <span className="font-editorial text-3xl sm:text-4xl font-bold text-[#0B2B20] block mb-1">
                Direto
              </span>
              <span className="text-xs uppercase tracking-wider text-gray-600 font-medium">
                Com o Corretor Sávio
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FEATURED PROPERTIES (OPORTUNIDADES SELECIONADAS) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-left">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-[#C8A251] block mb-2">
              Oportunidades Selecionadas
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-[#0B2B20] font-editorial text-balance">
              Imóveis que podem ser o começo de uma nova história.
            </h2>
            <p className="text-sm text-gray-600 mt-2 max-w-xl">
              Propriedades singulares que combinam localização nobre, acabamento impecável e valorização patrimonial garantida.
            </p>
          </div>

          <button
            onClick={() => navigate('/imoveis')}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0B2B20] hover:text-[#C8A251] transition-colors whitespace-nowrap self-start md:self-auto cursor-pointer"
          >
            <span>Ver todos os imóveis</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {showcaseProperties.slice(0, 6).map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              onSelect={(slug) => navigate(`/imovel/${slug}`)}
              onOpenLeadModal={(p) => onOpenLeadModal(p, 'visita')}
            />
          ))}
        </div>
      </section>

      {/* 5. DEVELOPMENTS HIGHLIGHT (LANÇAMENTOS) */}
      {developments.length > 0 && (
        <section className="py-20 bg-[#071C15] text-white border-y border-[#153D2F] text-left">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
              <div>
                <span className="text-[#C8A251] text-xs uppercase tracking-widest font-semibold block mb-2">
                  Empreendimentos & Oportunidades
                </span>
                <h2 className="font-editorial text-2xl sm:text-4xl font-bold text-white">
                  Lançamentos Imobiliários
                </h2>
              </div>
              <button
                onClick={() => navigate('/lancamentos')}
                className="inline-flex items-center gap-2 text-[#C8A251] hover:text-[#E2C481] text-sm font-semibold group self-start md:self-auto cursor-pointer"
              >
                <span>Conhecer Todos os Lançamentos</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {developments.slice(0, 2).map((dev) => (
                <div
                  key={dev.id}
                  className="relative rounded-2xl overflow-hidden border border-[#1A4535] bg-[#0B2B20] group hover:border-[#C8A251]/40 transition-all flex flex-col justify-between shadow-xl"
                >
                  <div className="relative h-64 sm:h-80 overflow-hidden bg-slate-900">
                    <img
                      src={dev.images[0] || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80'}
                      alt={dev.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B2B20] via-black/30 to-transparent" />
                    <span className="absolute top-4 left-4 px-3 py-1 rounded bg-[#C8A251] text-[#0B2B20] text-xs font-bold uppercase tracking-wider">
                      {dev.status === 'lancamento' ? 'Lançamento Exclusivo' : dev.status === 'em_obras' ? 'Em Construção' : 'Pronto para Morar'}
                    </span>
                    <span className="absolute bottom-4 left-4 text-xs text-gray-300 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#C8A251]" />
                      <span>{dev.neighborhood}, {dev.city} — {dev.developer}</span>
                    </span>
                  </div>

                  <div className="p-6 sm:p-8 space-y-4">
                    <h3 className="font-editorial text-xl sm:text-2xl font-bold text-white">
                      {dev.name}
                    </h3>
                    <p className="text-sm text-gray-300 line-clamp-2 leading-relaxed">
                      {dev.description}
                    </p>
                    <div className="text-xs text-[#E2C481] font-medium">
                      {dev.typologies}
                    </div>

                    <div className="pt-3 flex items-center justify-between border-t border-[#1A4535]">
                      <div>
                        <span className="text-[10px] text-gray-400 uppercase tracking-wider block">A partir de</span>
                        <span className="font-editorial text-lg sm:text-xl font-bold text-[#C8A251]">
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(dev.minPrice)}
                        </span>
                      </div>
                      <button
                        onClick={() => onOpenLeadModal(undefined, 'visita')}
                        className="px-4 py-2 rounded bg-[#C8A251] hover:bg-[#D4AF37] text-[#0B2B20] font-bold text-xs tracking-wider uppercase transition-all cursor-pointer"
                      >
                        Receber Apresentação
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 6. BROKER PRESENTATION & ABOUT SÁVIO (TFT STYLE - 01 · APRESENTAÇÃO & COMPROMISSO) */}
      <section className="bg-[#0B2B20] text-white py-20 relative overflow-hidden text-left">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-[#0D3628] to-transparent opacity-60 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Photo & Badge */}
            <div className="lg:col-span-5 space-y-6">
              <div className="relative rounded-2xl overflow-hidden border border-[#C8A251]/40 shadow-2xl bg-[#082119] group aspect-[4/3] sm:aspect-[3/4] max-h-[500px]">
                <img
                  src={settings.avatarUrl || 'https://i.postimg.cc/V6v7JDFN/Selfie-no-escritorio-da-Imoveis-com-Savio.png'}
                  alt={settings.brokerName || 'Sávio no escritório'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#071C15]/95 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-[#0B2B20]/90 backdrop-blur-md border border-[#1A4535]">
                  <span className="text-xs uppercase tracking-widest text-[#C8A251] font-semibold block">
                    Corretor Responsável
                  </span>
                  <h4 className="font-editorial text-lg font-bold text-white">
                    {settings.brokerName || 'Sávio'}
                  </h4>
                  <p className="text-xs text-gray-300">
                    {settings.creci || 'CRECI em homologação'} • @imoveiscomsavio
                  </p>
                </div>
              </div>
            </div>

            {/* Text Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#C8A251]">
                <span>01 · Apresentação & Compromisso</span>
              </div>
              <h2 className="font-editorial text-3xl sm:text-4xl font-bold text-white leading-tight">
                Mais que intermediar imóveis, conectamos você à sua melhor conquista.
              </h2>
              <p className="text-base text-gray-300 leading-relaxed font-light">
                {settings.aboutExperience || 'A assessoria imobiliária de alto padrão exige discrição, transparência jurídica e profundo conhecimento de mercado. Conduzimos cada negociação com rigor técnico, garantindo uma experiência tranquila e segura.'}
              </p>

              {/* Differentials Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#123024] border border-[#1A4535]">
                  <ShieldCheck className="w-5 h-5 text-[#C8A251] shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-sm font-semibold text-white">Segurança Jurídica</h5>
                    <p className="text-xs text-gray-300">Análise documental e certidões completas em cada transação.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#123024] border border-[#1A4535]">
                  <Award className="w-5 h-5 text-[#C8A251] shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-sm font-semibold text-white">Seleção Rigorosa</h5>
                    <p className="text-xs text-gray-300">Imóveis com alto valor de mercado e liquidez comprovada.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#123024] border border-[#1A4535]">
                  <Users className="w-5 h-5 text-[#C8A251] shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-sm font-semibold text-white">Atendimento Direto</h5>
                    <p className="text-xs text-gray-300">Comunicação sem intermediários com o corretor responsável.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#123024] border border-[#1A4535]">
                  <TrendingUp className="w-5 h-5 text-[#C8A251] shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-sm font-semibold text-white">Inteligência de Mercado</h5>
                    <p className="text-xs text-gray-300">Avaliações baseadas em dados reais de valorização.</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap gap-4">
                <a
                  href={directWhatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20BA5A] text-white font-bold px-6 py-3.5 rounded-md text-xs uppercase tracking-wider shadow-lg transition-all"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Conversar com Sávio no WhatsApp</span>
                </a>

                <button
                  onClick={() => navigate('/sobre')}
                  className="px-6 py-3.5 rounded-md bg-white/10 hover:bg-white/20 text-white text-xs uppercase tracking-wider font-semibold transition-colors cursor-pointer"
                >
                  Conhecer Trajetória
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FINANCING SIMULATOR (FULL TFT EMBED WITH 5 OFFICIAL BANKS) */}
      <section className="bg-gray-100/70 py-20 border-y border-gray-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FinancingSimulator />
        </div>
      </section>

      {/* 8. CLIENT SERVICES / CONSULTORIA SOB MEDIDA */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#C8A251] block mb-2">
            Serviços & Consultoria
          </span>
          <h2 className="font-editorial text-3xl sm:text-4xl font-bold text-[#0B2B20] mb-4">
            Como Podemos Ajudar Você?
          </h2>
          <p className="text-sm text-gray-600 max-w-2xl mx-auto mb-12">
            Orientação sob medida para encontrar sua residência definitiva ou anunciar seu patrimônio com a visibilidade que ele merece.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            <div
              onClick={() => onOpenLeadModal(undefined, 'comprar')}
              className="p-6 rounded-xl bg-[#F8F9FA] border border-gray-200/80 hover:border-[#C8A251] hover:shadow-xl cursor-pointer group transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-[#0B2B20] text-[#C8A251] flex items-center justify-center mb-4 group-hover:bg-[#C8A251] group-hover:text-[#0B2B20] transition-colors">
                <Home className="w-6 h-6" />
              </div>
              <h3 className="font-editorial text-lg font-bold text-[#0B2B20] mb-2">Compra de Imóveis</h3>
              <p className="text-xs text-gray-600 leading-relaxed mb-4">
                Busca ativa e curadoria personalizada para encontrar residências ideais com o perfil do comprador.
              </p>
              <span className="text-xs font-semibold text-[#0B2B20] group-hover:text-[#C8A251] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Iniciar Busca <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>

            <div
              onClick={() => onOpenLeadModal(undefined, 'vender')}
              className="p-6 rounded-xl bg-[#F8F9FA] border border-gray-200/80 hover:border-[#C8A251] hover:shadow-xl cursor-pointer group transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-[#0B2B20] text-[#C8A251] flex items-center justify-center mb-4 group-hover:bg-[#C8A251] group-hover:text-[#0B2B20] transition-colors">
                <KeyRound className="w-6 h-6" />
              </div>
              <h3 className="font-editorial text-lg font-bold text-[#0B2B20] mb-2">Venda de Imóveis</h3>
              <p className="text-xs text-gray-600 leading-relaxed mb-4">
                Divulgação qualificada, precificação correta de mercado e alcance junto a compradores reais.
              </p>
              <span className="text-xs font-semibold text-[#0B2B20] group-hover:text-[#C8A251] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Anunciar Imóvel <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>

            <div
              onClick={() => onOpenLeadModal(undefined, 'investir')}
              className="p-6 rounded-xl bg-[#F8F9FA] border border-gray-200/80 hover:border-[#C8A251] hover:shadow-xl cursor-pointer group transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-[#0B2B20] text-[#C8A251] flex items-center justify-center mb-4 group-hover:bg-[#C8A251] group-hover:text-[#0B2B20] transition-colors">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="font-editorial text-lg font-bold text-[#0B2B20] mb-2">Investimentos</h3>
              <p className="text-xs text-gray-600 leading-relaxed mb-4">
                Oportunidades com potencial de valorização acelerada, lançamentos e retorno de locação.
              </p>
              <span className="text-xs font-semibold text-[#0B2B20] group-hover:text-[#C8A251] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Consultar Opções <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>

            <div
              onClick={() => onOpenLeadModal(undefined, 'informacao')}
              className="p-6 rounded-xl bg-[#F8F9FA] border border-gray-200/80 hover:border-[#C8A251] hover:shadow-xl cursor-pointer group transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-[#0B2B20] text-[#C8A251] flex items-center justify-center mb-4 group-hover:bg-[#C8A251] group-hover:text-[#0B2B20] transition-colors">
                <FileCheck2 className="w-6 h-6" />
              </div>
              <h3 className="font-editorial text-lg font-bold text-[#0B2B20] mb-2">Avaliação Imobiliária</h3>
              <p className="text-xs text-gray-600 leading-relaxed mb-4">
                Estudo mercadológico com levantamento técnico para determinar o valor justo de comercialização.
              </p>
              <span className="text-xs font-semibold text-[#0B2B20] group-hover:text-[#C8A251] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Solicitar Estudo <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 9. TRUST & CONFIDENCE FINAL BANNER (TFT STYLE) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="bg-[#0B2B20] rounded-2xl p-8 lg:p-14 text-white relative overflow-hidden shadow-2xl">
          <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-[#133F30] to-transparent opacity-40 pointer-events-none" />
          <div className="max-w-2xl space-y-4 text-left relative z-10">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#C8A251] block">
              Atendimento Dedicado
            </span>
            <h3 className="font-editorial text-3xl sm:text-4xl font-bold leading-tight">
              Pronto para dar o próximo passo na sua jornada imobiliária?
            </h3>
            <p className="text-sm text-gray-300 leading-relaxed font-light">
              Envie uma mensagem diretamente para Sávio no WhatsApp. Receba atendimento prioritário, agende visitas com flexibilidade e tire todas as suas dúvidas sobre crédito e documentação.
            </p>
            <div className="pt-4 flex flex-wrap gap-4">
              <a
                href={directWhatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20BA5A] text-white font-bold px-6 py-3.5 rounded-md text-xs uppercase tracking-wider shadow-lg transition-all"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Conversar no WhatsApp</span>
              </a>
              <button
                onClick={() => navigate('/contato')}
                className="px-6 py-3.5 rounded-md bg-white/10 hover:bg-white/20 text-white text-xs uppercase tracking-wider font-semibold transition-colors cursor-pointer"
              >
                Canais de Atendimento
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
