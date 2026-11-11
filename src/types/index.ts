export type NegotiationType = 'venda' | 'aluguel' | 'lancamento';
export type PropertyType = 'casa' | 'apartamento' | 'cobertura' | 'terreno' | 'comercial';
export type DevelopmentStatus = 'lancamento' | 'em_obras' | 'pronto';
export type LeadStatus = 'novo' | 'em_atendimento' | 'visita_agendada' | 'proposta' | 'concluido' | 'arquivado';
export type LeadInterest = 'comprar' | 'alugar' | 'vender' | 'investir' | 'visita' | 'informacao';

export type PeopleCount = '1-2' | '3-4' | '5+' | 'familia';
export type LifeStage = 'estudante' | 'jovem_profissional' | 'casal' | 'familia' | 'investidor';
export type HousingPreference = 'exclusivo' | 'compartilhado' | 'flexivel';
export type LifestyleVibe = 'quieto_homeoffice' | 'movimento_urbano' | 'lazer_familia' | 'natureza' | 'pet_friendly';
export type LocationPriority = 'universidades' | 'metro_transporte' | 'bairro_tranquilo' | 'centro_vibrante' | 'escolas_parques';

export interface ClientProfile {
  freeTextQuery?: string;
  peopleCount?: PeopleCount;
  lifeStage?: LifeStage;
  isStudent?: boolean;
  nearUniversity?: boolean;
  housingPreference?: HousingPreference;
  lifestyle?: LifestyleVibe;
  locationPriority?: LocationPriority;
  maxBudget?: number;
  minBudget?: number;
  negotiationType?: NegotiationType | 'todos';
  preferredRegion?: string;
}

export interface SmartMatchResult {
  property: Property;
  score: number; // 0 to 100
  matchReason: string; // e.g. "Ideal para 2 estudantes: 350m da universidade, silencioso para estudo e fácil mobilidade."
  badgeLabel?: string;
  keyHighlights: string[];
}

export interface Property {
  id: string;
  title: string;
  slug: string;
  code: string;
  price: number;
  condoFee?: number;
  iptu?: number;
  negotiationType: NegotiationType;
  propertyType: PropertyType;
  neighborhood: string;
  city: string;
  state: string;
  address?: string;
  area: number; // m²
  builtArea?: number; // m²
  bedrooms: number;
  suites: number;
  bathrooms: number;
  parkingSpots: number;
  description: string;
  features: string[];
  featured: boolean;
  published: boolean;
  mainImage: string;
  gallery: string[];
  videoUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Development {
  id: string;
  name: string;
  slug: string;
  developer: string;
  neighborhood: string;
  city: string;
  state: string;
  description: string;
  minPrice: number;
  maxPrice?: number;
  typologies: string;
  features: string[];
  images: string[];
  status: DevelopmentStatus;
  featured: boolean;
  published: boolean;
  deliveryDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LandingPage {
  id: string;
  title: string;
  slug: string;
  headline: string;
  subheadline: string;
  targetType: 'property' | 'development' | 'custom';
  targetId?: string;
  bannerImage: string;
  gallery: string[];
  highlights: string[];
  published: boolean;
  viewsCount: number;
  leadsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email?: string;
  interestType: LeadInterest;
  propertyId?: string;
  propertyTitle?: string;
  message?: string;
  origin?: string;
  pageUrl?: string;
  campaign?: string;
  status: LeadStatus;
  notes?: string;
  createdAt: string;
}

export interface SiteSettings {
  id: string;
  brokerName: string;
  commercialName: string;
  creci: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  instagramUrl: string;
  facebookUrl?: string;
  linkedinUrl?: string;
  youtubeUrl?: string;
  bio: string;
  aboutExperience: string;
  heroTitle: string;
  heroSubtitle: string;
  heroBadge: string;
  primaryColor: string;
  logoUrl?: string;
  avatarUrl?: string;
  confirmationNotice?: string;
  updatedAt: string;
}

export interface AnalyticsEvent {
  id: string;
  eventType: 'page_view' | 'property_view' | 'whatsapp_click' | 'lead_submit' | 'share';
  targetId?: string;
  targetTitle?: string;
  pageUrl: string;
  referrer?: string;
  createdAt: string;
}
