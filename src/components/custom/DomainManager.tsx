'use client';

import { useState } from 'react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Globe,
  Search,
  CheckCircle,
  XCircle,
  Loader2,
  ShoppingCart,
  Settings,
  ExternalLink,
  Shield,
  Clock,
  AlertCircle,
} from 'lucide-react';

interface Domain {
  id: string;
  name: string;
  status: 'available' | 'taken' | 'owned' | 'pending';
  price?: number;
  expiryDate?: string;
  sslEnabled?: boolean;
  projectId?: string;
}

const mockOwnedDomains: Domain[] = [
  {
    id: '1',
    name: 'techstartup.com',
    status: 'owned',
    price: 12.99,
    expiryDate: '2025-12-15',
    sslEnabled: true,
    projectId: 'proj_1',
  },
  {
    id: '2',
    name: 'myrestaurant.net',
    status: 'owned',
    price: 9.99,
    expiryDate: '2025-08-20',
    sslEnabled: true,
    projectId: 'proj_2',
  },
  {
    id: '3',
    name: 'beautysalon.org',
    status: 'pending',
    price: 14.99,
    sslEnabled: false,
  },
];

export function DomainManager() {
  const { t } = useLanguageStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Domain[]>([]);
  const [ownedDomains, setOwnedDomains] = useState<Domain[]>(mockOwnedDomains);
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);
  const [purchasing, setPurchasing] = useState(false);

  const searchDomain = async () => {
    if (!searchQuery.trim()) return;

    setSearching(true);
    // Simulate domain search
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const extensions = ['.com', '.net', '.org', '.io', '.co'];
    const results: Domain[] = extensions.map((ext, i) => ({
      id: `search_${i}`,
      name: `${searchQuery.toLowerCase().replace(/\s+/g, '')}${ext}`,
      status: Math.random() > 0.3 ? 'available' : 'taken',
      price: ext === '.io' ? 39.99 : ext === '.co' ? 24.99 : 12.99,
    }));

    setSearchResults(results);
    setSearching(false);
  };

  const purchaseDomain = async (domain: Domain) => {
    setPurchasing(true);
    // Simulate purchase
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const newDomain: Domain = {
      ...domain,
      id: `owned_${Date.now()}`,
      status: 'owned',
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      sslEnabled: true,
    };

    setOwnedDomains([...ownedDomains, newDomain]);
    setSearchResults(searchResults.filter((d) => d.id !== domain.id));
    setPurchasing(false);
    setSelectedDomain(null);
  };

  const getStatusBadge = (status: Domain['status']) => {
    switch (status) {
      case 'available':
        return <Badge className="bg-green-500">{t('domain.available')}</Badge>;
      case 'taken':
        return <Badge variant="destructive">{t('domain.taken')}</Badge>;
      case 'owned':
        return <Badge className="bg-blue-500">{t('domain.owned')}</Badge>;
      case 'pending':
        return <Badge variant="secondary">{t('domain.pending')}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Globe className="h-6 w-6 text-blue-600" />
            {t('domain.title')}
          </h2>
          <p className="text-muted-foreground">
            {t('domain.subtitle')}
          </p>
        </div>
      </div>

      {/* Domain Search */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t('domain.searchDomain')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder={t('domain.enterDomain')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && searchDomain()}
              className="flex-1"
            />
            <Button onClick={searchDomain} disabled={searching}>
              {searching ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
              <span className="ml-2 hidden sm:inline">{t('domain.search')}</span>
            </Button>
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="mt-6 space-y-2">
              <h4 className="font-medium">{t('domain.searchResults')}</h4>
              <div className="space-y-2">
                {searchResults.map((domain) => (
                  <div
                    key={domain.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Globe className="h-5 w-5 text-muted-foreground" />
                      <span className="font-medium">{domain.name}</span>
                      {getStatusBadge(domain.status)}
                    </div>
                    <div className="flex items-center gap-2">
                      {domain.status === 'available' && (
                        <>
                          <span className="text-sm font-medium">
                            ${domain.price?.toFixed(2)}/year
                          </span>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                onClick={() => setSelectedDomain(domain)}
                              >
                                <ShoppingCart className="h-4 w-4 mr-1" />
                                {t('domain.buy')}
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>{t('domain.purchaseDomain')}</DialogTitle>
                                <DialogDescription>
                                  {t('domain.purchaseDesc')} {domain.name}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="py-4">
                                <div className="space-y-4">
                                  <div className="flex justify-between">
                                    <span>{t('domain.domainLabel')}</span>
                                    <span className="font-medium">
                                      {domain.name}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>{t('domain.duration')}</span>
                                    <span>{t('domain.oneYear')}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>{t('domain.sslCertificate')}</span>
                                    <span className="text-green-600">
                                      {t('domain.includedFree')}
                                    </span>
                                  </div>
                                  <div className="flex justify-between text-lg font-bold border-t pt-4">
                                    <span>{t('domain.totalLabel')}</span>
                                    <span>${domain.price?.toFixed(2)}</span>
                                  </div>
                                </div>
                              </div>
                              <DialogFooter>
                                <Button
                                  onClick={() => purchaseDomain(domain)}
                                  disabled={purchasing}
                                >
                                  {purchasing ? (
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                  ) : (
                                    <ShoppingCart className="h-4 w-4 mr-2" />
                                  )}
                                  {t('domain.completePurchase')}
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </>
                      )}
                      {domain.status === 'taken' && (
                        <span className="text-sm text-muted-foreground">
                          {t('domain.notAvailable')}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Owned Domains */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t('domain.yourDomains')}</CardTitle>
        </CardHeader>
        <CardContent>
          {ownedDomains.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Globe className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>{t('domain.noDomains')}</p>
              <p className="text-sm">
                {t('domain.searchDomainAbove')}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {ownedDomains.map((domain) => (
                <div
                  key={domain.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
                      <Globe className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{domain.name}</span>
                        {getStatusBadge(domain.status)}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        {domain.expiryDate && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {t('domain.expires')} {domain.expiryDate}
                          </span>
                        )}
                        {domain.sslEnabled && (
                          <span className="flex items-center gap-1 text-green-600">
                            <Shield className="h-3 w-3" />
                            {t('domain.sslActive')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {domain.status === 'owned' && (
                      <>
                        <Button variant="outline" size="sm">
                          <ExternalLink className="h-4 w-4 mr-1" />
                          {t('domain.visit')}
                        </Button>
                        <Button variant="outline" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                    {domain.status === 'pending' && (
                      <div className="flex items-center gap-1 text-amber-600 text-sm">
                        <AlertCircle className="h-4 w-4" />
                        {t('domain.setupRequired')}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Domain Pricing Info */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">$12.99</p>
              <p className="text-sm text-muted-foreground">.com {t('domain.perYear')}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">Free</p>
              <p className="text-sm text-muted-foreground">{t('domain.sslFree')}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-600">24/7</p>
              <p className="text-sm text-muted-foreground">{t('domain.dnsSupport')}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
