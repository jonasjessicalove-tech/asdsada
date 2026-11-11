import React, { useState } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { Development, LeadInterest } from '../types';
import { Building2, MapPin, Sparkles, ArrowRight, MessageCircle, Film, Play, X } from 'lucide-react';
import { trackEvent } from '../lib/analytics';

interface DevelopmentsPageProps {
  navigate: (route: string) => void;
  onOpenLeadModal: (property?: any, defaultInterest?: LeadInterest) => void;
}

export const DevelopmentsPage: React.FC<DevelopmentsPageProps> = ({ navigate, onOpenLeadModal }) => {
  const { developments, settings } = useSettings();
  const [selectedStatus, setSelectedStatus] = useState<string>('todos');
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);

  const cleanWhatsapp = (settings.whatsapp || '').replace(/\D/g, '');

  const [activeImgIndex, setActiveImgIndex] = useState<Record<string, number>>({});

  const filteredDevelopments = developments.filter((dev) => {
    if (!dev.published) return false;
    if (selectedStatus !== 'todos' && dev.status !== selectedStatus) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1A2621]">
      {/* Video Modal */}
      {activeVideoUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-4xl bg-slate-950 rounded-2xl overflow-hidden border border-[#C8A251]/40 shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-[#0B2B20]">
              <span className="font-editorial text-sm font-bold text-[#C8A251] flex items-center gap-2">
                <Film className="w-4 h-4 text-[#C8A251]" />
                <span>Tour em Vídeo do Empreendimento</span>
              </span>
              <button
                onClick={() => setActiveVideoUrl(null)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                title="Fechar vídeo"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 bg-black flex items-center justify-center min-h-[360px]">
              {activeVideoUrl.match(/\.(mp4|webm|mov|ogg)($|\?)/i) || activeVideoUrl.startsWith('data:video') || activeVideoUrl.includes('blob.vercel-storage.com') ? (
                <video
                  src={activeVideoUrl}
                  controls
                  autoPlay
                  className="w-full max-h-[70vh] rounded-lg shadow-lg"
                />
              ) : activeVideoUrl.includes('youtube.com') || activeVideoUrl.includes('youtu.be') ? (
                <iframe
                  src={activeVideoUrl.replace('watch?v=', 'embed/')}
                  title="Tour Vídeo"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-[450px] rounded-lg"
                />
              ) : (
                <iframe
                  src={activeVideoUrl}
                  title="Tour Vídeo"
                  className="w-full h-[450px] rounded-lg"
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Header Banner in Noble Green #0B2B20 */}
      <section className="bg-[#0B2B20] text-white pt-32 pb-16 px-4 sm:px-6 lg:px-8 border-b border-[#153D2F] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#C8A251_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10 text-center max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C8A251]/15 border border-[#C8A251]/30 text-[#C8A251] text-xs font-semibold uppercase tracking-wider mb-3">
            <Building2 className="w-4 h-4" />
            <span>Lançamentos & Plantas Selecionadas</span>
          </div>
          <h1 className="font-editorial text-3xl sm:text-5xl font-bold text-white mb-4 tracking-tight">
            Empreendimentos de Alto Padrão
          </h1>
          <p className="text-sm sm:text-base text-gray-300 leading-relaxed font-light">
            Projetos arquitetônicos e condomínios fechados desenvolvidos pelas incorporadoras mais prestigiadas, com assessoria exclusiva de Sávio.
          </p>

          {/* Status Tabs */}
          <div className="flex items-center justify-center gap-2 mt-8 flex-wrap">
            {[
              { id: 'todos', label: 'Todos os Projetos' },
              { id: 'lancamento', label: 'Lançamentos' },
              { id: 'em_obras', label: 'Em Construção' },
              { id: 'pronto', label: 'Prontos para Morar' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedStatus(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  selectedStatus === tab.id
                    ? 'bg-[#C8A251] text-[#0B2B20] shadow-md font-bold'
                    : 'bg-[#153D2F] text-gray-300 hover:text-white hover:bg-[#1A4535]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Developments List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-12">
          {filteredDevelopments.map((dev) => {
            const currentImgIdx = activeImgIndex[dev.id] || 0;
            const currentImg = dev.images?.[currentImgIdx] || dev.images?.[0] || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80';
            const hasVideo = !!(dev.videoUrl || (dev.videos && dev.videos.length > 0));

            const devWhatsappUrl = `https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(
              `Olá Sávio! Gostaria de receber a apresentação completa e tabela do empreendimento "${dev.name}".`
            )}`;

            return (
              <div
                key={dev.id}
                className="bg-white rounded-2xl border border-gray-200/90 overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 shadow-sm hover:shadow-xl transition-all"
              >
                {/* Image & Multi-photo Gallery */}
                <div className="lg:col-span-5 flex flex-col justify-between bg-gray-900">
                  <div className="relative min-h-[300px] lg:h-[380px] overflow-hidden">
                    <img
                      src={currentImg}
                      alt={dev.name}
                      className="w-full h-full object-cover transition-all duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#0B2B20] text-[#C8A251] shadow border border-[#C8A251]/30">
                      {dev.status === 'lancamento' ? 'Lançamento Exclusivo' : dev.status === 'em_obras' ? 'Em Obras' : 'Pronto'}
                    </span>
                    {dev.images && dev.images.length > 1 && (
                      <span className="absolute bottom-4 right-4 px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-md text-[11px] text-[#C8A251] font-medium border border-white/10">
                        Foto {currentImgIdx + 1} de {dev.images.length}
                      </span>
                    )}

                    {/* Video tour floating badge if available */}
                    {hasVideo && (
                      <button
                        type="button"
                        onClick={() => setActiveVideoUrl(dev.videoUrl || dev.videos?.[0] || null)}
                        className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/80 hover:bg-[#C8A251] text-[#C8A251] hover:text-[#0B2B20] text-xs font-bold border border-[#C8A251]/50 backdrop-blur-md transition-all shadow-lg cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Vídeo Tour</span>
                      </button>
                    )}
                  </div>

                  {/* Multi-Photo Thumbnail Bar */}
                  {dev.images && dev.images.length > 1 && (
                    <div className="p-3 bg-gray-900 border-t border-gray-800 flex items-center gap-2 overflow-x-auto">
                      {dev.images.map((img, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setActiveImgIndex((prev) => ({ ...prev, [dev.id]: idx }))}
                          className={`relative rounded-lg overflow-hidden w-16 h-12 shrink-0 border transition-all ${
                            currentImgIdx === idx
                              ? 'border-[#C8A251] scale-105 shadow'
                              : 'border-transparent opacity-60 hover:opacity-100'
                          }`}
                        >
                          <img src={img} alt={`Miniatura ${idx + 1}`} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-[#0B2B20] uppercase tracking-widest font-semibold mb-2">
                      <MapPin className="w-4 h-4 text-[#C8A251]" />
                      <span>{dev.neighborhood}, {dev.city} — Incorporação: {dev.developer}</span>
                    </div>

                    <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#0B2B20] mb-3">
                      {dev.name}
                    </h2>

                    <p className="text-sm text-gray-600 leading-relaxed mb-4">
                      {dev.description}
                    </p>

                    <div className="p-4 rounded-xl bg-[#F8F9FA] border border-gray-200 text-xs text-gray-700 font-medium space-y-1 mb-4">
                      <div className="text-[#0B2B20] font-bold uppercase tracking-wider text-[11px]">Tipologias Disponíveis:</div>
                      <div>{dev.typologies}</div>
                    </div>

                    {/* Features */}
                    {dev.features && dev.features.length > 0 && (
                      <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mb-4">
                        {dev.features.map((feat, i) => (
                          <div key={i} className="flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-[#C8A251] shrink-0" />
                            <span className="truncate">{feat}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <span className="text-[11px] uppercase tracking-wider text-gray-500 block">Valores a partir de</span>
                      <span className="font-editorial text-xl sm:text-2xl font-bold text-[#0B2B20]">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(dev.minPrice)}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      {hasVideo && (
                        <button
                          type="button"
                          onClick={() => setActiveVideoUrl(dev.videoUrl || dev.videos?.[0] || null)}
                          className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#C8A251] text-[#0B2B20] hover:bg-[#C8A251]/15 text-xs font-bold transition-all"
                        >
                          <Film className="w-4 h-4 text-[#C8A251]" />
                          <span className="hidden sm:inline">Ver Vídeo</span>
                        </button>
                      )}

                      <a
                        href={devWhatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20BA5A] text-white text-xs font-bold transition-all shadow-sm"
                      >
                        <MessageCircle className="w-4 h-4 fill-white" />
                        <span>Tabela no WhatsApp</span>
                      </a>

                      <button
                        onClick={() => onOpenLeadModal(undefined, 'visita')}
                        className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-[#0B2B20] hover:bg-[#133F30] text-[#C8A251] font-bold text-xs uppercase tracking-wider shadow-sm transition-all"
                      >
                        Agendar Apresentação
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
