import React, { useState, useMemo, useEffect } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { PropertyCard } from '../components/PropertyCard';
import { Property, PropertyType, NegotiationType, ClientProfile } from '../types';
import { calculateSmartMatches } from '../lib/smartMatch';
import {
  Search,
  Filter,
  SlidersHorizontal,
  RotateCcw,
  Home,
  Sparkles,
  Users,
  GraduationCap,
  Briefcase,
  Heart,
  Bot
} from 'lucide-react';

interface PropertiesPageProps {
  navigate: (route: string) => void;
  onOpenLeadModal: (property?: Property) => void;
}

export const PropertiesPage: React.FC<PropertiesPageProps> = ({ navigate, onOpenLeadModal }) => {
  const { properties } = useSettings();

  // URL search params sync
  const queryParams = new URLSearchParams(window.location.search);
  const initialPurpose = (queryParams.get('finalidade') as NegotiationType) || 'todos';
  const initialType = (queryParams.get('tipo') as PropertyType) || 'todos';
  const initialSearch = queryParams.get('busca') || '';

  const [profile, setProfile] = useState<ClientProfile>({
    freeTextQuery: initialSearch,
    negotiationType: initialPurpose,
  });

  const [purpose, setPurpose] = useState<string>(initialPurpose);
  const [propertyType, setPropertyType] = useState<string>(initialType);
  const [searchTerm, setSearchTerm] = useState<string>(initialSearch);
  const [minBedrooms, setMinBedrooms] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(25000000);
  const [sortBy, setSortBy] = useState<string>('matching');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState<boolean>(false);

  // Sync state if URL changes
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    if (q.get('finalidade')) {
      setPurpose(q.get('finalidade')!);
      setProfile((prev) => ({ ...prev, negotiationType: q.get('finalidade') as any }));
    }
    if (q.get('tipo')) setPropertyType(q.get('tipo')!);
    if (q.get('busca')) {
      setSearchTerm(q.get('busca')!);
      setProfile((prev) => ({ ...prev, freeTextQuery: q.get('busca')! }));
    }
  }, []);

  const handleUpdateProfile = (updated: Partial<ClientProfile>) => {
    setProfile((prev) => ({ ...prev, ...updated }));
  };

  const resetFilters = () => {
    setPurpose('todos');
    setPropertyType('todos');
    setSearchTerm('');
    setMinBedrooms(0);
    setMaxPrice(25000000);
    setSortBy('matching');
    setProfile({});
  };

  // Run Smart Matching Engine
  const { results: smartMatchedResults, personalizedSummary } = useMemo(() => {
    const activeProfile: ClientProfile = {
      ...profile,
      freeTextQuery: searchTerm,
      negotiationType: purpose !== 'todos' ? (purpose as any) : undefined,
      maxBudget: maxPrice < 25000000 ? maxPrice : undefined,
    };
    return calculateSmartMatches(properties, activeProfile);
  }, [properties, profile, searchTerm, purpose, maxPrice]);

  // Apply secondary filters and sorting
  const finalFilteredResults = useMemo(() => {
    return smartMatchedResults.filter((item) => {
      const p = item.property;
      if (propertyType !== 'todos' && p.propertyType !== propertyType) return false;
      if (minBedrooms > 0 && p.bedrooms < minBedrooms) return false;
      return true;
    }).sort((a, b) => {
      if (sortBy === 'matching') return b.score - a.score;
      if (sortBy === 'preco_desc') return b.property.price - a.property.price;
      if (sortBy === 'preco_asc') return a.property.price - b.property.price;
      if (sortBy === 'recentes') {
        return new Date(b.property.createdAt).getTime() - new Date(a.property.createdAt).getTime();
      }
      return 0;
    });
  }, [smartMatchedResults, propertyType, minBedrooms, sortBy]);

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1A2621]">
      {/* Header Banner in Deep Forest Green #0B2B20 */}
      <section className="bg-[#0B2B20] text-white pt-32 pb-16 px-4 sm:px-6 lg:px-8 border-b border-[#153D2F] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#C8A251_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex items-center gap-2 text-[#C8A251] text-xs uppercase tracking-widest font-semibold mb-3">
            <Sparkles className="w-4 h-4" />
            <span>Busca Personalizada & Inteligente</span>
          </div>
          <h1 className="font-editorial text-3xl sm:text-5xl font-bold text-white mb-3 tracking-tight">
            Imóveis com Match para Você
          </h1>
          <p className="text-sm sm:text-base text-gray-300 max-w-2xl leading-relaxed font-light">
            {personalizedSummary}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Natural Language + Profile Filters Card in Clean White */}
        <div className="bg-white rounded-2xl border border-gray-200/90 p-5 sm:p-7 mb-10 shadow-sm space-y-5">
          {/* Top Bar: Natural Language Search Input */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-[#0B2B20] uppercase tracking-wider">
              O que você procura em linguagem natural?
            </label>
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Ex: Preciso de um lugar perto da faculdade para dividir com colega, ou casa com quintal para pets..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  handleUpdateProfile({ freeTextQuery: e.target.value });
                }}
                className="w-full pl-10 pr-24 py-3 rounded-xl bg-[#F8F9FA] border border-gray-300 text-sm text-[#1A2621] placeholder:text-gray-400 outline-none focus:border-[#0B2B20] focus:ring-1 focus:ring-[#0B2B20] transition-colors"
              />
              {searchTerm && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    handleUpdateProfile({ freeTextQuery: '' });
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-500 hover:text-gray-800"
                >
                  Limpar
                </button>
              )}
            </div>
          </div>

          {/* Quick Life-Stage / Profile Pills */}
          <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-gray-100">
            <span className="text-xs font-semibold text-gray-500 mr-1">Momento / Perfil:</span>

            <button
              onClick={() => handleUpdateProfile({ isStudent: !profile.isStudent, nearUniversity: !profile.nearUniversity })}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                profile.isStudent ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Estudante / Perto de Faculdade</span>
            </button>

            <button
              onClick={() => handleUpdateProfile({ peopleCount: profile.peopleCount === '1-2' ? undefined : '1-2' })}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                profile.peopleCount === '1-2' ? 'bg-[#0B2B20] text-[#C8A251]' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>1 a 2 pessoas</span>
            </button>

            <button
              onClick={() => handleUpdateProfile({ peopleCount: profile.peopleCount === 'familia' ? undefined : 'familia', lifeStage: 'familia' })}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                profile.peopleCount === 'familia' ? 'bg-[#0B2B20] text-[#C8A251]' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Heart className="w-3.5 h-3.5" />
              <span>Família com filhos</span>
            </button>

            <button
              onClick={() => handleUpdateProfile({ lifestyle: profile.lifestyle === 'quieto_homeoffice' ? undefined : 'quieto_homeoffice' })}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                profile.lifestyle === 'quieto_homeoffice' ? 'bg-blue-100 text-blue-900 border border-blue-300' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Home Office Silencioso</span>
            </button>

            <button
              onClick={() => handleUpdateProfile({ housingPreference: profile.housingPreference === 'compartilhado' ? undefined : 'compartilhado' })}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                profile.housingPreference === 'compartilhado' ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>Para Dividir com Colegas</span>
            </button>
          </div>

          {/* Secondary Controls: Purpose + Sort + Toggle Technical */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-100">
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-gray-500 font-semibold mb-1">
                Finalidade
              </label>
              <select
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#F8F9FA] border border-gray-300 text-xs sm:text-sm text-[#1A2621] outline-none focus:border-[#0B2B20]"
              >
                <option value="todos">Todas as finalidades</option>
                <option value="venda">Comprar (Venda)</option>
                <option value="aluguel">Alugar (Locação)</option>
                <option value="lancamento">Lançamentos</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-gray-500 font-semibold mb-1">
                Ordenar Por
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#F8F9FA] border border-gray-300 text-xs sm:text-sm text-[#1A2621] outline-none focus:border-[#0B2B20]"
              >
                <option value="matching">Maior Afinidade com Você (IA)</option>
                <option value="preco_asc">Menor Preço</option>
                <option value="preco_desc">Maior Preço</option>
                <option value="recentes">Mais Recentes</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-gray-500 font-semibold mb-1">
                Tipo de Imóvel
              </label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#F8F9FA] border border-gray-300 text-xs sm:text-sm text-[#1A2621] outline-none focus:border-[#0B2B20]"
              >
                <option value="todos">Todos os Tipos</option>
                <option value="apartamento">Apartamentos & Studios</option>
                <option value="casa">Casas & Mansões</option>
                <option value="cobertura">Coberturas</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={resetFilters}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#F1F4F2] hover:bg-gray-200 text-xs text-gray-700 border border-gray-300 transition-colors font-medium"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Limpar Critérios</span>
              </button>
            </div>
          </div>
        </div>

        {/* Results Counter & Personalized Tag */}
        <div className="flex items-center justify-between mb-6 text-xs text-gray-500">
          <span>
            Exibindo <strong className="text-[#0B2B20] font-bold">{finalFilteredResults.length}</strong> {finalFilteredResults.length === 1 ? 'imóvel ordenado por compatibilidade' : 'imóveis ordenados por afinidade consultiva'}
          </span>
          <span className="flex items-center gap-1 text-[#0B2B20] font-bold">
            <Sparkles className="w-3.5 h-3.5 text-[#C8A251]" />
            <span>Matching Ativo</span>
          </span>
        </div>

        {/* Properties Grid with Match Scores */}
        {finalFilteredResults.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {finalFilteredResults.map((item) => (
              <PropertyCard
                key={item.property.id}
                property={item.property}
                matchScore={item.score}
                badgeLabel={item.badgeLabel}
                matchReason={item.matchReason}
                keyHighlights={item.keyHighlights}
                onSelect={(slug) => navigate(`/imovel/${slug}`)}
                onOpenLeadModal={(p) => onOpenLeadModal(p)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center max-w-xl mx-auto space-y-4 shadow-sm">
            <Home className="w-12 h-12 text-gray-400 mx-auto" />
            <h3 className="font-editorial text-xl font-bold text-[#0B2B20]">
              Nenhum imóvel compatível com os filtros atuais
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Tente ampliar a faixa de busca ou conversar diretamente com Sávio para captação sob medida.
            </p>
            <button
              onClick={resetFilters}
              className="px-6 py-2.5 rounded-xl bg-[#0B2B20] text-[#C8A251] font-bold text-xs uppercase tracking-wider hover:bg-[#133F30] transition-colors"
            >
              Restaurar Todos os Imóveis
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
