'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Sparkles, Crown, Zap } from 'lucide-react';
import { PRICING_PACKAGES } from '@/lib/pricing';

export function PricingSection() {
  return (
    <section id="pricing" className="py-20 px-4 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <Badge className="mb-4" variant="secondary">
            Transparent Pricing
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Choose Your Package
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Professional website packages tailored to your business needs.
            All packages include mobile-responsive design and SEO optimization.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {PRICING_PACKAGES.map((pkg, index) => (
            <div
              key={pkg.id}
              className={`relative rounded-2xl border-2 p-8 transition-all hover:shadow-xl ${
                pkg.highlighted
                  ? 'border-blue-600 shadow-xl scale-105 z-10'
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
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">{pkg.name}</h3>
                <p className="text-muted-foreground mb-4">{pkg.description}</p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold">${pkg.price}</span>
                  <span className="text-muted-foreground">one-time</span>
                </div>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {pkg.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="mt-0.5 h-5 w-5 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center flex-shrink-0">
                      <Check className="h-3 w-3 text-green-600 dark:text-green-400" />
                    </div>
                    <span className="text-sm">{feature}</span>
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
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Get Started
              </Button>

              {/* Premium Notice */}
              {pkg.id === 'premium' && (
                <p className="text-xs text-center text-muted-foreground mt-4">
                  Includes e-commerce & unlimited updates
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            Need a custom solution?{' '}
            <a href="mailto:brank493@gmail.com" className="text-blue-600 hover:underline font-medium">
              Contact us
            </a>{' '}
            for enterprise pricing.
          </p>
        </div>
      </div>
    </section>
  );
}
