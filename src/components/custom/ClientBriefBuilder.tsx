'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  Palette,
  Layout,
  Globe,
  FileText,
  Image as ImageIcon,
  Clock,
  Users,
  Mail,
  Phone,
  MapPin,
  Sparkles,
  Loader2,
  Download,
  Building,
  Briefcase,
  Target,
  Link,
  Server,
  Search,
  Shield,
  Calendar,
  DollarSign,
  FileCheck,
  Globe2,
  Share2,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export interface BriefData {
  // Business Information
  businessName: string;
  legalBusinessName: string;
  businessType: string;
  industry: string;
  otherIndustry: string;
  foundingYear: string;
  employeeCount: string;
  annualRevenue: string;
  businessRegistrationNumber: string;
  taxId: string;
  description: string;
  missionStatement: string;
  visionStatement: string;
  coreValues: string;
  targetAudience: string;
  targetAgeRange: string;
  targetLocation: string;
  targetIncome: string;
  primaryGoals: string;
  uniqueSelling: string;
  competitiveAdvantage: string;
  brandPersonality: string;
  
  // Contact Information
  contactName: string;
  contactPosition: string;
  email: string;
  alternativeEmail: string;
  phone: string;
  alternativePhone: string;
  whatsappNumber: string;
  preferredContactMethod: string;
  bestTimeToContact: string;
  country: string;
  city: string;
  address: string;
  postalCode: string;
  timezone: string;
  
  // Social Media & Online Presence
  currentWebsite: string;
  facebook: string;
  instagram: string;
  twitter: string;
  linkedin: string;
  youtube: string;
  tiktok: string;
  otherSocial: string;
  
  // Design Preferences
  style: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  fontPreference: string;
  fontSizePreference: string;
  layoutStyle: string;
  headerStyle: string;
  navigationStyle: string;
  footerStyle: string;
  animationPreference: string;
  iconStyle: string;
  imageStyle: string;
  buttonStyle: string;
  formStyle: string;
  referenceWebsites: string;
  websitesYouLike: string;
  websitesYouDislike: string;
  designInspiration: string;
  
  // Pages & Content
  pagesNeeded: string[];
  pageDetails: Record<string, { title: string; description: string; sections: string }>;
  contentLanguage: string;
  additionalLanguages: string;
  hasSlogan: boolean;
  slogan: string;
  hasTagline: boolean;
  tagline: string;
  
  // Features & Functionality
  mainFeatures: string[];
  specialFeatures: string;
  ecommerceNeeds: string;
  paymentMethods: string[];
  shippingNeeds: string;
  bookingType: string;
  membershipType: string;
  userAccounts: boolean;
  userAccountFeatures: string[];
  dashboardNeeds: string;
  
  // Technical Requirements
  domainStatus: string;
  preferredDomain: string;
  currentHosting: string;
  hostingPreference: string;
  sslRequired: boolean;
  cdnRequired: boolean;
  backupFrequency: string;
  securityRequirements: string;
  performanceRequirements: string;
  browserSupport: string[];
  deviceSupport: string[];
  integrationNeeds: string[];
  apiRequirements: string;
  
  // SEO & Marketing
  seoLevel: string;
  targetKeywords: string;
  localSeo: boolean;
  googleBusinessProfile: string;
  analyticsPreference: string;
  newsletterIntegration: boolean;
  crmIntegration: string;
  marketingAutomation: string;
  
  // Competitor Analysis
  mainCompetitors: string;
  competitorWebsites: string;
  competitorStrengths: string;
  competitorWeaknesses: string;
  differentiationStrategy: string;
  
  // Brand Assets
  hasLogo: boolean;
  logoFormat: string;
  logoFile: string;
  hasBrandGuidelines: boolean;
  brandColors: string;
  hasFonts: boolean;
  brandFonts: string;
  hasImages: boolean;
  imageCount: string;
  hasVideos: boolean;
  videoLinks: string;
  hasContent: boolean;
  contentFormat: string;
  hasTestimonials: boolean;
  testimonials: string;
  hasCaseStudies: boolean;
  caseStudies: string;
  
  // Timeline & Budget
  deadline: string;
  launchDate: string;
  budget: string;
  paymentPreference: string;
  milestones: string;
  
  // Additional Information
  additionalNotes: string;
  previousWebsiteIssues: string;
  mustHaves: string;
  niceToHaves: string;
  dealBreakers: string;
  successMetrics: string;
  maintenancePlan: string;
  trainingNeeds: string;
  longTermVision: string;
  
  // Agreement
  termsAccepted: boolean;
  marketingConsent: boolean;
}

const initialBrief: BriefData = {
  businessName: '',
  legalBusinessName: '',
  businessType: '',
  industry: '',
  otherIndustry: '',
  foundingYear: '',
  employeeCount: '',
  annualRevenue: '',
  businessRegistrationNumber: '',
  taxId: '',
  description: '',
  missionStatement: '',
  visionStatement: '',
  coreValues: '',
  targetAudience: '',
  targetAgeRange: '',
  targetLocation: '',
  targetIncome: '',
  primaryGoals: '',
  uniqueSelling: '',
  competitiveAdvantage: '',
  brandPersonality: '',
  contactName: '',
  contactPosition: '',
  email: '',
  alternativeEmail: '',
  phone: '',
  alternativePhone: '',
  whatsappNumber: '',
  preferredContactMethod: 'email',
  bestTimeToContact: '',
  country: '',
  city: '',
  address: '',
  postalCode: '',
  timezone: '',
  currentWebsite: '',
  facebook: '',
  instagram: '',
  twitter: '',
  linkedin: '',
  youtube: '',
  tiktok: '',
  otherSocial: '',
  style: 'modern',
  primaryColor: '#2563EB',
  secondaryColor: '#1E40AF',
  accentColor: '#7C3AED',
  backgroundColor: '#FFFFFF',
  fontPreference: 'modern',
  fontSizePreference: 'medium',
  layoutStyle: 'wide',
  headerStyle: 'fixed',
  navigationStyle: 'horizontal',
  footerStyle: 'standard',
  animationPreference: 'subtle',
  iconStyle: 'filled',
  imageStyle: 'modern',
  buttonStyle: 'rounded',
  formStyle: 'modern',
  referenceWebsites: '',
  websitesYouLike: '',
  websitesYouDislike: '',
  designInspiration: '',
  pagesNeeded: [],
  pageDetails: {},
  contentLanguage: 'en',
  additionalLanguages: '',
  hasSlogan: false,
  slogan: '',
  hasTagline: false,
  tagline: '',
  mainFeatures: [],
  specialFeatures: '',
  ecommerceNeeds: '',
  paymentMethods: [],
  shippingNeeds: '',
  bookingType: '',
  membershipType: '',
  userAccounts: false,
  userAccountFeatures: [],
  dashboardNeeds: '',
  domainStatus: 'need_new',
  preferredDomain: '',
  currentHosting: '',
  hostingPreference: '',
  sslRequired: true,
  cdnRequired: false,
  backupFrequency: 'weekly',
  securityRequirements: '',
  performanceRequirements: '',
  browserSupport: ['chrome', 'firefox', 'safari', 'edge'],
  deviceSupport: ['desktop', 'tablet', 'mobile'],
  integrationNeeds: [],
  apiRequirements: '',
  seoLevel: 'standard',
  targetKeywords: '',
  localSeo: false,
  googleBusinessProfile: '',
  analyticsPreference: 'google',
  newsletterIntegration: false,
  crmIntegration: '',
  marketingAutomation: '',
  mainCompetitors: '',
  competitorWebsites: '',
  competitorStrengths: '',
  competitorWeaknesses: '',
  differentiationStrategy: '',
  hasLogo: false,
  logoFormat: '',
  logoFile: '',
  hasBrandGuidelines: false,
  brandColors: '',
  hasFonts: false,
  brandFonts: '',
  hasImages: false,
  imageCount: '',
  hasVideos: false,
  videoLinks: '',
  hasContent: false,
  contentFormat: '',
  hasTestimonials: false,
  testimonials: '',
  hasCaseStudies: false,
  caseStudies: '',
  deadline: '',
  launchDate: '',
  budget: '',
  paymentPreference: '',
  milestones: '',
  additionalNotes: '',
  previousWebsiteIssues: '',
  mustHaves: '',
  niceToHaves: '',
  dealBreakers: '',
  successMetrics: '',
  maintenancePlan: '',
  trainingNeeds: '',
  longTermVision: '',
  termsAccepted: false,
  marketingConsent: false,
};

const PAGE_OPTIONS = [
  { id: 'home', label: 'Home', description: 'Main landing page with hero section and key information' },
  { id: 'about', label: 'About Us', description: 'Company story, mission, vision, and team' },
  { id: 'services', label: 'Services', description: 'Products or services offered with details' },
  { id: 'products', label: 'Products/Shop', description: 'Product catalog or e-commerce shop' },
  { id: 'gallery', label: 'Gallery', description: 'Image/video gallery with lightbox' },
  { id: 'portfolio', label: 'Portfolio', description: 'Work samples and case studies' },
  { id: 'blog', label: 'Blog', description: 'News, articles, and updates' },
  { id: 'contact', label: 'Contact', description: 'Contact form, map, and contact details' },
  { id: 'testimonials', label: 'Testimonials', description: 'Customer reviews and feedback' },
  { id: 'faq', label: 'FAQ', description: 'Frequently asked questions' },
  { id: 'booking', label: 'Booking/Appointment', description: 'Appointment scheduling system' },
  { id: 'team', label: 'Team/Staff', description: 'Staff profiles and bios' },
  { id: 'pricing', label: 'Pricing', description: 'Price lists and service plans' },
  { id: 'careers', label: 'Careers', description: 'Job listings and applications' },
  { id: 'events', label: 'Events', description: 'Upcoming events and calendar' },
  { id: 'news', label: 'News', description: 'Company news and press releases' },
  { id: 'downloads', label: 'Downloads/Resources', description: 'Downloadable files and resources' },
  { id: 'support', label: 'Support/Help', description: 'Help center and support tickets' },
];

const FEATURE_OPTIONS = [
  { id: 'contact-form', label: 'Contact Form', description: 'Multi-field contact form with validation' },
  { id: 'booking', label: 'Booking System', description: 'Appointment scheduling and calendar' },
  { id: 'gallery', label: 'Photo Gallery', description: 'Image gallery with lightbox' },
  { id: 'video-gallery', label: 'Video Gallery', description: 'Video showcase and playlists' },
  { id: 'map', label: 'Location Map', description: 'Google Maps integration' },
  { id: 'social', label: 'Social Media Integration', description: 'Feeds, share buttons, links' },
  { id: 'newsletter', label: 'Newsletter Signup', description: 'Email subscription form' },
  { id: 'testimonials', label: 'Testimonials Slider', description: 'Customer reviews carousel' },
  { id: 'blog', label: 'Blog System', description: 'Full blog with categories and tags' },
  { id: 'ecommerce', label: 'E-commerce', description: 'Full online shop with cart' },
  { id: 'payment', label: 'Payment Integration', description: 'Accept online payments' },
  { id: 'chat', label: 'Live Chat', description: 'WhatsApp or live chat widget' },
  { id: 'analytics', label: 'Analytics Dashboard', description: 'Website statistics tracking' },
  { id: 'search', label: 'Search Functionality', description: 'Site search with filters' },
  { id: 'membership', label: 'Membership System', description: 'User accounts and roles' },
  { id: 'forum', label: 'Forum/Community', description: 'Discussion boards' },
  { id: 'calculator', label: 'Calculator/Quote Tool', description: 'Price or service calculator' },
  { id: 'quiz', label: 'Quiz/Survey', description: 'Interactive questionnaires' },
  { id: 'portfolio', label: 'Portfolio Filter', description: 'Filterable project showcase' },
  { id: 'countdown', label: 'Countdown Timer', description: 'Event countdown' },
  { id: 'progress-tracker', label: 'Progress Tracker', description: 'Project status tracking' },
  { id: 'document-sign', label: 'Document Signing', description: 'E-signature functionality' },
];

const STYLE_OPTIONS = [
  { id: 'modern', label: 'Modern & Clean', description: 'Minimalist with lots of white space' },
  { id: 'classic', label: 'Classic & Professional', description: 'Traditional business style' },
  { id: 'bold', label: 'Bold & Creative', description: 'Vibrant colors, unique layouts' },
  { id: 'elegant', label: 'Elegant & Luxurious', description: 'Premium, sophisticated look' },
  { id: 'playful', label: 'Playful & Fun', description: 'Colorful, animated elements' },
  { id: 'corporate', label: 'Corporate', description: 'Formal, trustworthy appearance' },
  { id: 'minimalist', label: 'Ultra Minimalist', description: 'Maximum simplicity and focus' },
  { id: 'retro', label: 'Retro/Vintage', description: 'Classic nostalgic design' },
];

const INDUSTRY_OPTIONS = [
  'Restaurant & Food Services',
  'Retail & E-commerce',
  'Health & Medical',
  'Beauty & Wellness',
  'Technology & Software',
  'Education & Training',
  'Real Estate & Property',
  'Legal Services',
  'Financial Services',
  'Automotive',
  'Hospitality & Travel',
  'Professional Services',
  'Entertainment & Media',
  'Sports & Fitness',
  'Non-Profit & Charity',
  'Government & Public Sector',
  'Manufacturing',
  'Construction & Architecture',
  'Agriculture & Farming',
  'Other',
];

const BUSINESS_TYPE_OPTIONS = [
  'Sole Proprietorship',
  'Partnership',
  'Limited Liability Company (LLC)',
  'Corporation',
  'Non-Profit Organization',
  'Freelancer/Self-Employed',
  'Startup',
  'Government Agency',
  'Other',
];

const EMPLOYEE_COUNT_OPTIONS = [
  'Just me (1)',
  '2-10 employees',
  '11-50 employees',
  '51-200 employees',
  '201-500 employees',
  '500+ employees',
];

const REVENUE_OPTIONS = [
  'Pre-revenue / Startup',
  'Under $50,000/year',
  '$50,000 - $100,000/year',
  '$100,000 - $500,000/year',
  '$500,000 - $1,000,000/year',
  '$1,000,000 - $5,000,000/year',
  '$5,000,000+/year',
];

const PAYMENT_METHOD_OPTIONS = [
  { id: 'stripe', label: 'Credit/Debit Cards (Stripe)' },
  { id: 'paypal', label: 'PayPal' },
  { id: 'orange-money', label: 'Orange Money' },
  { id: 'mtn-money', label: 'MTN Mobile Money' },
  { id: 'wave', label: 'Wave' },
  { id: 'mpesa', label: 'M-Pesa' },
  { id: 'bank-transfer', label: 'Bank Transfer' },
  { id: 'crypto', label: 'Cryptocurrency' },
];

const INTEGRATION_OPTIONS = [
  { id: 'google-analytics', label: 'Google Analytics' },
  { id: 'google-tag-manager', label: 'Google Tag Manager' },
  { id: 'facebook-pixel', label: 'Facebook Pixel' },
  { id: 'mailchimp', label: 'Mailchimp' },
  { id: 'hubspot', label: 'HubSpot' },
  { id: 'salesforce', label: 'Salesforce' },
  { id: 'zapier', label: 'Zapier' },
  { id: 'slack', label: 'Slack' },
  { id: 'zendesk', label: 'Zendesk' },
  { id: 'intercom', label: 'Intercom' },
  { id: 'calendly', label: 'Calendly' },
  { id: 'stripe', label: 'Stripe' },
];

interface ClientBriefBuilderProps {
  onSubmit: (brief: BriefData) => void;
  initialData?: Partial<BriefData>;
}

export function ClientBriefBuilder({ onSubmit, initialData }: ClientBriefBuilderProps) {
  const [step, setStep] = useState(1);
  const [brief, setBrief] = useState<BriefData>({ ...initialBrief, ...initialData });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const totalSteps = 8;

  const updateBrief = (field: keyof BriefData, value: string | boolean | string[] | Record<string, unknown>) => {
    setBrief((prev) => ({ ...prev, [field]: value }));
  };

  const toggleArrayItem = (field: 'pagesNeeded' | 'mainFeatures' | 'paymentMethods' | 'browserSupport' | 'deviceSupport' | 'integrationNeeds' | 'userAccountFeatures', item: string) => {
    setBrief((prev) => {
      const arr = prev[field] as string[];
      const newArr = arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item];
      return { ...prev, [field]: newArr };
    });
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setShowSuccessModal(true);
    onSubmit(brief);
  };

  const generatePDF = async () => {
    setDownloading(true);
    try {
      const response = await fetch('/api/brief/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(brief),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `website-brief-${brief.businessName || 'project'}-${new Date().toISOString().split('T')[0]}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setDownloading(false);
    }
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return brief.businessName && brief.description && brief.contactName && brief.email;
      case 2:
        return brief.style && brief.pagesNeeded.length > 0;
      default:
        return true;
    }
  };

  const stepLabels = [
    { num: 1, label: 'Business Info', icon: Building },
    { num: 2, label: 'Design & Pages', icon: Palette },
    { num: 3, label: 'Features', icon: Sparkles },
    { num: 4, label: 'Technical', icon: Server },
    { num: 5, label: 'SEO & Marketing', icon: Search },
    { num: 6, label: 'Brand Assets', icon: Image },
    { num: 7, label: 'Competitors', icon: Target },
    { num: 8, label: 'Timeline & Budget', icon: Calendar },
  ];

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold flex items-center justify-center gap-2">
                <Building className="h-5 w-5 text-blue-600" />
                Business Information
              </h3>
              <p className="text-muted-foreground text-sm mt-1">
                Tell us about your business in detail
              </p>
            </div>

            {/* Basic Business Info */}
            <div className="space-y-4 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <h4 className="font-medium text-blue-800 dark:text-blue-200">Basic Information</h4>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="businessName">Business Name *</Label>
                  <Input
                    id="businessName"
                    placeholder="Your business name"
                    value={brief.businessName}
                    onChange={(e) => updateBrief('businessName', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="legalBusinessName">Legal Business Name (if different)</Label>
                  <Input
                    id="legalBusinessName"
                    placeholder="Registered legal name"
                    value={brief.legalBusinessName}
                    onChange={(e) => updateBrief('legalBusinessName', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="businessType">Business Type</Label>
                  <Select value={brief.businessType} onValueChange={(v) => updateBrief('businessType', v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select business type" />
                    </SelectTrigger>
                    <SelectContent>
                      {BUSINESS_TYPE_OPTIONS.map((type) => (
                        <SelectItem key={type} value={type.toLowerCase().replace(/\s+/g, '-')}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry *</Label>
                  <Select value={brief.industry} onValueChange={(v) => updateBrief('industry', v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {INDUSTRY_OPTIONS.map((ind) => (
                        <SelectItem key={ind} value={ind.toLowerCase().replace(/\s+/g, '-')}>
                          {ind}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="foundingYear">Founding Year</Label>
                  <Input
                    id="foundingYear"
                    placeholder="e.g., 2020"
                    value={brief.foundingYear}
                    onChange={(e) => updateBrief('foundingYear', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="employeeCount">Number of Employees</Label>
                  <Select value={brief.employeeCount} onValueChange={(v) => updateBrief('employeeCount', v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select range" />
                    </SelectTrigger>
                    <SelectContent>
                      {EMPLOYEE_COUNT_OPTIONS.map((count) => (
                        <SelectItem key={count} value={count.toLowerCase().replace(/\s+/g, '-')}>
                          {count}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="annualRevenue">Annual Revenue</Label>
                  <Select value={brief.annualRevenue} onValueChange={(v) => updateBrief('annualRevenue', v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select range" />
                    </SelectTrigger>
                    <SelectContent>
                      {REVENUE_OPTIONS.map((rev) => (
                        <SelectItem key={rev} value={rev.toLowerCase().replace(/\s+/g, '-')}>
                          {rev}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="businessRegistrationNumber">Business Registration Number</Label>
                  <Input
                    id="businessRegistrationNumber"
                    placeholder="Registration/License number"
                    value={brief.businessRegistrationNumber}
                    onChange={(e) => updateBrief('businessRegistrationNumber', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taxId">Tax ID / VAT Number</Label>
                  <Input
                    id="taxId"
                    placeholder="Tax identification number"
                    value={brief.taxId}
                    onChange={(e) => updateBrief('taxId', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Business Description */}
            <div className="space-y-4 p-4 bg-green-50 dark:bg-green-950 rounded-lg">
              <h4 className="font-medium text-green-800 dark:text-green-200">Business Description</h4>
              <div className="space-y-2">
                <Label htmlFor="description">Describe Your Business *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what your business does, your products/services, history, and what makes you unique..."
                  rows={5}
                  value={brief.description}
                  onChange={(e) => updateBrief('description', e.target.value)}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="missionStatement">Mission Statement</Label>
                  <Textarea
                    id="missionStatement"
                    placeholder="What is your company's mission?"
                    rows={3}
                    value={brief.missionStatement}
                    onChange={(e) => updateBrief('missionStatement', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="visionStatement">Vision Statement</Label>
                  <Textarea
                    id="visionStatement"
                    placeholder="Where do you see your company in the future?"
                    rows={3}
                    value={brief.visionStatement}
                    onChange={(e) => updateBrief('visionStatement', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="coreValues">Core Values</Label>
                <Input
                  id="coreValues"
                  placeholder="e.g., Integrity, Innovation, Customer First"
                  value={brief.coreValues}
                  onChange={(e) => updateBrief('coreValues', e.target.value)}
                />
              </div>
            </div>

            {/* Target Audience */}
            <div className="space-y-4 p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
              <h4 className="font-medium text-purple-800 dark:text-purple-200">Target Audience</h4>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="targetAudience">Target Audience Description *</Label>
                  <Textarea
                    id="targetAudience"
                    placeholder="Who are your ideal customers? Describe their demographics, interests, behaviors..."
                    rows={3}
                    value={brief.targetAudience}
                    onChange={(e) => updateBrief('targetAudience', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="targetAgeRange">Target Age Range</Label>
                  <Input
                    id="targetAgeRange"
                    placeholder="e.g., 25-45 years old"
                    value={brief.targetAgeRange}
                    onChange={(e) => updateBrief('targetAgeRange', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="targetLocation">Target Geographic Location</Label>
                  <Input
                    id="targetLocation"
                    placeholder="e.g., Cameroon, West Africa, Global"
                    value={brief.targetLocation}
                    onChange={(e) => updateBrief('targetLocation', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="targetIncome">Target Income Level</Label>
                  <Input
                    id="targetIncome"
                    placeholder="e.g., Middle to upper class"
                    value={brief.targetIncome}
                    onChange={(e) => updateBrief('targetIncome', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Goals & Differentiation */}
            <div className="space-y-4 p-4 bg-amber-50 dark:bg-amber-950 rounded-lg">
              <h4 className="font-medium text-amber-800 dark:text-amber-200">Goals & Differentiation</h4>
              <div className="space-y-2">
                <Label htmlFor="primaryGoals">Primary Website Goals</Label>
                <Textarea
                  id="primaryGoals"
                  placeholder="What do you want to achieve with this website? e.g., Generate leads, sell products, build brand awareness..."
                  rows={3}
                  value={brief.primaryGoals}
                  onChange={(e) => updateBrief('primaryGoals', e.target.value)}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="uniqueSelling">Unique Selling Proposition (USP)</Label>
                  <Textarea
                    id="uniqueSelling"
                    placeholder="What makes your business unique?"
                    rows={2}
                    value={brief.uniqueSelling}
                    onChange={(e) => updateBrief('uniqueSelling', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="competitiveAdvantage">Competitive Advantage</Label>
                  <Textarea
                    id="competitiveAdvantage"
                    placeholder="What gives you an edge over competitors?"
                    rows={2}
                    value={brief.competitiveAdvantage}
                    onChange={(e) => updateBrief('competitiveAdvantage', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="brandPersonality">Brand Personality</Label>
                <Input
                  id="brandPersonality"
                  placeholder="e.g., Professional, Friendly, Innovative, Trustworthy"
                  value={brief.brandPersonality}
                  onChange={(e) => updateBrief('brandPersonality', e.target.value)}
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h4 className="font-medium flex items-center gap-2">
                <Users className="h-4 w-4" />
                Contact Information
              </h4>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="contactName">Contact Person Name *</Label>
                  <Input
                    id="contactName"
                    placeholder="Full name"
                    value={brief.contactName}
                    onChange={(e) => updateBrief('contactName', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactPosition">Position/Title</Label>
                  <Input
                    id="contactPosition"
                    placeholder="e.g., CEO, Marketing Manager"
                    value={brief.contactPosition}
                    onChange={(e) => updateBrief('contactPosition', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="email">Primary Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@example.com"
                    value={brief.email}
                    onChange={(e) => updateBrief('email', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="alternativeEmail">Alternative Email</Label>
                  <Input
                    id="alternativeEmail"
                    type="email"
                    placeholder="backup@email.com"
                    value={brief.alternativeEmail}
                    onChange={(e) => updateBrief('alternativeEmail', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="phone">Primary Phone</Label>
                  <Input
                    id="phone"
                    placeholder="+237 6XX XXX XXX"
                    value={brief.phone}
                    onChange={(e) => updateBrief('phone', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="alternativePhone">Alternative Phone</Label>
                  <Input
                    id="alternativePhone"
                    placeholder="+237 6XX XXX XXX"
                    value={brief.alternativePhone}
                    onChange={(e) => updateBrief('alternativePhone', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="whatsappNumber">WhatsApp Number</Label>
                  <Input
                    id="whatsappNumber"
                    placeholder="+237 6XX XXX XXX"
                    value={brief.whatsappNumber}
                    onChange={(e) => updateBrief('whatsappNumber', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="preferredContactMethod">Preferred Contact Method</Label>
                  <Select value={brief.preferredContactMethod} onValueChange={(v) => updateBrief('preferredContactMethod', v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="phone">Phone Call</SelectItem>
                      <SelectItem value="whatsapp">WhatsApp</SelectItem>
                      <SelectItem value="video">Video Call</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bestTimeToContact">Best Time to Contact</Label>
                  <Input
                    id="bestTimeToContact"
                    placeholder="e.g., Weekdays 9AM-5PM WAT"
                    value={brief.bestTimeToContact}
                    onChange={(e) => updateBrief('bestTimeToContact', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    placeholder="Cameroon"
                    value={brief.country}
                    onChange={(e) => updateBrief('country', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    placeholder="Douala"
                    value={brief.city}
                    onChange={(e) => updateBrief('city', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Business Address</Label>
                  <Input
                    id="address"
                    placeholder="Street address"
                    value={brief.address}
                    onChange={(e) => updateBrief('address', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postalCode">Postal Code</Label>
                  <Input
                    id="postalCode"
                    placeholder="Postal code"
                    value={brief.postalCode}
                    onChange={(e) => updateBrief('postalCode', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="space-y-4 p-4 bg-indigo-50 dark:bg-indigo-950 rounded-lg">
              <h4 className="font-medium flex items-center gap-2 text-indigo-800 dark:text-indigo-200">
                <Share2 className="h-4 w-4" />
                Social Media & Online Presence
              </h4>
              <div className="space-y-2">
                <Label htmlFor="currentWebsite">Current Website (if any)</Label>
                <Input
                  id="currentWebsite"
                  placeholder="https://www.yourcurrentwebsite.com"
                  value={brief.currentWebsite}
                  onChange={(e) => updateBrief('currentWebsite', e.target.value)}
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="facebook">Facebook</Label>
                  <Input
                    id="facebook"
                    placeholder="https://facebook.com/yourpage"
                    value={brief.facebook}
                    onChange={(e) => updateBrief('facebook', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input
                    id="instagram"
                    placeholder="https://instagram.com/yourhandle"
                    value={brief.instagram}
                    onChange={(e) => updateBrief('instagram', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="twitter">Twitter/X</Label>
                  <Input
                    id="twitter"
                    placeholder="https://twitter.com/yourhandle"
                    value={brief.twitter}
                    onChange={(e) => updateBrief('twitter', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <Input
                    id="linkedin"
                    placeholder="https://linkedin.com/company/yourcompany"
                    value={brief.linkedin}
                    onChange={(e) => updateBrief('linkedin', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="youtube">YouTube</Label>
                  <Input
                    id="youtube"
                    placeholder="https://youtube.com/@yourchannel"
                    value={brief.youtube}
                    onChange={(e) => updateBrief('youtube', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tiktok">TikTok</Label>
                  <Input
                    id="tiktok"
                    placeholder="https://tiktok.com/@yourhandle"
                    value={brief.tiktok}
                    onChange={(e) => updateBrief('tiktok', e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="otherSocial">Other Social Media/Online Profiles</Label>
                <Textarea
                  id="otherSocial"
                  placeholder="List any other social media or online profiles..."
                  rows={2}
                  value={brief.otherSocial}
                  onChange={(e) => updateBrief('otherSocial', e.target.value)}
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold flex items-center justify-center gap-2">
                <Palette className="h-5 w-5 text-blue-600" />
                Design & Pages
              </h3>
              <p className="text-muted-foreground text-sm mt-1">
                Define your website's visual style and structure
              </p>
            </div>

            {/* Style Selection */}
            <div className="space-y-4 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <h4 className="font-medium text-blue-800 dark:text-blue-200">Design Style</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {STYLE_OPTIONS.map((style) => (
                  <div
                    key={style.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      brief.style === style.id
                        ? 'border-blue-500 bg-blue-100 dark:bg-blue-900'
                        : 'hover:border-blue-300'
                    }`}
                    onClick={() => updateBrief('style', style.id)}
                  >
                    <div className="font-medium text-sm">{style.label}</div>
                    <div className="text-xs text-muted-foreground mt-1">{style.description}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Color Palette */}
            <div className="space-y-4 p-4 bg-green-50 dark:bg-green-950 rounded-lg">
              <h4 className="font-medium text-green-800 dark:text-green-200">Color Palette</h4>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-2">
                  <Label>Primary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={brief.primaryColor}
                      onChange={(e) => updateBrief('primaryColor', e.target.value)}
                      className="w-14 h-10 p-1 cursor-pointer"
                    />
                    <Input
                      value={brief.primaryColor}
                      onChange={(e) => updateBrief('primaryColor', e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Secondary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={brief.secondaryColor}
                      onChange={(e) => updateBrief('secondaryColor', e.target.value)}
                      className="w-14 h-10 p-1 cursor-pointer"
                    />
                    <Input
                      value={brief.secondaryColor}
                      onChange={(e) => updateBrief('secondaryColor', e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Accent Color</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={brief.accentColor}
                      onChange={(e) => updateBrief('accentColor', e.target.value)}
                      className="w-14 h-10 p-1 cursor-pointer"
                    />
                    <Input
                      value={brief.accentColor}
                      onChange={(e) => updateBrief('accentColor', e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Background Color</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={brief.backgroundColor}
                      onChange={(e) => updateBrief('backgroundColor', e.target.value)}
                      className="w-14 h-10 p-1 cursor-pointer"
                    />
                    <Input
                      value={brief.backgroundColor}
                      onChange={(e) => updateBrief('backgroundColor', e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Typography & Layout */}
            <div className="space-y-4 p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
              <h4 className="font-medium text-purple-800 dark:text-purple-200">Typography & Layout</h4>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-2">
                  <Label>Font Style</Label>
                  <Select value={brief.fontPreference} onValueChange={(v) => updateBrief('fontPreference', v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select font style" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="modern">Modern (Sans-serif)</SelectItem>
                      <SelectItem value="classic">Classic (Serif)</SelectItem>
                      <SelectItem value="mixed">Mixed Combination</SelectItem>
                      <SelectItem value="custom">Custom Fonts</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Font Size</Label>
                  <Select value={brief.fontSizePreference} onValueChange={(v) => updateBrief('fontSizePreference', v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Layout Style</Label>
                  <Select value={brief.layoutStyle} onValueChange={(v) => updateBrief('layoutStyle', v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select layout" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="boxed">Boxed</SelectItem>
                      <SelectItem value="wide">Wide</SelectItem>
                      <SelectItem value="full-width">Full Width</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Header Style</Label>
                  <Select value={brief.headerStyle} onValueChange={(v) => updateBrief('headerStyle', v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select header" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fixed">Fixed/Sticky</SelectItem>
                      <SelectItem value="static">Static</SelectItem>
                      <SelectItem value="transparent">Transparent</SelectItem>
                      <SelectItem value="minimal">Minimal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Navigation Style</Label>
                  <Select value={brief.navigationStyle} onValueChange={(v) => updateBrief('navigationStyle', v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select navigation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="horizontal">Horizontal Menu</SelectItem>
                      <SelectItem value="hamburger">Hamburger Menu</SelectItem>
                      <SelectItem value="sidebar">Sidebar Menu</SelectItem>
                      <SelectItem value="mega">Mega Menu</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Animation Style</Label>
                  <Select value={brief.animationPreference} onValueChange={(v) => updateBrief('animationPreference', v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select animation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Animations</SelectItem>
                      <SelectItem value="subtle">Subtle</SelectItem>
                      <SelectItem value="moderate">Moderate</SelectItem>
                      <SelectItem value="extensive">Extensive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Pages Selection */}
            <div className="space-y-4 p-4 bg-amber-50 dark:bg-amber-950 rounded-lg">
              <h4 className="font-medium text-amber-800 dark:text-amber-200">Pages Needed *</h4>
              <p className="text-sm text-muted-foreground">Select all pages you want on your website</p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {PAGE_OPTIONS.map((page) => (
                  <div
                    key={page.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-all ${
                      brief.pagesNeeded.includes(page.id)
                        ? 'border-amber-500 bg-amber-100 dark:bg-amber-900'
                        : 'hover:border-amber-300'
                    }`}
                    onClick={() => toggleArrayItem('pagesNeeded', page.id)}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-4 h-4 rounded border flex items-center justify-center ${
                          brief.pagesNeeded.includes(page.id)
                            ? 'bg-amber-500 border-amber-500'
                            : ''
                        }`}
                      >
                        {brief.pagesNeeded.includes(page.id) && (
                          <CheckCircle className="h-3 w-3 text-white" />
                        )}
                      </div>
                      <span className="font-medium text-sm">{page.label}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 ml-6">{page.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Content Language */}
            <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h4 className="font-medium">Content & Language</h4>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Primary Language</Label>
                  <Select value={brief.contentLanguage} onValueChange={(v) => updateBrief('contentLanguage', v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="pt">Portuguese</SelectItem>
                      <SelectItem value="ar">Arabic</SelectItem>
                      <SelectItem value="zh">Chinese</SelectItem>
                      <SelectItem value="multi">Multilingual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Additional Languages</Label>
                  <Input
                    placeholder="e.g., French, Spanish"
                    value={brief.additionalLanguages}
                    onChange={(e) => updateBrief('additionalLanguages', e.target.value)}
                  />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <Checkbox
                    id="hasSlogan"
                    checked={brief.hasSlogan}
                    onCheckedChange={(checked) => updateBrief('hasSlogan', checked as boolean)}
                  />
                  <div>
                    <Label htmlFor="hasSlogan" className="cursor-pointer">I have a slogan</Label>
                    {brief.hasSlogan && (
                      <Input
                        placeholder="Your slogan"
                        value={brief.slogan}
                        onChange={(e) => updateBrief('slogan', e.target.value)}
                        className="mt-2"
                      />
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <Checkbox
                    id="hasTagline"
                    checked={brief.hasTagline}
                    onCheckedChange={(checked) => updateBrief('hasTagline', checked as boolean)}
                  />
                  <div>
                    <Label htmlFor="hasTagline" className="cursor-pointer">I have a tagline</Label>
                    {brief.hasTagline && (
                      <Input
                        placeholder="Your tagline"
                        value={brief.tagline}
                        onChange={(e) => updateBrief('tagline', e.target.value)}
                        className="mt-2"
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Reference Websites */}
            <div className="space-y-4 p-4 bg-indigo-50 dark:bg-indigo-950 rounded-lg">
              <h4 className="font-medium text-indigo-800 dark:text-indigo-200">Design Inspiration</h4>
              <div className="space-y-2">
                <Label htmlFor="websitesYouLike">Websites You Like</Label>
                <Textarea
                  id="websitesYouLike"
                  placeholder="List websites you like and what you like about them..."
                  rows={3}
                  value={brief.websitesYouLike}
                  onChange={(e) => updateBrief('websitesYouLike', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="websitesYouDislike">Websites You Don't Like</Label>
                <Textarea
                  id="websitesYouDislike"
                  placeholder="List websites you don't like and what to avoid..."
                  rows={3}
                  value={brief.websitesYouDislike}
                  onChange={(e) => updateBrief('websitesYouDislike', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="designInspiration">Additional Design Inspiration</Label>
                <Textarea
                  id="designInspiration"
                  placeholder="Any other design ideas, Pinterest boards, mood boards..."
                  rows={2}
                  value={brief.designInspiration}
                  onChange={(e) => updateBrief('designInspiration', e.target.value)}
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold flex items-center justify-center gap-2">
                <Sparkles className="h-5 w-5 text-blue-600" />
                Features & Functionality
              </h3>
              <p className="text-muted-foreground text-sm mt-1">
                Select the features your website needs
              </p>
            </div>

            {/* Main Features */}
            <div className="space-y-4 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <h4 className="font-medium text-blue-800 dark:text-blue-200">Core Features</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {FEATURE_OPTIONS.map((feature) => (
                  <div
                    key={feature.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-all ${
                      brief.mainFeatures.includes(feature.id)
                        ? 'border-blue-500 bg-blue-100 dark:bg-blue-900'
                        : 'hover:border-blue-300'
                    }`}
                    onClick={() => toggleArrayItem('mainFeatures', feature.id)}
                  >
                    <div className="flex items-start gap-2">
                      <div
                        className={`w-4 h-4 mt-0.5 rounded border flex items-center justify-center flex-shrink-0 ${
                          brief.mainFeatures.includes(feature.id)
                            ? 'bg-blue-500 border-blue-500'
                            : ''
                        }`}
                      >
                        {brief.mainFeatures.includes(feature.id) && (
                          <CheckCircle className="h-3 w-3 text-white" />
                        )}
                      </div>
                      <div>
                        <span className="font-medium text-sm">{feature.label}</span>
                        <p className="text-xs text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* E-commerce Details */}
            <div className="space-y-4 p-4 bg-green-50 dark:bg-green-950 rounded-lg">
              <h4 className="font-medium text-green-800 dark:text-green-200">E-commerce Details (if applicable)</h4>
              <div className="space-y-2">
                <Label htmlFor="ecommerceNeeds">E-commerce Requirements</Label>
                <Textarea
                  id="ecommerceNeeds"
                  placeholder="Describe your e-commerce needs: number of products, categories, inventory management, etc."
                  rows={3}
                  value={brief.ecommerceNeeds}
                  onChange={(e) => updateBrief('ecommerceNeeds', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Payment Methods to Accept</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {PAYMENT_METHOD_OPTIONS.map((method) => (
                    <div
                      key={method.id}
                      className={`p-2 border rounded-lg cursor-pointer transition-all text-sm ${
                        brief.paymentMethods.includes(method.id)
                          ? 'border-green-500 bg-green-100 dark:bg-green-900'
                          : 'hover:border-green-300'
                      }`}
                      onClick={() => toggleArrayItem('paymentMethods', method.id)}
                    >
                      {method.label}
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="shippingNeeds">Shipping & Delivery</Label>
                <Textarea
                  id="shippingNeeds"
                  placeholder="Describe your shipping zones, rates, and delivery options..."
                  rows={2}
                  value={brief.shippingNeeds}
                  onChange={(e) => updateBrief('shippingNeeds', e.target.value)}
                />
              </div>
            </div>

            {/* Booking & Membership */}
            <div className="space-y-4 p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
              <h4 className="font-medium text-purple-800 dark:text-purple-200">Booking & Membership (if applicable)</h4>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Booking System Type</Label>
                  <Select value={brief.bookingType} onValueChange={(v) => updateBrief('bookingType', v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select booking type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="appointments">Appointments</SelectItem>
                      <SelectItem value="classes">Classes/Events</SelectItem>
                      <SelectItem value="rentals">Rentals</SelectItem>
                      <SelectItem value="restaurant">Restaurant Reservations</SelectItem>
                      <SelectItem value="hotel">Hotel/Room Booking</SelectItem>
                      <SelectItem value="service">Service Booking</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Membership Type</Label>
                  <Select value={brief.membershipType} onValueChange={(v) => updateBrief('membershipType', v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select membership type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Membership</SelectItem>
                      <SelectItem value="free">Free Membership</SelectItem>
                      <SelectItem value="paid">Paid Subscription</SelectItem>
                      <SelectItem value="tiered">Tiered Membership</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* User Accounts */}
            <div className="space-y-4 p-4 bg-amber-50 dark:bg-amber-950 rounded-lg">
              <div className="flex items-center gap-3">
                <Checkbox
                  id="userAccounts"
                  checked={brief.userAccounts}
                  onCheckedChange={(checked) => updateBrief('userAccounts', checked as boolean)}
                />
                <Label htmlFor="userAccounts" className="cursor-pointer font-medium">Enable User Accounts</Label>
              </div>
              {brief.userAccounts && (
                <div className="space-y-2 ml-6">
                  <Label>User Account Features</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Profile Management', 'Order History', 'Wishlist/Favorites', 'Saved Addresses', 'Messaging', 'Notifications', 'Social Login', 'Two-Factor Auth'].map((feature) => (
                      <div
                        key={feature.toLowerCase().replace(/\s+/g, '-')}
                        className={`p-2 border rounded-lg cursor-pointer text-sm transition-all ${
                          brief.userAccountFeatures.includes(feature.toLowerCase().replace(/\s+/g, '-'))
                            ? 'border-amber-500 bg-amber-100 dark:bg-amber-900'
                            : 'hover:border-amber-300'
                        }`}
                        onClick={() => toggleArrayItem('userAccountFeatures', feature.toLowerCase().replace(/\s+/g, '-'))}
                      >
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Special Features */}
            <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h4 className="font-medium">Special Requirements</h4>
              <div className="space-y-2">
                <Label htmlFor="specialFeatures">Additional Features & Functionality</Label>
                <Textarea
                  id="specialFeatures"
                  placeholder="Describe any special features, custom functionality, or integrations you need..."
                  rows={4}
                  value={brief.specialFeatures}
                  onChange={(e) => updateBrief('specialFeatures', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dashboardNeeds">Dashboard/Admin Requirements</Label>
                <Textarea
                  id="dashboardNeeds"
                  placeholder="Describe any admin dashboard or reporting needs..."
                  rows={3}
                  value={brief.dashboardNeeds}
                  onChange={(e) => updateBrief('dashboardNeeds', e.target.value)}
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold flex items-center justify-center gap-2">
                <Server className="h-5 w-5 text-blue-600" />
                Technical Requirements
              </h3>
              <p className="text-muted-foreground text-sm mt-1">
                Domain, hosting, and technical specifications
              </p>
            </div>

            {/* Domain */}
            <div className="space-y-4 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <h4 className="font-medium text-blue-800 dark:text-blue-200 flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Domain Configuration
              </h4>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Domain Status</Label>
                  <Select value={brief.domainStatus} onValueChange={(v) => updateBrief('domainStatus', v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="need_new">I need a new domain</SelectItem>
                      <SelectItem value="have_domain">I have a domain</SelectItem>
                      <SelectItem value="multiple">I need multiple domains</SelectItem>
                      <SelectItem value="subdomain">Use subdomain for now</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="preferredDomain">Preferred Domain Name</Label>
                  <Input
                    id="preferredDomain"
                    placeholder="example.com"
                    value={brief.preferredDomain}
                    onChange={(e) => updateBrief('preferredDomain', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Hosting */}
            <div className="space-y-4 p-4 bg-green-50 dark:bg-green-950 rounded-lg">
              <h4 className="font-medium text-green-800 dark:text-green-200">Hosting Requirements</h4>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="currentHosting">Current Hosting Provider (if any)</Label>
                  <Input
                    id="currentHosting"
                    placeholder="e.g., GoDaddy, Bluehost"
                    value={brief.currentHosting}
                    onChange={(e) => updateBrief('currentHosting', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Hosting Preference</Label>
                  <Select value={brief.hostingPreference} onValueChange={(v) => updateBrief('hostingPreference', v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select preference" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="managed">Managed Hosting (Recommended)</SelectItem>
                      <SelectItem value="shared">Shared Hosting</SelectItem>
                      <SelectItem value="vps">VPS Server</SelectItem>
                      <SelectItem value="dedicated">Dedicated Server</SelectItem>
                      <SelectItem value="cloud">Cloud Hosting</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="sslRequired"
                    checked={brief.sslRequired}
                    onCheckedChange={(checked) => updateBrief('sslRequired', checked as boolean)}
                  />
                  <Label htmlFor="sslRequired" className="cursor-pointer">SSL Certificate Required</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="cdnRequired"
                    checked={brief.cdnRequired}
                    onCheckedChange={(checked) => updateBrief('cdnRequired', checked as boolean)}
                  />
                  <Label htmlFor="cdnRequired" className="cursor-pointer">CDN Required</Label>
                </div>
              </div>
            </div>

            {/* Security & Performance */}
            <div className="space-y-4 p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
              <h4 className="font-medium text-purple-800 dark:text-purple-200 flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Security & Performance
              </h4>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Backup Frequency</Label>
                  <Select value={brief.backupFrequency} onValueChange={(v) => updateBrief('backupFrequency', v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily Backups</SelectItem>
                      <SelectItem value="weekly">Weekly Backups</SelectItem>
                      <SelectItem value="monthly">Monthly Backups</SelectItem>
                      <SelectItem value="on-demand">On-Demand Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="performanceRequirements">Performance Requirements</Label>
                  <Input
                    id="performanceRequirements"
                    placeholder="e.g., Fast loading, high traffic capacity"
                    value={brief.performanceRequirements}
                    onChange={(e) => updateBrief('performanceRequirements', e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="securityRequirements">Security Requirements</Label>
                <Textarea
                  id="securityRequirements"
                  placeholder="Any specific security requirements (GDPR compliance, data protection, etc.)..."
                  rows={2}
                  value={brief.securityRequirements}
                  onChange={(e) => updateBrief('securityRequirements', e.target.value)}
                />
              </div>
            </div>

            {/* Browser & Device Support */}
            <div className="space-y-4 p-4 bg-amber-50 dark:bg-amber-950 rounded-lg">
              <h4 className="font-medium text-amber-800 dark:text-amber-200">Browser & Device Support</h4>
              <div className="space-y-3">
                <div>
                  <Label className="mb-2 block">Browser Support</Label>
                  <div className="flex flex-wrap gap-2">
                    {['Chrome', 'Firefox', 'Safari', 'Edge', 'Opera', 'IE11'].map((browser) => (
                      <div
                        key={browser.toLowerCase()}
                        className={`px-3 py-1.5 border rounded-full cursor-pointer text-sm transition-all ${
                          brief.browserSupport.includes(browser.toLowerCase())
                            ? 'border-amber-500 bg-amber-100 dark:bg-amber-900'
                            : 'hover:border-amber-300'
                        }`}
                        onClick={() => toggleArrayItem('browserSupport', browser.toLowerCase())}
                      >
                        {browser}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <Label className="mb-2 block">Device Support</Label>
                  <div className="flex flex-wrap gap-2">
                    {['Desktop', 'Tablet', 'Mobile', 'Smart TV', 'Print'].map((device) => (
                      <div
                        key={device.toLowerCase().replace(' ', '-')}
                        className={`px-3 py-1.5 border rounded-full cursor-pointer text-sm transition-all ${
                          brief.deviceSupport.includes(device.toLowerCase().replace(' ', '-'))
                            ? 'border-amber-500 bg-amber-100 dark:bg-amber-900'
                            : 'hover:border-amber-300'
                        }`}
                        onClick={() => toggleArrayItem('deviceSupport', device.toLowerCase().replace(' ', '-'))}
                      >
                        {device}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Integrations */}
            <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h4 className="font-medium">Third-Party Integrations</h4>
              <div className="space-y-2">
                <Label>Select Required Integrations</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {INTEGRATION_OPTIONS.map((integration) => (
                    <div
                      key={integration.id}
                      className={`p-2 border rounded-lg cursor-pointer text-sm transition-all ${
                        brief.integrationNeeds.includes(integration.id)
                          ? 'border-gray-500 bg-gray-100 dark:bg-gray-700'
                          : 'hover:border-gray-400'
                      }`}
                      onClick={() => toggleArrayItem('integrationNeeds', integration.id)}
                    >
                      {integration.label}
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="apiRequirements">API Requirements</Label>
                <Textarea
                  id="apiRequirements"
                  placeholder="Describe any API integrations needed..."
                  rows={2}
                  value={brief.apiRequirements}
                  onChange={(e) => updateBrief('apiRequirements', e.target.value)}
                />
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold flex items-center justify-center gap-2">
                <Search className="h-5 w-5 text-blue-600" />
                SEO & Marketing
              </h3>
              <p className="text-muted-foreground text-sm mt-1">
                Help us optimize your website for search engines
              </p>
            </div>

            {/* SEO Level */}
            <div className="space-y-4 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <h4 className="font-medium text-blue-800 dark:text-blue-200">SEO Configuration</h4>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>SEO Level Required</Label>
                  <Select value={brief.seoLevel} onValueChange={(v) => updateBrief('seoLevel', v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">Basic (Meta tags only)</SelectItem>
                      <SelectItem value="standard">Standard (Recommended)</SelectItem>
                      <SelectItem value="advanced">Advanced (Full optimization)</SelectItem>
                      <SelectItem value="enterprise">Enterprise (Complete SEO strategy)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="targetKeywords">Target Keywords</Label>
                  <Input
                    id="targetKeywords"
                    placeholder="e.g., restaurant douala, best food cameroon"
                    value={brief.targetKeywords}
                    onChange={(e) => updateBrief('targetKeywords', e.target.value)}
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="localSeo"
                  checked={brief.localSeo}
                  onCheckedChange={(checked) => updateBrief('localSeo', checked as boolean)}
                />
                <Label htmlFor="localSeo" className="cursor-pointer">Local SEO (Google Maps, Business Profile)</Label>
              </div>
              {brief.localSeo && (
                <div className="space-y-2">
                  <Label htmlFor="googleBusinessProfile">Google Business Profile URL</Label>
                  <Input
                    id="googleBusinessProfile"
                    placeholder="https://business.google.com/..."
                    value={brief.googleBusinessProfile}
                    onChange={(e) => updateBrief('googleBusinessProfile', e.target.value)}
                  />
                </div>
              )}
            </div>

            {/* Analytics */}
            <div className="space-y-4 p-4 bg-green-50 dark:bg-green-950 rounded-lg">
              <h4 className="font-medium text-green-800 dark:text-green-200">Analytics & Tracking</h4>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Analytics Platform</Label>
                  <Select value={brief.analyticsPreference} onValueChange={(v) => updateBrief('analyticsPreference', v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="google">Google Analytics</SelectItem>
                      <SelectItem value="matomo">Matomo (Privacy-focused)</SelectItem>
                      <SelectItem value="mixpanel">Mixpanel</SelectItem>
                      <SelectItem value="custom">Custom Solution</SelectItem>
                      <SelectItem value="none">No Analytics</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="newsletterIntegration"
                      checked={brief.newsletterIntegration}
                      onCheckedChange={(checked) => updateBrief('newsletterIntegration', checked as boolean)}
                    />
                    <Label htmlFor="newsletterIntegration" className="cursor-pointer">Newsletter Integration</Label>
                  </div>
                </div>
              </div>
            </div>

            {/* CRM & Marketing Automation */}
            <div className="space-y-4 p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
              <h4 className="font-medium text-purple-800 dark:text-purple-200">CRM & Marketing Automation</h4>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="crmIntegration">CRM Integration</Label>
                  <Input
                    id="crmIntegration"
                    placeholder="e.g., HubSpot, Salesforce, Zoho"
                    value={brief.crmIntegration}
                    onChange={(e) => updateBrief('crmIntegration', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="marketingAutomation">Marketing Automation</Label>
                  <Input
                    id="marketingAutomation"
                    placeholder="e.g., Mailchimp, ActiveCampaign"
                    value={brief.marketingAutomation}
                    onChange={(e) => updateBrief('marketingAutomation', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold flex items-center justify-center gap-2">
                <ImageIcon className="h-5 w-5 text-blue-600" />
                Brand Assets
              </h3>
              <p className="text-muted-foreground text-sm mt-1">
                Tell us what brand assets you have ready
              </p>
            </div>

            {/* Logo */}
            <div className="space-y-4 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <div className="flex items-center gap-3">
                <Checkbox
                  id="hasLogo"
                  checked={brief.hasLogo}
                  onCheckedChange={(checked) => updateBrief('hasLogo', checked as boolean)}
                />
                <Label htmlFor="hasLogo" className="cursor-pointer font-medium text-blue-800 dark:text-blue-200">I have a logo</Label>
              </div>
              {brief.hasLogo && (
                <div className="grid gap-4 md:grid-cols-2 ml-6">
                  <div className="space-y-2">
                    <Label>Logo Format</Label>
                    <Select value={brief.logoFormat} onValueChange={(v) => updateBrief('logoFormat', v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="vector">Vector (AI, EPS, SVG)</SelectItem>
                        <SelectItem value="png">PNG</SelectItem>
                        <SelectItem value="jpg">JPG</SelectItem>
                        <SelectItem value="pdf">PDF</SelectItem>
                        <SelectItem value="multiple">Multiple Formats</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="logoFile">Logo File Name</Label>
                    <Input
                      id="logoFile"
                      placeholder="my-logo.png"
                      value={brief.logoFile}
                      onChange={(e) => updateBrief('logoFile', e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Brand Guidelines */}
            <div className="space-y-4 p-4 bg-green-50 dark:bg-green-950 rounded-lg">
              <div className="flex items-center gap-3">
                <Checkbox
                  id="hasBrandGuidelines"
                  checked={brief.hasBrandGuidelines}
                  onCheckedChange={(checked) => updateBrief('hasBrandGuidelines', checked as boolean)}
                />
                <Label htmlFor="hasBrandGuidelines" className="cursor-pointer font-medium text-green-800 dark:text-green-200">I have brand guidelines</Label>
              </div>
              {brief.hasBrandGuidelines && (
                <div className="space-y-2 ml-6">
                  <Label htmlFor="brandColors">Brand Colors</Label>
                  <Input
                    id="brandColors"
                    placeholder="e.g., Primary: #2563EB, Secondary: #1E40AF"
                    value={brief.brandColors}
                    onChange={(e) => updateBrief('brandColors', e.target.value)}
                  />
                </div>
              )}
            </div>

            {/* Fonts */}
            <div className="space-y-4 p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
              <div className="flex items-center gap-3">
                <Checkbox
                  id="hasFonts"
                  checked={brief.hasFonts}
                  onCheckedChange={(checked) => updateBrief('hasFonts', checked as boolean)}
                />
                <Label htmlFor="hasFonts" className="cursor-pointer font-medium text-purple-800 dark:text-purple-200">I have brand fonts</Label>
              </div>
              {brief.hasFonts && (
                <div className="space-y-2 ml-6">
                  <Label htmlFor="brandFonts">Brand Fonts</Label>
                  <Input
                    id="brandFonts"
                    placeholder="e.g., Heading: Montserrat, Body: Open Sans"
                    value={brief.brandFonts}
                    onChange={(e) => updateBrief('brandFonts', e.target.value)}
                  />
                </div>
              )}
            </div>

            {/* Images */}
            <div className="space-y-4 p-4 bg-amber-50 dark:bg-amber-950 rounded-lg">
              <div className="flex items-center gap-3">
                <Checkbox
                  id="hasImages"
                  checked={brief.hasImages}
                  onCheckedChange={(checked) => updateBrief('hasImages', checked as boolean)}
                />
                <Label htmlFor="hasImages" className="cursor-pointer font-medium text-amber-800 dark:text-amber-200">I have images ready</Label>
              </div>
              {brief.hasImages && (
                <div className="space-y-2 ml-6">
                  <Label htmlFor="imageCount">Approximate Number of Images</Label>
                  <Input
                    id="imageCount"
                    placeholder="e.g., 20-30 images"
                    value={brief.imageCount}
                    onChange={(e) => updateBrief('imageCount', e.target.value)}
                  />
                </div>
              )}
            </div>

            {/* Videos */}
            <div className="space-y-4 p-4 bg-red-50 dark:bg-red-950 rounded-lg">
              <div className="flex items-center gap-3">
                <Checkbox
                  id="hasVideos"
                  checked={brief.hasVideos}
                  onCheckedChange={(checked) => updateBrief('hasVideos', checked as boolean)}
                />
                <Label htmlFor="hasVideos" className="cursor-pointer font-medium text-red-800 dark:text-red-200">I have videos</Label>
              </div>
              {brief.hasVideos && (
                <div className="space-y-2 ml-6">
                  <Label htmlFor="videoLinks">Video Links</Label>
                  <Textarea
                    id="videoLinks"
                    placeholder="YouTube/Vimeo links or file names..."
                    rows={2}
                    value={brief.videoLinks}
                    onChange={(e) => updateBrief('videoLinks', e.target.value)}
                  />
                </div>
              )}
            </div>

            {/* Content */}
            <div className="space-y-4 p-4 bg-indigo-50 dark:bg-indigo-950 rounded-lg">
              <div className="flex items-center gap-3">
                <Checkbox
                  id="hasContent"
                  checked={brief.hasContent}
                  onCheckedChange={(checked) => updateBrief('hasContent', checked as boolean)}
                />
                <Label htmlFor="hasContent" className="cursor-pointer font-medium text-indigo-800 dark:text-indigo-200">I have content ready</Label>
              </div>
              {brief.hasContent && (
                <div className="space-y-2 ml-6">
                  <Label>Content Format</Label>
                  <Select value={brief.contentFormat} onValueChange={(v) => updateBrief('contentFormat', v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="doc">Word Document</SelectItem>
                      <SelectItem value="google-docs">Google Docs</SelectItem>
                      <SelectItem value="txt">Text Files</SelectItem>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="mixed">Mixed Formats</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            {/* Testimonials */}
            <div className="space-y-4 p-4 bg-cyan-50 dark:bg-cyan-950 rounded-lg">
              <div className="flex items-center gap-3">
                <Checkbox
                  id="hasTestimonials"
                  checked={brief.hasTestimonials}
                  onCheckedChange={(checked) => updateBrief('hasTestimonials', checked as boolean)}
                />
                <Label htmlFor="hasTestimonials" className="cursor-pointer font-medium text-cyan-800 dark:text-cyan-200">I have testimonials/reviews</Label>
              </div>
              {brief.hasTestimonials && (
                <div className="space-y-2 ml-6">
                  <Label htmlFor="testimonials">Testimonials</Label>
                  <Textarea
                    id="testimonials"
                    placeholder="Paste testimonials or describe where to find them..."
                    rows={3}
                    value={brief.testimonials}
                    onChange={(e) => updateBrief('testimonials', e.target.value)}
                  />
                </div>
              )}
            </div>

            {/* Case Studies */}
            <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center gap-3">
                <Checkbox
                  id="hasCaseStudies"
                  checked={brief.hasCaseStudies}
                  onCheckedChange={(checked) => updateBrief('hasCaseStudies', checked as boolean)}
                />
                <Label htmlFor="hasCaseStudies" className="cursor-pointer font-medium">I have case studies/portfolio items</Label>
              </div>
              {brief.hasCaseStudies && (
                <div className="space-y-2 ml-6">
                  <Label htmlFor="caseStudies">Case Studies Details</Label>
                  <Textarea
                    id="caseStudies"
                    placeholder="Describe your case studies or portfolio items..."
                    rows={3}
                    value={brief.caseStudies}
                    onChange={(e) => updateBrief('caseStudies', e.target.value)}
                  />
                </div>
              )}
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold flex items-center justify-center gap-2">
                <Target className="h-5 w-5 text-blue-600" />
                Competitor Analysis
              </h3>
              <p className="text-muted-foreground text-sm mt-1">
                Help us understand your competitive landscape
              </p>
            </div>

            {/* Main Competitors */}
            <div className="space-y-4 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <h4 className="font-medium text-blue-800 dark:text-blue-200">Your Competitors</h4>
              <div className="space-y-2">
                <Label htmlFor="mainCompetitors">Main Competitors</Label>
                <Textarea
                  id="mainCompetitors"
                  placeholder="List your main competitors..."
                  rows={3}
                  value={brief.mainCompetitors}
                  onChange={(e) => updateBrief('mainCompetitors', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="competitorWebsites">Competitor Websites</Label>
                <Textarea
                  id="competitorWebsites"
                  placeholder="List competitor website URLs..."
                  rows={3}
                  value={brief.competitorWebsites}
                  onChange={(e) => updateBrief('competitorWebsites', e.target.value)}
                />
              </div>
            </div>

            {/* Competitor Analysis */}
            <div className="space-y-4 p-4 bg-green-50 dark:bg-green-950 rounded-lg">
              <h4 className="font-medium text-green-800 dark:text-green-200">Competitor Strengths & Weaknesses</h4>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="competitorStrengths">What do competitors do well?</Label>
                  <Textarea
                    id="competitorStrengths"
                    placeholder="What do you admire about competitor websites..."
                    rows={3}
                    value={brief.competitorStrengths}
                    onChange={(e) => updateBrief('competitorStrengths', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="competitorWeaknesses">Where do competitors fall short?</Label>
                  <Textarea
                    id="competitorWeaknesses"
                    placeholder="What do competitors lack or do poorly..."
                    rows={3}
                    value={brief.competitorWeaknesses}
                    onChange={(e) => updateBrief('competitorWeaknesses', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Differentiation */}
            <div className="space-y-4 p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
              <h4 className="font-medium text-purple-800 dark:text-purple-200">Your Differentiation Strategy</h4>
              <div className="space-y-2">
                <Label htmlFor="differentiationStrategy">How will you stand out?</Label>
                <Textarea
                  id="differentiationStrategy"
                  placeholder="How will your website differentiate from competitors..."
                  rows={4}
                  value={brief.differentiationStrategy}
                  onChange={(e) => updateBrief('differentiationStrategy', e.target.value)}
                />
              </div>
            </div>
          </div>
        );

      case 8:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold flex items-center justify-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                Timeline, Budget & Final Details
              </h3>
              <p className="text-muted-foreground text-sm mt-1">
                Final details and special requirements
              </p>
            </div>

            {/* Timeline */}
            <div className="space-y-4 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <h4 className="font-medium text-blue-800 dark:text-blue-200">Timeline</h4>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>When do you need the website?</Label>
                  <Select value={brief.deadline} onValueChange={(v) => updateBrief('deadline', v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select timeline" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asap">As soon as possible</SelectItem>
                      <SelectItem value="1week">Within 1 week</SelectItem>
                      <SelectItem value="2weeks">Within 2 weeks</SelectItem>
                      <SelectItem value="1month">Within 1 month</SelectItem>
                      <SelectItem value="2months">Within 2 months</SelectItem>
                      <SelectItem value="flexible">No rush, flexible</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="launchDate">Target Launch Date (if known)</Label>
                  <Input
                    id="launchDate"
                    type="date"
                    value={brief.launchDate}
                    onChange={(e) => updateBrief('launchDate', e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="milestones">Key Milestones</Label>
                <Textarea
                  id="milestones"
                  placeholder="Any important dates or milestones we should know about..."
                  rows={2}
                  value={brief.milestones}
                  onChange={(e) => updateBrief('milestones', e.target.value)}
                />
              </div>
            </div>

            {/* Budget */}
            <div className="space-y-4 p-4 bg-green-50 dark:bg-green-950 rounded-lg">
              <h4 className="font-medium text-green-800 dark:text-green-200 flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Budget
              </h4>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Budget Range</Label>
                  <Select value={brief.budget} onValueChange={(v) => updateBrief('budget', v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select budget" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Under $200</SelectItem>
                      <SelectItem value="medium">$200 - $500</SelectItem>
                      <SelectItem value="large">$500 - $1000</SelectItem>
                      <SelectItem value="premium">$1000 - $2500</SelectItem>
                      <SelectItem value="enterprise">$2500+</SelectItem>
                      <SelectItem value="discuss">Let's discuss</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Payment Preference</Label>
                  <Select value={brief.paymentPreference} onValueChange={(v) => updateBrief('paymentPreference', v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select preference" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full">Full payment upfront</SelectItem>
                      <SelectItem value="half">50% deposit, 50% on completion</SelectItem>
                      <SelectItem value="milestone">Milestone-based payments</SelectItem>
                      <SelectItem value="monthly">Monthly payment plan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Must-Haves & Deal Breakers */}
            <div className="space-y-4 p-4 bg-amber-50 dark:bg-amber-950 rounded-lg">
              <h4 className="font-medium text-amber-800 dark:text-amber-200">Requirements Priority</h4>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="mustHaves">Must-Haves</Label>
                  <Textarea
                    id="mustHaves"
                    placeholder="Features or elements that are absolutely required..."
                    rows={3}
                    value={brief.mustHaves}
                    onChange={(e) => updateBrief('mustHaves', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="niceToHaves">Nice-to-Haves</Label>
                  <Textarea
                    id="niceToHaves"
                    placeholder="Features that would be great but not essential..."
                    rows={3}
                    value={brief.niceToHaves}
                    onChange={(e) => updateBrief('niceToHaves', e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dealBreakers">Deal Breakers</Label>
                <Textarea
                  id="dealBreakers"
                  placeholder="Things you absolutely don't want..."
                  rows={2}
                  value={brief.dealBreakers}
                  onChange={(e) => updateBrief('dealBreakers', e.target.value)}
                />
              </div>
            </div>

            {/* Success Metrics */}
            <div className="space-y-4 p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
              <h4 className="font-medium text-purple-800 dark:text-purple-200">Success Metrics</h4>
              <div className="space-y-2">
                <Label htmlFor="successMetrics">How will you measure success?</Label>
                <Textarea
                  id="successMetrics"
                  placeholder="What defines a successful website for you? (e.g., more leads, higher sales, better brand awareness...)"
                  rows={3}
                  value={brief.successMetrics}
                  onChange={(e) => updateBrief('successMetrics', e.target.value)}
                />
              </div>
            </div>

            {/* Long-term Vision */}
            <div className="space-y-4 p-4 bg-indigo-50 dark:bg-indigo-950 rounded-lg">
              <h4 className="font-medium text-indigo-800 dark:text-indigo-200">Long-term Plans</h4>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="maintenancePlan">Maintenance Plan</Label>
                  <Select value={brief.maintenancePlan} onValueChange={(v) => updateBrief('maintenancePlan', v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select plan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="self">Self-maintenance</SelectItem>
                      <SelectItem value="monthly">Monthly maintenance package</SelectItem>
                      <SelectItem value="quarterly">Quarterly updates</SelectItem>
                      <SelectItem value="annual">Annual review</SelectItem>
                      <SelectItem value="as-needed">As-needed support</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="trainingNeeds">Training Needs</Label>
                  <Input
                    id="trainingNeeds"
                    placeholder="e.g., Content management, updates"
                    value={brief.trainingNeeds}
                    onChange={(e) => updateBrief('trainingNeeds', e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="longTermVision">Long-term Vision</Label>
                <Textarea
                  id="longTermVision"
                  placeholder="Where do you see this website in 1-3 years? Any future plans or expansions?"
                  rows={3}
                  value={brief.longTermVision}
                  onChange={(e) => updateBrief('longTermVision', e.target.value)}
                />
              </div>
            </div>

            {/* Previous Website Issues */}
            <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h4 className="font-medium">Previous Website Issues (if applicable)</h4>
              <div className="space-y-2">
                <Label htmlFor="previousWebsiteIssues">What didn't work with your previous website?</Label>
                <Textarea
                  id="previousWebsiteIssues"
                  placeholder="Any issues, complaints, or things to avoid from your previous website..."
                  rows={3}
                  value={brief.previousWebsiteIssues}
                  onChange={(e) => updateBrief('previousWebsiteIssues', e.target.value)}
                />
              </div>
            </div>

            {/* Additional Notes */}
            <div className="space-y-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <h4 className="font-medium">Additional Notes</h4>
              <div className="space-y-2">
                <Label htmlFor="additionalNotes">Anything Else?</Label>
                <Textarea
                  id="additionalNotes"
                  placeholder="Any other information you'd like to share..."
                  rows={4}
                  value={brief.additionalNotes}
                  onChange={(e) => updateBrief('additionalNotes', e.target.value)}
                />
              </div>
            </div>

            {/* Summary */}
            <div className="p-6 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900 rounded-lg">
              <h4 className="font-semibold mb-4 text-lg">Brief Summary</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="p-3 bg-white/50 dark:bg-black/20 rounded-lg">
                  <span className="text-muted-foreground">Business:</span>
                  <p className="font-medium truncate">{brief.businessName || 'Not specified'}</p>
                </div>
                <div className="p-3 bg-white/50 dark:bg-black/20 rounded-lg">
                  <span className="text-muted-foreground">Pages:</span>
                  <p className="font-medium">{brief.pagesNeeded.length} pages selected</p>
                </div>
                <div className="p-3 bg-white/50 dark:bg-black/20 rounded-lg">
                  <span className="text-muted-foreground">Features:</span>
                  <p className="font-medium">{brief.mainFeatures.length} features selected</p>
                </div>
                <div className="p-3 bg-white/50 dark:bg-black/20 rounded-lg">
                  <span className="text-muted-foreground">Style:</span>
                  <p className="font-medium capitalize">{brief.style}</p>
                </div>
              </div>
            </div>

            {/* Download PDF Button */}
            <div className="flex justify-center">
              <Button
                variant="outline"
                size="lg"
                onClick={generatePDF}
                disabled={downloading}
                className="gap-2"
              >
                {downloading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Download className="h-5 w-5" />
                )}
                Download Brief as PDF
              </Button>
            </div>
          </div>
        );
    }
  };

  return (
    <Card className="w-full max-w-5xl mx-auto">
      <CardContent className="p-4 md:p-6">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between mb-2 overflow-x-auto gap-1 pb-2">
            {stepLabels.map((s) => {
              const Icon = s.icon;
              const isActive = step === s.num;
              const isComplete = step > s.num;
              return (
                <div
                  key={s.num}
                  className={`flex flex-col items-center min-w-[60px] md:min-w-[80px] cursor-pointer transition-all ${
                    isActive ? 'scale-105' : ''
                  }`}
                  onClick={() => isComplete && setStep(s.num)}
                >
                  <div
                    className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-lg ring-4 ring-blue-200 dark:ring-blue-800'
                        : isComplete
                        ? 'bg-green-600 text-white'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {isComplete ? (
                      <CheckCircle className="h-4 w-4 md:h-5 md:w-5" />
                    ) : (
                      <Icon className="h-4 w-4 md:h-5 md:w-5" />
                    )}
                  </div>
                  <span className={`text-[10px] md:text-xs mt-1 text-center ${isActive ? 'text-blue-600 font-medium' : 'text-muted-foreground'}`}>
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-300"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        {renderStep()}

        {/* Navigation */}
        <div className="flex justify-between mt-8 pt-6 border-t">
          <Button
            variant="outline"
            onClick={() => setStep(step - 1)}
            disabled={step === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>

          {step < totalSteps ? (
            <Button
              onClick={() => setStep(step + 1)}
              disabled={!isStepValid()}
              className="bg-gradient-to-r from-blue-600 to-indigo-600"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={submitting} className="bg-gradient-to-r from-green-600 to-emerald-600">
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <FileCheck className="h-4 w-4 mr-2" />
              )}
              Submit Brief
            </Button>
          )}
        </div>

        {/* Success Modal */}
        <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
          <DialogContent className="text-center max-w-lg">
            <DialogHeader>
              <div className="mx-auto mb-4">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
              <DialogTitle className="text-xl">Brief Submitted Successfully!</DialogTitle>
              <DialogDescription className="mt-4 space-y-4">
                <p>
                  Thank you for your detailed brief. Our team will review your requirements
                  and get back to you within 24 hours.
                </p>
                <Button
                  variant="outline"
                  onClick={generatePDF}
                  disabled={downloading}
                  className="gap-2"
                >
                  {downloading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                  Download Your Brief (PDF)
                </Button>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
