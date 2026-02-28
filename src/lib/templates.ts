// Website templates for different business categories

export interface WebsiteTemplate {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  previewImage: string;
  features: string[];
  isPremium: boolean;
  layout: 'modern' | 'classic' | 'minimalist' | 'bold';
  colorScheme: string[];
  sections: TemplateSection[];
}

export interface TemplateSection {
  id: string;
  type: 'hero' | 'about' | 'services' | 'gallery' | 'contact' | 'testimonials' | 'cta' | 'footer';
  required: boolean;
  order: number;
}

export const WEBSITE_TEMPLATES: WebsiteTemplate[] = [
  // Restaurant Templates
  {
    id: 'resto-modern',
    name: 'Modern Restaurant',
    slug: 'modern-restaurant',
    description: 'Sleek and modern design perfect for contemporary restaurants, cafes, and bistros',
    category: 'restaurant',
    previewImage: '/templates/resto-modern.png',
    features: ['Menu display', 'Online reservations', 'Photo gallery', 'Location map', 'Opening hours'],
    isPremium: false,
    layout: 'modern',
    colorScheme: ['#1a1a2e', '#e94560', '#ffffff', '#f5f5f5'],
    sections: [
      { id: 'hero', type: 'hero', required: true, order: 1 },
      { id: 'about', type: 'about', required: false, order: 2 },
      { id: 'menu', type: 'services', required: true, order: 3 },
      { id: 'gallery', type: 'gallery', required: false, order: 4 },
      { id: 'testimonials', type: 'testimonials', required: false, order: 5 },
      { id: 'contact', type: 'contact', required: true, order: 6 },
      { id: 'footer', type: 'footer', required: true, order: 7 },
    ],
  },
  {
    id: 'resto-elegant',
    name: 'Elegant Dining',
    slug: 'elegant-dining',
    description: 'Sophisticated design for fine dining establishments and upscale restaurants',
    category: 'restaurant',
    previewImage: '/templates/resto-elegant.png',
    features: ['Table booking system', 'Wine menu', 'Chef showcase', 'Event calendar', 'Gift cards'],
    isPremium: true,
    layout: 'classic',
    colorScheme: ['#2c3e50', '#c0392b', '#ecf0f1', '#d4af37'],
    sections: [
      { id: 'hero', type: 'hero', required: true, order: 1 },
      { id: 'about', type: 'about', required: true, order: 2 },
      { id: 'menu', type: 'services', required: true, order: 3 },
      { id: 'gallery', type: 'gallery', required: true, order: 4 },
      { id: 'testimonials', type: 'testimonials', required: false, order: 5 },
      { id: 'contact', type: 'contact', required: true, order: 6 },
      { id: 'footer', type: 'footer', required: true, order: 7 },
    ],
  },

  // Retail Templates
  {
    id: 'retail-shop',
    name: 'Retail Store',
    slug: 'retail-store',
    description: 'Clean and organized layout for retail stores and boutiques',
    category: 'retail',
    previewImage: '/templates/retail-shop.png',
    features: ['Product catalog', 'Store locator', 'Promotions', 'Newsletter signup', 'Social links'],
    isPremium: false,
    layout: 'modern',
    colorScheme: ['#2d3436', '#00b894', '#ffffff', '#dfe6e9'],
    sections: [
      { id: 'hero', type: 'hero', required: true, order: 1 },
      { id: 'products', type: 'services', required: true, order: 2 },
      { id: 'about', type: 'about', required: false, order: 3 },
      { id: 'gallery', type: 'gallery', required: false, order: 4 },
      { id: 'contact', type: 'contact', required: true, order: 5 },
      { id: 'footer', type: 'footer', required: true, order: 6 },
    ],
  },
  {
    id: 'retail-ecommerce',
    name: 'E-Commerce Store',
    slug: 'ecommerce-store',
    description: 'Full-featured online store with shopping cart and checkout',
    category: 'retail',
    previewImage: '/templates/retail-ecommerce.png',
    features: ['Product catalog', 'Shopping cart', 'Secure checkout', 'Order tracking', 'Customer accounts'],
    isPremium: true,
    layout: 'modern',
    colorScheme: ['#6c5ce7', '#00cec9', '#ffffff', '#f8f9fa'],
    sections: [
      { id: 'hero', type: 'hero', required: true, order: 1 },
      { id: 'products', type: 'services', required: true, order: 2 },
      { id: 'testimonials', type: 'testimonials', required: false, order: 3 },
      { id: 'cta', type: 'cta', required: true, order: 4 },
      { id: 'contact', type: 'contact', required: true, order: 5 },
      { id: 'footer', type: 'footer', required: true, order: 6 },
    ],
  },

  // Health & Medical Templates
  {
    id: 'health-clinic',
    name: 'Medical Clinic',
    slug: 'medical-clinic',
    description: 'Professional design for healthcare providers and medical clinics',
    category: 'health',
    previewImage: '/templates/health-clinic.png',
    features: ['Appointment booking', 'Doctor profiles', 'Services list', 'Insurance info', 'Patient forms'],
    isPremium: false,
    layout: 'classic',
    colorScheme: ['#0077b6', '#00b4d8', '#ffffff', '#caf0f8'],
    sections: [
      { id: 'hero', type: 'hero', required: true, order: 1 },
      { id: 'services', type: 'services', required: true, order: 2 },
      { id: 'about', type: 'about', required: true, order: 3 },
      { id: 'gallery', type: 'gallery', required: false, order: 4 },
      { id: 'contact', type: 'contact', required: true, order: 5 },
      { id: 'footer', type: 'footer', required: true, order: 6 },
    ],
  },
  {
    id: 'health-spa',
    name: 'Wellness Spa',
    slug: 'wellness-spa',
    description: 'Relaxing design for spas, wellness centers, and beauty salons',
    category: 'health',
    previewImage: '/templates/health-spa.png',
    features: ['Service menu', 'Online booking', 'Gift certificates', 'Photo gallery', 'Special offers'],
    isPremium: false,
    layout: 'minimalist',
    colorScheme: ['#606c38', '#dda15e', '#fefae0', '#283618'],
    sections: [
      { id: 'hero', type: 'hero', required: true, order: 1 },
      { id: 'services', type: 'services', required: true, order: 2 },
      { id: 'about', type: 'about', required: false, order: 3 },
      { id: 'gallery', type: 'gallery', required: true, order: 4 },
      { id: 'testimonials', type: 'testimonials', required: false, order: 5 },
      { id: 'contact', type: 'contact', required: true, order: 6 },
      { id: 'footer', type: 'footer', required: true, order: 7 },
    ],
  },

  // Service Business Templates
  {
    id: 'service-pro',
    name: 'Professional Services',
    slug: 'professional-services',
    description: 'Clean design for consultants, lawyers, accountants, and professionals',
    category: 'professional',
    previewImage: '/templates/service-pro.png',
    features: ['Team profiles', 'Service areas', 'Case studies', 'Contact form', 'Blog'],
    isPremium: false,
    layout: 'classic',
    colorScheme: ['#1b263b', '#415a77', '#e0e1dd', '#778da9'],
    sections: [
      { id: 'hero', type: 'hero', required: true, order: 1 },
      { id: 'services', type: 'services', required: true, order: 2 },
      { id: 'about', type: 'about', required: true, order: 3 },
      { id: 'testimonials', type: 'testimonials', required: false, order: 4 },
      { id: 'contact', type: 'contact', required: true, order: 5 },
      { id: 'footer', type: 'footer', required: true, order: 6 },
    ],
  },
  {
    id: 'service-creative',
    name: 'Creative Agency',
    slug: 'creative-agency',
    description: 'Bold and creative design for agencies and creative businesses',
    category: 'professional',
    previewImage: '/templates/service-creative.png',
    features: ['Portfolio', 'Client logos', 'Process showcase', 'Team section', 'Pricing tables'],
    isPremium: true,
    layout: 'bold',
    colorScheme: ['#0d1b2a', '#ff6b6b', '#f8f9fa', '#ffd93d'],
    sections: [
      { id: 'hero', type: 'hero', required: true, order: 1 },
      { id: 'services', type: 'services', required: true, order: 2 },
      { id: 'gallery', type: 'gallery', required: true, order: 3 },
      { id: 'about', type: 'about', required: false, order: 4 },
      { id: 'testimonials', type: 'testimonials', required: true, order: 5 },
      { id: 'cta', type: 'cta', required: true, order: 6 },
      { id: 'contact', type: 'contact', required: true, order: 7 },
      { id: 'footer', type: 'footer', required: true, order: 8 },
    ],
  },

  // Beauty & Personal Care
  {
    id: 'beauty-salon',
    name: 'Beauty Salon',
    slug: 'beauty-salon',
    description: 'Elegant design for hair salons, beauty parlors, and nail studios',
    category: 'beauty',
    previewImage: '/templates/beauty-salon.png',
    features: ['Service menu', 'Online booking', 'Stylist profiles', 'Gallery', 'Gift cards'],
    isPremium: false,
    layout: 'minimalist',
    colorScheme: ['#f8e8ee', '#c9a7c4', '#5c5c5c', '#d4a5a5'],
    sections: [
      { id: 'hero', type: 'hero', required: true, order: 1 },
      { id: 'services', type: 'services', required: true, order: 2 },
      { id: 'gallery', type: 'gallery', required: true, order: 3 },
      { id: 'about', type: 'about', required: false, order: 4 },
      { id: 'testimonials', type: 'testimonials', required: false, order: 5 },
      { id: 'contact', type: 'contact', required: true, order: 6 },
      { id: 'footer', type: 'footer', required: true, order: 7 },
    ],
  },

  // Auto Services
  {
    id: 'auto-garage',
    name: 'Auto Service',
    slug: 'auto-service',
    description: 'Professional design for auto repair shops, garages, and car services',
    category: 'auto',
    previewImage: '/templates/auto-garage.png',
    features: ['Services list', 'Appointment booking', 'Price estimates', 'Location map', 'Reviews'],
    isPremium: false,
    layout: 'modern',
    colorScheme: ['#212529', '#fca311', '#ffffff', '#e9ecef'],
    sections: [
      { id: 'hero', type: 'hero', required: true, order: 1 },
      { id: 'services', type: 'services', required: true, order: 2 },
      { id: 'about', type: 'about', required: false, order: 3 },
      { id: 'gallery', type: 'gallery', required: false, order: 4 },
      { id: 'testimonials', type: 'testimonials', required: false, order: 5 },
      { id: 'contact', type: 'contact', required: true, order: 6 },
      { id: 'footer', type: 'footer', required: true, order: 7 },
    ],
  },
];

// Get templates by category
export function getTemplatesByCategory(category: string): WebsiteTemplate[] {
  return WEBSITE_TEMPLATES.filter(
    (t) => t.category === category || t.category === 'all'
  );
}

// Get template by slug
export function getTemplateBySlug(slug: string): WebsiteTemplate | undefined {
  return WEBSITE_TEMPLATES.find((t) => t.slug === slug);
}

// Get all categories
export function getTemplateCategories(): string[] {
  return [...new Set(WEBSITE_TEMPLATES.map((t) => t.category))];
}

// Get free templates
export function getFreeTemplates(): WebsiteTemplate[] {
  return WEBSITE_TEMPLATES.filter((t) => !t.isPremium);
}

// Get premium templates
export function getPremiumTemplates(): WebsiteTemplate[] {
  return WEBSITE_TEMPLATES.filter((t) => t.isPremium);
}
