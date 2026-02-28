'use client';

import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Globe,
  Unlink,
  ExternalLink,
  MessageCircle,
  Star,
  Phone,
  MapPin,
  Loader2,
} from 'lucide-react';
import type { Business } from '@/types';

const WEBSITE_STATUS_LABELS: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  no_website: { label: 'No Website', variant: 'destructive' },
  active: { label: 'Has Website', variant: 'default' },
  broken: { label: 'Broken Link', variant: 'secondary' },
  social_media: { label: 'Social Only', variant: 'outline' },
};

export function BusinessList() {
  const {
    searchResults,
    isSearching,
    searchError,
    websiteFilter,
    setWebsiteFilter,
    setSelectedBusiness,
    setIsChatOpen,
    setConversation,
    addMessage,
  } = useAppStore();

  const { t } = useLanguageStore();
  const [startingChat, setStartingChat] = useState<string | null>(null);

  // Get website status labels with translations
  const getWebsiteStatusLabel = (status: string) => {
    switch (status) {
      case 'no_website':
        return { label: t('business.noWebsiteLabel'), variant: 'destructive' as const };
      case 'active':
        return { label: t('business.hasWebsiteLabel'), variant: 'default' as const };
      case 'broken':
        return { label: t('business.brokenLink'), variant: 'secondary' as const };
      case 'social_media':
        return { label: t('business.socialOnly'), variant: 'outline' as const };
      default:
        return { label: t('business.noWebsiteLabel'), variant: 'destructive' as const };
    }
  };

  // Filter results based on website filter
  const filteredResults = searchResults.filter((business) => {
    if (websiteFilter === 'no_website') {
      return !business.hasWebsite || business.websiteStatus === 'social_media';
    }
    if (websiteFilter === 'has_website') {
      return business.hasWebsite && business.websiteStatus === 'active';
    }
    return true;
  });

  const handleStartChat = async (business: Business) => {
    setStartingChat(business.id);
    
    // Immediately open the chat panel and set the business
    setSelectedBusiness(business);
    setIsChatOpen(true);
    
    // Clear any existing conversation
    setConversation([]);
    
    // Generate initial AI message
    const initialMessage = {
      id: `msg-${Date.now()}`,
      role: 'assistant' as const,
      content: `Hello! I'm reaching out from WebFinder. I noticed ${business.name}${business.category ? `, your ${business.category.toLowerCase()} business` : ' your business'}${business.rating ? ` with an impressive ${business.rating}-star rating` : ''}, and I saw that you don't currently have a website.\n\nA professional website could help you reach more customers and showcase your services 24/7. Would you be interested in learning about how we can create an affordable, professional website for your business?`,
      timestamp: new Date(),
    };
    
    addMessage(initialMessage);
    setStartingChat(null);
    
    // Try to save to database in the background (non-blocking)
    try {
      await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessId: business.id }),
      });
    } catch (error) {
      // Silently fail - the chat is already open and working
      console.log('Background save failed:', error);
    }
  };

  if (isSearching) {
    return (
      <section id="dashboard" className="py-16 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
            <p className="text-lg text-muted-foreground">{t('business.searching')}</p>
          </div>
        </div>
      </section>
    );
  }

  if (searchError) {
    return (
      <section id="dashboard" className="py-16 px-4">
        <div className="container mx-auto">
          <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-6 text-center">
            <p className="text-red-600 dark:text-red-400">{searchError}</p>
          </div>
        </div>
      </section>
    );
  }

  if (searchResults.length === 0) {
    return (
      <section id="dashboard" className="py-16 px-4">
        <div className="container mx-auto">
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-12 text-center">
            <Globe className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">{t('business.noResults')}</h3>
            <p className="text-muted-foreground">
              {t('business.useSearch')}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="dashboard" className="py-16 px-4 bg-gray-50 dark:bg-gray-900/50">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold">{t('business.searchResults')}</h2>
            <p className="text-muted-foreground">
              {t('business.found')} {filteredResults.length} {t('business.businesses')}
              {websiteFilter !== 'all' && ` (${websiteFilter === 'no_website' ? t('business.withoutWebsites') : t('business.withWebsites')})`}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">{t('business.filter')}</span>
            <Select value={websiteFilter} onValueChange={(v) => setWebsiteFilter(v as 'all' | 'no_website' | 'has_website')}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('business.allBusinesses')}</SelectItem>
                <SelectItem value="no_website">{t('business.noWebsite')}</SelectItem>
                <SelectItem value="has_website">{t('business.hasWebsite')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('business.businessName')}</TableHead>
                  <TableHead>{t('business.category')}</TableHead>
                  <TableHead>{t('business.rating')}</TableHead>
                  <TableHead>{t('business.address')}</TableHead>
                  <TableHead>{t('business.websiteStatus')}</TableHead>
                  <TableHead className="text-right">{t('business.action')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredResults.map((business) => {
                  const status = getWebsiteStatusLabel(business.websiteStatus || 'no_website');
                  const canContact = !business.hasWebsite || business.websiteStatus === 'social_media';

                  return (
                    <TableRow key={business.id}>
                      <TableCell>
                        <div className="font-medium">{business.name}</div>
                        {business.phone && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                            <Phone className="h-3 w-3" />
                            {business.phone}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{business.category || t('category.business')}</Badge>
                      </TableCell>
                      <TableCell>
                        {business.rating ? (
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium">{business.rating}</span>
                            {business.reviewCount && (
                              <span className="text-xs text-muted-foreground">
                                ({business.reviewCount})
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-start gap-1 max-w-[200px]">
                          <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                          <span className="text-sm truncate">{business.address || '—'}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={status.variant}>
                          {business.websiteStatus === 'active' ? (
                            <Globe className="h-3 w-3 mr-1" />
                          ) : (
                            <Unlink className="h-3 w-3 mr-1" />
                          )}
                          {status.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          {business.website && (
                            <Button
                              variant="ghost"
                              size="sm"
                              asChild
                            >
                              <a
                                href={business.website}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            </Button>
                          )}
                          {canContact && (
                            <Button
                              size="sm"
                              onClick={() => handleStartChat(business)}
                              disabled={startingChat === business.id}
                              className="bg-gradient-to-r from-blue-600 to-indigo-600"
                            >
                              {startingChat === business.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <>
                                  <MessageCircle className="h-4 w-4 mr-1" />
                                  {t('business.contact')}
                                </>
                              )}
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </section>
  );
}
