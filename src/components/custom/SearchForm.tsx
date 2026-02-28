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
import { Search, Loader2 } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import { BUSINESS_CATEGORIES, RADIUS_OPTIONS } from '@/types';

export function SearchForm() {
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('all');
  const [radius, setRadius] = useState('5000');

  const { isSearching, setSearchResults, setIsSearching, setSearchError } = useAppStore();
  const { t } = useLanguageStore();

  const handleSearch = async () => {
    if (!location.trim()) return;

    setIsSearching(true);
    setSearchError(null);

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          location,
          category,
          radius: parseInt(radius),
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSearchResults(data.data.businesses);
      } else {
        setSearchError(data.error || t('hero.searchFailed'));
      }
    } catch (error) {
      setSearchError(t('hero.connectionFailed'));
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4 md:p-6 border">
        <div className="grid gap-4 md:grid-cols-4">
          {/* Location Input */}
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-muted-foreground mb-1.5 block">
              {t('searchForm.location')}
            </label>
            <Input
              type="text"
              placeholder={t('searchForm.enterCity')}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="h-12"
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>

          {/* Category Select */}
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-1.5 block">
              {t('searchForm.category')}
            </label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder={t('searchForm.selectCategory')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('category.all')}</SelectItem>
                {BUSINESS_CATEGORIES.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Radius Select */}
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-1.5 block">
              {t('searchForm.radius')}
            </label>
            <Select value={radius} onValueChange={setRadius}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder={t('searchForm.selectRadius')} />
              </SelectTrigger>
              <SelectContent>
                {RADIUS_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value.toString()}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Search Button */}
        <Button
          onClick={handleSearch}
          disabled={isSearching || !location.trim()}
          className="w-full h-12 mt-4 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all"
        >
          {isSearching ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              {t('searchForm.searching')}
            </>
          ) : (
            <>
              <Search className="mr-2 h-5 w-5" />
              {t('searchForm.discoverBusinesses')}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
