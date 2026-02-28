// Pricing packages data - can be safely imported on client side

export interface PricingPackage {
  id: string;
  name: string;
  price: number;
  priceCFA: number;
  description: string;
  features: string[];
  highlighted?: boolean;
  badge?: string;
}

const USD_TO_CFA = 612; // Exchange rate

export const PRICING_PACKAGES: PricingPackage[] = [
  {
    id: 'standard',
    name: 'Standard',
    price: 149,
    priceCFA: 149 * USD_TO_CFA,
    description: 'Perfect for getting your business online',
    features: [
      'Up to 5 pages',
      'Mobile responsive design',
      'Contact form',
      '1 year hosting included',
      'Basic SEO setup',
      '30 days email support',
      'Social media integration',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 399,
    priceCFA: 399 * USD_TO_CFA,
    description: 'Recommended for growing businesses',
    features: [
      'Up to 10 pages',
      'Semi-custom design',
      'Booking/Appointment system',
      'Photo gallery',
      'Custom domain ($15 value)',
      'Full SEO optimization',
      '90 days email & chat support',
      '3 content updates',
      'Analytics dashboard',
    ],
    highlighted: true,
    badge: 'Most Popular',
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 999,
    priceCFA: 999 * USD_TO_CFA,
    description: 'Complete business solution with e-commerce',
    features: [
      'Unlimited pages',
      'Fully custom design',
      'E-commerce functionality',
      'Payment integration',
      'Custom domain + SSL',
      'Priority support for 1 year',
      'Unlimited content updates',
      'Advanced analytics',
      'Multi-language support',
      'CRM integration',
      'Newsletter system',
    ],
    badge: 'Best Value',
  },
];

// Package colors for UI
export const PACKAGE_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  standard: {
    bg: 'bg-gray-50 dark:bg-gray-800/50',
    border: 'border-gray-200 dark:border-gray-700',
    text: 'text-gray-600',
  },
  pro: {
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    border: 'border-blue-500',
    text: 'text-blue-600',
  },
  premium: {
    bg: 'bg-purple-50 dark:bg-purple-900/20',
    border: 'border-purple-500',
    text: 'text-purple-600',
  },
};

// Get package by ID
export function getPackageById(id: string): PricingPackage | undefined {
  return PRICING_PACKAGES.find((p) => p.id === id);
}

// Get price in different currencies (approximate conversion)
export function getPriceInCurrency(priceUSD: number, currency: string): number {
  const rates: Record<string, number> = {
    USD: 1,
    EUR: 0.92,
    GBP: 0.79,
    XOF: 610, // CFA Franc
    XAF: 610,
    KES: 154, // Kenyan Shilling
    GHS: 15, // Ghanaian Cedi
    UGX: 3800, // Ugandan Shilling
    RWF: 1280, // Rwandan Franc
    ZAR: 18, // South African Rand
  };
  return Math.round(priceUSD * (rates[currency] || 1));
}

// Format currency
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  const symbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    XOF: 'CFA',
    XAF: 'CFA',
    KES: 'KSh',
    GHS: 'GH₵',
    UGX: 'USh',
    RWF: 'FRw',
    ZAR: 'R',
  };

  const symbol = symbols[currency] || currency;
  return `${symbol}${amount.toLocaleString()}`;
}
