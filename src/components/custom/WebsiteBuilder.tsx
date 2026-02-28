'use client';

import { useState } from 'react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Check,
  Sparkles,
  Loader2,
  Eye,
  Download,
  Wand2,
  Palette,
  FileText,
  Globe,
} from 'lucide-react';
import { PRICING_PACKAGES, type PricingPackage } from '@/lib/pricing';

interface WebsiteBuilderProps {
  projectId: string;
  businessName: string;
  category: string;
  package_: 'standard' | 'pro' | 'premium';
  existingBrief?: {
    services?: string;
    style?: string;
    colors?: string[];
    features?: string[];
    pages?: string[];
    domain?: string;
    notes?: string;
  };
}

export function WebsiteBuilder({
  projectId,
  businessName,
  category,
  package_,
  existingBrief,
}: WebsiteBuilderProps) {
  const { t } = useLanguageStore();
  const [generating, setGenerating] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [generated, setGenerated] = useState(false);
  const [activeTab, setActiveTab] = useState('customize');

  // Brief form state
  const [brief, setBrief] = useState({
    services: existingBrief?.services || '',
    style: existingBrief?.style || 'modern',
    colors: existingBrief?.colors?.join(', ') || '',
    features: existingBrief?.features?.join(', ') || '',
    pages: existingBrief?.pages?.join(', ') || 'Home, About, Services, Contact',
    domain: existingBrief?.domain || '',
    notes: existingBrief?.notes || '',
  });

  const package_ = PRICING_PACKAGES.find((p) => p.id === package_);
  const isPremium = package_ === 'premium';
  const isPro = package_ === 'pro';

  const generateWebsite = async () => {
    setGenerating(true);

    try {
      const response = await fetch('/api/website/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          templateSlug: `${category.replace(/\s+/g, '-')}-${brief.style}`,
          customBrief: {
            ...brief,
            colors: brief.colors.split(',').map((c) => c.trim()).filter(Boolean),
            features: brief.features.split(',').map((f) => f.trim()).filter(Boolean),
            pages: brief.pages.split(',').map((p) => p.trim()).filter(Boolean),
          },
        }),
      });

      const data = await response.json();

      if (data.success) {
        setPreviewUrl(`/api/preview?projectId=${projectId}`);
        setGenerated(true);
        setActiveTab('preview');
      }
    } catch (error) {
      console.error('Generation error:', error);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Wand2 className="h-6 w-6 text-blue-600" />
            Website Builder
          </h2>
          <p className="text-muted-foreground">
            Create a professional website for {businessName}
          </p>
        </div>
        <Badge
          variant={isPremium ? 'default' : isPro ? 'secondary' : 'outline'}
          className="text-sm"
        >
          {package_?.name} Package
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="customize">
            <Palette className="h-4 w-4 mr-2" />
            Customize
          </TabsTrigger>
          <TabsTrigger value="preview" disabled={!generated}>
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </TabsTrigger>
          <TabsTrigger value="export" disabled={!generated}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </TabsTrigger>
        </TabsList>

        {/* Customize Tab */}
        <TabsContent value="customize" className="space-y-6 mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Left Column - Brief */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Content Brief
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="services">Services / Products</Label>
                  <Textarea
                    id="services"
                    value={brief.services}
                    onChange={(e) =>
                      setBrief({ ...brief, services: e.target.value })
                    }
                    placeholder="Describe the services or products offered..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Design Style</Label>
                  <Select
                    value={brief.style}
                    onValueChange={(v) => setBrief({ ...brief, style: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="modern">Modern</SelectItem>
                      <SelectItem value="classic">Classic</SelectItem>
                      <SelectItem value="minimalist">Minimalist</SelectItem>
                      <SelectItem value="bold">Bold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="colors">Brand Colors</Label>
                  <Input
                    id="colors"
                    value={brief.colors}
                    onChange={(e) =>
                      setBrief({ ...brief, colors: e.target.value })
                    }
                    placeholder="blue, white, gold (comma-separated)"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="features">Features Needed</Label>
                  <Textarea
                    id="features"
                    value={brief.features}
                    onChange={(e) =>
                      setBrief({ ...brief, features: e.target.value })
                    }
                    placeholder="booking system, contact form, gallery..."
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Right Column - Structure */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Site Structure
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="pages">Pages</Label>
                  <Textarea
                    id="pages"
                    value={brief.pages}
                    onChange={(e) =>
                      setBrief({ ...brief, pages: e.target.value })
                    }
                    placeholder="Home, About, Services, Contact"
                    rows={2}
                  />
                  <p className="text-xs text-muted-foreground">
                    {isPremium ? 'Unlimited pages' : isPro ? 'Up to 10 pages' : 'Up to 5 pages'}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="domain">Preferred Domain</Label>
                  <Input
                    id="domain"
                    value={brief.domain}
                    onChange={(e) =>
                      setBrief({ ...brief, domain: e.target.value })
                    }
                    placeholder="yourbusiness.com"
                  />
                  {isPremium && (
                    <p className="text-xs text-green-600">
                      Custom domain included with Premium
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea
                    id="notes"
                    value={brief.notes}
                    onChange={(e) =>
                      setBrief({ ...brief, notes: e.target.value })
                    }
                    placeholder="Any specific requirements or preferences..."
                    rows={3}
                  />
                </div>

                {/* Package Features */}
                <div className="pt-4 border-t">
                  <p className="text-sm font-medium mb-2">Package Features:</p>
                  <ul className="space-y-1">
                    {package_?.features.slice(0, 5).map((feature, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-2 text-xs text-muted-foreground"
                      >
                        <Check className="h-3 w-3 text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Generate Button */}
          <div className="flex justify-center">
            <Button
              size="lg"
              onClick={generateWebsite}
              disabled={generating}
              className="px-8 bg-gradient-to-r from-blue-600 to-indigo-600"
            >
              {generating ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Generating Website...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5 mr-2" />
                  Generate Website with AI
                </>
              )}
            </Button>
          </div>
        </TabsContent>

        {/* Preview Tab */}
        <TabsContent value="preview" className="mt-6">
          <Card>
            <CardContent className="p-0">
              {previewUrl && (
                <iframe
                  src={previewUrl}
                  className="w-full h-[600px] border-0 rounded-lg"
                  title="Website Preview"
                />
              )}
            </CardContent>
          </Card>

          <div className="flex justify-center gap-4 mt-6">
            <Button variant="outline" onClick={() => setActiveTab('customize')}>
              Make Changes
            </Button>
            <Button
              className="bg-gradient-to-r from-green-600 to-emerald-600"
              onClick={() => setActiveTab('export')}
            >
              Continue to Export
            </Button>
          </div>
        </TabsContent>

        {/* Export Tab */}
        <TabsContent value="export" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Export Your Website</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Your website is ready! Choose how you'd like to export it:
              </p>

              <div className="grid gap-4 md:grid-cols-2">
                <Button
                  variant="outline"
                  className="h-auto py-4 flex flex-col items-center gap-2"
                >
                  <Download className="h-6 w-6" />
                  <span className="font-medium">Download HTML/CSS</span>
                  <span className="text-xs text-muted-foreground">
                    Get files to host anywhere
                  </span>
                </Button>

                <Button
                  className="h-auto py-4 flex flex-col items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600"
                >
                  <Globe className="h-6 w-6" />
                  <span className="font-medium">Deploy with WebFinder</span>
                  <span className="text-xs opacity-80">
                    We'll host it for you
                  </span>
                </Button>
              </div>

              {isPremium && (
                <div className="p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
                  <p className="text-sm font-medium text-purple-900 dark:text-purple-100">
                    Premium Benefits:
                  </p>
                  <ul className="mt-2 space-y-1 text-sm text-purple-700 dark:text-purple-300">
                    <li>• Free custom domain setup</li>
                    <li>• SSL certificate included</li>
                    <li>• Priority support for 1 year</li>
                    <li>• Unlimited content updates</li>
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
