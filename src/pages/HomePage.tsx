import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { PropertyCard } from '../components/PropertyCard';
import { FinancingSimulator } from '../components/FinancingSimulator';
import { SmartMatchingFinder } from '../components/SmartMatchingFinder';
import { Property, LeadInterest, ClientProfile } from '../types';
import { calculateSmartMatches, fetchAiSmartMatch } from '../lib/smartMatch';
import {
  Search,
  Building,
  ShieldCheck,
  Award,
  Sparkles,
  ArrowRight,
  MessageCircle,
  Home,
  CheckCircle2,
  MapPin,
  TrendingUp,
  KeyRound,
  FileCheck2,
  Users,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  RotateCcw,
  Bot,
  Compass,
  HeartHandshake,
  Play,
  Pause
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

  // Client-Centric Matching Profile State
  const [profile, setProfile] = useState<ClientProfile>({});
  const [showTechnicalFilters, setShowTechnicalFilters] = useState<boolean>(false);

  // Technical Filter Overrides
  const [techPurpose, setTechPurpose] = useState<string>('todos');
  const [techType, setTechType] = useState<string>('todos');
  const [techBedrooms, setTechBedrooms] = useState<number>(0);

  const resultsRef = useRef<HTMLDivElement>(null);

  const handleUpdateProfile = (updated: Partial<ClientProfile>) => {
    setProfile((prev) => ({ ...prev, ...updated }));
  };

  const handleResetProfile = () => {
    setProfile({});
    setTechPurpose('todos');
    setTechType('todos');
    setTechBedrooms(0);
  };

  const scrollToResults = () => {
    resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Real-time Client-Centric Matching
  const { results: smartMatchedResults, personalizedSummary } = useMemo(() => {
    return calculateSmartMatches(properties, profile);
  }, [properties, profile]);

  // Apply optional technical overrides if activated
  const displayProperties = useMemo(() => {
    return smartMatchedResults.filter((item) => {
      const p = item.property;
      if (techPurpose !== 'todos' && p.negotiationType !== techPurpose) return false;
      if (techType !== 'todos' && p.propertyType !== techType) return false;
      if (techBedrooms > 0 && p.bedrooms < techBedrooms) return false;
      return true;
    });
  }, [smartMatchedResults, techPurpose, techType, techBedrooms]);

  // Hero Background Slideshow with Real Estate Photos
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(true);

  const heroSlides = useMemo(() => {
    const list: {
      id: string;
      image: string;
      title: string;
      subtitle: string;
      tag?: string;
    }[] = [];

    // Prioritize high-quality property photos
    properties.forEach((prop) => {
      const img = prop.mainImage || (prop.gallery && prop.gallery[0]);
      if (img && list.length < 8) {
        list.push({
          id: `prop-${prop.id}`,
          image: img,
          title: prop.title,
          subtitle: `${prop.neighborhood}, ${prop.city}`,
          tag: prop.negotiationType === 'aluguel' ? 'Locação Premium' : 'Venda Exclusiva'
        });
      }
    });

    // Also include development photos
    developments.forEach((dev) => {
      const img = dev.images && dev.images[0];
      if (img && list.length < 10) {
        list.push({
          id: `dev-${dev.id}`,
          image: img,
          title: dev.name,
          subtitle: `${dev.neighborhood}, ${dev.city}`,
          tag: 'Empreendimento'
        });
      }
    });

    // Fallbacks if no properties loaded yet
    if (list.length === 0) {
      list.push(
        {
          id: 'fb-1',
          image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2000&q=80',
          title: 'Residencial Alphaville Classic',
          subtitle: 'Alphaville, Barueri • SP',
          tag: 'Mansão de Luxo'
        },
        {
          id: 'fb-2',
          image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=80',
          title: 'Villa Botanique Jardins',
          subtitle: 'Jardins, São Paulo • SP',
          tag: 'Design Assinado'
        },
        {
          id: 'fb-3',
          image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=2000&q=80',
          title: 'Penthouse Parque Ibirapuera',
          subtitle: 'Vila Nova Conceição, SP',
          tag: 'Vista Panorâmica'
        }
      );
    }

    return list;
  }, [properties, developments]);

  // Slideshow auto-rotation interval
  useEffect(() => {
    if (!isAutoPlaying || heroSlides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [isAutoPlaying, heroSlides.length]);

  const currentSlideData = heroSlides[currentSlide] || heroSlides[0];

  const cleanWhatsapp = (settings.whatsapp || '').replace(/\D/g, '');
  const directWhatsappUrl = `https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(
    'Olá Sávio! Gostaria de conversar sobre uma consultoria imobiliária personalizada.'
  )}`;

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1A2621]">
      {/* 1. HERO WITH REAL ESTATE PHOTOS TRANSITION & CONVERSATIONAL FINDER */}
      <section className="relative pt-32 pb-24 px-4 sm:px-6 lg:px-8 bg-[#071C15] text-white overflow-hidden min-h-[85vh] flex flex-col justify-center">
        {/* CINEMATIC BACKGROUND SLIDESHOW WITH SMOOTH TRANSITIONS */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
          <AnimatePresence mode="sync">
            {currentSlideData && (
              <motion.div
                key={currentSlideData.id}
                initial={{ opacity: 0, scale: 1.15, filter: 'brightness(0.65) blur(3px)' }}
                animate={{ opacity: 1, scale: 1.0, filter: 'brightness(0.85) blur(0px)' }}
                exit={{ opacity: 0, scale: 0.96, filter: 'brightness(0.5)' }}
                transition={{ duration: 1.5, ease: [0.25, 1, 0.5, 1] }}
                className="absolute inset-0 w-full h-full"
              >
                <img
                  src={currentSlideData.image}
                  alt={currentSlideData.title}
                  className="w-full h-full object-cover object-center"
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Luxury scrim layers for perfect typography contrast and readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#071C15]/90 via-[#071C15]/80 to-[#071C15]/95" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(11,43,32,0.45)_0%,rgba(7,28,21,0.92)_85%)]" />
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#C8A251_1px,transparent_1px)] [background-size:28px_28px]" />
          
          {/* Bottom smooth fade into the page background */}
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#F8F9FA] to-transparent z-10" />
        </div>

        <div className="max-w-6xl mx-auto relative z-10 text-center space-y-6 mb-8 mt-4">
          {/* Badge de Posicionamento */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C8A251]/20 border border-[#C8A251]/40 text-[#C8A251] text-xs font-bold uppercase tracking-widest backdrop-blur-md shadow-lg">
            <HeartHandshake className="w-4 h-4 text-[#C8A251]" />
            <span>Busca Imobiliária Centrada no Cliente</span>
          </div>

          {/* Main Headline */}
          <h1 className="font-editorial text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.15] text-balance max-w-4xl mx-auto drop-shadow-md">
            Aqui a gente não te joga um monte de filtros. A gente entende o que você realmente precisa.
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-lg text-gray-200 max-w-2xl mx-auto leading-relaxed font-light drop-shadow">
            Esqueça as buscas mecânicas de catálogo. Conte para nós quem vai morar, seu estilo de vida e rotina. Nossa inteligência conecta você aos imóveis com real afinidade.
          </p>

          {/* Property Slideshow Controls & Info Indicator */}
          {heroSlides.length > 1 && (
            <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 pt-1">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-[#C8A251]/30 text-xs text-gray-200 shadow-md">
                <span className="w-2 h-2 rounded-full bg-[#C8A251] animate-pulse" />
                <span className="text-[#C8A251] font-semibold">{currentSlideData?.tag || 'Destaque'}:</span>
                <span className="font-medium text-white max-w-[180px] sm:max-w-xs truncate">{currentSlideData?.title}</span>
                <span className="text-gray-400">({currentSlide + 1}/{heroSlides.length})</span>
              </div>

              {/* Navigation Controls */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/15 shadow-md">
                <button
                  type="button"
                  onClick={() => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
                  aria-label="Foto anterior"
                  className="p-1 rounded-full hover:bg-white/20 text-gray-300 hover:text-white transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>

                <div className="flex items-center gap-1 px-1">
                  {heroSlides.map((_, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => setCurrentSlide(idx)}
                      aria-label={`Ver foto ${idx + 1}`}
                      className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                        idx === currentSlide ? 'w-5 bg-[#C8A251]' : 'w-1.5 bg-white/40 hover:bg-white/80'
                      }`}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length)}
                  aria-label="Próxima foto"
                  className="p-1 rounded-full hover:bg-white/20 text-gray-300 hover:text-white transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => setIsAutoPlaying((prev) => !prev)}
                  aria-label={isAutoPlaying ? "Pausar apresentação" : "Continuar apresentação"}
                  className="p-1 ml-0.5 rounded-full hover:bg-white/20 text-gray-300 hover:text-white transition-colors cursor-pointer"
                  title={isAutoPlaying ? "Pausar rotação automática" : "Iniciar rotação automática"}
                >
                  {isAutoPlaying ? <Pause className="w-3 h-3 text-[#C8A251]" /> : <Play className="w-3 h-3 text-[#C8A251]" />}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 2. THE SMART MATCHING FINDER ENGINE (Prominent Central Card) */}
        <div className="relative z-20">
          <SmartMatchingFinder
            profile={profile}
            onChangeProfile={handleUpdateProfile}
            onReset={handleResetProfile}
            totalMatches={displayProperties.length}
            onScrollToResults={scrollToResults}
          />
        </div>
      </section>

      {/* 3. "COMO FUNCIONA O MATCHING CONSULTIVO" (Visual 3-Step Process) */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto text-center">
        <span className="text-xs font-bold uppercase tracking-widest text-[#0B2B20] block mb-2">
          Experiência Invertida
        </span>
        <h2 className="font-editorial text-2xl sm:text-4xl font-bold text-[#0B2B20] mb-3">
          Como Funciona o Matching Personalizado?
        </h2>
        <p className="text-sm text-gray-600 max-w-xl mx-auto mb-12">
          Uma consultoria digital pensada para poupar seu tempo e eliminar visitas a imóveis que não têm nada a ver com você.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <div className="bg-white rounded-2xl p-6 sm:p-7 border border-gray-200/90 shadow-sm relative space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#0B2B20] text-[#C8A251] font-bold text-lg flex items-center justify-center font-editorial">
              1
            </div>
            <h3 className="font-editorial text-lg font-bold text-[#0B2B20]">
              Você conta seu momento real de vida
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed font-light">
              Se é estudante procurando dividir apê, jovem casal precisando de home office acústico ou família buscando segurança e quintal para os filhos.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 sm:p-7 border border-gray-200/90 shadow-sm relative space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#0B2B20] text-[#C8A251] font-bold text-lg flex items-center justify-center font-editorial">
              2
            </div>
            <h3 className="font-editorial text-lg font-bold text-[#0B2B20]">
              Nossa IA cruza mobilidade, rotina e estilo
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed font-light">
              Avaliamos proximidade a faculdades, estações de metrô, isolamento acústico, espaços de convivência e condomínio, ranqueando a compatibilidade real.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 sm:p-7 border border-gray-200/90 shadow-sm relative space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#0B2B20] text-[#C8A251] font-bold text-lg flex items-center justify-center font-editorial">
              3
            </div>
            <h3 className="font-editorial text-lg font-bold text-[#0B2B20]">
              Você visita apenas com alto índice de match
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed font-light">
              Cada imóvel vem acompanhado de uma justificativa clara de por que ele combina com você, além de contato prioritário com o corretor Sávio.
            </p>
          </div>
        </div>
      </section>

      {/* 4. REAL-TIME MATCHING RESULTS SECTION */}
      <section ref={resultsRef} className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-24">
        {/* Dynamic Personalized Diagnosis Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#C8A251]/40 shadow-md mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#0B2B20] uppercase tracking-wider">
              <span className="p-1 rounded-md bg-[#0B2B20] text-[#C8A251]">
                <Sparkles className="w-3.5 h-3.5" />
              </span>
              <span>Diagnóstico de Matching em Tempo Real</span>
            </div>
            <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#0B2B20]">
              {personalizedSummary}
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 font-light">
              Mostrando <strong className="font-bold text-[#0B2B20]">{displayProperties.length}</strong> {displayProperties.length === 1 ? 'imóvel ordenado por afinidade' : 'imóveis ordenados pelo maior índice de compatibilidade'}.
            </p>
          </div>

          {/* Toggle Technical Filters */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowTechnicalFilters(!showTechnicalFilters)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F8F9FA] hover:bg-gray-100 text-xs font-semibold text-[#0B2B20] border border-gray-300 transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4 text-[#C8A251]" />
              <span>{showTechnicalFilters ? 'Ocultar Filtros Técnicos' : 'Filtros Técnicos Tradicionais'}</span>
            </button>
          </div>
        </div>

        {/* Collapsible Secondary Technical Filters (Optional fine tuning) */}
        {showTechnicalFilters && (
          <div className="bg-white rounded-2xl p-5 mb-8 border border-gray-200/90 shadow-sm space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100 text-xs font-semibold text-gray-700">
              <span>Filtros Técnicos Secundários</span>
              <button
                onClick={() => {
                  setTechPurpose('todos');
                  setTechType('todos');
                  setTechBedrooms(0);
                }}
                className="text-gray-500 hover:text-[#0B2B20] underline text-[11px]"
              >
                Limpar filtros técnicos
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-gray-500 font-semibold mb-1">
                  Finalidade
                </label>
                <select
                  value={techPurpose}
                  onChange={(e) => setTechPurpose(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#F8F9FA] border border-gray-300 text-xs text-[#1A2621] outline-none focus:border-[#0B2B20]"
                >
                  <option value="todos">Todas as finalidades</option>
                  <option value="venda">Apenas Venda</option>
                  <option value="aluguel">Apenas Locação</option>
                  <option value="lancamento">Apenas Lançamentos</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-gray-500 font-semibold mb-1">
                  Tipo de Imóvel
                </label>
                <select
                  value={techType}
                  onChange={(e) => setTechType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#F8F9FA] border border-gray-300 text-xs text-[#1A2621] outline-none focus:border-[#0B2B20]"
                >
                  <option value="todos">Todos os tipos</option>
                  <option value="apartamento">Apartamentos</option>
                  <option value="casa">Casas & Mansões</option>
                  <option value="cobertura">Coberturas</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-gray-500 font-semibold mb-1">
                  Mínimo de Quartos
                </label>
                <select
                  value={techBedrooms}
                  onChange={(e) => setTechBedrooms(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-[#F8F9FA] border border-gray-300 text-xs text-[#1A2621] outline-none focus:border-[#0B2B20]"
                >
                  <option value={0}>Sem mínimo</option>
                  <option value={1}>1+ quarto</option>
                  <option value={2}>2+ quartos</option>
                  <option value={3}>3+ quartos</option>
                  <option value={4}>4+ quartos</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* PROPERTY CARDS GRID WITH MATCHING BADGES & CONTEXTUAL PHRASES */}
        {displayProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayProperties.map((item) => (
              <PropertyCard
                key={item.property.id}
                property={item.property}
                matchScore={item.score}
                badgeLabel={item.badgeLabel}
                matchReason={item.matchReason}
                keyHighlights={item.keyHighlights}
                onSelect={(slug) => navigate(`/imovel/${slug}`)}
                onOpenLeadModal={(p) => onOpenLeadModal(p, 'visita')}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center max-w-xl mx-auto space-y-4 shadow-sm">
            <Home className="w-12 h-12 text-gray-400 mx-auto" />
            <h3 className="font-editorial text-xl font-bold text-[#0B2B20]">
              Nenhum imóvel atingiu os critérios selecionados
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Você pode relaxar os filtros ou conversar diretamente com Sávio para captação sob medida.
            </p>
            <button
              onClick={handleResetProfile}
              className="px-6 py-2.5 rounded-xl bg-[#0B2B20] text-[#C8A251] font-bold text-xs uppercase tracking-wider hover:bg-[#133F30] transition-colors"
            >
              Restaurar Todas as Opções
            </button>
          </div>
        )}

        {/* "CONTINUAR CONVERSANDO COM A IA" BANNER */}
        <div className="mt-14 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#0B2B20] via-[#0D3628] to-[#071C15] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C8A251]/20 text-[#C8A251] text-xs font-bold uppercase tracking-wider">
              <Bot className="w-3.5 h-3.5" />
              <span>Refine com Sofia • Consultora IA</span>
            </div>
            <h3 className="font-editorial text-xl sm:text-2xl font-bold text-white">
              Quer uma sugestão ainda mais precisa?
            </h3>
            <p className="text-xs text-gray-300 font-light leading-relaxed">
              Abra a assistente virtual Sofia no canto inferior esquerdo ou nos chame no WhatsApp para uma curadoria humana 100% personalizada.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href={directWhatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#25D366] hover:bg-[#20BA5A] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Chamar no WhatsApp</span>
            </a>
          </div>
        </div>
      </section>

      {/* 5. NUMBERS & CREDIBILITY STRIP */}
      <section className="py-12 bg-[#F1F4F2] border-y border-gray-200/80 my-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            <div className="p-4 border-r border-gray-300/80 last:border-none">
              <span className="font-editorial text-3xl sm:text-4xl font-bold text-[#0B2B20] block mb-1">
                <NumberTicker value={properties.length > 0 ? properties.length : 8} />+
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
                Atendimento Consultivo
              </span>
            </div>
            <div className="p-4 border-r border-gray-300/80 last:border-none">
              <span className="font-editorial text-3xl sm:text-4xl font-bold text-[#0B2B20] block mb-1">
                Zero
              </span>
              <span className="text-xs uppercase tracking-wider text-gray-600 font-medium">
                Filtros Frios Obrigatórios
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

      {/* 6. DEVELOPMENTS (LANÇAMENTOS) */}
      {developments.length > 0 && (
        <section className="py-20 bg-[#071C15] text-white border-y border-[#153D2F]">
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

      {/* 7. BROKER PRESENTATION & ABOUT SÁVIO */}
      <section className="bg-[#0B2B20] text-white py-20 relative overflow-hidden">
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
                <span>01 · Atendimento Humano & Consultivo</span>
              </div>
              <h2 className="font-editorial text-3xl sm:text-4xl font-bold text-white leading-tight">
                Mais que intermediar imóveis, entendemos quem você é para encontrar seu lugar no mundo.
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

      {/* 8. FINANCING SIMULATOR */}
      <section className="bg-gray-100/70 py-20 border-y border-gray-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FinancingSimulator />
        </div>
      </section>

      {/* 9. TRUST & CONFIDENCE FINAL BANNER */}
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
