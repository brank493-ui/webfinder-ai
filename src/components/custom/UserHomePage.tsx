'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
  Globe,
  Clock,
  CheckCircle2,
  MessageSquare,
  CreditCard,
  Calendar,
  Mail,
  Phone,
  Sparkles,
  ArrowRight,
  Zap,
  FileText,
  User,
  Shield,
  LayoutDashboard,
  ClipboardList,
  TrendingUp,
  Rocket,
  Eye,
  Star,
  Users,
  Award,
  Clock3,
  MapPin,
  Send,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  ChevronRight,
  Play,
  Quote,
  Heart,
} from 'lucide-react';

interface UserHomePageProps {
  onNavigate: (page: 'home' | 'dashboard' | 'onboarding' | 'gallery') => void;
}

export function UserHomePage({ onNavigate }: UserHomePageProps) {
  const { user } = useAuthStore();
  const { t } = useLanguageStore();
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);

  // Get initials for avatar
  const getUserInitials = (name: string | undefined) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  // Gallery items
  const galleryItems = [
    { id: 1, title: t('services.businessWebsites'), category: t('category.business'), image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop' },
    { id: 2, title: t('services.ecommerceStores'), category: t('category.retail'), image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop' },
    { id: 3, title: 'Restaurant Website', category: t('category.food'), image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop' },
    { id: 4, title: 'Healthcare Portal', category: t('category.health'), image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=300&fit=crop' },
    { id: 5, title: 'Tech Startup', category: t('category.technology'), image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop' },
    { id: 6, title: 'Creative Agency', category: t('category.creative'), image: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=400&h=300&fit=crop' },
  ];

  // Packages
  const packages = [
    {
      id: 'standard',
      name: t('package.standard'),
      price: 149,
      currency: 'USD',
      description: t('package.standardDesc'),
      features: [
        t('package.standardFeature1'),
        t('package.standardFeature2'),
        t('package.standardFeature3'),
        t('package.standardFeature4'),
        t('package.standardFeature5'),
        t('package.standardFeature6'),
      ],
      popular: false,
    },
    {
      id: 'pro',
      name: t('package.pro'),
      price: 399,
      currency: 'USD',
      description: t('package.proDesc'),
      features: [
        t('package.proFeature1'),
        t('package.proFeature2'),
        t('package.proFeature3'),
        t('package.proFeature4'),
        t('package.proFeature5'),
        t('package.proFeature6'),
        t('package.proFeature7'),
        t('package.proFeature8'),
      ],
      popular: true,
    },
    {
      id: 'premium',
      name: t('package.premium'),
      price: 999,
      currency: 'USD',
      description: t('package.premiumDesc'),
      features: [
        t('package.premiumFeature1'),
        t('package.premiumFeature2'),
        t('package.premiumFeature3'),
        t('package.premiumFeature4'),
        t('package.premiumFeature5'),
        t('package.premiumFeature6'),
        t('package.premiumFeature7'),
        t('package.premiumFeature8'),
        t('package.premiumFeature9'),
      ],
      popular: false,
    },
  ];

  // Stats
  const stats = [
    { label: t('stats.projectsDelivered'), value: '500+' },
    { label: t('stats.happyClients'), value: '350+' },
    { label: t('stats.countriesServed'), value: '25+' },
    { label: t('stats.yearsExperience'), value: '5+' },
  ];

  // Testimonials
  const testimonials = [
    {
      id: 1,
      name: t('testimonials.marieName'),
      role: t('testimonials.marieRole'),
      content: t('testimonials.marieContent'),
      rating: 5,
    },
    {
      id: 2,
      name: t('testimonials.davidName'),
      role: t('testimonials.davidRole'),
      content: t('testimonials.davidContent'),
      rating: 5,
    },
    {
      id: 3,
      name: t('testimonials.sarahName'),
      role: t('testimonials.sarahRole'),
      content: t('testimonials.sarahContent'),
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
          <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
        </div>
        
        <div className="container mx-auto px-4 py-16 md:py-24 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text Content */}
            <div className="max-w-xl">
              {/* Logo and Brand */}
              <div className="flex items-center gap-4 mb-8">
                <img
                  src="/webfinder-logo-new.png"
                  alt="WebFinder AI"
                  className="h-16 w-16 rounded-2xl shadow-2xl"
                />
                <div className="text-left">
                  <h1 className="text-3xl font-bold">WebFinder AI</h1>
                  <p className="text-blue-200">{t('common.businessDiscovery')}</p>
                </div>
              </div>

              {/* Welcome Message */}
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-5 py-2 mb-6">
                <Sparkles className="h-5 w-5 text-yellow-300" />
                <span className="font-medium">{t('userHome.welcomeBack')}, {user?.name?.split(' ')[0] || 'User'}!</span>
              </div>

              <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                {t('userHome.digitalJourney')}
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-orange-200">
                  {t('userHome.startsHere')}
                </span>
              </h2>
              
              <p className="text-lg text-blue-100 mb-8">
                {t('userHome.heroDescription')}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-start gap-4 mb-10">
                <Button 
                  size="lg" 
                  className="bg-white text-blue-600 hover:bg-blue-50 shadow-xl text-base px-6 py-5"
                  onClick={() => onNavigate('onboarding')}
                >
                  <Rocket className="h-5 w-5 mr-2" />
                  {t('home.startProject')}
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white/30 text-white hover:bg-white/10 text-base px-6 py-5"
                  onClick={() => document.getElementById('packages')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <Sparkles className="h-5 w-5 mr-2" />
                  {t('userHome.viewPackages')}
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                  <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-blue-200 text-xs">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column - Hero Image */}
            <div className="hidden lg:block relative">
              <div className="relative">
                {/* Main Image - Custom Web Development Workspace */}
                <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl">
                  <img 
                    src="/web-dev-hero.png"
                    alt="WebFinder AI - Professional Web Development"
                    className="w-full h-auto object-cover"
                  />
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/30 to-transparent" />
                </div>
                
                {/* Floating Elements */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-xl animate-bounce">
                  <Globe className="h-10 w-10 text-white" />
                </div>
                
                <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-xl">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 bg-green-100 rounded-xl flex items-center justify-center">
                      <CheckCircle2 className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-gray-900 font-bold">500+</p>
                      <p className="text-gray-500 text-sm">{t('stats.projectsDone')}</p>
                    </div>
                  </div>
                </div>

                <div className="absolute top-1/2 -right-8 bg-white rounded-2xl p-3 shadow-xl">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">M</div>
                      <div className="h-8 w-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">J</div>
                      <div className="h-8 w-8 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">S</div>
                    </div>
                    <span className="text-sm font-medium text-gray-700">+350 {t('stats.clients')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="bg-blue-100 text-blue-700 mb-4">{t('gallery.ourWork')}</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('gallery.title')}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t('gallery.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryItems.map((item) => (
              <div 
                key={item.id} 
                className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <div className="aspect-[4/3] bg-gray-100">
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <Badge className="bg-white/20 text-white mb-2">{item.category}</Badge>
                    <h3 className="text-xl font-bold text-white">{item.title}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Button 
              variant="outline" 
              size="lg" 
              className="border-blue-600 text-blue-600 hover:bg-blue-50"
              onClick={() => onNavigate('gallery')}
            >
              {t('gallery.viewAllProjects')}
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-gradient-to-b from-white to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="bg-blue-100 text-blue-700 mb-4">{t('home.ourServices')}</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('services.title')}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t('services.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Service 1 */}
            <Card className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg overflow-hidden">
              <div className="h-3 bg-gradient-to-r from-blue-500 to-blue-600" />
              <CardHeader>
                <div className="h-14 w-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Globe className="h-7 w-7 text-blue-600" />
                </div>
                <CardTitle className="text-xl">{t('services.businessWebsites')}</CardTitle>
                <CardDescription>
                  {t('services.businessWebsitesDesc')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600 mb-4">
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" />{t('services.responsiveDesign')}</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" />{t('services.seoOptimized')}</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" />{t('services.contactForms')}</li>
                </ul>
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  onClick={() => onNavigate('onboarding')}
                >
                  {t('home.getStarted')}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            {/* Service 2 */}
            <Card className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg overflow-hidden">
              <div className="h-3 bg-gradient-to-r from-purple-500 to-purple-600" />
              <CardHeader>
                <div className="h-14 w-14 bg-purple-100 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <TrendingUp className="h-7 w-7 text-purple-600" />
                </div>
                <CardTitle className="text-xl">{t('services.ecommerceStores')}</CardTitle>
                <CardDescription>
                  {t('services.ecommerceStoresDesc')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600 mb-4">
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" />{t('services.productCatalog')}</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" />{t('services.securePayments')}</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" />{t('services.orderManagement')}</li>
                </ul>
                <Button 
                  className="w-full bg-purple-600 hover:bg-purple-700"
                  onClick={() => onNavigate('onboarding')}
                >
                  {t('home.getStarted')}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            {/* Service 3 */}
            <Card className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg overflow-hidden">
              <div className="h-3 bg-gradient-to-r from-green-500 to-green-600" />
              <CardHeader>
                <div className="h-14 w-14 bg-green-100 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Users className="h-7 w-7 text-green-600" />
                </div>
                <CardTitle className="text-xl">{t('services.bookingSystems')}</CardTitle>
                <CardDescription>
                  {t('services.bookingSystemsDesc')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600 mb-4">
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" />{t('services.calendarIntegration')}</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" />{t('services.automatedReminders')}</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" />{t('services.paymentCollection')}</li>
                </ul>
                <Button 
                  className="w-full bg-green-600 hover:bg-green-700"
                  onClick={() => onNavigate('onboarding')}
                >
                  {t('home.getStarted')}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            {/* Service 4 */}
            <Card className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg overflow-hidden">
              <div className="h-3 bg-gradient-to-r from-orange-500 to-orange-600" />
              <CardHeader>
                <div className="h-14 w-14 bg-orange-100 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <FileText className="h-7 w-7 text-orange-600" />
                </div>
                <CardTitle className="text-xl">{t('services.landingPages')}</CardTitle>
                <CardDescription>
                  {t('services.landingPagesDesc')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600 mb-4">
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" />{t('services.fastLoading')}</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" />{t('services.abTestingReady')}</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" />{t('services.leadCapture')}</li>
                </ul>
                <Button 
                  className="w-full bg-orange-600 hover:bg-orange-700"
                  onClick={() => onNavigate('onboarding')}
                >
                  {t('home.getStarted')}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            {/* Service 5 */}
            <Card className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg overflow-hidden">
              <div className="h-3 bg-gradient-to-r from-indigo-500 to-indigo-600" />
              <CardHeader>
                <div className="h-14 w-14 bg-indigo-100 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Shield className="h-7 w-7 text-indigo-600" />
                </div>
                <CardTitle className="text-xl">{t('services.webApplications')}</CardTitle>
                <CardDescription>
                  {t('services.webApplicationsDesc')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600 mb-4">
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" />{t('services.customFeatures')}</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" />{t('services.userManagement')}</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" />{t('services.apiIntegration')}</li>
                </ul>
                <Button 
                  className="w-full bg-indigo-600 hover:bg-indigo-700"
                  onClick={() => onNavigate('onboarding')}
                >
                  {t('home.getStarted')}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            {/* Service 6 */}
            <Card className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg overflow-hidden">
              <div className="h-3 bg-gradient-to-r from-pink-500 to-pink-600" />
              <CardHeader>
                <div className="h-14 w-14 bg-pink-100 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Eye className="h-7 w-7 text-pink-600" />
                </div>
                <CardTitle className="text-xl">{t('services.websiteRedesign')}</CardTitle>
                <CardDescription>
                  {t('services.websiteRedesignDesc')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600 mb-4">
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" />{t('services.modernUiUx')}</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" />{t('services.performanceBoost')}</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" />{t('services.mobileOptimization')}</li>
                </ul>
                <Button 
                  className="w-full bg-pink-600 hover:bg-pink-700"
                  onClick={() => onNavigate('onboarding')}
                >
                  {t('home.getStarted')}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section id="packages" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="bg-purple-100 text-purple-700 mb-4">{t('package.pricing')}</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('package.title')}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t('package.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {packages.map((pkg) => (
              <Card 
                key={pkg.id}
                className={`relative overflow-hidden transition-all duration-300 hover:shadow-2xl ${
                  pkg.popular ? 'border-2 border-blue-500 shadow-xl scale-105' : 'border border-gray-200'
                } ${selectedPackage === pkg.id ? 'ring-4 ring-blue-300' : ''}`}
              >
                {pkg.popular && (
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-1 text-sm font-medium rounded-bl-lg">
                    {t('package.mostPopular')}
                  </div>
                )}
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl font-bold">{pkg.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-gray-900">${pkg.price}</span>
                    <span className="text-gray-500">/{t('package.perProject')}</span>
                  </div>
                  <CardDescription className="mt-2">{pkg.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {pkg.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full ${pkg.popular ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700' : 'bg-gray-900 hover:bg-gray-800'}`}
                    onClick={() => setSelectedPackage(pkg.id)}
                  >
                    {selectedPackage === pkg.id ? t('package.selected') : t('package.selectPackage')}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-10">
            <p className="text-gray-600 mb-4">{t('package.needCustom')}</p>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-blue-600 text-blue-600"
              onClick={() => window.location.href = 'mailto:brank493@gmail.com?subject=Custom%20Package%20Inquiry'}
            >
              <MessageSquare className="h-5 w-5 mr-2" />
              {t('package.contactCustom')}
            </Button>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="bg-green-100 text-green-700 mb-4">{t('about.title')}</Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                {t('about.heading')}
                <span className="text-blue-600"> {t('about.highlight')}</span>
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {t('about.paragraph1')}
              </p>
              <p className="text-gray-600 mb-8 leading-relaxed">
                {t('about.paragraph2')}
              </p>

              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="flex items-start gap-3">
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <Award className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{t('about.qualityFirst')}</h4>
                    <p className="text-sm text-gray-600">{t('about.qualityFirstDesc')}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-3 bg-green-100 rounded-xl">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{t('about.clientFocused')}</h4>
                    <p className="text-sm text-gray-600">{t('about.clientFocusedDesc')}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-3 bg-purple-100 rounded-xl">
                    <Clock3 className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{t('about.onTimeDelivery')}</h4>
                    <p className="text-sm text-gray-600">{t('about.onTimeDeliveryDesc')}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-3 bg-orange-100 rounded-xl">
                    <Heart className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{t('about.dedicatedSupport')}</h4>
                    <p className="text-sm text-gray-600">{t('about.dedicatedSupportDesc')}</p>
                  </div>
                </div>
              </div>

              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                onClick={() => document.getElementById('about-section')?.scrollIntoView({ behavior: 'smooth' })}
              >
                {t('about.learnMoreAboutUs')}
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </div>

            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="rounded-2xl overflow-hidden shadow-lg">
                    <img 
                      src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=300&fit=crop" 
                      alt="Team collaboration"
                      className="w-full h-48 object-cover"
                    />
                  </div>
                  <div className="rounded-2xl overflow-hidden shadow-lg">
                    <img 
                      src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=400&fit=crop" 
                      alt="Modern office"
                      className="w-full h-64 object-cover"
                    />
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="rounded-2xl overflow-hidden shadow-lg">
                    <img 
                      src="https://images.unsplash.com/photo-1553877522-43269d4ea984?w=400&h=400&fit=crop" 
                      alt="Creative workspace"
                      className="w-full h-64 object-cover"
                    />
                  </div>
                  <div className="rounded-2xl overflow-hidden shadow-lg">
                    <img 
                      src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&h=300&fit=crop" 
                      alt="Team meeting"
                      className="w-full h-48 object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="bg-yellow-100 text-yellow-700 mb-4">{t('testimonials.title')}</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('testimonials.title')}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t('testimonials.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <Quote className="h-8 w-8 text-blue-200 mb-4" />
                  <p className="text-gray-600 mb-6 italic">{testimonial.content}</p>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-blue-600 text-white">
                        {testimonial.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-gray-900">{testimonial.name}</p>
                      <p className="text-sm text-gray-500">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {t('cta.title')}
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            {t('cta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-blue-50 shadow-xl text-lg px-8"
              onClick={() => onNavigate('onboarding')}
            >
              <Rocket className="h-5 w-5 mr-2" />
              {t('cta.startProject')}
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white/30 text-white hover:bg-white/10 text-lg px-8"
              asChild
            >
              <a href="tel:+237693401619">
                <Phone className="h-5 w-5 mr-2" />
                {t('cta.callUsNow')}
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white pt-16 pb-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Brand Column */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img
                  src="/webfinder-logo-new.png"
                  alt="WebFinder AI"
                  className="h-12 w-12 rounded-xl"
                />
                <div>
                  <h3 className="text-xl font-bold">WebFinder AI</h3>
                  <p className="text-gray-400 text-sm">{t('common.businessDiscovery')}</p>
                </div>
              </div>
              <p className="text-gray-400 mb-4">
                {t('footer.description')}
              </p>
              <div className="flex gap-3">
                <a href="https://facebook.com/webfinderai" target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href="https://twitter.com/webfinderai" target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="https://linkedin.com/company/webfinderai" target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
                  <Linkedin className="h-5 w-5" />
                </a>
                <a href="https://instagram.com/webfinderai" target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
                  <Instagram className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">{t('nav.quickLinks')}</h4>
              <ul className="space-y-2">
                <li><button onClick={() => onNavigate('home')} className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"><ChevronRight className="h-4 w-4" />{t('nav.home')}</button></li>
                <li><a href="#packages" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"><ChevronRight className="h-4 w-4" />{t('home.ourPackages')}</a></li>
                <li><button onClick={() => onNavigate('onboarding')} className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"><ChevronRight className="h-4 w-4" />{t('about.title')}</button></li>
                <li><button onClick={() => onNavigate('gallery')} className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"><ChevronRight className="h-4 w-4" />{t('nav.gallery')}</button></li>
                <li><a href="mailto:brank493@gmail.com" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"><ChevronRight className="h-4 w-4" />{t('nav.contact')}</a></li>
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="text-lg font-semibold mb-4">{t('footer.ourServices')}</h4>
              <ul className="space-y-2">
                <li><button onClick={() => onNavigate('onboarding')} className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"><ChevronRight className="h-4 w-4" />{t('footer.webDevelopment')}</button></li>
                <li><button onClick={() => onNavigate('onboarding')} className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"><ChevronRight className="h-4 w-4" />{t('footer.ecommerceSolutions')}</button></li>
                <li><button onClick={() => onNavigate('onboarding')} className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"><ChevronRight className="h-4 w-4" />{t('footer.seoOptimization')}</button></li>
                <li><button onClick={() => onNavigate('onboarding')} className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"><ChevronRight className="h-4 w-4" />{t('footer.domainRegistration')}</button></li>
                <li><button onClick={() => onNavigate('onboarding')} className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"><ChevronRight className="h-4 w-4" />{t('footer.websiteMaintenance')}</button></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-semibold mb-4">{t('nav.contact')}</h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-blue-400 mt-0.5" />
                  <div>
                    <p className="text-gray-400">{t('auth.email')}</p>
                    <a href="mailto:brank493@gmail.com" className="text-white hover:text-blue-400 transition-colors">brank493@gmail.com</a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-blue-400 mt-0.5" />
                  <div>
                    <p className="text-gray-400">{t('auth.phone')}</p>
                    <a href="tel:+237693401619" className="text-white hover:text-blue-400 transition-colors">+237 693 401 619</a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-blue-400 mt-0.5" />
                  <div>
                    <p className="text-gray-400">{t('auth.country')}</p>
                    <p className="text-white">Cameroon, West Africa</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-400 text-sm">
                © {new Date().getFullYear()} WebFinder AI. {t('footer.rights')}
              </p>
              <p className="text-gray-400 text-sm">
                {t('footer.ownedBy')} <span className="text-white font-medium">Fongang Lamago Brank</span>
              </p>
              <div className="flex gap-6 text-sm">
                <button onClick={() => window.location.href = 'mailto:brank493@gmail.com?subject=Privacy%20Policy%20Request'} className="text-gray-400 hover:text-white transition-colors">{t('nav.privacyPolicy')}</button>
                <button onClick={() => window.location.href = 'mailto:brank493@gmail.com?subject=Terms%20of%20Service%20Request'} className="text-gray-400 hover:text-white transition-colors">{t('nav.termsOfService')}</button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
