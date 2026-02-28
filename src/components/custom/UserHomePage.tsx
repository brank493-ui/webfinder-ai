'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
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
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);

  // Get initials for avatar
  const getUserInitials = (name: string | undefined) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  // Gallery items
  const galleryItems = [
    { id: 1, title: 'Modern Business', category: 'Business', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop' },
    { id: 2, title: 'E-Commerce Store', category: 'Retail', image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop' },
    { id: 3, title: 'Restaurant Website', category: 'Food', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop' },
    { id: 4, title: 'Healthcare Portal', category: 'Health', image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=300&fit=crop' },
    { id: 5, title: 'Tech Startup', category: 'Technology', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop' },
    { id: 6, title: 'Creative Agency', category: 'Creative', image: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=400&h=300&fit=crop' },
  ];

  // Packages
  const packages = [
    {
      id: 'standard',
      name: 'Standard',
      price: 149,
      currency: 'USD',
      description: 'Perfect for small businesses starting their online journey',
      features: [
        '5-page responsive website',
        'Mobile-friendly design',
        'Contact form integration',
        'Basic SEO setup',
        '1 month support',
        'Social media links',
      ],
      popular: false,
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 399,
      currency: 'USD',
      description: 'Ideal for growing businesses with advanced needs',
      features: [
        '10-page custom website',
        'E-commerce ready',
        'Advanced SEO optimization',
        'CMS integration',
        '3 months support',
        'Analytics dashboard',
        'Custom domain setup',
        'Email integration',
      ],
      popular: true,
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 999,
      currency: 'USD',
      description: 'Complete solution for established businesses',
      features: [
        'Unlimited pages',
        'Full e-commerce solution',
        'Custom web application',
        'Priority support (6 months)',
        'Advanced analytics',
        'Multi-language support',
        'API integrations',
        'Custom features',
        'Dedicated manager',
      ],
      popular: false,
    },
  ];

  // Stats
  const stats = [
    { label: 'Projects Delivered', value: '500+' },
    { label: 'Happy Clients', value: '350+' },
    { label: 'Countries Served', value: '25+' },
    { label: 'Years Experience', value: '5+' },
  ];

  // Testimonials
  const testimonials = [
    {
      id: 1,
      name: 'Marie Johnson',
      role: 'Restaurant Owner',
      content: 'WebFinder AI transformed my restaurant business. The website they built increased our online orders by 300%!',
      rating: 5,
    },
    {
      id: 2,
      name: 'David Chen',
      role: 'Tech Startup CEO',
      content: 'Incredible service! They understood our vision and delivered a stunning website that perfectly represents our brand.',
      rating: 5,
    },
    {
      id: 3,
      name: 'Sarah Williams',
      role: 'Fashion Boutique Owner',
      content: 'The e-commerce solution they built for us is amazing. Sales have doubled since launching our new website.',
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
                  <p className="text-blue-200">Business Discovery Platform</p>
                </div>
              </div>

              {/* Welcome Message */}
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-5 py-2 mb-6">
                <Sparkles className="h-5 w-5 text-yellow-300" />
                <span className="font-medium">Welcome back, {user?.name?.split(' ')[0] || 'User'}!</span>
              </div>

              <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Your Digital Journey
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-orange-200">
                  Starts Here
                </span>
              </h2>
              
              <p className="text-lg text-blue-100 mb-8">
                Transform your business with stunning websites, powerful tools, and AI-powered solutions. 
                We bring your vision to life with modern design and cutting-edge technology.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-start gap-4 mb-10">
                <Button 
                  size="lg" 
                  className="bg-white text-blue-600 hover:bg-blue-50 shadow-xl text-base px-6 py-5"
                  onClick={() => onNavigate('onboarding')}
                >
                  <Rocket className="h-5 w-5 mr-2" />
                  Start Your Project
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white/30 text-white hover:bg-white/10 text-base px-6 py-5"
                  onClick={() => document.getElementById('packages')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <Sparkles className="h-5 w-5 mr-2" />
                  View Packages
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
                      <p className="text-gray-500 text-sm">Projects Done</p>
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
                    <span className="text-sm font-medium text-gray-700">+350 clients</span>
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
            <Badge className="bg-blue-100 text-blue-700 mb-4">Our Work</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Stunning Websites We've Built
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore our portfolio of beautifully crafted websites across various industries
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
              View All Projects
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-gradient-to-b from-white to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="bg-blue-100 text-blue-700 mb-4">Our Services</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What We Offer
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Choose from our comprehensive range of web development services tailored to your business needs
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
                <CardTitle className="text-xl">Business Websites</CardTitle>
                <CardDescription>
                  Professional websites that showcase your brand and attract customers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600 mb-4">
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" />Responsive Design</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" />SEO Optimized</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" />Contact Forms</li>
                </ul>
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  onClick={() => onNavigate('onboarding')}
                >
                  Get Started
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
                <CardTitle className="text-xl">E-Commerce Stores</CardTitle>
                <CardDescription>
                  Full-featured online stores to sell your products worldwide
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600 mb-4">
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" />Product Catalog</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" />Secure Payments</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" />Order Management</li>
                </ul>
                <Button 
                  className="w-full bg-purple-600 hover:bg-purple-700"
                  onClick={() => onNavigate('onboarding')}
                >
                  Get Started
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
                <CardTitle className="text-xl">Booking Systems</CardTitle>
                <CardDescription>
                  Online appointment and reservation systems for service businesses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600 mb-4">
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" />Calendar Integration</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" />Automated Reminders</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" />Payment Collection</li>
                </ul>
                <Button 
                  className="w-full bg-green-600 hover:bg-green-700"
                  onClick={() => onNavigate('onboarding')}
                >
                  Get Started
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
                <CardTitle className="text-xl">Landing Pages</CardTitle>
                <CardDescription>
                  High-converting landing pages for marketing campaigns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600 mb-4">
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" />Fast Loading</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" />A/B Testing Ready</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" />Lead Capture</li>
                </ul>
                <Button 
                  className="w-full bg-orange-600 hover:bg-orange-700"
                  onClick={() => onNavigate('onboarding')}
                >
                  Get Started
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
                <CardTitle className="text-xl">Web Applications</CardTitle>
                <CardDescription>
                  Custom web applications for your unique business needs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600 mb-4">
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" />Custom Features</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" />User Management</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" />API Integration</li>
                </ul>
                <Button 
                  className="w-full bg-indigo-600 hover:bg-indigo-700"
                  onClick={() => onNavigate('onboarding')}
                >
                  Get Started
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
                <CardTitle className="text-xl">Website Redesign</CardTitle>
                <CardDescription>
                  Modernize your existing website with a fresh new look
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600 mb-4">
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" />Modern UI/UX</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" />Performance Boost</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" />Mobile Optimization</li>
                </ul>
                <Button 
                  className="w-full bg-pink-600 hover:bg-pink-700"
                  onClick={() => onNavigate('onboarding')}
                >
                  Get Started
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
            <Badge className="bg-purple-100 text-purple-700 mb-4">Pricing</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Choose Your Package
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Select the perfect plan for your business needs. All packages include our premium support.
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
                    Most Popular
                  </div>
                )}
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl font-bold">{pkg.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-gray-900">${pkg.price}</span>
                    <span className="text-gray-500">/project</span>
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
                    {selectedPackage === pkg.id ? 'Selected' : 'Select Package'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-10">
            <p className="text-gray-600 mb-4">Need a custom solution?</p>
            <Button variant="outline" size="lg" className="border-blue-600 text-blue-600">
              <MessageSquare className="h-5 w-5 mr-2" />
              Contact Us for Custom Pricing
            </Button>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="bg-green-100 text-green-700 mb-4">About Us</Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Empowering Businesses with
                <span className="text-blue-600"> Digital Excellence</span>
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                WebFinder AI is a leading web development and business discovery platform founded by 
                Fongang Lamago Brank. We specialize in creating stunning, high-performance websites 
                that help businesses thrive in the digital age.
              </p>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Our AI-powered platform combines cutting-edge technology with creative design to deliver 
                exceptional results. From small startups to established enterprises, we've helped hundreds 
                of businesses establish their online presence and achieve their digital goals.
              </p>

              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="flex items-start gap-3">
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <Award className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Quality First</h4>
                    <p className="text-sm text-gray-600">Premium quality in every project</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-3 bg-green-100 rounded-xl">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Client Focused</h4>
                    <p className="text-sm text-gray-600">Your success is our priority</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-3 bg-purple-100 rounded-xl">
                    <Clock3 className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">On-Time Delivery</h4>
                    <p className="text-sm text-gray-600">Meeting deadlines, every time</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-3 bg-orange-100 rounded-xl">
                    <Heart className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Dedicated Support</h4>
                    <p className="text-sm text-gray-600">24/7 assistance available</p>
                  </div>
                </div>
              </div>

              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                Learn More About Us
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
            <Badge className="bg-yellow-100 text-yellow-700 mb-4">Testimonials</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Clients Say
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Don't just take our word for it - hear from some of our satisfied clients
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
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Let's build something amazing together. Start your project today!
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-blue-50 shadow-xl text-lg px-8"
              onClick={() => onNavigate('onboarding')}
            >
              <Rocket className="h-5 w-5 mr-2" />
              Start Your Project
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white/30 text-white hover:bg-white/10 text-lg px-8"
              asChild
            >
              <a href="tel:+237693401619">
                <Phone className="h-5 w-5 mr-2" />
                Call Us Now
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
                  <p className="text-gray-400 text-sm">Business Discovery Platform</p>
                </div>
              </div>
              <p className="text-gray-400 mb-4">
                Empowering businesses with cutting-edge web solutions and AI-powered tools for digital success.
              </p>
              <div className="flex gap-3">
                <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
                  <Linkedin className="h-5 w-5" />
                </a>
                <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
                  <Instagram className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"><ChevronRight className="h-4 w-4" />Home</a></li>
                <li><a href="#packages" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"><ChevronRight className="h-4 w-4" />Packages</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"><ChevronRight className="h-4 w-4" />About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"><ChevronRight className="h-4 w-4" />Portfolio</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"><ChevronRight className="h-4 w-4" />Contact</a></li>
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Our Services</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"><ChevronRight className="h-4 w-4" />Web Development</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"><ChevronRight className="h-4 w-4" />E-Commerce Solutions</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"><ChevronRight className="h-4 w-4" />SEO Optimization</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"><ChevronRight className="h-4 w-4" />Domain Registration</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"><ChevronRight className="h-4 w-4" />Website Maintenance</a></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-blue-400 mt-0.5" />
                  <div>
                    <p className="text-gray-400">Email</p>
                    <a href="mailto:brank493@gmail.com" className="text-white hover:text-blue-400 transition-colors">brank493@gmail.com</a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-blue-400 mt-0.5" />
                  <div>
                    <p className="text-gray-400">Phone</p>
                    <a href="tel:+237693401619" className="text-white hover:text-blue-400 transition-colors">+237 693 401 619</a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-blue-400 mt-0.5" />
                  <div>
                    <p className="text-gray-400">Location</p>
                    <p className="text-white">Cameroon, Central Africa</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="border-t border-gray-800 pt-8 mb-8">
            <h4 className="text-center text-gray-400 mb-4">Accepted Payment Methods</h4>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="px-4 py-2 bg-gray-800 rounded-lg text-sm">
                <span className="font-semibold text-orange-400">MTN</span> Mobile Money
              </div>
              <div className="px-4 py-2 bg-gray-800 rounded-lg text-sm">
                <span className="font-semibold text-orange-500">Orange</span> Money
              </div>
              <div className="px-4 py-2 bg-gray-800 rounded-lg text-sm">
                <span className="font-semibold text-blue-400">Wave</span>
              </div>
              <div className="px-4 py-2 bg-gray-800 rounded-lg text-sm">
                <span className="font-semibold text-blue-600">Stripe</span>
              </div>
              <div className="px-4 py-2 bg-gray-800 rounded-lg text-sm">
                <span className="font-semibold text-green-400">MPesa</span>
              </div>
              <div className="px-4 py-2 bg-gray-800 rounded-lg text-sm">
                <span className="font-semibold text-gray-300">Bank Transfer</span>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-gray-400 text-sm">
                © {new Date().getFullYear()} WebFinder AI. All rights reserved. Owned by Fongang Lamago Brank.
              </p>
              <div className="flex gap-6">
                <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy Policy</a>
                <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Terms of Service</a>
                <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Cookie Policy</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
