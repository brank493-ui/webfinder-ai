'use client';

import { useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Sparkles, Crown, Zap } from 'lucide-react';
import { PRICING_PACKAGES } from '@/lib/pricing';
import { useLanguageStore } from '@/store/useLanguageStore';

export function PricingSection() {
  const { t } = useLanguageStore();

  const handlePackageSelect = useCallback((packageId: string) => {
    // Scroll to contact section
    const contactSection = document.getElementById('contact-footer') || document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      // Fallback to email
      const subject = encodeURIComponent(`Website Package Inquiry - ${packageId.charAt(0).toUpperCase() + packageId.slice(1)} Package`);
      window.open(`mailto:brank493@gmail.com?subject=${subject}`, '_self');
    }
  }, []);

  return (
    <section id="pricing" className="py-12 sm:py-20 px-4 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <Badge className="mb-3 sm:mb-4" variant="secondary">
            {t('pricing.transparent')}
          </Badge>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
            {t('package.title')}
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('package.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
          {PRICING_PACKAGES.map((pkg, index) => (
            <div
              key={pkg.id}
              className={`relative rounded-2xl border-2 p-6 sm:p-8 transition-all hover:shadow-xl ${
                pkg.highlighted
                  ? 'border-blue-600 shadow-xl scale-100 md:scale-105 z-10'
                  : 'border-border hover:border-blue-300'
              }`}
            >
              {/* Badge */}
              {pkg.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge
                    className={`${
                      pkg.id === 'premium'
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600'
                        : 'bg-gradient-to-r from-blue-600 to-indigo-600'
                    } px-4 py-1`}
                  >
                    {pkg.id === 'premium' ? (
                      <Crown className="h-3 w-3 mr-1" />
                    ) : (
                      <Zap className="h-3 w-3 mr-1" />
                    )}
                    {pkg.badge}
                  </Badge>
                </div>
              )}

              {/* Package Header */}
              <div className="text-center mb-4 sm:mb-6">
                <h3 className="text-xl sm:text-2xl font-bold mb-2">{pkg.name}</h3>
                <p className="text-muted-foreground mb-3 sm:mb-4 text-sm sm:text-base">{pkg.description}</p>
                <div className="flex flex-col items-center gap-1">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-3xl sm:text-4xl font-bold">${pkg.price}</span>
                    <span className="text-muted-foreground text-sm">{t('pricing.oneTime')}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <span className="font-medium text-green-600">≈ {pkg.priceCFA?.toLocaleString() || (pkg.price * 612).toLocaleString()} CFA</span>
                  </div>
                </div>
              </div>

              {/* Features */}
              <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                {pkg.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 sm:gap-3">
                    <div className="mt-0.5 h-4 w-4 sm:h-5 sm:w-5 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center flex-shrink-0">
                      <Check className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-green-600 dark:text-green-400" />
                    </div>
                    <span className="text-xs sm:text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <Button
                className={`w-full ${
                  pkg.highlighted
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
                    : pkg.id === 'premium'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                    : ''
                }`}
                variant={pkg.highlighted || pkg.id === 'premium' ? 'default' : 'outline'}
                size="lg"
                onClick={() => handlePackageSelect(pkg.id)}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                {t('pricing.getStarted')}
              </Button>

              {/* Premium Notice */}
              {pkg.id === 'premium' && (
                <p className="text-xs text-center text-muted-foreground mt-4">
                  {t('pricing.includesEcommerce')}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-8 sm:mt-12 text-center">
          <p className="text-xs sm:text-sm text-muted-foreground">
            {t('pricing.needCustomSolution')}{' '}
            <a href="mailto:brank493@gmail.com" className="text-blue-600 hover:underline font-medium">
              {t('pricing.contactUs')}
            </a>{' '}
            {t('pricing.forEnterprisePricing')}
          </p>
        </div>
      </div>
    </section>
  );
}
