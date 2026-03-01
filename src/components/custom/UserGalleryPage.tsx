'use client';

import { useState } from 'react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Globe,
  ExternalLink,
  Eye,
  Heart,
  Filter,
  Grid3X3,
  LayoutGrid,
  Sparkles,
} from 'lucide-react';

const galleryCategories = [
  { id: 'all', labelKey: 'gallery.allProjects' },
  { id: 'business', labelKey: 'category.business' },
  { id: 'ecommerce', labelKey: 'gallery.ecommerce' },
  { id: 'restaurant', labelKey: 'category.restaurant' },
  { id: 'health', labelKey: 'gallery.healthcare' },
  { id: 'tech', labelKey: 'gallery.tech' },
  { id: 'creative', labelKey: 'category.creative' },
];

const galleryItems = [
  {
    id: 1,
    title: 'TechVision Startup',
    category: 'tech',
    description: 'Modern SaaS platform with dark mode and animated components',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
    tags: ['React', 'Next.js', 'Tailwind'],
    views: 2450,
    likes: 189,
  },
  {
    id: 2,
    title: 'LuxeStyle Fashion',
    category: 'ecommerce',
    description: 'Premium e-commerce store with smooth checkout experience',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop',
    tags: ['Shopify', 'Custom Theme', 'Payment'],
    views: 3200,
    likes: 256,
  },
  {
    id: 3,
    title: 'Sakura Restaurant',
    category: 'restaurant',
    description: 'Elegant Japanese restaurant with online reservation system',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop',
    tags: ['Booking', 'Menu', 'Gallery'],
    views: 1890,
    likes: 145,
  },
  {
    id: 4,
    title: 'MedCare Health',
    category: 'health',
    description: 'Healthcare portal with appointment booking and telemedicine',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&h=400&fit=crop',
    tags: ['Healthcare', 'Booking', 'HIPAA'],
    views: 2100,
    likes: 178,
  },
  {
    id: 5,
    title: 'FinanceHub Pro',
    category: 'business',
    description: 'Financial services website with calculator tools',
    image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&h=400&fit=crop',
    tags: ['Finance', 'Calculator', 'Forms'],
    views: 1650,
    likes: 132,
  },
  {
    id: 6,
    title: 'CreativeStudio',
    category: 'creative',
    description: 'Portfolio website for creative agency',
    image: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=600&h=400&fit=crop',
    tags: ['Portfolio', 'Animation', 'GSAP'],
    views: 2800,
    likes: 224,
  },
  {
    id: 7,
    title: 'EduLearn Platform',
    category: 'tech',
    description: 'Online learning platform with course management',
    image: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=600&h=400&fit=crop',
    tags: ['LMS', 'Courses', 'Progress'],
    views: 1950,
    likes: 156,
  },
  {
    id: 8,
    title: 'GreenLeaf Organics',
    category: 'ecommerce',
    description: 'Organic products store with subscription model',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&h=400&fit=crop',
    tags: ['Subscription', 'Organic', 'Delivery'],
    views: 1420,
    likes: 98,
  },
  {
    id: 9,
    title: 'Bella Italia',
    category: 'restaurant',
    description: 'Italian restaurant with online ordering system',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop',
    tags: ['Order Online', 'Delivery', 'Italian'],
    views: 2340,
    likes: 187,
  },
  {
    id: 10,
    title: 'DentalCare Plus',
    category: 'health',
    description: 'Dental clinic with patient portal and scheduling',
    image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600&h=400&fit=crop',
    tags: ['Dental', 'Scheduling', 'Portal'],
    views: 890,
    likes: 67,
  },
  {
    id: 11,
    title: 'ConsultPro',
    category: 'business',
    description: 'Business consulting firm with case studies',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop',
    tags: ['Consulting', 'Case Studies', 'B2B'],
    views: 1560,
    likes: 123,
  },
  {
    id: 12,
    title: 'ArtGallery NYC',
    category: 'creative',
    description: 'Virtual art gallery with 3D exhibition space',
    image: 'https://images.unsplash.com/photo-1544967082-d9d25d867d66?w=600&h=400&fit=crop',
    tags: ['3D', 'Gallery', 'Virtual Tour'],
    views: 3100,
    likes: 287,
  },
];

export function UserGalleryPage() {
  const { t } = useLanguageStore();
  const [activeCategory, setActiveCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'masonry'>('grid');
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);
  const [visibleCount, setVisibleCount] = useState(6);
  const [selectedItem, setSelectedItem] = useState<typeof galleryItems[0] | null>(null);

  const filteredItems = activeCategory === 'all'
    ? galleryItems
    : galleryItems.filter(item => item.category === activeCategory);

  const displayedItems = filteredItems.slice(0, visibleCount);
  const hasMoreItems = visibleCount < filteredItems.length;

  const handleViewProject = (item: typeof galleryItems[0]) => {
    // For demo purposes, open a mailto link or show project details
    window.open(`mailto:brank493@gmail.com?subject=Project%20Inquiry%20-%20${encodeURIComponent(item.title)}&body=I'm%20interested%20in%20a%20similar%20website%20project.`, '_blank');
  };

  const handleLoadMore = () => {
    setVisibleCount(prev => Math.min(prev + 6, filteredItems.length));
  };

  return (
    <div className="space-y-8">
      {/* Filter Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-blue-600" />
          <span className="text-sm font-medium text-gray-600">{t('gallery.filterBy')}</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
            className={viewMode === 'grid' ? 'bg-blue-600' : ''}
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'masonry' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('masonry')}
            className={viewMode === 'masonry' ? 'bg-blue-600' : ''}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Category Tabs */}
      <Tabs value={activeCategory} onValueChange={setActiveCategory}>
        <TabsList className="flex flex-wrap h-auto gap-2 bg-transparent">
          {galleryCategories.map((category) => (
            <TabsTrigger
              key={category.id}
              value={category.id}
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white px-4 py-2"
            >
              {t(category.labelKey)}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Gallery Grid */}
      <div className={`grid gap-6 ${
        viewMode === 'grid' 
          ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
          : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
      }`}>
        {displayedItems.map((item) => (
          <Card
            key={item.id}
            className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
            onMouseEnter={() => setHoveredItem(item.id)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <div className="relative overflow-hidden">
              <div className={`${
                viewMode === 'masonry' && item.id % 3 === 0 ? 'aspect-[4/5]' : 'aspect-[4/3]'
              }`}>
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              
              {/* Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-opacity duration-300 ${
                hoveredItem === item.id ? 'opacity-100' : 'opacity-0'
              }`}>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-lg font-bold text-white mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-300 mb-3">{item.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <span className="flex items-center gap-1 text-white text-sm">
                        <Eye className="h-4 w-4" />
                        {item.views.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1 text-white text-sm">
                        <Heart className="h-4 w-4" />
                        {item.likes}
                      </span>
                    </div>
                    <Button 
                      size="sm" 
                      className="bg-white text-gray-900 hover:bg-gray-100"
                      onClick={() => handleViewProject(item)}
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      {t('gallery.view')}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Category Badge */}
              <Badge className="absolute top-3 left-3 bg-blue-600 text-white capitalize">
                {item.category}
              </Badge>
            </div>

            <CardContent className="p-4">
              <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
              <div className="flex flex-wrap gap-1">
                {item.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More */}
      {hasMoreItems && (
        <div className="text-center pt-8">
          <Button 
            variant="outline" 
            size="lg" 
            className="border-blue-600 text-blue-600 hover:bg-blue-50"
            onClick={handleLoadMore}
          >
            <Sparkles className="h-5 w-5 mr-2" />
            {t('gallery.loadMore')}
          </Button>
        </div>
      )}
    </div>
  );
}
