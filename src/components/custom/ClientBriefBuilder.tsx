'use client';

import { useState } from 'react';
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
  Image,
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

const PAGE_OPTIONS = [
  { id: 'home', label: 'Home', description: 'Main landing page' },
  { id: 'about', label: 'About Us', description: 'Company story and team' },
  { id: 'services', label: 'Services', description: 'Products or services offered' },
  { id: 'products', label: 'Products/Shop', description: 'Product catalog or shop' },
  { id: 'gallery', label: 'Gallery', description: 'Image/video gallery' },
  { id: 'blog', label: 'Blog', description: 'News and articles' },
  { id: 'contact', label: 'Contact', description: 'Contact form and details' },
  { id: 'testimonials', label: 'Testimonials', description: 'Customer reviews' },
  { id: 'faq', label: 'FAQ', description: 'Frequently asked questions' },
  { id: 'booking', label: 'Booking', description: 'Appointment scheduling' },
  { id: 'team', label: 'Team', description: 'Staff profiles' },
  { id: 'pricing', label: 'Pricing', description: 'Price lists and plans' },
];

const FEATURE_OPTIONS = [
  { id: 'contact-form', label: 'Contact Form', description: 'Simple contact form' },
  { id: 'booking', label: 'Booking System', description: 'Appointment scheduling' },
  { id: 'gallery', label: 'Photo Gallery', description: 'Image gallery with lightbox' },
  { id: 'map', label: 'Location Map', description: 'Google Maps integration' },
  { id: 'social', label: 'Social Media Links', description: 'Social media integration' },
  { id: 'newsletter', label: 'Newsletter Signup', description: 'Email subscription' },
  { id: 'testimonials', label: 'Testimonials Slider', description: 'Customer reviews carousel' },
  { id: 'blog', label: 'Blog Section', description: 'News and articles' },
  { id: 'ecommerce', label: 'E-commerce', description: 'Online shop functionality' },
  { id: 'payment', label: 'Payment Integration', description: 'Accept online payments' },
  { id: 'chat', label: 'Live Chat', description: 'WhatsApp or chat widget' },
  { id: 'analytics', label: 'Analytics', description: 'Website statistics' },
];

const STYLE_OPTIONS = [
  { id: 'modern', label: 'Modern & Clean', description: 'Minimalist, lots of white space' },
  { id: 'classic', label: 'Classic & Professional', description: 'Traditional business style' },
  { id: 'bold', label: 'Bold & Creative', description: 'Vibrant colors, unique layouts' },
  { id: 'elegant', label: 'Elegant & Luxurious', description: 'Premium, sophisticated look' },
  { id: 'playful', label: 'Playful & Fun', description: 'Colorful, animated elements' },
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
                Business Information
              </h3>
              <p className="text-muted-foreground text-sm mt-1">
                Tell us about your business
              </p>
            </div>

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
                <Label htmlFor="industry">Industry</Label>
                <Select
                  value={brief.industry}
                  onValueChange={(v) => updateBrief('industry', v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your industry" />
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
              <Label htmlFor="description">Business Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe what your business does, your products/services..."
                rows={4}
                value={brief.description}
                onChange={(e) => updateBrief('description', e.target.value)}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="targetAudience">Target Audience</Label>
                <Input
                  id="targetAudience"
                  placeholder="Who are your customers?"
                  value={brief.targetAudience}
                  onChange={(e) => updateBrief('targetAudience', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="uniqueSelling">What makes you unique?</Label>
                <Input
                  id="uniqueSelling"
                  placeholder="Your competitive advantage"
                  value={brief.uniqueSelling}
                  onChange={(e) => updateBrief('uniqueSelling', e.target.value)}
                />
              </div>
            </div>

            <div className="border-t pt-6 mt-6">
              <h4 className="font-medium mb-4 flex items-center gap-2">
                <Users className="h-4 w-4" />
                Contact Information
              </h4>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="contactName">Your Name *</Label>
                  <Input
                    id="contactName"
                    placeholder="Full name"
                    value={brief.contactName}
                    onChange={(e) => updateBrief('contactName', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@example.com"
                    value={brief.email}
                    onChange={(e) => updateBrief('email', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone/WhatsApp</Label>
                  <Input
                    id="phone"
                    placeholder="+237 6XX XXX XXX"
                    value={brief.phone}
                    onChange={(e) => updateBrief('phone', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
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
                Design & Pages
              </h3>
              <p className="text-muted-foreground text-sm mt-1">
                Choose your website structure
              </p>
            </div>

            {/* Style Selection */}
            <div className="space-y-3">
              <Label>Design Style</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {STYLE_OPTIONS.map((style) => (
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
                <Label>Primary Color</Label>
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
                <Label>Secondary Color</Label>
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
              <Label>Pages Needed *</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {PAGE_OPTIONS.map((page) => (
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
              <Label htmlFor="referenceWebsites">Websites you like (for inspiration)</Label>
              <Textarea
                id="referenceWebsites"
                placeholder="List any websites you like (e.g., competitor sites, designs you admire)"
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
                Features & Functionality
              </h3>
              <p className="text-muted-foreground text-sm mt-1">
                Select features you need
              </p>
            </div>

            {/* Features Selection */}
            <div className="space-y-3">
              <Label>Main Features</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {FEATURE_OPTIONS.map((feature) => (
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
              <Label htmlFor="specialFeatures">Special Requirements</Label>
              <Textarea
                id="specialFeatures"
                placeholder="Any special features or functionality you need..."
                rows={3}
                value={brief.specialFeatures}
                onChange={(e) => updateBrief('specialFeatures', e.target.value)}
              />
            </div>

            {/* Assets Checklist */}
            <div className="space-y-3">
              <Label>What do you have ready?</Label>
              <div className="grid grid-cols-3 gap-3">
                <div
                  className={`p-4 border rounded-lg cursor-pointer text-center transition-all ${
                    brief.hasLogo ? 'border-green-500 bg-green-50 dark:bg-green-950' : ''
                  }`}
                  onClick={() => updateBrief('hasLogo', !brief.hasLogo)}
                >
                  <Image className="h-6 w-6 mx-auto mb-2" />
                  <span className="text-sm font-medium">Logo</span>
                </div>
                <div
                  className={`p-4 border rounded-lg cursor-pointer text-center transition-all ${
                    brief.hasContent ? 'border-green-500 bg-green-50 dark:bg-green-950' : ''
                  }`}
                  onClick={() => updateBrief('hasContent', !brief.hasContent)}
                >
                  <FileText className="h-6 w-6 mx-auto mb-2" />
                  <span className="text-sm font-medium">Content</span>
                </div>
                <div
                  className={`p-4 border rounded-lg cursor-pointer text-center transition-all ${
                    brief.hasImages ? 'border-green-500 bg-green-50 dark:bg-green-950' : ''
                  }`}
                  onClick={() => updateBrief('hasImages', !brief.hasImages)}
                >
                  <Image className="h-6 w-6 mx-auto mb-2" />
                  <span className="text-sm font-medium">Images</span>
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
                Timeline & Budget
              </h3>
              <p className="text-muted-foreground text-sm mt-1">
                Final details
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>When do you need the website?</Label>
                <Select
                  value={brief.deadline}
                  onValueChange={(v) => updateBrief('deadline', v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select timeline" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asap">As soon as possible</SelectItem>
                    <SelectItem value="1week">Within 1 week</SelectItem>
                    <SelectItem value="2weeks">Within 2 weeks</SelectItem>
                    <SelectItem value="1month">Within 1 month</SelectItem>
                    <SelectItem value="flexible">No rush, flexible</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Budget Range</Label>
                <Select
                  value={brief.budget}
                  onValueChange={(v) => updateBrief('budget', v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select budget" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Under $200</SelectItem>
                    <SelectItem value="medium">$200 - $500</SelectItem>
                    <SelectItem value="large">$500 - $1000</SelectItem>
                    <SelectItem value="enterprise">$1000+</SelectItem>
                    <SelectItem value="discuss">Let's discuss</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="additionalNotes">Additional Notes</Label>
              <Textarea
                id="additionalNotes"
                placeholder="Anything else you'd like us to know..."
                rows={4}
                value={brief.additionalNotes}
                onChange={(e) => updateBrief('additionalNotes', e.target.value)}
              />
            </div>

            {/* Summary */}
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-3">Brief Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Business:</span>
                  <span className="font-medium">{brief.businessName || 'Not specified'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Pages:</span>
                  <span className="font-medium">{brief.pagesNeeded.length} pages selected</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Features:</span>
                  <span className="font-medium">{brief.mainFeatures.length} features selected</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Style:</span>
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
            Previous
          </Button>

          {step < totalSteps ? (
            <Button
              onClick={() => setStep(step + 1)}
              disabled={!isStepValid()}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <CheckCircle className="h-4 w-4 mr-2" />
              )}
              Submit Brief
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
              <DialogTitle className="text-xl">Brief Submitted Successfully!</DialogTitle>
              <DialogDescription className="mt-4">
                Thank you for your detailed brief. Our team will review your requirements
                and get back to you within 24 hours.
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
