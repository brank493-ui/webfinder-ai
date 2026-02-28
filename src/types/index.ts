// Type definitions for the Business Discovery Platform

export interface Business {
  id: string;
  placeId?: string;
  name: string;
  email?: string;
  address?: string;
  phone?: string;
  website?: string;
  category?: string;
  rating?: number;
  reviewCount?: number;
  latitude?: number;
  longitude?: number;
  hasWebsite: boolean;
  websiteStatus?: 'no_website' | 'active' | 'broken' | 'social_media';
  photoUrl?: string;
  country?: string;
  city?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Conversation {
  id: string;
  businessId: string;
  business?: Business;
  status: 'active' | 'completed' | 'declined';
  messages: ChatMessage[];
  brief?: ProjectBrief;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ProjectBrief {
  services?: string;
  style?: 'modern' | 'classic' | 'minimalist' | 'bold';
  colors?: string[];
  features?: string[];
  pages?: string[];
  domain?: string;
  notes?: string;
  tagline?: string;
  aboutText?: string;
}

export interface Project {
  id: string;
  businessId: string;
  business?: Business;
  package: 'standard' | 'pro' | 'premium';
  status: 'pending' | 'in_progress' | 'review' | 'completed' | 'cancelled';
  brief?: ProjectBrief;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  paymentMethod?: 'stripe' | 'orange_money' | 'mtn_money' | 'wave' | 'mpesa';
  stripePaymentId?: string;
  amount?: number;
  currency?: string;
  websiteUrl?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PricingPackage {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  highlighted?: boolean;
  badge?: string;
}

export interface SearchParams {
  location: string;
  category: string;
  radius: number;
}

export interface GooglePlaceResult {
  place_id: string;
  name: string;
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  rating?: number;
  user_ratings_total?: number;
  types?: string[];
  international_phone_number?: string;
  website?: string;
  photos?: Array<{
    photo_reference: string;
  }>;
}

export interface SearchResponse {
  success: boolean;
  businesses?: Business[];
  error?: string;
  total?: number;
}

export interface ChatRequest {
  businessId: string;
  message: string;
  conversationId?: string;
}

export interface ChatResponse {
  success: boolean;
  message?: ChatMessage;
  conversationId?: string;
  error?: string;
}

// Website Template Types
export interface WebsiteTemplate {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  previewImage?: string;
  previewUrl?: string;
  features: string[];
  isPremium: boolean;
  isActive?: boolean;
  layout: 'modern' | 'classic' | 'minimalist' | 'bold' | 'grid' | 'masonry';
  colorScheme: string[];
  sections: string[] | TemplateSection[];
}

export interface TemplateSection {
  id: string;
  type: 'hero' | 'about' | 'services' | 'gallery' | 'contact' | 'testimonials' | 'cta' | 'footer';
  required: boolean;
  order: number;
}

// Generated Website Types
export interface GeneratedWebsite {
  id: string;
  html: string;
  css: string;
  sections: GeneratedSection[];
  assets: { type: string; content: string; name: string }[];
}

export interface GeneratedSection {
  id: string;
  type: string;
  html: string;
}

// Workspace Types
export interface Workspace {
  id: string;
  status: string;
  paymentStatus: string;
  package: string;
  amount: number | null;
  createdAt: string;
  brief: ProjectBrief | null;
  business: {
    id: string;
    name: string;
    category: string | null;
    email: string | null;
    phone: string | null;
    address: string | null;
  };
}

// Dashboard Stats Types
export interface DashboardStats {
  totalBusinesses: number;
  businessesWithoutWebsite: number;
  totalProjects: number;
  pendingPayments: number;
  completedProjects: number;
  inProgressProjects: number;
  totalRevenue: number;
}

// Mobile Money Types
export interface MobileMoneyProvider {
  id: string;
  name: string;
  countries: string[];
  currencies: string[];
  logo: string;
  color: string;
}

export interface MobileMoneyPaymentRequest {
  provider: string;
  phoneNumber: string;
  amount: number;
  currency: string;
  reference: string;
  description: string;
}

export interface MobileMoneyPaymentResponse {
  success: boolean;
  transactionId?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  message?: string;
  ussdCode?: string;
}

// Store state types
export interface AppState {
  // Search state
  searchResults: Business[];
  isSearching: boolean;
  searchError: string | null;

  // Filter state
  websiteFilter: 'all' | 'no_website' | 'has_website';
  categoryFilter: string;

  // Chat state
  selectedBusiness: Business | null;
  isChatOpen: boolean;
  conversation: ChatMessage[];
  isAiTyping: boolean;

  // UI state
  selectedPackage: 'standard' | 'pro' | 'premium' | null;

  // Actions
  setSearchResults: (results: Business[]) => void;
  setIsSearching: (isSearching: boolean) => void;
  setSearchError: (error: string | null) => void;
  setWebsiteFilter: (filter: 'all' | 'no_website' | 'has_website') => void;
  setCategoryFilter: (category: string) => void;
  setSelectedBusiness: (business: Business | null) => void;
  setIsChatOpen: (isOpen: boolean) => void;
  addMessage: (message: ChatMessage) => void;
  setConversation: (messages: ChatMessage[]) => void;
  setIsAiTyping: (isTyping: boolean) => void;
  setSelectedPackage: (pkg: 'standard' | 'pro' | 'premium' | null) => void;
  clearConversation: () => void;
}

// Business Categories for search
export const BUSINESS_CATEGORIES = [
  { id: 'all', label: 'All Categories' },
  { id: 'restaurant', label: 'Restaurant' },
  { id: 'retail', label: 'Retail' },
  { id: 'health', label: 'Health' },
  { id: 'beauty', label: 'Beauty' },
  { id: 'auto', label: 'Auto' },
  { id: 'service', label: 'Service' },
  { id: 'professional', label: 'Professional' },
  { id: 'technology', label: 'Technology' },
  { id: 'education', label: 'Education' },
  { id: 'entertainment', label: 'Entertainment' },
] as const;

// Radius options for search
export const RADIUS_OPTIONS = [
  { value: 1000, label: '1 km' },
  { value: 5000, label: '5 km' },
  { value: 10000, label: '10 km' },
  { value: 25000, label: '25 km' },
  { value: 50000, label: '50 km' },
] as const;
