// Mobile Money Payment Integration Configuration

export interface MobileMoneyProvider {
  id: string;
  name: string;
  countries: string[];
  currencies: string[];
  logo: string;
  color: string;
}

export const MOBILE_MONEY_PROVIDERS: MobileMoneyProvider[] = [
  {
    id: 'orange_money',
    name: 'Orange Money',
    countries: [
      'Senegal', 'Ivory Coast', 'Mali', 'Burkina Faso',
      'Niger', 'Guinea', 'Guinea-Bissau', 'Cameroon',
      'Madagascar', 'Egypt', 'Tunisia', 'Morocco',
      'Botswana', 'Jordan', 'Liberia', 'Central African Republic',
      'Sierra Leone', 'Uganda'
    ],
    currencies: ['XOF', 'XAF', 'MGA', 'EGP', 'TND', 'MAD', 'BWP', 'JOD', 'LRD', 'UGX'],
    logo: '/payments/orange-money.png',
    color: '#FF6600',
  },
  {
    id: 'mtn_money',
    name: 'MTN Mobile Money',
    countries: [
      'Uganda', 'Rwanda', 'Ghana', 'Cameroon',
      'Benin', 'Ivory Coast', 'Guinea', 'Liberia',
      'Nigeria', 'South Africa', 'Zambia', 'Swaziland',
      'Congo', 'Syria', 'Afghanistan'
    ],
    currencies: ['UGX', 'RWF', 'GHS', 'XAF', 'XOF', 'NGN', 'ZAR', 'ZMW', 'SYP', 'AFN'],
    logo: '/payments/mtn-money.png',
    color: '#FFCC00',
  },
  {
    id: 'wave',
    name: 'Wave',
    countries: ['Senegal', 'Ivory Coast'],
    currencies: ['XOF'],
    logo: '/payments/wave.png',
    color: '#1DC8F2',
  },
  {
    id: 'mpesa',
    name: 'M-Pesa',
    countries: [
      'Kenya', 'Tanzania', 'Ghana', 'Egypt',
      'Mozambique', 'Lesotho', 'Democratic Republic of Congo',
      'Romania', 'Albania'
    ],
    currencies: ['KES', 'TZS', 'GHS', 'EGP', 'MZN', 'LSL', 'CDF', 'RON', 'ALL'],
    logo: '/payments/mpesa.png',
    color: '#00A651',
  },
];

// Payment request interface
export interface MobileMoneyPaymentRequest {
  provider: string;
  phoneNumber: string;
  amount: number;
  currency: string;
  reference: string;
  description: string;
}

// Payment response interface
export interface MobileMoneyPaymentResponse {
  success: boolean;
  transactionId?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  message?: string;
  ussdCode?: string; // For USSD-based payments
}

// Generate mock USSD code for demo
export function generateUSSDCode(provider: string, amount: number, reference: string): string {
  const codes: Record<string, string> = {
    orange_money: `#144*82*${amount}*${reference.slice(-4)}#`,
    mtn_money: `*165*2*${amount}*${reference.slice(-4)}#`,
    wave: `*120#${reference.slice(-6)}`,
    mpesa: `*234*${amount}*${reference.slice(-4)}#`,
  };
  return codes[provider] || '*123#';
}

// Simulate mobile money payment (for demo without real API)
export async function initiateMobileMoneyPayment(
  request: MobileMoneyPaymentRequest
): Promise<MobileMoneyPaymentResponse> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Validate phone number format (basic validation)
  const phoneRegex = /^\+?[1-9]\d{8,14}$/;
  if (!phoneRegex.test(request.phoneNumber.replace(/[\s-]/g, ''))) {
    return {
      success: false,
      status: 'failed',
      message: 'Invalid phone number format',
    };
  }

  // Generate mock transaction ID
  const transactionId = `${request.provider.toUpperCase()}-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

  // Generate USSD code for user to complete payment
  const ussdCode = generateUSSDCode(request.provider, request.amount, transactionId);

  return {
    success: true,
    transactionId,
    status: 'pending',
    message: `Payment initiated. Please complete using USSD code: ${ussdCode}`,
    ussdCode,
  };
}

// Check payment status (mock)
export async function checkMobileMoneyStatus(
  transactionId: string
): Promise<{ status: 'pending' | 'processing' | 'completed' | 'failed'; message: string }> {
  // Simulate status check
  await new Promise((resolve) => setTimeout(resolve, 500));

  // For demo, randomly complete payments after 30 seconds
  const timestamp = parseInt(transactionId.split('-')[1] || '0');
  const elapsed = Date.now() - timestamp;

  if (elapsed > 30000) {
    // After 30 seconds, mark as completed for demo
    return {
      status: 'completed',
      message: 'Payment successfully received',
    };
  }

  return {
    status: 'pending',
    message: 'Awaiting payment confirmation',
  };
}

// Detect provider from phone number prefix
export function detectProviderFromPhone(phoneNumber: string): MobileMoneyProvider | null {
  const cleanNumber = phoneNumber.replace(/[\s+-]/g, '');

  // Country code + prefix mappings (simplified)
  const providerPrefixes: Record<string, string[]> = {
    orange_money: ['22177', '22178', '22507', '22508', '2237', '2267'], // Senegal, Ivory Coast, Mali, Burkina
    mtn_money: ['25677', '25678', '2507', '23324', '23325', '2376'], // Uganda, Rwanda, Ghana, Cameroon
    wave: ['22178', '22507'], // Senegal, Ivory Coast
    mpesa: ['2547', '2557', '2335', '2010'], // Kenya, Tanzania, Ghana, Egypt
  };

  for (const [providerId, prefixes] of Object.entries(providerPrefixes)) {
    if (prefixes.some((prefix) => cleanNumber.startsWith(prefix))) {
      return MOBILE_MONEY_PROVIDERS.find((p) => p.id === providerId) || null;
    }
  }

  return null;
}

// Get supported currencies for a country
export function getCurrenciesForCountry(country: string): string[] {
  const currencies: string[] = [];
  for (const provider of MOBILE_MONEY_PROVIDERS) {
    if (provider.countries.includes(country)) {
      currencies.push(...provider.currencies);
    }
  }
  return [...new Set(currencies)];
}

// Get providers for a country
export function getProvidersForCountry(country: string): MobileMoneyProvider[] {
  return MOBILE_MONEY_PROVIDERS.filter((p) => p.countries.includes(country));
}
