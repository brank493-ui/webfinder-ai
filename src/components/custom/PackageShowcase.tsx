'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Check,
  Crown,
  Sparkles,
  Zap,
  Globe,
  Monitor,
  ExternalLink,
  Play,
  Star,
  ShoppingCart,
  CreditCard,
  Palette,
  Clock,
  Headphones,
  ArrowRight,
} from 'lucide-react';
import { PRICING_PACKAGES } from '@/lib/pricing';

interface PackageExample {
  id: string;
  name: string;
  category: string;
  thumbnail: string;
  description: string;
  features: string[];
  liveUrl?: string;
}

// Real examples - these would be your actual past projects
const PACKAGE_EXAMPLES: Record<string, PackageExample[]> = {
  standard: [
    {
      id: 'std_1',
      name: 'City Restaurant',
      category: 'Restaurant',
      thumbnail: '/examples/standard-restaurant.jpg',
      description: 'Simple, elegant restaurant website with menu display and contact form',
      features: ['5 pages', 'Mobile responsive', 'Contact form', 'Google Maps'],
      liveUrl: '#',
    },
    {
      id: 'std_2',
      name: 'Beauty Studio',
      category: 'Beauty',
      thumbnail: '/examples/standard-beauty.jpg',
      description: 'Clean beauty salon website with services and booking info',
      features: ['4 pages', 'Service list', 'Photo gallery', 'Social links'],
      liveUrl: '#',
    },
    {
      id: 'std_3',
      name: 'Auto Repair Shop',
      category: 'Automotive',
      thumbnail: '/examples/standard-auto.jpg',
      description: 'Professional auto service website with service listings',
      features: ['5 pages', 'Services grid', 'Contact info', 'Basic SEO'],
      liveUrl: '#',
    },
  ],
  pro: [
    {
      id: 'pro_1',
      name: 'TechStartup Inc.',
      category: 'Technology',
      thumbnail: '/examples/pro-tech.jpg',
      description: 'Modern tech company website with team profiles and blog',
      features: ['10 pages', 'Blog system', 'Team profiles', 'Analytics'],
      liveUrl: '#',
    },
    {
      id: 'pro_2',
      name: 'Health Clinic',
      category: 'Health',
      thumbnail: '/examples/pro-health.jpg',
      description: 'Medical clinic with appointment booking system',
      features: ['8 pages', 'Booking system', 'Doctor profiles', 'Patient portal'],
      liveUrl: '#',
    },
    {
      id: 'pro_3',
      name: 'Law Firm Elite',
      category: 'Legal',
      thumbnail: '/examples/pro-legal.jpg',
      description: 'Professional law firm with case studies and consultations',
      features: ['10 pages', 'Case studies', 'Contact form', 'SEO optimized'],
      liveUrl: '#',
    },
  ],
  premium: [
    {
      id: 'prem_1',
      name: 'Fashion Store',
      category: 'E-commerce',
      thumbnail: '/examples/premium-fashion.jpg',
      description: 'Full e-commerce fashion store with payment integration',
      features: ['Unlimited pages', 'E-commerce', 'Payment gateway', 'Inventory'],
      liveUrl: '#',
    },
    {
      id: 'prem_2',
      name: 'Real Estate Pro',
      category: 'Real Estate',
      thumbnail: '/examples/premium-realestate.jpg',
      description: 'Property listing platform with search and agent system',
      features: ['Unlimited pages', 'Property search', 'Agent portal', 'CRM'],
      liveUrl: '#',
    },
    {
      id: 'prem_3',
      name: 'Restaurant Chain',
      category: 'Restaurant',
      thumbnail: '/examples/premium-restaurant.jpg',
      description: 'Multi-location restaurant with online ordering and reservations',
      features: ['Unlimited pages', 'Online ordering', 'Reservations', 'Multi-location'],
      liveUrl: '#',
    },
  ],
};

const PACKAGE_FEATURES = {
  standard: {
    title: 'Standard Package',
    price: 149,
    color: 'from-gray-600 to-gray-800',
    borderColor: 'border-gray-400',
    icon: Globe,
    description: 'Perfect for small businesses getting started online',
    features: [
      { text: 'Up to 5 pages', included: true },
      { text: 'Mobile responsive design', included: true },
      { text: 'Contact form', included: true },
      { text: 'Basic SEO setup', included: true },
      { text: '1 year hosting', included: true },
      { text: '30 days support', included: true },
      { text: 'Custom domain', included: false },
      { text: 'E-commerce', included: false },
      { text: 'Booking system', included: false },
      { text: 'Priority support', included: false },
    ],
  },
  pro: {
    title: 'Pro Package',
    price: 399,
    color: 'from-blue-600 to-indigo-600',
    borderColor: 'border-blue-500',
    icon: Zap,
    badge: 'Most Popular',
    description: 'Recommended for growing businesses',
    features: [
      { text: 'Up to 10 pages', included: true },
      { text: 'Semi-custom design', included: true },
      { text: 'Booking/Appointment system', included: true },
      { text: 'Photo gallery', included: true },
      { text: 'Custom domain included', included: true },
      { text: 'Full SEO optimization', included: true },
      { text: '90 days support', included: true },
      { text: '3 content updates', included: true },
      { text: 'Analytics dashboard', included: true },
      { text: 'E-commerce', included: false },
    ],
  },
  premium: {
    title: 'Premium Package',
    price: 999,
    color: 'from-purple-600 to-pink-600',
    borderColor: 'border-purple-500',
    icon: Crown,
    badge: 'Best Value',
    description: 'Complete business solution with e-commerce',
    features: [
      { text: 'Unlimited pages', included: true },
      { text: 'Fully custom design', included: true },
      { text: 'E-commerce functionality', included: true },
      { text: 'Payment integration', included: true },
      { text: 'Custom domain + SSL', included: true },
      { text: 'Priority support (1 year)', included: true },
      { text: 'Unlimited updates', included: true },
      { text: 'Advanced analytics', included: true },
      { text: 'Multi-language support', included: true },
      { text: 'CRM integration', included: true },
    ],
  },
};

interface PackageShowcaseProps {
  selectedPackage?: string | null;
  onSelectPackage?: (pkg: string) => void;
}

export function PackageShowcase({ selectedPackage, onSelectPackage }: PackageShowcaseProps) {
  const [activeTab, setActiveTab] = useState('compare');
  const [selectedExample, setSelectedExample] = useState<PackageExample | null>(null);
  const [hoveredPackage, setHoveredPackage] = useState<string | null>(null);

  // Handle package selection with default handler
  const handleSelectPackage = (pkg: string) => {
    if (onSelectPackage) {
      onSelectPackage(pkg);
    }
  };

  const packages = ['standard', 'pro', 'premium'] as const;

  return (
    <div className="space-y-8">
      {/* Package Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {packages.map((pkg) => {
          const info = PACKAGE_FEATURES[pkg];
          const Icon = info.icon;
          const isSelected = selectedPackage === pkg;

          return (
            <div
              key={pkg}
              className={`relative rounded-2xl border-2 transition-all cursor-pointer ${
                isSelected
                  ? `${info.borderColor} shadow-xl scale-105`
                  : 'border-border hover:border-blue-300'
              }`}
              onClick={() => handleSelectPackage(pkg)}
              onMouseEnter={() => setHoveredPackage(pkg)}
              onMouseLeave={() => setHoveredPackage(null)}
            >
              {/* Badge */}
              {info.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge className={`bg-gradient-to-r ${info.color} px-4 py-1`}>
                    <Star className="h-3 w-3 mr-1" />
                    {info.badge}
                  </Badge>
                </div>
              )}

              {/* Header */}
              <div className={`p-6 rounded-t-2xl bg-gradient-to-r ${info.color} text-white`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-white/20">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{info.title}</h3>
                    <p className="text-sm opacity-90">{info.description}</p>
                  </div>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold">${info.price}</span>
                  <span className="opacity-80">one-time</span>
                </div>
              </div>

              {/* Features */}
              <div className="p-6">
                <ul className="space-y-3">
                  {info.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3">
                      {feature.included ? (
                        <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                          <Check className="h-3 w-3 text-green-600" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                          <span className="text-gray-400 text-xs">—</span>
                        </div>
                      )}
                      <span
                        className={`text-sm ${
                          feature.included ? '' : 'text-muted-foreground line-through'
                        }`}
                      >
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full mt-6 ${
                    isSelected
                      ? `bg-gradient-to-r ${info.color}`
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                  variant={isSelected ? 'default' : 'outline'}
                >
                  {isSelected ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Selected
                    </>
                  ) : (
                    'Select Package'
                  )}
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Visual Examples Tabs */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            See What You Get - Real Examples
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="compare">Side by Side</TabsTrigger>
              <TabsTrigger value="standard">Standard Examples</TabsTrigger>
              <TabsTrigger value="pro">Pro Examples</TabsTrigger>
              <TabsTrigger value="premium">Premium Examples</TabsTrigger>
            </TabsList>

            <TabsContent value="compare" className="mt-6">
              <div className="grid md:grid-cols-3 gap-4">
                {packages.map((pkg) => (
                  <div key={pkg} className="space-y-3">
                    <h4 className="font-semibold capitalize text-center">{pkg} Package</h4>
                    <div className="aspect-video bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <Globe className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                        <p className="text-sm text-muted-foreground">Preview</p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground text-center">
                      {pkg === 'standard' && 'Clean, professional design'}
                      {pkg === 'pro' && 'Enhanced features & design'}
                      {pkg === 'premium' && 'Full-featured, custom design'}
                    </p>
                  </div>
                ))}
              </div>
            </TabsContent>

            {packages.map((pkg) => (
              <TabsContent key={pkg} value={pkg} className="mt-6">
                <div className="grid md:grid-cols-3 gap-4">
                  {PACKAGE_EXAMPLES[pkg].map((example) => (
                    <div
                      key={example.id}
                      className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => setSelectedExample(example)}
                    >
                      <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 flex items-center justify-center relative">
                        <div className="text-center">
                          <Globe className="h-12 w-12 mx-auto text-blue-400 mb-2" />
                          <p className="text-sm font-medium">{example.name}</p>
                        </div>
                        <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center">
                          <Play className="h-12 w-12 text-white opacity-0 hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{example.name}</h4>
                          <Badge variant="outline">{example.category}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{example.description}</p>
                        <div className="flex flex-wrap gap-1 mt-3">
                          {example.features.slice(0, 3).map((f, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {f}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Feature Comparison Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Detailed Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Feature</th>
                  <th className="text-center py-3 px-4">Standard</th>
                  <th className="text-center py-3 px-4 bg-blue-50 dark:bg-blue-950">Pro</th>
                  <th className="text-center py-3 px-4">Premium</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: 'Pages', standard: 'Up to 5', pro: 'Up to 10', premium: 'Unlimited' },
                  { feature: 'Design', standard: 'Template-based', pro: 'Semi-custom', premium: 'Fully custom' },
                  { feature: 'Responsive', standard: true, pro: true, premium: true },
                  { feature: 'Contact Form', standard: true, pro: true, premium: true },
                  { feature: 'SEO', standard: 'Basic', pro: 'Full', premium: 'Advanced' },
                  { feature: 'Hosting', standard: '1 year', pro: '1 year', premium: '1 year' },
                  { feature: 'Custom Domain', standard: false, pro: true, premium: true },
                  { feature: 'SSL Certificate', standard: true, pro: true, premium: true },
                  { feature: 'Booking System', standard: false, pro: true, premium: true },
                  { feature: 'E-commerce', standard: false, pro: false, premium: true },
                  { feature: 'Payment Integration', standard: false, pro: false, premium: true },
                  { feature: 'Analytics', standard: false, pro: true, premium: 'Advanced' },
                  { feature: 'Support', standard: '30 days', pro: '90 days', premium: '1 year' },
                  { feature: 'Content Updates', standard: false, pro: '3 updates', premium: 'Unlimited' },
                  { feature: 'Multi-language', standard: false, pro: false, premium: true },
                ].map((row, i) => (
                  <tr key={i} className="border-b">
                    <td className="py-3 px-4 font-medium">{row.feature}</td>
                    <td className="text-center py-3 px-4">
                      {typeof row.standard === 'boolean' ? (
                        row.standard ? (
                          <Check className="h-5 w-5 text-green-500 mx-auto" />
                        ) : (
                          <span className="text-gray-300">—</span>
                        )
                      ) : (
                        row.standard
                      )}
                    </td>
                    <td className="text-center py-3 px-4 bg-blue-50 dark:bg-blue-950">
                      {typeof row.pro === 'boolean' ? (
                        row.pro ? (
                          <Check className="h-5 w-5 text-green-500 mx-auto" />
                        ) : (
                          <span className="text-gray-300">—</span>
                        )
                      ) : (
                        <span className="font-medium">{row.pro}</span>
                      )}
                    </td>
                    <td className="text-center py-3 px-4">
                      {typeof row.premium === 'boolean' ? (
                        row.premium ? (
                          <Check className="h-5 w-5 text-green-500 mx-auto" />
                        ) : (
                          <span className="text-gray-300">—</span>
                        )
                      ) : (
                        row.premium
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Example Preview Modal */}
      <Dialog open={!!selectedExample} onOpenChange={() => setSelectedExample(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedExample?.name}</DialogTitle>
            <DialogDescription>{selectedExample?.description}</DialogDescription>
          </DialogHeader>
          <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
            <div className="text-center">
              <Globe className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Website preview would appear here</p>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            {selectedExample?.liveUrl && (
              <Button asChild>
                <a href={selectedExample.liveUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Live Site
                </a>
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
