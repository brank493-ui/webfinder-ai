'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  CreditCard,
  Smartphone,
  Loader2,
  CheckCircle,
  AlertCircle,
  Copy,
  Phone,
} from 'lucide-react';
import { MOBILE_MONEY_PROVIDERS, type MobileMoneyProvider } from '@/lib/mobile-money';
import { PRICING_PACKAGES, type PricingPackage } from '@/lib/pricing';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  businessId: string;
  selectedPackage: PricingPackage | null;
  onSuccess?: (projectId: string) => void;
}

export function PaymentModal({
  isOpen,
  onClose,
  businessId,
  selectedPackage,
  onSuccess,
}: PaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'mobile'>('mobile');
  const [selectedProvider, setSelectedProvider] = useState<string>('orange_money');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'pending' | 'success' | 'error'>('idle');
  const [ussdCode, setUssdCode] = useState<string | null>(null);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePayment = async () => {
    if (!selectedPackage) return;

    setLoading(true);
    setError(null);
    setPaymentStatus('processing');

    try {
      if (paymentMethod === 'mobile') {
        // Mobile money payment
        const response = await fetch('/api/payment/mobile-money', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            businessId,
            packageId: selectedPackage.id,
            provider: selectedProvider,
            phoneNumber,
          }),
        });

        const data = await response.json();

        if (data.success) {
          setPaymentStatus('pending');
          setUssdCode(data.ussdCode);
          setProjectId(data.projectId);
        } else {
          setPaymentStatus('error');
          setError(data.error || 'Payment failed');
        }
      } else {
        // Card payment (Stripe)
        const response = await fetch('/api/payment/create-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            businessId,
            packageId: selectedPackage.id,
          }),
        });

        const data = await response.json();

        if (data.success && data.checkoutUrl) {
          // Redirect to Stripe checkout
          window.location.href = data.checkoutUrl;
        } else {
          setPaymentStatus('error');
          setError(data.error || 'Failed to create payment session');
        }
      }
    } catch (err) {
      setPaymentStatus('error');
      setError('Failed to process payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyUssdCode = () => {
    if (ussdCode) {
      navigator.clipboard.writeText(ussdCode);
    }
  };

  const resetModal = () => {
    setPaymentStatus('idle');
    setUssdCode(null);
    setProjectId(null);
    setError(null);
    setPhoneNumber('');
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  const provider = MOBILE_MONEY_PROVIDERS.find((p) => p.id === selectedProvider);

  if (!selectedPackage) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Complete Your Order
          </DialogTitle>
          <DialogDescription>
            {selectedPackage.name} Package - ${selectedPackage.price}
          </DialogDescription>
        </DialogHeader>

        {paymentStatus === 'idle' && (
          <div className="space-y-6">
            {/* Package Summary */}
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">{selectedPackage.name} Package</span>
                <Badge variant="secondary">${selectedPackage.price}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{selectedPackage.description}</p>
            </div>

            {/* Payment Method Selection */}
            <div className="space-y-3">
              <Label>Select Payment Method</Label>
              <RadioGroup
                value={paymentMethod}
                onValueChange={(v) => setPaymentMethod(v as 'card' | 'mobile')}
                className="grid grid-cols-2 gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="mobile" id="mobile" />
                  <Label htmlFor="mobile" className="flex items-center gap-2 cursor-pointer">
                    <Smartphone className="h-4 w-4" />
                    Mobile Money
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer">
                    <CreditCard className="h-4 w-4" />
                    Card
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {paymentMethod === 'mobile' && (
              <>
                {/* Provider Selection */}
                <div className="space-y-3">
                  <Label>Select Provider</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {MOBILE_MONEY_PROVIDERS.map((p) => (
                      <Button
                        key={p.id}
                        type="button"
                        variant={selectedProvider === p.id ? 'default' : 'outline'}
                        className="justify-start h-auto py-2"
                        onClick={() => setSelectedProvider(p.id)}
                        style={{
                          borderColor: selectedProvider === p.id ? p.color : undefined,
                          backgroundColor: selectedProvider === p.id ? `${p.color}20` : undefined,
                        }}
                      >
                        <div
                          className="w-3 h-3 rounded-full mr-2"
                          style={{ backgroundColor: p.color }}
                        />
                        {p.name}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Phone Number Input */}
                <div className="space-y-2">
                  <Label htmlFor="phone">
                    <Phone className="h-4 w-4 inline mr-2" />
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+221 77 123 4567"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                  {provider && (
                    <p className="text-xs text-muted-foreground">
                      Available in: {provider.countries.slice(0, 5).join(', ')}
                      {provider.countries.length > 5 && ` +${provider.countries.length - 5} more`}
                    </p>
                  )}
                </div>
              </>
            )}

            <Button
              className="w-full"
              onClick={handlePayment}
              disabled={loading || (paymentMethod === 'mobile' && !phoneNumber)}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                `Pay $${selectedPackage.price}`
              )}
            </Button>
          </div>
        )}

        {paymentStatus === 'processing' && (
          <div className="text-center py-8">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-blue-600 mb-4" />
            <p className="text-lg font-medium">Processing Payment...</p>
            <p className="text-sm text-muted-foreground">Please wait while we process your payment</p>
          </div>
        )}

        {paymentStatus === 'pending' && ussdCode && (
          <div className="space-y-6 py-4">
            <div className="text-center">
              <CheckCircle className="h-12 w-12 mx-auto text-green-600 mb-4" />
              <p className="text-lg font-medium">Payment Initiated!</p>
              <p className="text-sm text-muted-foreground">
                Complete the payment on your phone
              </p>
            </div>

            <div className="bg-muted rounded-lg p-4 text-center">
              <p className="text-sm text-muted-foreground mb-2">Dial this USSD code:</p>
              <div className="flex items-center justify-center gap-2">
                <code className="text-xl font-bold bg-background px-4 py-2 rounded">
                  {ussdCode}
                </code>
                <Button variant="ghost" size="icon" onClick={copyUssdCode}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="text-sm text-muted-foreground">
              <p>Instructions:</p>
              <ol className="list-decimal list-inside space-y-1 mt-2">
                <li>Copy or remember the USSD code above</li>
                <li>Dial it on your phone</li>
                <li>Enter your PIN to confirm</li>
                <li>Wait for confirmation SMS</li>
              </ol>
            </div>

            <Button variant="outline" className="w-full" onClick={handleClose}>
              I&apos;ll Complete Payment Later
            </Button>
          </div>
        )}

        {paymentStatus === 'error' && (
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 mx-auto text-red-600 mb-4" />
            <p className="text-lg font-medium">Payment Failed</p>
            <p className="text-sm text-muted-foreground mb-4">
              {error || 'Something went wrong. Please try again.'}
            </p>
            <Button onClick={resetModal}>Try Again</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
