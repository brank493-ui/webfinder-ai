'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  CreditCard,
  Building,
  Copy,
  CheckCircle,
  AlertCircle,
  Clock,
  Shield,
  ArrowRight,
  Loader2,
  Wallet,
  Lock,
  Smartphone,
  Fingerprint,
  KeyRound,
} from 'lucide-react';
import { COMPANY_INFO } from '@/lib/company';

interface PaymentSelectorProps {
  selectedPackage: string;
  amount: number;
  onPaymentInitiated: (paymentData: PaymentData) => void;
}

interface PaymentData {
  method: 'bank' | 'mtn' | 'orange' | 'wave' | 'visa' | 'mastercard' | 'paypal';
  amount: number;
  currency: string;
  packageName: string;
  phoneNumber?: string;
  cardNumber?: string;
  transactionId?: string;
}

const PACKAGE_PRICES: Record<string, number> = {
  standard: 149,
  pro: 399,
  premium: 999,
};

// Currency conversion rates (approximate)
const CURRENCY_RATES: Record<string, { rate: number; symbol: string }> = {
  USD: { rate: 1, symbol: '$' },
  XAF: { rate: 610, symbol: 'CFA' },
  XOF: { rate: 610, symbol: 'CFA' },
  EUR: { rate: 0.92, symbol: '€' },
};

// Bank Details
const BANK_DETAILS = {
  bankName: 'Your Bank Name',
  accountName: 'Fongang Lamago Brank',
  accountNumber: 'XXXXXXXXXX',
  routingNumber: 'XXXXXXXXX',
  iban: 'XXXXXXXXXXXXXXXXXXXX',
  swiftCode: 'XXXXXXXX',
};

// MTN Logo SVG
const MTNLogo = () => (
  <svg viewBox="0 0 100 100" className="h-8 w-8">
    <circle cx="50" cy="50" r="45" fill="#FFCC00"/>
    <ellipse cx="50" cy="55" rx="30" ry="20" fill="#000"/>
    <text x="50" y="60" textAnchor="middle" fill="#FFCC00" fontSize="16" fontWeight="bold" fontFamily="Arial">MTN</text>
  </svg>
);

// Orange Money Logo SVG
const OrangeMoneyLogo = () => (
  <svg viewBox="0 0 100 100" className="h-8 w-8">
    <rect width="100" height="100" rx="15" fill="#FF6600"/>
    <rect x="15" y="20" width="70" height="60" rx="10" fill="#FFF"/>
    <circle cx="35" cy="50" r="15" fill="#FF6600"/>
    <circle cx="65" cy="50" r="15" fill="#FF6600"/>
    <text x="50" y="90" textAnchor="middle" fill="#FFF" fontSize="10" fontWeight="bold">Orange Money</text>
  </svg>
);

// Wave Logo SVG
const WaveLogo = () => (
  <svg viewBox="0 0 100 100" className="h-8 w-8">
    <rect width="100" height="100" rx="20" fill="#1DC9B2"/>
    <path d="M20 50 Q35 30, 50 50 T80 50" stroke="#FFF" strokeWidth="6" fill="none"/>
    <path d="M20 60 Q35 40, 50 60 T80 60" stroke="#FFF" strokeWidth="4" fill="none" opacity="0.7"/>
    <path d="M20 70 Q35 50, 50 70 T80 70" stroke="#FFF" strokeWidth="3" fill="none" opacity="0.4"/>
  </svg>
);

// Visa Logo SVG
const VisaLogo = () => (
  <svg viewBox="0 0 100 60" className="h-8 w-auto">
    <rect width="100" height="60" rx="5" fill="#1A1F71"/>
    <text x="50" y="38" textAnchor="middle" fill="#FFF" fontSize="24" fontWeight="bold" fontStyle="italic" fontFamily="Arial">VISA</text>
  </svg>
);

// Mastercard Logo SVG
const MastercardLogo = () => (
  <svg viewBox="0 0 100 60" className="h-8 w-auto">
    <rect width="100" height="60" rx="5" fill="#FFF"/>
    <circle cx="35" cy="30" r="22" fill="#EB001B"/>
    <circle cx="65" cy="30" r="22" fill="#F79E1B"/>
    <path d="M50 12 a22 22 0 0 1 0 36 a22 22 0 0 1 0 -36" fill="#FF5F00"/>
  </svg>
);

// PayPal Logo SVG
const PayPalLogo = () => (
  <svg viewBox="0 0 100 60" className="h-8 w-auto">
    <rect width="100" height="60" rx="5" fill="#FFF"/>
    <path d="M25 45 L30 15 L45 15 C55 15 60 20 58 30 C56 40 48 45 38 45 L32 45 L30 55 L20 55 Z" fill="#003087"/>
    <path d="M35 40 L38 20 L52 20 C60 20 63 25 61 33 C59 42 52 47 44 47 L38 47 L35 55 L28 55 L30 45 L35 40 Z" fill="#009CDE"/>
    <text x="55" y="35" fill="#003087" fontSize="12" fontWeight="bold" fontFamily="Arial">PayPal</text>
  </svg>
);

// Payment Methods Configuration
const PAYMENT_METHODS = {
  mtn: {
    name: 'MTN Mobile Money',
    number: '+237 693 401 619',
    accountName: 'Fongang Lamago Brank',
    color: '#FFCC00',
    bgColor: '#FFCC0015',
    logo: MTNLogo,
    type: 'mobile',
  },
  orange: {
    name: 'Orange Money',
    number: '+237 693 401 619',
    accountName: 'Fongang Lamago Brank',
    color: '#FF6600',
    bgColor: '#FF660015',
    logo: OrangeMoneyLogo,
    type: 'mobile',
  },
  wave: {
    name: 'Wave',
    number: '+237 693 401 619',
    accountName: 'Fongang Lamago Brank',
    color: '#1DC9B2',
    bgColor: '#1DC9B215',
    logo: WaveLogo,
    type: 'mobile',
  },
  visa: {
    name: 'Visa',
    color: '#1A1F71',
    bgColor: '#1A1F7115',
    logo: VisaLogo,
    type: 'card',
  },
  mastercard: {
    name: 'Mastercard',
    color: '#EB001B',
    bgColor: '#EB001B15',
    logo: MastercardLogo,
    type: 'card',
  },
  paypal: {
    name: 'PayPal',
    color: '#003087',
    bgColor: '#00308715',
    logo: PayPalLogo,
    type: 'online',
  },
};

export function PaymentSelector({ selectedPackage, amount, onPaymentInitiated }: PaymentSelectorProps) {
  const [paymentMethod, setPaymentMethod] = useState<'bank' | 'mtn' | 'orange' | 'wave' | 'visa' | 'mastercard' | 'paypal'>('mtn');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [currency, setCurrency] = useState<'USD' | 'XAF'>('XAF');
  const [copied, setCopied] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [pin, setPin] = useState('');
  const [otp, setOtp] = useState('');
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'verifying' | 'success' | 'failed'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const convertedAmount = Math.round(amount * CURRENCY_RATES[currency].rate);
  const currencySymbol = CURRENCY_RATES[currency].symbol;

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
  };

  const handlePayment = async () => {
    const isMobilePayment = ['mtn', 'orange', 'wave'].includes(paymentMethod);
    const isCardPayment = ['visa', 'mastercard'].includes(paymentMethod);
    
    if (isMobilePayment && !phoneNumber) {
      alert('Please enter your phone number');
      return;
    }
    
    if (isCardPayment && (!cardNumber || !expiryDate || !cvv || !cardName)) {
      alert('Please fill in all card details');
      return;
    }

    // Show PIN/OTP confirmation modal for direct payment
    setShowPinModal(true);
    setPin('');
    setOtp('');
    setPaymentStatus('idle');
    setErrorMessage('');
  };

  const confirmPayment = async () => {
    const isMobilePayment = ['mtn', 'orange', 'wave'].includes(paymentMethod);
    const isCardPayment = ['visa', 'mastercard'].includes(paymentMethod);
    
    // Validate PIN/OTP
    if (isMobilePayment && pin.length < 4) {
      setErrorMessage('Please enter your 4-digit PIN');
      return;
    }
    
    if (isCardPayment && otp.length < 6) {
      setErrorMessage('Please enter your 6-digit OTP');
      return;
    }

    setPaymentStatus('processing');
    setErrorMessage('');

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    setPaymentStatus('verifying');
    
    // Simulate verification
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    // Simulate success (in real app, this would be API response)
    const success = true; // Simulated - in production, this comes from payment gateway
    
    if (success) {
      setPaymentStatus('success');
      setTimeout(() => {
        setShowPinModal(false);
        setShowSuccessModal(true);
        onPaymentInitiated({
          method: paymentMethod,
          amount: convertedAmount,
          currency,
          packageName: selectedPackage,
          phoneNumber: isMobilePayment ? phoneNumber : undefined,
          cardNumber: isCardPayment ? cardNumber.slice(-4) : undefined,
        });
      }, 500);
    } else {
      setPaymentStatus('failed');
      setErrorMessage('Transaction failed. Please check your details and try again.');
    }
  };

  const renderBankDetails = () => (
    <div className="space-y-4">
      <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
        <div className="flex items-center gap-2 mb-3">
          <Building className="h-5 w-5 text-blue-600" />
          <span className="font-semibold">Bank Transfer Details</span>
        </div>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Bank Name:</span>
            <div className="flex items-center gap-2">
              <span className="font-medium">{BANK_DETAILS.bankName}</span>
              <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => copyToClipboard(BANK_DETAILS.bankName, 'bank')}>
                {copied === 'bank' ? <CheckCircle className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
              </Button>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Account Name:</span>
            <div className="flex items-center gap-2">
              <span className="font-medium">{BANK_DETAILS.accountName}</span>
              <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => copyToClipboard(BANK_DETAILS.accountName, 'name')}>
                {copied === 'name' ? <CheckCircle className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
              </Button>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Account Number:</span>
            <div className="flex items-center gap-2">
              <span className="font-medium font-mono">{BANK_DETAILS.accountNumber}</span>
              <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => copyToClipboard(BANK_DETAILS.accountNumber, 'account')}>
                {copied === 'account' ? <CheckCircle className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
              </Button>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Swift Code:</span>
            <div className="flex items-center gap-2">
              <span className="font-medium font-mono">{BANK_DETAILS.swiftCode}</span>
              <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => copyToClipboard(BANK_DETAILS.swiftCode, 'swift')}>
                {copied === 'swift' ? <CheckCircle className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 bg-amber-50 dark:bg-amber-950 rounded-lg border border-amber-200 dark:border-amber-800">
        <div className="flex items-start gap-2">
          <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium">Important:</p>
            <ul className="mt-1 space-y-1 text-muted-foreground">
              <li>• Include your business name in the transfer reference</li>
              <li>• Send proof of payment to {COMPANY_INFO.contact.email}</li>
              <li>• We'll confirm payment within 24 hours</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMobileMoney = (type: 'mtn' | 'orange' | 'wave') => {
    const config = PAYMENT_METHODS[type];
    const LogoComponent = config.logo;
    
    return (
      <div className="space-y-4">
        <div
          className="p-4 rounded-lg border"
          style={{
            borderColor: config.color,
            backgroundColor: config.bgColor,
          }}
        >
          <div className="flex items-center gap-3 mb-4">
            <LogoComponent />
            <div>
              <h4 className="font-semibold">{config.name}</h4>
              <p className="text-sm text-muted-foreground">Send money instantly</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Number:</span>
              <div className="flex items-center gap-2">
                <span className="font-medium font-mono">{config.number}</span>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0"
                  onClick={() => copyToClipboard(config.number!.replace(/\s/g, ''), 'number')}
                >
                  {copied === 'number' ? <CheckCircle className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                </Button>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Account Name:</span>
              <span className="font-medium">{config.accountName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Amount:</span>
              <span className="font-bold text-lg">
                {currencySymbol}{convertedAmount.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phoneNumber">Your Phone Number (for confirmation)</Label>
          <Input
            id="phoneNumber"
            type="tel"
            placeholder="+237 6XX XXX XXX"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            We'll use this to verify your payment
          </p>
        </div>

        <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
          <div className="flex items-start gap-2">
            <Shield className="h-5 w-5 text-green-600 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium">How to pay:</p>
              <ol className="mt-1 space-y-1 text-muted-foreground list-decimal list-inside">
                <li>Open your {config.name} app or dial the USSD code</li>
                <li>Select "Send Money"</li>
                <li>Enter the number: {config.number}</li>
                <li>Enter amount: {currencySymbol}{convertedAmount.toLocaleString()}</li>
                <li>Confirm with your PIN</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderCardPayment = (type: 'visa' | 'mastercard') => {
    const config = PAYMENT_METHODS[type];
    const LogoComponent = config.logo;
    
    return (
      <div className="space-y-4">
        <div
          className="p-4 rounded-lg border"
          style={{
            borderColor: config.color,
            backgroundColor: config.bgColor,
          }}
        >
          <div className="flex items-center gap-3 mb-4">
            <LogoComponent />
            <div>
              <h4 className="font-semibold">{config.name}</h4>
              <p className="text-sm text-muted-foreground">Pay securely with your card</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cardName">Cardholder Name</Label>
            <Input
              id="cardName"
              type="text"
              placeholder="John Doe"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="cardNumber">Card Number</Label>
            <Input
              id="cardNumber"
              type="text"
              placeholder="1234 5678 9012 3456"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              maxLength={19}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiryDate">Expiry Date</Label>
              <Input
                id="expiryDate"
                type="text"
                placeholder="MM/YY"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                maxLength={5}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cvv">CVV</Label>
              <Input
                id="cvv"
                type="password"
                placeholder="***"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                maxLength={4}
              />
            </div>
          </div>

          <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
            <span className="text-sm">Amount to charge:</span>
            <span className="font-bold text-lg">{currencySymbol}{convertedAmount.toLocaleString()}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
          <Shield className="h-5 w-5 text-green-600" />
          <p className="text-sm text-green-700 dark:text-green-300">
            Your card information is encrypted and secure. We use industry-standard SSL encryption.
          </p>
        </div>
      </div>
    );
  };

  const renderPayPal = () => {
    const config = PAYMENT_METHODS.paypal;
    const LogoComponent = config.logo;
    
    return (
      <div className="space-y-4">
        <div
          className="p-4 rounded-lg border"
          style={{
            borderColor: config.color,
            backgroundColor: config.bgColor,
          }}
        >
          <div className="flex items-center gap-3 mb-4">
            <LogoComponent />
            <div>
              <h4 className="font-semibold">{config.name}</h4>
              <p className="text-sm text-muted-foreground">Pay with your PayPal account</p>
            </div>
          </div>
        </div>

        <div className="p-6 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800 text-center">
          <p className="text-muted-foreground mb-4">
            You'll be redirected to PayPal to complete your payment of
          </p>
          <p className="text-3xl font-bold text-blue-600 mb-4">
            {currencySymbol}{convertedAmount.toLocaleString()}
          </p>
          <Button
            className="w-full bg-[#0070ba] hover:bg-[#005ea6]"
            onClick={handlePayment}
          >
            <LogoComponent />
            Pay with PayPal
          </Button>
        </div>

        <div className="flex items-center gap-2 p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
          <Shield className="h-5 w-5 text-green-600" />
          <p className="text-sm text-green-700 dark:text-green-300">
            PayPal offers buyer protection and secure payments.
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Amount Summary */}
      <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-80">Amount to Pay</p>
              <p className="text-3xl font-bold">{currencySymbol}{convertedAmount.toLocaleString()}</p>
              <p className="text-sm opacity-80 mt-1 capitalize">{selectedPackage} Package</p>
            </div>
            <div className="p-4 rounded-full bg-white/20">
              <Wallet className="h-8 w-8" />
            </div>
          </div>

          <div className="flex items-center gap-4 mt-4">
            <span className="text-sm">Currency:</span>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={currency === 'XAF' ? 'secondary' : 'outline'}
                className={currency === 'XAF' ? 'bg-white text-blue-600' : 'border-white/50 text-white hover:bg-white/10'}
                onClick={() => setCurrency('XAF')}
              >
                CFA (XAF)
              </Button>
              <Button
                size="sm"
                variant={currency === 'USD' ? 'secondary' : 'outline'}
                className={currency === 'USD' ? 'bg-white text-blue-600' : 'border-white/50 text-white hover:bg-white/10'}
                onClick={() => setCurrency('USD')}
              >
                USD ($)
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Method Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Choose Payment Method
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as typeof paymentMethod)}>
            {/* Mobile Money Section */}
            <div className="mb-4">
              <p className="text-sm font-medium text-muted-foreground mb-2">Mobile Money</p>
              <TabsList className="grid w-full grid-cols-3 mb-2">
                <TabsTrigger value="mtn" className="flex items-center gap-2 py-3">
                  <MTNLogo />
                  <span className="hidden sm:inline">MTN</span>
                </TabsTrigger>
                <TabsTrigger value="orange" className="flex items-center gap-2 py-3">
                  <OrangeMoneyLogo />
                  <span className="hidden sm:inline">Orange</span>
                </TabsTrigger>
                <TabsTrigger value="wave" className="flex items-center gap-2 py-3">
                  <WaveLogo />
                  <span className="hidden sm:inline">Wave</span>
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Cards Section */}
            <div className="mb-4">
              <p className="text-sm font-medium text-muted-foreground mb-2">Credit / Debit Cards</p>
              <TabsList className="grid w-full grid-cols-2 mb-2">
                <TabsTrigger value="visa" className="flex items-center gap-2 py-3">
                  <VisaLogo />
                  <span className="hidden sm:inline">Visa</span>
                </TabsTrigger>
                <TabsTrigger value="mastercard" className="flex items-center gap-2 py-3">
                  <MastercardLogo />
                  <span className="hidden sm:inline">Mastercard</span>
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Online Payments Section */}
            <div className="mb-4">
              <p className="text-sm font-medium text-muted-foreground mb-2">Online Payments</p>
              <TabsList className="grid w-full grid-cols-2 mb-2">
                <TabsTrigger value="paypal" className="flex items-center gap-2 py-3">
                  <PayPalLogo />
                  <span className="hidden sm:inline">PayPal</span>
                </TabsTrigger>
                <TabsTrigger value="bank" className="flex items-center gap-2 py-3">
                  <Building className="h-6 w-6" />
                  <span className="hidden sm:inline">Bank</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="mtn">{renderMobileMoney('mtn')}</TabsContent>
            <TabsContent value="orange">{renderMobileMoney('orange')}</TabsContent>
            <TabsContent value="wave">{renderMobileMoney('wave')}</TabsContent>
            <TabsContent value="visa">{renderCardPayment('visa')}</TabsContent>
            <TabsContent value="mastercard">{renderCardPayment('mastercard')}</TabsContent>
            <TabsContent value="paypal">{renderPayPal()}</TabsContent>
            <TabsContent value="bank">{renderBankDetails()}</TabsContent>

            {/* Pay Button - Not shown for PayPal */}
            {paymentMethod !== 'paypal' && (
              <Button
                className="w-full mt-6 h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                onClick={handlePayment}
                disabled={processing || (['mtn', 'orange', 'wave'].includes(paymentMethod) && !phoneNumber) || (['visa', 'mastercard'].includes(paymentMethod) && (!cardNumber || !expiryDate || !cvv || !cardName))}
              >
                {processing ? (
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                ) : (
                  <>
                    <Lock className="h-5 w-5 mr-2" />
                    {['visa', 'mastercard'].includes(paymentMethod) ? 'Pay Securely Now' : 'Pay with ' + paymentMethod.toUpperCase()}
                  </>
                )}
              </Button>
            )}
          </Tabs>
        </CardContent>
      </Card>

      {/* Security Note */}
      <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
        <Shield className="h-8 w-8 text-green-600" />
        <div>
          <p className="font-medium">Secure Payment</p>
          <p className="text-sm text-muted-foreground">
            Your payment information is secure. All transactions are encrypted.
          </p>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              Confirm Payment
            </DialogTitle>
            <DialogDescription>
              Please confirm your payment of {currencySymbol}{convertedAmount.toLocaleString()} via {paymentMethod.toUpperCase()}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="p-4 bg-muted rounded-lg mb-4">
              <div className="flex justify-between mb-2">
                <span className="text-muted-foreground">Package:</span>
                <span className="font-medium capitalize">{selectedPackage}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-muted-foreground">Amount:</span>
                <span className="font-medium">{currencySymbol}{convertedAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Method:</span>
                <span className="font-medium uppercase">{paymentMethod}</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Our team will verify your payment and start working on your project immediately.
              You'll receive a confirmation email within 24 hours.
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setShowConfirmation(false)} className="flex-1">
              Cancel
            </Button>
            <Button onClick={confirmPayment} disabled={processing} className="flex-1">
              {processing ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <CheckCircle className="h-4 w-4 mr-2" />
              )}
              Confirm Payment
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="text-center">
          <DialogHeader>
            <div className="mx-auto mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <DialogTitle className="text-xl">Payment Successful!</DialogTitle>
            <DialogDescription className="mt-4">
              Your payment of <strong>{currencySymbol}{convertedAmount.toLocaleString()}</strong> has been processed successfully.
              <br /><br />
              You'll receive a confirmation at <strong>{COMPANY_INFO.contact.email}</strong> shortly.
              <br /><br />
              Our team will contact you on <strong>{COMPANY_INFO.contact.phone}</strong> once your project begins.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* PIN/OTP Confirmation Modal for Direct Payment */}
      <Dialog open={showPinModal} onOpenChange={setShowPinModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {paymentStatus === 'success' ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : paymentStatus === 'failed' ? (
                <AlertCircle className="h-5 w-5 text-red-600" />
              ) : (
                <Lock className="h-5 w-5 text-blue-600" />
              )}
              {['mtn', 'orange', 'wave'].includes(paymentMethod) ? 'Confirm with PIN' : '3D Secure Verification'}
            </DialogTitle>
            <DialogDescription>
              {paymentStatus === 'idle' && (
                <>Enter your {['mtn', 'orange', 'wave'].includes(paymentMethod) ? 'Mobile Money PIN' : 'one-time password'} to authorize this transaction</>
              )}
              {paymentStatus === 'processing' && 'Processing your payment...'}
              {paymentStatus === 'verifying' && 'Verifying transaction...'}
              {paymentStatus === 'success' && 'Payment successful!'}
              {paymentStatus === 'failed' && 'Transaction failed'}
            </DialogDescription>
          </DialogHeader>

          <div className="py-6">
            {/* Transaction Summary */}
            <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 rounded-lg mb-6 border border-blue-200 dark:border-blue-800">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-muted-foreground">Amount:</span>
                <span className="text-xl font-bold text-blue-600">{currencySymbol}{convertedAmount.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-muted-foreground">Package:</span>
                <span className="font-medium capitalize">{selectedPackage}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Method:</span>
                <div className="flex items-center gap-2">
                  {['mtn', 'orange', 'wave'].includes(paymentMethod) && <Smartphone className="h-4 w-4" />}
                  {['visa', 'mastercard'].includes(paymentMethod) && <CreditCard className="h-4 w-4" />}
                  <span className="font-medium uppercase">{paymentMethod}</span>
                </div>
              </div>
              {['mtn', 'orange', 'wave'].includes(paymentMethod) && phoneNumber && (
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-blue-200 dark:border-blue-700">
                  <span className="text-sm text-muted-foreground">Phone:</span>
                  <span className="font-medium font-mono">{phoneNumber}</span>
                </div>
              )}
            </div>

            {/* PIN Input for Mobile Money */}
            {['mtn', 'orange', 'wave'].includes(paymentMethod) && paymentStatus === 'idle' && (
              <div className="space-y-4">
                <div className="text-center">
                  <KeyRound className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Enter your 4-digit Mobile Money PIN
                  </p>
                </div>
                <div className="flex justify-center gap-2">
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-14 w-14 border-2 rounded-xl flex items-center justify-center text-2xl font-bold bg-background"
                    >
                      {pin[i] ? '•' : ''}
                    </div>
                  ))}
                </div>
                <Input
                  type="password"
                  inputMode="numeric"
                  maxLength={4}
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  className="text-center text-2xl tracking-widest h-14"
                  placeholder="Enter PIN"
                  autoFocus
                />
                <p className="text-xs text-center text-muted-foreground">
                  <Shield className="h-3 w-3 inline mr-1" />
                  Your PIN is encrypted and secure
                </p>
              </div>
            )}

            {/* OTP Input for Cards */}
            {['visa', 'mastercard'].includes(paymentMethod) && paymentStatus === 'idle' && (
              <div className="space-y-4">
                <div className="text-center">
                  <Fingerprint className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Enter the 6-digit code sent to your phone
                  </p>
                </div>
                <div className="flex justify-center gap-1">
                  {[0, 1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="h-12 w-10 border-2 rounded-lg flex items-center justify-center text-xl font-bold bg-background"
                    >
                      {otp[i] || ''}
                    </div>
                  ))}
                </div>
                <Input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="text-center text-xl tracking-widest h-14"
                  placeholder="Enter OTP"
                  autoFocus
                />
                <p className="text-xs text-center text-muted-foreground">
                  Check your registered phone for the OTP code
                </p>
                <Button variant="link" className="w-full text-sm">
                  Resend OTP Code
                </Button>
              </div>
            )}

            {/* Processing State */}
            {(paymentStatus === 'processing' || paymentStatus === 'verifying') && (
              <div className="text-center py-8">
                <Loader2 className="h-16 w-16 mx-auto animate-spin text-blue-600 mb-4" />
                <p className="text-lg font-medium">
                  {paymentStatus === 'processing' ? 'Processing Payment...' : 'Verifying Transaction...'}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Please wait, do not close this window
                </p>
                <div className="mt-4 w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div className="bg-blue-600 h-full animate-pulse" style={{ width: '60%' }} />
                </div>
              </div>
            )}

            {/* Success State */}
            {paymentStatus === 'success' && (
              <div className="text-center py-8">
                <div className="relative inline-block">
                  <CheckCircle className="h-20 w-20 mx-auto text-green-500" />
                  <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping" />
                </div>
                <p className="text-lg font-medium text-green-600 mt-4">
                  Payment Successful!
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  {currencySymbol}{convertedAmount.toLocaleString()} has been charged to your {paymentMethod.toUpperCase()} account
                </p>
              </div>
            )}

            {/* Failed State */}
            {paymentStatus === 'failed' && (
              <div className="text-center py-8">
                <AlertCircle className="h-20 w-20 mx-auto text-red-500" />
                <p className="text-lg font-medium text-red-600 mt-4">
                  Transaction Failed
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  {errorMessage || 'Please check your details and try again'}
                </p>
              </div>
            )}

            {/* Error Message */}
            {errorMessage && paymentStatus === 'idle' && (
              <div className="p-3 bg-red-50 dark:bg-red-950 rounded-lg border border-red-200 dark:border-red-800">
                <p className="text-sm text-red-600 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  {errorMessage}
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          {paymentStatus === 'idle' && (
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowPinModal(false)} className="flex-1">
                Cancel
              </Button>
              <Button 
                onClick={confirmPayment} 
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              >
                <Lock className="h-4 w-4 mr-2" />
                Confirm & Pay
              </Button>
            </div>
          )}

          {paymentStatus === 'failed' && (
            <Button 
              onClick={() => {
                setPaymentStatus('idle');
                setPin('');
                setOtp('');
                setErrorMessage('');
              }} 
              className="w-full"
            >
              Try Again
            </Button>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
