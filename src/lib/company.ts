// Company/Owner Information
// This file centralizes all business information for easy updates

export const COMPANY_INFO = {
  // Owner Information
  owner: {
    name: 'Fongang Lamago Brank',
    email: 'brank493@gmail.com',
    phone: '+237 693 401 619',
    phoneRaw: '693401619',
    country: 'Cameroon',
    region: 'West Africa',
  },

  // Business Information
  business: {
    name: 'Brank Web Solutions',
    tagline: 'Professional Website Development',
    description: 'Professional website development services helping businesses establish their online presence with beautiful, functional websites.',
    fullDescription: 'We help businesses establish their online presence by connecting them with professional website development services. Our AI-powered platform makes it easy to get online and grow your business.',
  },

  // Contact
  contact: {
    email: 'brank493@gmail.com',
    phone: '+237 693 401 619',
    phoneLink: 'tel:+237693401619',
    emailLink: 'mailto:brank493@gmail.com',
    whatsappLink: 'https://wa.me/237693401619',
  },

  // Social Links (add your own)
  social: {
    whatsapp: 'https://wa.me/237693401619',
  },

  // Currency preferences (for African markets)
  currency: {
    primary: 'XAF', // CFA Franc Central Africa
    secondary: 'USD',
    supportedCurrencies: ['USD', 'EUR', 'XAF', 'XOF'],
  },
} as const;

// Helper function to get formatted phone
export function getFormattedPhone(): string {
  return COMPANY_INFO.owner.phone;
}

// Helper function to get mailto link
export function getEmailLink(): string {
  return `mailto:${COMPANY_INFO.contact.email}`;
}

// Helper function to get WhatsApp link
export function getWhatsAppLink(message?: string): string {
  const base = `https://wa.me/237${COMPANY_INFO.owner.phoneRaw}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export default COMPANY_INFO;
