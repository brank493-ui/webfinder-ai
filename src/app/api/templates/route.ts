import { NextRequest, NextResponse } from 'next/server';

// Mock templates for development
const MOCK_TEMPLATES = [
  {
    id: '1',
    name: 'Business Starter',
    slug: 'business-starter',
    description: 'Clean and professional template perfect for small businesses and startups.',
    category: 'Business',
    layout: 'Classic',
    colorScheme: ['#2563EB', '#1E40AF', '#3B82F6', '#60A5FA'],
    features: ['Hero Section', 'Services Grid', 'Contact Form', 'About Page', 'Mobile Responsive'],
    sections: ['hero', 'services', 'about', 'contact', 'footer'],
    isPremium: false,
    isActive: true,
  },
  {
    id: '2',
    name: 'Restaurant Pro',
    slug: 'restaurant-pro',
    description: 'Elegant template designed for restaurants, cafes, and food businesses.',
    category: 'Restaurant',
    layout: 'Modern',
    colorScheme: ['#DC2626', '#991B1B', '#F59E0B', '#FBBF24'],
    features: ['Menu Display', 'Reservation System', 'Photo Gallery', 'Location Map', 'Online Ordering'],
    sections: ['hero', 'menu', 'gallery', 'about', 'reservation', 'contact', 'footer'],
    isPremium: true,
    isActive: true,
  },
  {
    id: '3',
    name: 'Health & Wellness',
    slug: 'health-wellness',
    description: 'Serene template for clinics, spas, and wellness centers.',
    category: 'Health',
    layout: 'Minimalist',
    colorScheme: ['#059669', '#047857', '#34D399', '#6EE7B7'],
    features: ['Appointment Booking', 'Services List', 'Team Profiles', 'Testimonials', 'Blog'],
    sections: ['hero', 'services', 'team', 'testimonials', 'booking', 'contact', 'footer'],
    isPremium: true,
    isActive: true,
  },
  {
    id: '4',
    name: 'E-Commerce Basic',
    slug: 'ecommerce-basic',
    description: 'Simple online store template for small shops and retailers.',
    category: 'Retail',
    layout: 'Grid',
    colorScheme: ['#7C3AED', '#5B21B6', '#8B5CF6', '#A78BFA'],
    features: ['Product Catalog', 'Shopping Cart', 'Checkout', 'Category Filter', 'Search'],
    sections: ['hero', 'featured', 'categories', 'products', 'about', 'contact', 'footer'],
    isPremium: false,
    isActive: true,
  },
  {
    id: '5',
    name: 'Creative Portfolio',
    slug: 'creative-portfolio',
    description: 'Stunning template for photographers, designers, and artists.',
    category: 'Creative',
    layout: 'Masonry',
    colorScheme: ['#18181B', '#27272A', '#71717A', '#A1A1AA'],
    features: ['Portfolio Gallery', 'Project Showcase', 'Client Testimonials', 'Contact Form', 'Social Links'],
    sections: ['hero', 'portfolio', 'about', 'services', 'testimonials', 'contact', 'footer'],
    isPremium: true,
    isActive: true,
  },
  {
    id: '6',
    name: 'Real Estate Pro',
    slug: 'real-estate-pro',
    description: 'Professional template for real estate agents and property listings.',
    category: 'Real Estate',
    layout: 'Modern',
    colorScheme: ['#0891B2', '#0E7490', '#22D3EE', '#67E8F9'],
    features: ['Property Listings', 'Search Filters', 'Agent Profiles', 'Mortgage Calculator', 'Virtual Tours'],
    sections: ['hero', 'search', 'featured', 'listings', 'agents', 'about', 'contact', 'footer'],
    isPremium: true,
    isActive: true,
  },
  {
    id: '7',
    name: 'Consulting Firm',
    slug: 'consulting-firm',
    description: 'Professional template for consultants and business services.',
    category: 'Business',
    layout: 'Classic',
    colorScheme: ['#1F2937', '#111827', '#4B5563', '#9CA3AF'],
    features: ['Team Directory', 'Case Studies', 'Service Details', 'Client Logos', 'Newsletter'],
    sections: ['hero', 'services', 'case-studies', 'team', 'clients', 'contact', 'footer'],
    isPremium: false,
    isActive: true,
  },
  {
    id: '8',
    name: 'Fitness Center',
    slug: 'fitness-center',
    description: 'Dynamic template for gyms, fitness centers, and personal trainers.',
    category: 'Health',
    layout: 'Bold',
    colorScheme: ['#EA580C', '#C2410C', '#FB923C', '#FDBA74'],
    features: ['Class Schedule', 'Membership Plans', 'Trainer Profiles', 'BMI Calculator', 'Blog'],
    sections: ['hero', 'classes', 'trainers', 'pricing', 'testimonials', 'contact', 'footer'],
    isPremium: true,
    isActive: true,
  },
  {
    id: '9',
    name: 'Auto Services',
    slug: 'auto-services',
    description: 'Perfect template for auto repair shops, car dealers, and mechanics.',
    category: 'Automotive',
    layout: 'Classic',
    colorScheme: ['#B91C1C', '#7F1D1D', '#EF4444', '#F87171'],
    features: ['Service Catalog', 'Online Booking', 'Price Calculator', 'Vehicle Gallery', 'Reviews'],
    sections: ['hero', 'services', 'gallery', 'pricing', 'booking', 'reviews', 'contact', 'footer'],
    isPremium: false,
    isActive: true,
  },
  {
    id: '10',
    name: 'Law Firm Elite',
    slug: 'law-firm-elite',
    description: 'Elegant template for law firms and legal professionals.',
    category: 'Legal',
    layout: 'Classic',
    colorScheme: ['#1E3A5F', '#0F172A', '#3B82F6', '#60A5FA'],
    features: ['Practice Areas', 'Attorney Profiles', 'Case Results', 'Client Testimonials', 'Free Consultation'],
    sections: ['hero', 'practice-areas', 'team', 'case-results', 'testimonials', 'contact', 'footer'],
    isPremium: true,
    isActive: true,
  },
  {
    id: '11',
    name: 'Beauty Salon',
    slug: 'beauty-salon',
    description: 'Elegant template for salons, spas, and beauty professionals.',
    category: 'Beauty',
    layout: 'Minimalist',
    colorScheme: ['#EC4899', '#BE185D', '#F472B6', '#F9A8D4'],
    features: ['Service Menu', 'Online Booking', 'Gallery', 'Stylist Profiles', 'Gift Cards'],
    sections: ['hero', 'services', 'gallery', 'team', 'booking', 'pricing', 'contact', 'footer'],
    isPremium: true,
    isActive: true,
  },
  {
    id: '12',
    name: 'Tech Startup',
    slug: 'tech-startup',
    description: 'Modern template for tech companies and SaaS products.',
    category: 'Technology',
    layout: 'Modern',
    colorScheme: ['#6366F1', '#4338CA', '#818CF8', '#A5B4FC'],
    features: ['Product Showcase', 'Pricing Table', 'Feature Grid', 'Customer Stories', 'API Docs Link'],
    sections: ['hero', 'features', 'product', 'pricing', 'testimonials', 'faq', 'contact', 'footer'],
    isPremium: false,
    isActive: true,
  },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const premium = searchParams.get('premium');

    let templates = [...MOCK_TEMPLATES];

    // Filter by category
    if (category && category !== 'all') {
      templates = templates.filter(
        (t) => t.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Filter by premium status
    if (premium === 'true') {
      templates = templates.filter((t) => t.isPremium);
    } else if (premium === 'false') {
      templates = templates.filter((t) => !t.isPremium);
    }

    return NextResponse.json({
      success: true,
      templates,
      total: templates.length,
    });
  } catch (error) {
    console.error('Templates fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch templates' },
      { status: 500 }
    );
  }
}
