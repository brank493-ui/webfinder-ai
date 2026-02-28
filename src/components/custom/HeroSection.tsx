'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, MapPin, Loader2 } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

const CATEGORIES = [
  { value: 'all', label: 'All Categories' },
  { value: 'restaurant', label: 'Restaurant' },
  { value: 'retail', label: 'Retail' },
  { value: 'health', label: 'Health & Medical' },
  { value: 'beauty', label: 'Beauty & Spa' },
  { value: 'auto', label: 'Auto Services' },
  { value: 'service', label: 'Professional Services' },
  { value: 'professional', label: 'Professional Services' },
];

const RADII = [
  { value: '1000', label: '1 km' },
  { value: '5000', label: '5 km' },
  { value: '10000', label: '10 km' },
  { value: '25000', label: '25 km' },
  { value: '50000', label: '50 km' },
];

export function HeroSection() {
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('all');
  const [radius, setRadius] = useState('5000');

  const { setIsSearching, setSearchResults, setSearchError } = useAppStore();

  const handleSearch = async () => {
    if (!location.trim()) {
      setSearchError('Please enter a location');
      return;
    }

    setIsSearching(true);
    setSearchError(null);

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ location, category, radius: parseInt(radius) }),
      });

      const data = await response.json();

      if (data.success) {
        setSearchResults(data.businesses);
      } else {
        setSearchError(data.error || 'Failed to search businesses');
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchError('Failed to connect to search service');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-20 md:py-32">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-400/20 rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10 px-4">
        <div className="text-center max-w-4xl mx-auto mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Find Businesses Without Websites
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-4">
            Help them grow online with professional website development
          </p>
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
            Search any location worldwide, discover businesses lacking an online presence,
            and connect with them through our AI-powered outreach system.
          </p>
        </div>

        {/* Search Form */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border">
            <div className="grid gap-4 md:grid-cols-4">
              {/* Location Input */}
              <div className="md:col-span-2 relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Enter city, area, or address..."
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="pl-10 h-12"
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>

              {/* Category Select */}
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Radius Select */}
              <Select value={radius} onValueChange={setRadius}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Radius" />
                </SelectTrigger>
                <SelectContent>
                  {RADII.map((r) => (
                    <SelectItem key={r.value} value={r.value}>
                      {r.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleSearch}
              className="w-full mt-4 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-lg"
              size="lg"
            >
              <Search className="mr-2 h-5 w-5" />
              Search Businesses
            </Button>
          </div>

          {/* Quick stats */}
          <div className="flex justify-center gap-8 mt-8 text-center">
            <div>
              <p className="text-2xl font-bold text-blue-600">10K+</p>
              <p className="text-sm text-muted-foreground">Businesses Found</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-indigo-600">500+</p>
              <p className="text-sm text-muted-foreground">Websites Created</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600">50+</p>
              <p className="text-sm text-muted-foreground">Countries Covered</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
