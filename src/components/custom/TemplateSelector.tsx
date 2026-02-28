'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import {
  Check,
  Crown,
  Star,
  Layout,
  Loader2,
} from 'lucide-react';
import type { WebsiteTemplate } from '@/types';

interface TemplateSelectorProps {
  category?: string;
  isPremium?: boolean;
  onSelect?: (template: WebsiteTemplate) => void;
  selectedSlug?: string;
}

export function TemplateSelector({
  category,
  isPremium = false,
  onSelect,
  selectedSlug,
}: TemplateSelectorProps) {
  const [templates, setTemplates] = useState<WebsiteTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'free' | 'premium'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchTemplates();
  }, [category]);

  const fetchTemplates = async () => {
    try {
      const url = category
        ? `/api/templates?category=${category}`
        : '/api/templates';
      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        setTemplates(data.templates);
      }
    } catch (error) {
      console.error('Failed to fetch templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTemplates = templates.filter((template) => {
    const matchesFilter =
      filter === 'all' ||
      (filter === 'free' && !template.isPremium) ||
      (filter === 'premium' && template.isPremium);

    const matchesSearch =
      !searchQuery ||
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const handleSelect = (template: WebsiteTemplate) => {
    if (template.isPremium && !isPremium) {
      alert('This template requires a Pro or Premium package');
      return;
    }
    onSelect?.(template);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Choose a Template</h2>
          <p className="text-muted-foreground">
            Select a professional template for your website
          </p>
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <Input
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="sm:w-[200px]"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <Tabs value={filter} onValueChange={(v) => setFilter(v as 'all' | 'free' | 'premium')}>
        <TabsList>
          <TabsTrigger value="all">All Templates</TabsTrigger>
          <TabsTrigger value="free">Free</TabsTrigger>
          <TabsTrigger value="premium">
            <Crown className="h-4 w-4 mr-1" />
            Premium
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Template Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredTemplates.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="py-12 text-center">
              <Layout className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-lg font-medium">No templates found</p>
              <p className="text-sm text-muted-foreground">
                Try adjusting your filters or search query
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredTemplates.map((template) => (
            <Card
              key={template.id}
              className={`cursor-pointer transition-all hover:shadow-lg ${
                selectedSlug === template.slug
                  ? 'ring-2 ring-blue-500 shadow-lg'
                  : ''
              } ${template.isPremium && !isPremium ? 'opacity-75' : ''}`}
              onClick={() => handleSelect(template)}
            >
              {/* Preview Image */}
              <div
                className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-t-lg flex items-center justify-center relative"
                style={{
                  background: `linear-gradient(135deg, ${template.colorScheme[0]}20, ${template.colorScheme[1]}20)`,
                }}
              >
                <div className="text-center">
                  <Layout className="h-12 w-12 mx-auto text-gray-400" />
                </div>

                {/* Badges */}
                <div className="absolute top-2 right-2 flex gap-1">
                  {template.isPremium && (
                    <Badge className="bg-gradient-to-r from-amber-500 to-orange-500">
                      <Crown className="h-3 w-3 mr-1" />
                      Premium
                    </Badge>
                  )}
                  {selectedSlug === template.slug && (
                    <Badge className="bg-green-500">
                      <Check className="h-3 w-3 mr-1" />
                      Selected
                    </Badge>
                  )}
                </div>

                {/* Layout Badge */}
                <Badge
                  variant="outline"
                  className="absolute bottom-2 left-2 bg-white/80 dark:bg-black/50"
                >
                  {template.layout}
                </Badge>
              </div>

              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <div className="flex gap-1">
                    {template.colorScheme.slice(0, 3).map((color, i) => (
                      <div
                        key={i}
                        className="w-4 h-4 rounded-full border"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {template.description}
                </p>

                {/* Features */}
                <div className="space-y-1">
                  {template.features.slice(0, 3).map((feature, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 text-xs text-muted-foreground"
                    >
                      <Check className="h-3 w-3 text-green-500" />
                      {feature}
                    </div>
                  ))}
                  {template.features.length > 3 && (
                    <p className="text-xs text-muted-foreground pl-5">
                      +{template.features.length - 3} more features
                    </p>
                  )}
                </div>

                {/* Category Badge */}
                <div className="mt-4 pt-4 border-t flex items-center justify-between">
                  <Badge variant="outline" className="capitalize">
                    {template.category}
                  </Badge>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Layout className="h-3 w-3" />
                    {template.sections.length} sections
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Premium Upgrade Notice */}
      {filter === 'all' && !isPremium && (
        <Card className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950 border-amber-200 dark:border-amber-800">
          <CardContent className="py-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-amber-100 dark:bg-amber-900">
                <Star className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Unlock Premium Templates</h3>
                <p className="text-sm text-muted-foreground">
                  Upgrade to Pro or Premium to access exclusive templates with advanced features
                </p>
              </div>
              <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
                Upgrade Now
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
