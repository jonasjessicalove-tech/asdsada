import React, { useState } from 'react';
import { ClientProfile, PeopleCount, LifeStage, HousingPreference, LifestyleVibe, LocationPriority } from '../types';
import {
  Sparkles,
  Search,
  Users,
  GraduationCap,
  Home,
  Briefcase,
  Compass,
  DollarSign,
  MapPin,
  Check,
  ChevronRight,
  ArrowRight,
  RotateCcw,
  SlidersHorizontal,
  Lightbulb,
  Heart
} from 'lucide-react';

interface SmartMatchingFinderProps {
  profile: ClientProfile;
  onChangeProfile: (updated: Partial<ClientProfile>) => void;
  onReset: () => void;
  totalMatches: number;
  onScrollToResults?: () => void;
}

export const SmartMatchingFinder: React.FC<SmartMatchingFinderProps> = ({
  profile,
  onChangeProfile,
  onReset,
  totalMatches,
  onScrollToResults,
}) => {
  const [activeTabStep, setActiveTabStep] = useState<number>(0);
  const [showTechnicalFilters, setShowTechnicalFilters] = useState<boolean>(false);

  // Quick inspirational prompt suggestions
  const promptSuggestions = [
    'Estudo na faculdade e quero dividir apê perto do metrô',
    'Casal com home office silencioso e espaço para pet',
    'Família com filhos procurando condomínio seguro com clube',
    'Studio moderno para morar sozinho perto de tudo',
  ];

  const hasAnyFilter =
    Boolean(profile.freeTextQuery) ||
    Boolean(profile.peopleCount) ||
    Boolean(profile.lifeStage) ||
    profile.isStudent === true ||
    profile.nearUniversity === true ||
    Boolean(profile.housingPreference) ||
    Boolean(profile.lifestyle) ||
    Boolean(profile.locationPriority) ||
    Boolean(profile.maxBudget) ||
    Boolean(profile.preferredRegion);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* 1. HERO CONVERSATIONAL SEARCH INPUT */}
      <div className="relative bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-gray-100/80 transition-all hover:shadow-[0_20px_50px_rgba(11,30,46,0.12)]">
        <div className="flex items-center gap-2 text-[#0B2B20] text-xs font-bold uppercase tracking-widest mb-3">
          <span className="p-1 rounded-md bg-[#0B2B20]/10 text-[#C8A251]">
            <Sparkles className="w-3.5 h-3.5 fill-[#C8A251]" />
          </span>
          <span>Busca Consultiva & Inteligente</span>
        </div>

        <label className="block font-editorial text-2xl sm:text-4xl font-bold text-[#0B2B20] tracking-tight mb-2">
          Me conta, o que você realmente precisa?
        </label>
        <p className="text-xs sm:text-sm text-gray-500 mb-6 leading-relaxed">
          Pode escrever em linguagem livre como se estivesse conversando com um consultor. Nossa IA entende seu momento de vida.
        </p>

        {/* Free text input bar */}
        <div className="relative flex items-center">
          <Search className="absolute left-4 w-5 h-5 text-gray-400 shrink-0 pointer-events-none" />
          <input
            type="text"
            value={profile.freeTextQuery || ''}
            onChange={(e) => onChangeProfile({ freeTextQuery: e.target.value })}
            placeholder="Ex: Preciso de um lugar perto da faculdade para dividir com amigos, com metrô perto..."
            className="w-full pl-12 pr-28 sm:pr-36 py-4 rounded-2xl bg-[#F8F9FA] border border-gray-200 text-sm sm:text-base text-[#1A2621] placeholder:text-gray-400 outline-none focus:border-[#0B2B20] focus:ring-2 focus:ring-[#0B2B20]/10 transition-all font-sans"
          />
          {profile.freeTextQuery ? (
            <button
              onClick={() => onChangeProfile({ freeTextQuery: '' })}
              className="absolute right-4 px-3 py-1.5 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-semibold transition-colors"
            >
              Limpar
            </button>
          ) : (
            <span className="absolute right-4 text-xs font-semibold text-[#0B2B20] hidden sm:inline-flex items-center gap-1 opacity-70">
              <Sparkles className="w-3 h-3 text-[#C8A251]" />
              IA Ativa
            </span>
          )}
        </div>

        {/* Clickable prompt suggestions */}
        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-2 flex-wrap">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-600 flex items-center gap-1 mr-1">
            <Lightbulb className="w-3 h-3 text-[#C8A251]" />
            Sugestões rápidas:
          </span>
          {promptSuggestions.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => onChangeProfile({ freeTextQuery: prompt })}
              className="text-xs px-3 py-1.5 rounded-full bg-[#F1F4F2] hover:bg-[#E5EAE7] text-gray-800 transition-colors text-left font-medium border border-gray-200/60"
            >
              "{prompt}"
            </button>
          ))}
        </div>
      </div>

      {/* 2. GUIDED CONSULTATIVE STEPS (The Inverted Logic) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-100 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
          <div>
            <h3 className="font-editorial text-xl sm:text-2xl font-bold text-[#0B2B20] flex items-center gap-2">
              <span>Perguntas para afinar seu matching</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#0B2B20] text-[#C8A251] font-sans font-bold">
                {totalMatches} {totalMatches === 1 ? 'imóvel compatível' : 'imóveis compatíveis'}
              </span>
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Clique nas opções para refinarmos as opções que fazem sentido para a sua rotina real.
            </p>
          </div>

          {hasAnyFilter && (
            <button
              onClick={onReset}
              className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#0B2B20] transition-colors self-start sm:self-auto py-1 px-2.5 rounded-lg hover:bg-gray-100"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Recomeçar perguntas</span>
            </button>
          )}
        </div>

        {/* Step Tabs Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-semibold no-scrollbar">
          {[
            { id: 0, label: '1. Pessoas' },
            { id: 1, label: '2. Perfil / Estudante' },
            { id: 2, label: '3. Localização & Metrô' },
            { id: 3, label: '4. Dividir ou Exclusivo' },
            { id: 4, label: '5. Estilo de Vida' },
            { id: 5, label: '6. Orçamento (Opcional)' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTabStep(tab.id)}
              className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition-all ${
                activeTabStep === tab.id
                  ? 'bg-[#0B2B20] text-[#C8A251] font-bold shadow-sm'
                  : 'bg-[#F8F9FA] text-gray-600 hover:text-[#0B2B20] hover:bg-gray-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* STEP CONTENT PANELS */}
        <div className="pt-2">
          {/* STEP 0: People Count */}
          {activeTabStep === 0 && (
            <div className="space-y-3 animate-fadeIn">
              <span className="text-xs uppercase tracking-wider font-semibold text-gray-500 block">
                Quantas pessoas vão morar no imóvel?
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { id: '1-2', label: '1 a 2 pessoas', desc: 'Prático, compacto ou casal' },
                  { id: '3-4', label: '3 a 4 pessoas', desc: 'Espaço para filhos ou home office' },
                  { id: '5+', label: '5 ou mais pessoas', desc: 'Plantas amplas com múltiplos dormitórios' },
                  { id: 'familia', label: 'Família com filhos', desc: 'Foco em condomínio seguro e lazer' },
                ].map((item) => {
                  const isSelected = profile.peopleCount === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onChangeProfile({ peopleCount: isSelected ? undefined : (item.id as PeopleCount) });
                      }}
                      className={`p-4 rounded-2xl text-left border transition-all ${
                        isSelected
                          ? 'border-[#0B2B20] bg-[#0B2B20] text-white shadow-md'
                          : 'border-gray-200 bg-[#F8F9FA] hover:border-gray-300 text-gray-800'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`font-bold text-sm ${isSelected ? 'text-[#C8A251]' : 'text-[#0B2B20]'}`}>
                          {item.label}
                        </span>
                        {isSelected && <Check className="w-4 h-4 text-[#C8A251]" />}
                      </div>
                      <span className={`text-xs block ${isSelected ? 'text-gray-300' : 'text-gray-500'}`}>
                        {item.desc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 1: Life Stage / Student */}
          {activeTabStep === 1 && (
            <div className="space-y-4 animate-fadeIn">
              <div>
                <span className="text-xs uppercase tracking-wider font-semibold text-gray-500 block mb-2">
                  Qual é o seu momento de vida atual?
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {[
                    { id: 'estudante', label: 'Estudante Universitário', desc: 'Próximo a faculdades e transporte' },
                    { id: 'jovem_profissional', label: 'Jovem Profissional', desc: 'Mobilidade, vida urbana e foco' },
                    { id: 'casal', label: 'Casal', desc: 'Conforto e espaço a dois' },
                    { id: 'familia', label: 'Família', desc: 'Segurança e espaço infantil' },
                    { id: 'investidor', label: 'Investidor', desc: 'Alta liquidez e rentabilidade' },
                  ].map((item) => {
                    const isSelected = profile.lifeStage === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          onChangeProfile({
                            lifeStage: isSelected ? undefined : (item.id as LifeStage),
                            isStudent: item.id === 'estudante' ? !isSelected : profile.isStudent,
                          });
                        }}
                        className={`p-3.5 rounded-2xl text-left border transition-all ${
                          isSelected
                            ? 'border-[#0B2B20] bg-[#0B2B20] text-white shadow-md'
                            : 'border-gray-200 bg-[#F8F9FA] hover:border-gray-300 text-gray-800'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className={`font-bold text-xs ${isSelected ? 'text-[#C8A251]' : 'text-[#0B2B20]'}`}>
                            {item.label}
                          </span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-[#C8A251]" />}
                        </div>
                        <span className={`text-[11px] block leading-tight ${isSelected ? 'text-gray-300' : 'text-gray-500'}`}>
                          {item.desc}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Direct Student Toggle */}
              <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <GraduationCap className="w-5 h-5 text-amber-700 shrink-0" />
                  <div>
                    <span className="font-bold text-xs text-amber-950 block">Você ou quem vai morar é estudante?</span>
                    <span className="text-[11px] text-amber-800">Prioriza proximidade a faculdades, ciclovias e áreas de estudo.</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onChangeProfile({ isStudent: true, nearUniversity: true })}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      profile.isStudent ? 'bg-[#0B2B20] text-[#C8A251]' : 'bg-white text-gray-700 border border-gray-300'
                    }`}
                  >
                    Sim
                  </button>
                  <button
                    onClick={() => onChangeProfile({ isStudent: false })}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      profile.isStudent === false ? 'bg-[#0B2B20] text-white' : 'bg-white text-gray-700 border border-gray-300'
                    }`}
                  >
                    Não
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Location Priority */}
          {activeTabStep === 2 && (
            <div className="space-y-3 animate-fadeIn">
              <span className="text-xs uppercase tracking-wider font-semibold text-gray-500 block">
                O que você mais valoriza em relação à localização?
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'universidades', label: 'Perto de Faculdades / USP / PUC', desc: 'Acesso rápido para estudantes e docentes' },
                  { id: 'metro_transporte', label: 'A poucos passos de Metrô & Transporte', desc: 'Sem depender de carro no trânsito' },
                  { id: 'bairro_tranquilo', label: 'Bairro estritamente residencial & calmo', desc: 'Ruas silenciosas, arborizadas e seguras' },
                  { id: 'centro_vibrante', label: 'Região Cosmopolita & Gastronomia', desc: 'Restaurantes, cultura e vida a pé' },
                  { id: 'escolas_parques', label: 'Ao lado de Parques & Colégios', desc: 'Áreas verdes para passeios e lazer' },
                ].map((item) => {
                  const isSelected = profile.locationPriority === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onChangeProfile({ locationPriority: isSelected ? undefined : (item.id as LocationPriority) });
                      }}
                      className={`p-3.5 rounded-2xl text-left border transition-all ${
                        isSelected
                          ? 'border-[#0B2B20] bg-[#0B2B20] text-white shadow-md'
                          : 'border-gray-200 bg-[#F8F9FA] hover:border-gray-300 text-gray-800'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`font-bold text-xs ${isSelected ? 'text-[#C8A251]' : 'text-[#0B2B20]'}`}>
                          {item.label}
                        </span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#C8A251]" />}
                      </div>
                      <span className={`text-[11px] block ${isSelected ? 'text-gray-300' : 'text-gray-500'}`}>
                        {item.desc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: Housing Preference (Shared vs Exclusive) */}
          {activeTabStep === 3 && (
            <div className="space-y-3 animate-fadeIn">
              <span className="text-xs uppercase tracking-wider font-semibold text-gray-500 block">
                Está buscando imóvel compartilhado ou exclusivo?
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    id: 'exclusivo',
                    label: 'Imóvel 100% Exclusivo',
                    desc: 'Total privacidade apenas para você ou sua família.',
                  },
                  {
                    id: 'compartilhado',
                    label: 'Perfeito para Dividir com Colegas',
                    desc: 'Planta inteligente com quartos separados para estudantes ou amigos dividirem custos.',
                  },
                  {
                    id: 'flexivel',
                    label: 'Tanto faz / Flexível',
                    desc: 'Quero ver tanto opções individuais quanto para compartilhar.',
                  },
                ].map((item) => {
                  const isSelected = profile.housingPreference === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onChangeProfile({ housingPreference: isSelected ? undefined : (item.id as HousingPreference) });
                      }}
                      className={`p-4 rounded-2xl text-left border transition-all ${
                        isSelected
                          ? 'border-[#0B2B20] bg-[#0B2B20] text-white shadow-md'
                          : 'border-gray-200 bg-[#F8F9FA] hover:border-gray-300 text-gray-800'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`font-bold text-sm ${isSelected ? 'text-[#C8A251]' : 'text-[#0B2B20]'}`}>
                          {item.label}
                        </span>
                        {isSelected && <Check className="w-4 h-4 text-[#C8A251]" />}
                      </div>
                      <span className={`text-xs block ${isSelected ? 'text-gray-300' : 'text-gray-500'}`}>
                        {item.desc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 4: Lifestyle */}
          {activeTabStep === 4 && (
            <div className="space-y-3 animate-fadeIn">
              <span className="text-xs uppercase tracking-wider font-semibold text-gray-500 block">
                Qual estilo de vida melhor descreve a sua rotina?
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {[
                  { id: 'quieto_homeoffice', label: 'Silencioso & Home Office', desc: 'Isolamento acústico e tranquilidade' },
                  { id: 'movimento_urbano', label: 'Vibrante & Urbano', desc: 'Noite, cafés e vida dinâmica' },
                  { id: 'lazer_familia', label: 'Lazer & Clube Completo', desc: 'Piscina, quadra e segurança' },
                  { id: 'natureza', label: 'Verde & Contemplação', desc: 'Jardins e ar puro' },
                  { id: 'pet_friendly', label: 'Amigo dos Pets', desc: 'Quintal ou espaço pet' },
                ].map((item) => {
                  const isSelected = profile.lifestyle === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onChangeProfile({ lifestyle: isSelected ? undefined : (item.id as LifestyleVibe) });
                      }}
                      className={`p-3.5 rounded-2xl text-left border transition-all ${
                        isSelected
                          ? 'border-[#0B2B20] bg-[#0B2B20] text-white shadow-md'
                          : 'border-gray-200 bg-[#F8F9FA] hover:border-gray-300 text-gray-800'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`font-bold text-xs ${isSelected ? 'text-[#C8A251]' : 'text-[#0B2B20]'}`}>
                          {item.label}
                        </span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#C8A251]" />}
                      </div>
                      <span className={`text-[11px] block leading-tight ${isSelected ? 'text-gray-300' : 'text-gray-500'}`}>
                        {item.desc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 5: Budget (Optional) */}
          {activeTabStep === 5 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs uppercase tracking-wider font-semibold text-gray-500 block">
                    Faixa de Orçamento Estimada (Opcional)
                  </span>
                  <span className="text-xs text-gray-400">
                    Não é obrigatório. Aqui você tem flexibilidade para explorar.
                  </span>
                </div>
                {profile.maxBudget && (
                  <span className="font-editorial text-lg font-bold text-[#0B2B20]">
                    Até R$ {profile.maxBudget.toLocaleString('pt-BR')}
                  </span>
                )}
              </div>

              {/* Fast budget pills */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { label: 'Aluguel até R$ 4.000', value: 4000, type: 'aluguel' },
                  { label: 'Aluguel até R$ 7.500', value: 7500, type: 'aluguel' },
                  { label: 'Compra até R$ 1,5 Milhão', value: 1500000, type: 'venda' },
                  { label: 'Compra até R$ 5 Milhões', value: 5000000, type: 'venda' },
                ].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => onChangeProfile({ maxBudget: item.value, negotiationType: item.type as any })}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all text-center ${
                      profile.maxBudget === item.value
                        ? 'bg-[#0B2B20] text-[#C8A251] border-[#0B2B20]'
                        : 'bg-[#F8F9FA] text-gray-700 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {profile.maxBudget && (
                <button
                  onClick={() => onChangeProfile({ maxBudget: undefined })}
                  className="text-xs text-gray-500 hover:text-[#0B2B20] underline"
                >
                  Remover restrição de valor
                </button>
              )}
            </div>
          )}
        </div>

        {/* STEP FOOTER: NAVIGATION & CURRENT PROFILE SUMMARY CHIPS */}
        <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-[#0B2B20] uppercase tracking-wider">Seu Perfil:</span>
            {profile.peopleCount && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#0B2B20]/10 text-[#0B2B20] text-xs font-semibold">
                <Users className="w-3 h-3 text-[#C8A251]" />
                {profile.peopleCount} pessoas
              </span>
            )}
            {(profile.isStudent || profile.lifeStage === 'estudante') && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold">
                <GraduationCap className="w-3.5 h-3.5" />
                Estudante / Universitário
              </span>
            )}
            {profile.housingPreference && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-semibold">
                <Home className="w-3 h-3" />
                {profile.housingPreference === 'compartilhado' ? 'Para Dividir' : 'Exclusivo'}
              </span>
            )}
            {profile.lifestyle === 'quieto_homeoffice' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-100 text-blue-900 text-xs font-semibold">
                <Briefcase className="w-3 h-3" />
                Home Office
              </span>
            )}
            {!hasAnyFilter && (
              <span className="text-xs text-gray-600 italic">
                Nenhum filtro rígido ativo — mostrando todos os imóveis por relevância.
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {activeTabStep < 5 && (
              <button
                onClick={() => setActiveTabStep((prev) => Math.min(5, prev + 1))}
                className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-semibold text-gray-700 transition-colors"
              >
                <span>Próximo</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}

            {onScrollToResults && (
              <button
                onClick={onScrollToResults}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0B2B20] hover:bg-[#133F30] text-[#C8A251] font-bold text-xs uppercase tracking-wider shadow-md transition-all"
              >
                <span>Ver Imóveis ({totalMatches})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
