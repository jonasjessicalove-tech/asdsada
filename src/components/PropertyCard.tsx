import React from 'react';
import { Property } from '../types';
import { useSettings } from '../contexts/SettingsContext';
import { Bed, Bath, Car, Maximize2, MapPin, MessageCircle, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { trackEvent } from '../lib/analytics';

interface PropertyCardProps {
  property: Property;
  onSelect: (slug: string) => void;
  onOpenLeadModal?: (property: Property) => void;
  matchScore?: number;
  matchReason?: string;
  badgeLabel?: string;
  keyHighlights?: string[];
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onSelect,
  onOpenLeadModal,
  matchScore,
  matchReason,
  badgeLabel,
  keyHighlights,
}) => {
  const { settings } = useSettings();

  const formatPrice = (val: number, type: Property['negotiationType']) => {
    const formatted = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0
    }).format(val);

    return type === 'aluguel' ? `${formatted} /mês` : formatted;
  };

  const cleanWhatsapp = (settings.whatsapp || '').replace(/\D/g, '');
  const directWhatsappText = `Olá Sávio! Gostaria de mais informações sobre o imóvel "${property.title}" (Cód: ${property.code}) anunciado no site.`;
  const whatsappUrl = `https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(directWhatsappText)}`;

  const handleCardClick = () => {
    trackEvent('property_view', {
      targetId: property.id,
      targetTitle: property.title,
    });
    onSelect(property.slug);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="h-full"
    >
      <div className="group bg-white rounded-2xl overflow-hidden border border-gray-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full relative">
        {/* MATCH SCORE PILL (Top Floating Banner if Match exists) */}
        {matchScore && matchScore > 0 && (
          <div className="bg-gradient-to-r from-[#0B2B20] to-[#153D2F] text-white px-4 py-1.5 flex items-center justify-between text-xs font-semibold border-b border-[#C8A251]/30">
            <span className="flex items-center gap-1.5 text-[#C8A251] font-bold">
              <Sparkles className="w-3.5 h-3.5 fill-[#C8A251]" />
              <span>{badgeLabel || `${matchScore}% Match com seu perfil`}</span>
            </span>
            <span className="text-[11px] text-gray-300 font-light">
              Recomendação Consultiva
            </span>
          </div>
        )}

        {/* Image Container with Badges */}
        <div
          onClick={handleCardClick}
          className="relative aspect-[16/10] overflow-hidden bg-gray-100 cursor-pointer"
        >
          <img
            src={property.mainImage || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'}
            alt={property.title}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            loading="lazy"
          />

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

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-70 group-hover:opacity-85 transition-opacity" />

          {/* Badges Top Left & Right */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-xs z-10">
            <span className="px-2.5 py-1 bg-[#0B2B20]/90 text-white font-medium rounded-lg backdrop-blur-sm text-xs">
              {property.negotiationType === 'venda' ? 'Venda' : property.negotiationType === 'aluguel' ? 'Locação' : 'Lançamento'}
            </span>
            {property.featured && (
              <span className="px-2.5 py-1 bg-[#C8A251]/95 text-[#0B2B20] font-bold rounded-lg backdrop-blur-sm flex items-center gap-1 shadow-sm text-xs">
                <Sparkles className="w-3 h-3" />
                <span>Destaque</span>
              </span>
            )}
          </div>

          {/* Price Overlay on Bottom */}
          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-white z-10">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-gray-300 block font-medium">
                {property.negotiationType === 'aluguel' ? 'Valor Locação' : 'Valor de Venda'}
              </span>
              <span className="text-xl font-bold font-editorial tracking-wide">
                {formatPrice(property.price, property.negotiationType)}
              </span>
            </div>
            <div className="text-xs font-mono text-gray-200 bg-black/50 px-2 py-0.5 rounded backdrop-blur-xs">
              {property.code}
            </div>
          </div>
        </div>

        {/* Content Details */}
        <div className="p-5 flex flex-col flex-1 justify-between space-y-4">
          <div>
            {/* Title */}
            <h3
              onClick={handleCardClick}
              className="text-lg font-bold text-[#0B2B20] hover:text-[#C8A251] transition-colors cursor-pointer font-editorial line-clamp-1 mb-1.5"
            >
              {property.title}
            </h3>

            {/* Location */}
            <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
              <MapPin className="w-3.5 h-3.5 text-[#C8A251] shrink-0" />
              <span className="truncate">{property.neighborhood}, {property.city} - {property.state || 'SP'}</span>
            </div>

            {/* CONTEXTUAL MATCH REASON BOX (Why this fits the user) */}
            {matchReason && (
              <div className="p-3 rounded-xl bg-emerald-50/80 border border-emerald-200/80 text-xs text-emerald-950 mb-3.5 space-y-1">
                <div className="font-bold flex items-center gap-1 text-emerald-800 text-[11px] uppercase tracking-wider">
                  <Sparkles className="w-3 h-3 text-[#C8A251]" />
                  <span>Por que combina com você:</span>
                </div>
                <p className="text-xs text-emerald-900 leading-snug font-medium">
                  {matchReason.replace('Por que combina com você: ', '')}
                </p>
                {keyHighlights && keyHighlights.length > 0 && (
                  <div className="pt-1 flex flex-wrap gap-1">
                    {keyHighlights.map((hl, i) => (
                      <span key={i} className="inline-flex items-center gap-1 text-[10px] bg-white text-emerald-800 font-semibold px-2 py-0.5 rounded border border-emerald-200">
                        <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                        {hl}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Specs row with unboxed discipline and · separators */}
            <div className="flex items-center flex-wrap gap-x-3 gap-y-1 text-xs text-gray-600 pb-3 border-b border-gray-100">
              <div className="flex items-center gap-1">
                <Maximize2 className="w-3.5 h-3.5 text-gray-400" />
                <span className="font-medium text-gray-800">{property.area} m²</span>
              </div>
              <span className="text-gray-300">·</span>
              <div className="flex items-center gap-1">
                <Bed className="w-3.5 h-3.5 text-gray-400" />
                <span>{property.bedrooms} {property.bedrooms === 1 ? 'quarto' : 'quartos'}</span>
              </div>
              {property.bathrooms && (
                <>
                  <span className="text-gray-300">·</span>
                  <div className="flex items-center gap-1">
                    <Bath className="w-3.5 h-3.5 text-gray-400" />
                    <span>{property.bathrooms} banh.</span>
                  </div>
                </>
              )}
              {property.parkingSpots > 0 && (
                <>
                  <span className="text-gray-300">·</span>
                  <div className="flex items-center gap-1">
                    <Car className="w-3.5 h-3.5 text-gray-400" />
                    <span>{property.parkingSpots} {property.parkingSpots === 1 ? 'vaga' : 'vagas'}</span>
                  </div>
                </>
              )}
            </div>

            {/* Description (shorter when matchReason is visible) */}
            <p className={`text-xs text-gray-600 leading-relaxed mt-2.5 ${matchReason ? 'line-clamp-1' : 'line-clamp-2'}`}>
              {property.description}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100 mt-auto">
            <button
              onClick={handleCardClick}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 text-xs font-semibold text-[#0B2B20] bg-gray-100 hover:bg-[#0B2B20] hover:text-white rounded-xl transition-all group/btn"
            >
              <span>Conhecer Imóvel</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
            </button>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent('whatsapp_click', { targetId: property.id, targetTitle: property.title })}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 text-xs font-semibold text-white bg-[#25D366] hover:bg-[#20BA5A] rounded-xl transition-colors shadow-xs"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-current" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
