'use client';

import { useState, useEffect } from 'react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  CheckCircle,
  Package,
  FileText,
  CreditCard,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Clock,
  Shield,
  MessageSquare,
  Globe,
} from 'lucide-react';
import { PackageShowcase } from '@/components/custom/PackageShowcase';
import { ClientBriefBuilder, type BriefData } from '@/components/custom/ClientBriefBuilder';
import { PaymentSelector, type PaymentData } from '@/components/custom/PaymentSelector';
import { COMPANY_INFO } from '@/lib/company';

interface OnboardingData {
  package: string | null;
  brief: BriefData | null;
  payment: PaymentData | null;
}

const PACKAGE_PRICES: Record<string, number> = {
  standard: 149,
  pro: 399,
  premium: 999,
};

interface ClientOnboardingPageProps {
  businessId?: string;
  businessName?: string;
  businessEmail?: string;
  onComplete?: (data: OnboardingData) => void;
}

export function ClientOnboardingPage({
  businessId,
  businessName,
  businessEmail,
  onComplete,
}: ClientOnboardingPageProps) {
  const { t } = useLanguageStore();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    package: null,
    brief: null,
    payment: null,
  });
  const [submitted, setSubmitted] = useState(false);

  const steps = [
    { id: 1, title: t('onboarding.choosePackage'), icon: Package, description: t('onboarding.selectPackage') },
    { id: 2, title: t('onboarding.yourBrief'), icon: FileText, description: t('onboarding.tellUsProject') },
    { id: 3, title: t('onboarding.payment'), icon: CreditCard, description: t('onboarding.completeOrder') },
  ];

  const currentStep = steps.find((s) => s.id === step);
  const progress = (step / 3) * 100;

  const handlePackageSelect = (pkg: string) => {
    setData((prev) => ({ ...prev, package: pkg }));
  };

  const handleBriefSubmit = (brief: BriefData) => {
    setData((prev) => ({ ...prev, brief }));
    setStep(3); // Move to payment
  };

  const handlePaymentComplete = (payment: PaymentData) => {
    setData((prev) => ({ ...prev, payment }));
    setSubmitted(true);
    onComplete?.(data);
  };

  const canProceed = () => {
    if (step === 1) return !!data.package;
    return true;
  };

  // Scroll to top on step change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="text-center">
            <CardContent className="pt-12 pb-8">
              <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold mb-4">{t('onboarding.thankYou')}</h1>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                {t('onboarding.orderSubmitted')}
              </p>

              <div className="bg-muted rounded-lg p-6 text-left max-w-md mx-auto mb-6">
                <h3 className="font-semibold mb-4">{t('onboarding.whatHappensNext')}</h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-blue-600">1</span>
                    </div>
                    <span>{t('onboarding.reviewBrief')}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-blue-600">2</span>
                    </div>
                    <span>{t('onboarding.verifyPayment')}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-blue-600">3</span>
                    </div>
                    <span>{t('onboarding.beginDevelopment')}</span>
                  </li>
                </ul>
              </div>

              <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  <span>{COMPANY_INFO.contact.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  <span>{COMPANY_INFO.contact.phone}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-bold">WebFinder</h1>
              <p className="text-sm text-muted-foreground">{t('onboarding.professionalDev')}</p>
            </div>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('onboarding.welcome')}
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((s, i) => {
              const Icon = s.icon;
              const isActive = step === s.id;
              const isComplete = step > s.id;

              return (
                <div key={s.id} className="flex items-center flex-1">
                  <div className="flex items-center">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-lg'
                          : isComplete
                          ? 'bg-green-600 text-white'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {isComplete ? (
                        <CheckCircle className="h-6 w-6" />
                      ) : (
                        <Icon className="h-6 w-6" />
                      )}
                    </div>
                    <div className="ml-3 hidden sm:block">
                      <p className={`font-medium ${isActive ? 'text-blue-600' : ''}`}>
                        {s.title}
                      </p>
                      <p className="text-xs text-muted-foreground">{s.description}</p>
                    </div>
                  </div>
                  {i < steps.length - 1 && (
                    <div className="flex-1 mx-4">
                      <div className="h-1 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 ${
                            step > s.id ? 'bg-green-600 w-full' : 'bg-blue-600 w-0'
                          }`}
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Content */}
        <div className="space-y-6">
          {/* Step 1: Package Selection */}
          {step === 1 && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Package className="h-5 w-5 text-blue-600" />
                    {t('onboarding.step1Title')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-6">
                    {t('onboarding.step1Desc')}
                  </p>
                  <PackageShowcase
                    selectedPackage={data.package}
                    onSelectPackage={handlePackageSelect}
                  />
                </CardContent>
              </Card>

              <div className="flex justify-between">
                <Button variant="outline" disabled>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {t('onboarding.back')}
                </Button>
                <Button
                  onClick={() => setStep(2)}
                  disabled={!canProceed()}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600"
                >
                  {t('onboarding.continueToBrief')}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Brief Builder */}
          {step === 2 && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    {t('onboarding.step2Title')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg mb-6">
                    <Package className="h-8 w-8 text-blue-600" />
                    <div>
                      <p className="font-semibold capitalize">{data.package} Package</p>
                      <p className="text-sm text-muted-foreground">
                        ${PACKAGE_PRICES[data.package || 'pro']} {t('onboarding.oneTimePayment')}
                      </p>
                    </div>
                  </div>
                  <ClientBriefBuilder
                    initialData={
                      businessName || businessEmail
                        ? {
                            businessName: businessName || '',
                            email: businessEmail || '',
                          }
                        : undefined
                    }
                    onSubmit={handleBriefSubmit}
                  />
                </CardContent>
              </Card>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(1)}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {t('onboarding.changePackage')}
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Payment */}
          {step === 3 && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-blue-600" />
                    {t('onboarding.step3Title')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <PaymentSelector
                    selectedPackage={data.package || 'pro'}
                    amount={PACKAGE_PRICES[data.package || 'pro']}
                    onPaymentInitiated={handlePaymentComplete}
                  />
                </CardContent>
              </Card>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(2)}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {t('onboarding.editBrief')}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Trust Badges */}
        <div className="mt-12 grid grid-cols-3 gap-4 max-w-2xl mx-auto">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mx-auto mb-2">
              <Shield className="h-6 w-6 text-green-600" />
            </div>
            <p className="text-sm font-medium">{t('onboarding.securePayment')}</p>
            <p className="text-xs text-muted-foreground">{t('onboarding.dataProtected')}</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mx-auto mb-2">
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
            <p className="text-sm font-medium">{t('onboarding.quickDelivery')}</p>
            <p className="text-xs text-muted-foreground">{t('onboarding.fastTurnaround')}</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mx-auto mb-2">
              <MessageSquare className="h-6 w-6 text-purple-600" />
            </div>
            <p className="text-sm font-medium">{t('onboarding.support24/7')}</p>
            <p className="text-xs text-muted-foreground">{t('onboarding.alwaysHelp')}</p>
          </div>
        </div>

        {/* Contact Footer */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>
            {t('onboarding.questions')}{' '}
            <a href={COMPANY_INFO.contact.emailLink} className="text-blue-600 hover:underline">
              {COMPANY_INFO.contact.email}
            </a>{' '}
            {t('onboarding.or')}{' '}
            <a href={COMPANY_INFO.contact.phoneLink} className="text-blue-600 hover:underline">
              {COMPANY_INFO.contact.phone}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
