'use client';

import { useState, useEffect } from 'react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Globe,
  Loader2,
  ExternalLink,
  Palette,
  FileText,
  Settings,
  MessageSquare,
  Send,
  Clock,
  CheckCircle,
} from 'lucide-react';

interface Workspace {
  id: string;
  status: string;
  paymentStatus: string;
  package: string;
  amount: number | null;
  createdAt: string;
  brief: {
    services?: string;
    style?: string;
    colors?: string[];
    features?: string[];
    pages?: string[];
    domain?: string;
    notes?: string;
  } | null;
  business: {
    id: string;
    name: string;
    category: string | null;
    email: string | null;
    phone: string | null;
    address: string | null;
  };
}

export function WorkspaceManager() {
  const { t } = useLanguageStore();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [updating, setUpdating] = useState(false);

  // Brief form state
  const [briefForm, setBriefForm] = useState({
    services: '',
    style: 'modern',
    colors: '',
    features: '',
    pages: '',
    domain: '',
    notes: '',
  });

  const fetchWorkspaces = async () => {
    try {
      const response = await fetch('/api/workspaces');
      const data = await response.json();

      if (data.success) {
        setWorkspaces(data.workspaces);
      }
    } catch (error) {
      console.error('Failed to fetch workspaces:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  const openWorkspace = (workspace: Workspace) => {
    setSelectedWorkspace(workspace);
    if (workspace.brief) {
      setBriefForm({
        services: workspace.brief.services || '',
        style: workspace.brief.style || 'modern',
        colors: workspace.brief.colors?.join(', ') || '',
        features: workspace.brief.features?.join(', ') || '',
        pages: workspace.brief.pages?.join(', ') || '',
        domain: workspace.brief.domain || '',
        notes: workspace.brief.notes || '',
      });
    }
    setDetailOpen(true);
  };

  const updateBrief = async () => {
    if (!selectedWorkspace) return;

    setUpdating(true);
    try {
      const response = await fetch('/api/workspaces', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: selectedWorkspace.id,
          brief: {
            services: briefForm.services,
            style: briefForm.style,
            colors: briefForm.colors.split(',').map((c) => c.trim()).filter(Boolean),
            features: briefForm.features.split(',').map((f) => f.trim()).filter(Boolean),
            pages: briefForm.pages.split(',').map((p) => p.trim()).filter(Boolean),
            domain: briefForm.domain,
            notes: briefForm.notes,
          },
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Update local state
        setWorkspaces((prev) =>
          prev.map((w) =>
            w.id === selectedWorkspace.id ? { ...w, brief: data.workspace.brief } : w
          )
        );
        setSelectedWorkspace(data.workspace);
      }
    } catch (error) {
      console.error('Failed to update brief:', error);
    } finally {
      setUpdating(false);
    }
  };

  const updateStatus = async (status: string) => {
    if (!selectedWorkspace) return;

    setUpdating(true);
    try {
      const response = await fetch('/api/workspaces', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: selectedWorkspace.id,
          status,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setWorkspaces((prev) =>
          prev.map((w) =>
            w.id === selectedWorkspace.id ? { ...w, status } : w
          )
        );
        setSelectedWorkspace({ ...selectedWorkspace, status });
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setUpdating(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      pending: 'secondary',
      in_progress: 'default',
      completed: 'default',
      cancelled: 'destructive',
    };
    return (
      <Badge variant={variants[status] || 'outline'}>
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  const getPaymentBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      pending: 'secondary',
      paid: 'default',
      refunded: 'destructive',
    };
    return (
      <Badge variant={variants[status] || 'outline'}>
        {status}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{t('workspace.title')}</h2>
          <p className="text-muted-foreground">
            {t('workspace.subtitle')}
          </p>
        </div>
      </div>

      {/* Workspace Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {workspaces.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="py-12 text-center">
              <Globe className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-lg font-medium">{t('workspace.noWorkspaces')}</p>
              <p className="text-sm text-muted-foreground">
                {t('workspace.createFirst')}
              </p>
            </CardContent>
          </Card>
        ) : (
          workspaces.map((workspace) => (
            <Card
              key={workspace.id}
              className="cursor-pointer hover:border-blue-500 transition-colors"
              onClick={() => openWorkspace(workspace)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{workspace.business.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {workspace.business.category || t('category.business')}
                    </p>
                  </div>
                  <Badge
                    variant={
                      workspace.package === 'premium'
                        ? 'default'
                        : workspace.package === 'pro'
                        ? 'secondary'
                        : 'outline'
                    }
                  >
                    {workspace.package}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-3">
                  {getStatusBadge(workspace.status)}
                  {getPaymentBadge(workspace.paymentStatus)}
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 mr-1" />
                  {new Date(workspace.createdAt).toLocaleDateString()}
                </div>
                {workspace.amount && (
                  <p className="text-lg font-bold mt-2">${workspace.amount}</p>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Workspace Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              {selectedWorkspace?.business.name}
            </DialogTitle>
          </DialogHeader>

          {selectedWorkspace && (
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid grid-cols-4">
                <TabsTrigger value="overview">{t('workspace.tabOverview')}</TabsTrigger>
                <TabsTrigger value="brief">{t('workspace.tabBrief')}</TabsTrigger>
                <TabsTrigger value="build">{t('workspace.tabBuild')}</TabsTrigger>
                <TabsTrigger value="messages">{t('workspace.tabMessages')}</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="pt-4">
                      <p className="text-sm text-muted-foreground">{t('workspace.statusLabel')}</p>
                      <div className="mt-1">{getStatusBadge(selectedWorkspace.status)}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-4">
                      <p className="text-sm text-muted-foreground">{t('workspace.paymentLabel')}</p>
                      <div className="mt-1">
                        {getPaymentBadge(selectedWorkspace.paymentStatus)}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardContent className="pt-4">
                    <h4 className="font-medium mb-2">{t('workspace.businessDetails')}</h4>
                    <div className="space-y-1 text-sm">
                      <p>
                        <span className="text-muted-foreground">{t('workspace.categoryLabel')}</span>{' '}
                        {selectedWorkspace.business.category || t('workspace.notAvailable')}
                      </p>
                      <p>
                        <span className="text-muted-foreground">{t('workspace.emailLabel')}</span>{' '}
                        {selectedWorkspace.business.email || t('workspace.notAvailable')}
                      </p>
                      <p>
                        <span className="text-muted-foreground">{t('workspace.phoneLabel')}</span>{' '}
                        {selectedWorkspace.business.phone || t('workspace.notAvailable')}
                      </p>
                      <p>
                        <span className="text-muted-foreground">{t('workspace.addressLabel')}</span>{' '}
                        {selectedWorkspace.business.address || t('workspace.notAvailable')}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex gap-2">
                  <Button
                    onClick={() => updateStatus('in_progress')}
                    disabled={selectedWorkspace.status === 'in_progress' || updating}
                    variant="outline"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    {t('workspace.startDevelopment')}
                  </Button>
                  <Button
                    onClick={() => updateStatus('completed')}
                    disabled={selectedWorkspace.status === 'completed' || updating}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    {t('workspace.markComplete')}
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="brief" className="space-y-4 mt-4">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="services">{t('workspace.servicesLabel')}</Label>
                    <Textarea
                      id="services"
                      value={briefForm.services}
                      onChange={(e) =>
                        setBriefForm({ ...briefForm, services: e.target.value })
                      }
                      placeholder={t('workspace.servicesPlaceholder')}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>{t('workspace.designStyle')}</Label>
                    <Select
                      value={briefForm.style}
                      onValueChange={(v) => setBriefForm({ ...briefForm, style: v })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="modern">{t('workspace.styleModern')}</SelectItem>
                        <SelectItem value="classic">{t('workspace.styleClassic')}</SelectItem>
                        <SelectItem value="minimalist">{t('workspace.styleMinimalist')}</SelectItem>
                        <SelectItem value="bold">{t('workspace.styleBold')}</SelectItem>
                        <SelectItem value="playful">{t('workspace.stylePlayful')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="colors">{t('workspace.brandColors')}</Label>
                    <Input
                      id="colors"
                      value={briefForm.colors}
                      onChange={(e) =>
                        setBriefForm({ ...briefForm, colors: e.target.value })
                      }
                      placeholder="blue, white, gold"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="features">{t('workspace.requiredFeatures')}</Label>
                    <Textarea
                      id="features"
                      value={briefForm.features}
                      onChange={(e) =>
                        setBriefForm({ ...briefForm, features: e.target.value })
                      }
                      placeholder="booking system, contact form, gallery"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pages">{t('workspace.pagesNeeded')}</Label>
                    <Input
                      id="pages"
                      value={briefForm.pages}
                      onChange={(e) =>
                        setBriefForm({ ...briefForm, pages: e.target.value })
                      }
                      placeholder="Home, About, Services, Contact"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="domain">{t('workspace.preferredDomain')}</Label>
                    <Input
                      id="domain"
                      value={briefForm.domain}
                      onChange={(e) =>
                        setBriefForm({ ...briefForm, domain: e.target.value })
                      }
                      placeholder="businessname.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">{t('workspace.additionalNotes')}</Label>
                    <Textarea
                      id="notes"
                      value={briefForm.notes}
                      onChange={(e) =>
                        setBriefForm({ ...briefForm, notes: e.target.value })
                      }
                      placeholder="Any additional requirements or notes..."
                    />
                  </div>

                  <Button onClick={updateBrief} disabled={updating}>
                    {updating ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <FileText className="h-4 w-4 mr-2" />
                    )}
                    {t('workspace.saveBrief')}
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="build" className="space-y-4 mt-4">
                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium">{t('workspace.websiteBuilder')}</h4>
                      <Badge variant="outline">
                        {selectedWorkspace.package} {t('workspace.packageLabel').toLowerCase()}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      {t('workspace.builderDesc')}
                    </p>
                    <div className="flex gap-2">
                      <Button>
                        <Palette className="h-4 w-4 mr-2" />
                        {t('workspace.generateAI')}
                      </Button>
                      <Button variant="outline">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        {t('common.preview')}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="messages" className="space-y-4 mt-4">
                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-2 mb-4">
                      <MessageSquare className="h-5 w-5" />
                      <h4 className="font-medium">{t('workspace.clientCommunication')}</h4>
                    </div>
                    <div className="space-y-4">
                      <Textarea placeholder={t('workspace.messagePlaceholder')} />
                      <Button>
                        <Send className="h-4 w-4 mr-2" />
                        {t('workspace.sendMessage')}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
