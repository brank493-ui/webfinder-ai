'use client';

import { useState } from 'react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
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
  MessageSquare,
  Clock,
  Users,
  ShoppingBag,
  Mail,
  Phone,
  MapPin,
  Sparkles,
  Loader2,
} from 'lucide-react';

interface BriefData {
  // Business Info
  businessName: string;
  businessType: string;
  industry: string;
  description: string;
  targetAudience: string;
  uniqueSelling: string;
  
  // Contact
  contactName: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  
  // Design Preferences
  style: string;
  primaryColor: string;
  secondaryColor: string;
  fontPreference: string;
  referenceWebsites: string;
  
  // Pages & Content
  pagesNeeded: string[];
  mainFeatures: string[];
  specialFeatures: string;
  
  // Additional
  deadline: string;
  budget: string;
  additionalNotes: string;
  hasLogo: boolean;
  hasContent: boolean;
  hasImages: boolean;
}

const initialBrief: BriefData = {
  businessName: '',
  businessType: '',
  industry: '',
  description: '',
  targetAudience: '',
  uniqueSelling: '',
  contactName: '',
  email: '',
  phone: '',
  country: '',
  city: '',
  style: 'modern',
  primaryColor: '#2563EB',
  secondaryColor: '#1E40AF',
  fontPreference: 'modern',
  referenceWebsites: '',
  pagesNeeded: [],
  mainFeatures: [],
  specialFeatures: '',
  deadline: '',
  budget: '',
  additionalNotes: '',
  hasLogo: false,
  hasContent: false,
  hasImages: false,
};

const PAGE_OPTIONS = (t: (key: string) => string) => [
  { id: 'home', label: t('brief.homePage'), description: t('brief.homePageDesc') },
  { id: 'about', label: t('brief.aboutPage'), description: t('brief.aboutPageDesc') },
  { id: 'services', label: t('brief.servicesPage'), description: t('brief.servicesPageDesc') },
  { id: 'products', label: t('brief.productsPage'), description: t('brief.productsPageDesc') },
  { id: 'gallery', label: t('brief.galleryPage'), description: t('brief.galleryPageDesc') },
  { id: 'blog', label: t('brief.blogPage'), description: t('brief.blogPageDesc') },
  { id: 'contact', label: t('brief.contactPage'), description: t('brief.contactPageDesc') },
  { id: 'testimonials', label: t('brief.testimonialsPage'), description: t('brief.testimonialsPageDesc') },
  { id: 'faq', label: t('brief.faqPage'), description: t('brief.faqPageDesc') },
  { id: 'booking', label: t('brief.bookingPage'), description: t('brief.bookingPageDesc') },
  { id: 'team', label: t('brief.teamPage'), description: t('brief.teamPageDesc') },
  { id: 'pricing', label: t('brief.pricingPage'), description: t('brief.pricingPageDesc') },
];

const FEATURE_OPTIONS = (t: (key: string) => string) => [
  { id: 'contact-form', label: t('brief.contactForm'), description: t('brief.contactFormDesc') },
  { id: 'booking', label: t('brief.bookingSystem'), description: t('brief.bookingSystemDesc') },
  { id: 'gallery', label: t('brief.photoGallery'), description: t('brief.photoGalleryDesc') },
  { id: 'map', label: t('brief.locationMap'), description: t('brief.locationMapDesc') },
  { id: 'social', label: t('brief.socialMediaLinks'), description: t('brief.socialMediaLinksDesc') },
  { id: 'newsletter', label: t('brief.newsletterSignup'), description: t('brief.newsletterSignupDesc') },
  { id: 'testimonials', label: t('brief.testimonialsSlider'), description: t('brief.testimonialsSliderDesc') },
  { id: 'blog', label: t('brief.blogSection'), description: t('brief.blogSectionDesc') },
  { id: 'ecommerce', label: t('brief.ecommerceFeature'), description: t('brief.ecommerceFeatureDesc') },
  { id: 'payment', label: t('brief.paymentIntegration'), description: t('brief.paymentIntegrationDesc') },
  { id: 'chat', label: t('brief.liveChat'), description: t('brief.liveChatDesc') },
  { id: 'analytics', label: t('brief.analyticsFeature'), description: t('brief.analyticsFeatureDesc') },
];

const STYLE_OPTIONS = (t: (key: string) => string) => [
  { id: 'modern', label: t('brief.modernClean'), description: t('brief.modernCleanDesc') },
  { id: 'classic', label: t('brief.classicProfessional'), description: t('brief.classicProfessionalDesc') },
  { id: 'bold', label: t('brief.boldCreative'), description: t('brief.boldCreativeDesc') },
  { id: 'elegant', label: t('brief.elegantLuxurious'), description: t('brief.elegantLuxuriousDesc') },
  { id: 'playful', label: t('brief.playfulFun'), description: t('brief.playfulFunDesc') },
];

const INDUSTRY_OPTIONS = [
  'Restaurant & Food',
  'Retail & E-commerce',
  'Health & Medical',
  'Beauty & Wellness',
  'Technology',
  'Education',
  'Real Estate',
  'Legal Services',
  'Automotive',
  'Hospitality',
  'Professional Services',
  'Entertainment',
  'Non-Profit',
  'Other',
];

interface ClientBriefBuilderProps {
  onSubmit: (brief: BriefData) => void;
  initialData?: Partial<BriefData>;
}

export function ClientBriefBuilder({ onSubmit, initialData }: ClientBriefBuilderProps) {
  const { t } = useLanguageStore();
  const [step, setStep] = useState(1);
  const [brief, setBrief] = useState<BriefData>({ ...initialBrief, ...initialData });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const totalSteps = 4;

  const updateBrief = (field: keyof BriefData, value: string | boolean | string[]) => {
    setBrief((prev) => ({ ...prev, [field]: value }));
  };

  const toggleArrayItem = (field: 'pagesNeeded' | 'mainFeatures', item: string) => {
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

  const isStepValid = () => {
    switch (step) {
      case 1:
        return brief.businessName && brief.description && brief.contactName && brief.email;
      case 2:
        return brief.style && brief.pagesNeeded.length > 0;
      case 3:
        return true;
      case 4:
        return true;
      default:
        return false;
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold flex items-center justify-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                {t('brief.businessInfo')}
              </h3>
              <p className="text-muted-foreground text-sm mt-1">
                {t('brief.businessInfoDesc')}
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="businessName">{t('brief.businessName')} *</Label>
                <Input
                  id="businessName"
                  placeholder={t('brief.businessNamePlaceholder')}
                  value={brief.businessName}
                  onChange={(e) => updateBrief('businessName', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="industry">{t('brief.industry')}</Label>
                <Select
                  value={brief.industry}
                  onValueChange={(v) => updateBrief('industry', v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('brief.selectIndustry')} />
                  </SelectTrigger>
                  <SelectContent>
                    {INDUSTRY_OPTIONS.map((ind) => (
                      <SelectItem key={ind} value={ind.toLowerCase()}>
                        {ind}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">{t('brief.description')} *</Label>
              <Textarea
                id="description"
                placeholder={t('brief.descriptionPlaceholder')}
                rows={4}
                value={brief.description}
                onChange={(e) => updateBrief('description', e.target.value)}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="targetAudience">{t('brief.targetAudience')}</Label>
                <Input
                  id="targetAudience"
                  placeholder={t('brief.targetAudiencePlaceholder')}
                  value={brief.targetAudience}
                  onChange={(e) => updateBrief('targetAudience', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="uniqueSelling">{t('brief.uniqueSelling')}</Label>
                <Input
                  id="uniqueSelling"
                  placeholder={t('brief.uniqueSellingPlaceholder')}
                  value={brief.uniqueSelling}
                  onChange={(e) => updateBrief('uniqueSelling', e.target.value)}
                />
              </div>
            </div>

            <div className="border-t pt-6 mt-6">
              <h4 className="font-medium mb-4 flex items-center gap-2">
                <Users className="h-4 w-4" />
                {t('brief.contactInformation')}
              </h4>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="contactName">{t('brief.yourName')} *</Label>
                  <Input
                    id="contactName"
                    placeholder={t('brief.fullName')}
                    value={brief.contactName}
                    onChange={(e) => updateBrief('contactName', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">{t('brief.emailAddress')} *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder={t('brief.emailExample')}
                    value={brief.email}
                    onChange={(e) => updateBrief('email', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">{t('brief.phoneWhatsapp')}</Label>
                  <Input
                    id="phone"
                    placeholder={t('brief.phonePlaceholder')}
                    value={brief.phone}
                    onChange={(e) => updateBrief('phone', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">{t('brief.countryLabel')}</Label>
                  <Input
                    id="country"
                    placeholder="Cameroon"
                    value={brief.country}
                    onChange={(e) => updateBrief('country', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold flex items-center justify-center gap-2">
                <Layout className="h-5 w-5 text-blue-600" />
                {t('brief.designPages')}
              </h3>
              <p className="text-muted-foreground text-sm mt-1">
                {t('brief.chooseStructure')}
              </p>
            </div>

            {/* Style Selection */}
            <div className="space-y-3">
              <Label>{t('brief.designStyle')}</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {STYLE_OPTIONS(t).map((style) => (
                  <div
                    key={style.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      brief.style === style.id
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                        : 'hover:border-blue-300'
                    }`}
                    onClick={() => updateBrief('style', style.id)}
                  >
                    <div className="font-medium">{style.label}</div>
                    <div className="text-xs text-muted-foreground">{style.description}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>{t('brief.primaryColor')}</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={brief.primaryColor}
                    onChange={(e) => updateBrief('primaryColor', e.target.value)}
                    className="w-16 h-10 p-1"
                  />
                  <Input
                    value={brief.primaryColor}
                    onChange={(e) => updateBrief('primaryColor', e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>{t('brief.secondaryColor')}</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={brief.secondaryColor}
                    onChange={(e) => updateBrief('secondaryColor', e.target.value)}
                    className="w-16 h-10 p-1"
                  />
                  <Input
                    value={brief.secondaryColor}
                    onChange={(e) => updateBrief('secondaryColor', e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>

            {/* Pages Selection */}
            <div className="space-y-3">
              <Label>{t('brief.pagesNeeded')} *</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {PAGE_OPTIONS(t).map((page) => (
                  <div
                    key={page.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-all ${
                      brief.pagesNeeded.includes(page.id)
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                        : 'hover:border-blue-300'
                    }`}
                    onClick={() => toggleArrayItem('pagesNeeded', page.id)}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-4 h-4 rounded border flex items-center justify-center ${
                          brief.pagesNeeded.includes(page.id)
                            ? 'bg-blue-500 border-blue-500'
                            : ''
                        }`}
                      >
                        {brief.pagesNeeded.includes(page.id) && (
                          <CheckCircle className="h-3 w-3 text-white" />
                        )}
                      </div>
                      <span className="font-medium text-sm">{page.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reference Websites */}
            <div className="space-y-2">
              <Label htmlFor="referenceWebsites">{t('brief.referenceWebsites')}</Label>
              <Textarea
                id="referenceWebsites"
                placeholder={t('brief.referencePlaceholder')}
                rows={2}
                value={brief.referenceWebsites}
                onChange={(e) => updateBrief('referenceWebsites', e.target.value)}
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold flex items-center justify-center gap-2">
                <Sparkles className="h-5 w-5 text-blue-600" />
                {t('brief.featuresFunctionality')}
              </h3>
              <p className="text-muted-foreground text-sm mt-1">
                {t('brief.selectFeatures')}
              </p>
            </div>

            {/* Features Selection */}
            <div className="space-y-3">
              <Label>{t('brief.mainFeatures')}</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {FEATURE_OPTIONS(t).map((feature) => (
                  <div
                    key={feature.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-all ${
                      brief.mainFeatures.includes(feature.id)
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                        : 'hover:border-blue-300'
                    }`}
                    onClick={() => toggleArrayItem('mainFeatures', feature.id)}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-4 h-4 rounded border flex items-center justify-center ${
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

            {/* Special Features */}
            <div className="space-y-2">
              <Label htmlFor="specialFeatures">{t('brief.specialRequirements')}</Label>
              <Textarea
                id="specialFeatures"
                placeholder={t('brief.specialRequirementsPlaceholder')}
                rows={3}
                value={brief.specialFeatures}
                onChange={(e) => updateBrief('specialFeatures', e.target.value)}
              />
            </div>

            {/* Assets Checklist */}
            <div className="space-y-3">
              <Label>{t('brief.assetsReady')}</Label>
              <div className="grid grid-cols-3 gap-3">
                <div
                  className={`p-4 border rounded-lg cursor-pointer text-center transition-all ${
                    brief.hasLogo ? 'border-green-500 bg-green-50 dark:bg-green-950' : ''
                  }`}
                  onClick={() => updateBrief('hasLogo', !brief.hasLogo)}
                >
                  <ImageIcon className="h-6 w-6 mx-auto mb-2" />
                  <span className="text-sm font-medium">{t('brief.logoReady')}</span>
                </div>
                <div
                  className={`p-4 border rounded-lg cursor-pointer text-center transition-all ${
                    brief.hasContent ? 'border-green-500 bg-green-50 dark:bg-green-950' : ''
                  }`}
                  onClick={() => updateBrief('hasContent', !brief.hasContent)}
                >
                  <FileText className="h-6 w-6 mx-auto mb-2" />
                  <span className="text-sm font-medium">{t('brief.contentReady')}</span>
                </div>
                <div
                  className={`p-4 border rounded-lg cursor-pointer text-center transition-all ${
                    brief.hasImages ? 'border-green-500 bg-green-50 dark:bg-green-950' : ''
                  }`}
                  onClick={() => updateBrief('hasImages', !brief.hasImages)}
                >
                  <ImageIcon className="h-6 w-6 mx-auto mb-2" />
                  <span className="text-sm font-medium">{t('brief.imagesReady')}</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold flex items-center justify-center gap-2">
                <Clock className="h-5 w-5 text-blue-600" />
                {t('brief.timelineBudget')}
              </h3>
              <p className="text-muted-foreground text-sm mt-1">
                {t('brief.finalDetails')}
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>{t('brief.whenNeeded')}</Label>
                <Select
                  value={brief.deadline}
                  onValueChange={(v) => updateBrief('deadline', v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select timeline" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asap">{t('brief.asap')}</SelectItem>
                    <SelectItem value="1week">{t('brief.within1week')}</SelectItem>
                    <SelectItem value="2weeks">{t('brief.within2weeks')}</SelectItem>
                    <SelectItem value="1month">{t('brief.within1month')}</SelectItem>
                    <SelectItem value="flexible">{t('brief.flexible')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>{t('brief.budgetRange')}</Label>
                <Select
                  value={brief.budget}
                  onValueChange={(v) => updateBrief('budget', v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select budget" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">{t('brief.under200')}</SelectItem>
                    <SelectItem value="medium">{t('brief.budget200to500')}</SelectItem>
                    <SelectItem value="large">{t('brief.budget500to1000')}</SelectItem>
                    <SelectItem value="enterprise">{t('brief.budget1000plus')}</SelectItem>
                    <SelectItem value="discuss">{t('brief.letsDiscuss')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="additionalNotes">{t('brief.additionalNotes')}</Label>
              <Textarea
                id="additionalNotes"
                placeholder={t('brief.additionalNotesPlaceholder')}
                rows={4}
                value={brief.additionalNotes}
                onChange={(e) => updateBrief('additionalNotes', e.target.value)}
              />
            </div>

            {/* Summary */}
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-3">{t('brief.summary')}</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('brief.businessLabel')}</span>
                  <span className="font-medium">{brief.businessName || t('brief.notSpecified')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('brief.pagesLabel')}</span>
                  <span className="font-medium">{brief.pagesNeeded.length} {t('brief.pagesSelected')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('brief.featuresLabel')}</span>
                  <span className="font-medium">{brief.mainFeatures.length} {t('brief.featuresSelected')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('brief.styleLabel')}</span>
                  <span className="font-medium capitalize">{brief.style}</span>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardContent className="p-6">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  s <= step
                    ? 'bg-blue-600 text-white'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {s}
              </div>
            ))}
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all duration-300"
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
            {t('brief.previous')}
          </Button>

          {step < totalSteps ? (
            <Button
              onClick={() => setStep(step + 1)}
              disabled={!isStepValid()}
            >
              {t('brief.next')}
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <CheckCircle className="h-4 w-4 mr-2" />
              )}
              {t('brief.submitBrief')}
            </Button>
          )}
        </div>

        {/* Success Modal */}
        <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
          <DialogContent className="text-center">
            <DialogHeader>
              <div className="mx-auto mb-4">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
              <DialogTitle className="text-xl">{t('brief.briefSubmitted')}</DialogTitle>
              <DialogDescription className="mt-4">
                {t('brief.briefSubmittedDesc')}
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
