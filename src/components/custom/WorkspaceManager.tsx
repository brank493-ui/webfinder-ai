'use client';

import { useState, useEffect } from 'react';
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
          <h2 className="text-2xl font-bold">Workspace Manager</h2>
          <p className="text-muted-foreground">
            Manage website development projects
          </p>
        </div>
      </div>

      {/* Workspace Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {workspaces.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="py-12 text-center">
              <Globe className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-lg font-medium">No workspaces yet</p>
              <p className="text-sm text-muted-foreground">
                Workspaces will appear here when businesses complete payment
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
                      {workspace.business.category || 'Business'}
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
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="brief">Brief</TabsTrigger>
                <TabsTrigger value="build">Build</TabsTrigger>
                <TabsTrigger value="messages">Messages</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="pt-4">
                      <p className="text-sm text-muted-foreground">Status</p>
                      <div className="mt-1">{getStatusBadge(selectedWorkspace.status)}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-4">
                      <p className="text-sm text-muted-foreground">Payment</p>
                      <div className="mt-1">
                        {getPaymentBadge(selectedWorkspace.paymentStatus)}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardContent className="pt-4">
                    <h4 className="font-medium mb-2">Business Details</h4>
                    <div className="space-y-1 text-sm">
                      <p>
                        <span className="text-muted-foreground">Category:</span>{' '}
                        {selectedWorkspace.business.category || 'N/A'}
                      </p>
                      <p>
                        <span className="text-muted-foreground">Email:</span>{' '}
                        {selectedWorkspace.business.email || 'N/A'}
                      </p>
                      <p>
                        <span className="text-muted-foreground">Phone:</span>{' '}
                        {selectedWorkspace.business.phone || 'N/A'}
                      </p>
                      <p>
                        <span className="text-muted-foreground">Address:</span>{' '}
                        {selectedWorkspace.business.address || 'N/A'}
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
                    Start Development
                  </Button>
                  <Button
                    onClick={() => updateStatus('completed')}
                    disabled={selectedWorkspace.status === 'completed' || updating}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Mark Complete
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="brief" className="space-y-4 mt-4">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="services">Services / Products</Label>
                    <Textarea
                      id="services"
                      value={briefForm.services}
                      onChange={(e) =>
                        setBriefForm({ ...briefForm, services: e.target.value })
                      }
                      placeholder="What services does the business offer?"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Design Style</Label>
                    <Select
                      value={briefForm.style}
                      onValueChange={(v) => setBriefForm({ ...briefForm, style: v })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="modern">Modern</SelectItem>
                        <SelectItem value="classic">Classic</SelectItem>
                        <SelectItem value="minimalist">Minimalist</SelectItem>
                        <SelectItem value="bold">Bold</SelectItem>
                        <SelectItem value="playful">Playful</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="colors">Brand Colors (comma-separated)</Label>
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
                    <Label htmlFor="features">Required Features</Label>
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
                    <Label htmlFor="pages">Pages Needed</Label>
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
                    <Label htmlFor="domain">Preferred Domain</Label>
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
                    <Label htmlFor="notes">Additional Notes</Label>
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
                    Save Brief
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="build" className="space-y-4 mt-4">
                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium">Website Builder</h4>
                      <Badge variant="outline">
                        {selectedWorkspace.package} package
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Generate and customize the website using AI assistance.
                    </p>
                    <div className="flex gap-2">
                      <Button>
                        <Palette className="h-4 w-4 mr-2" />
                        Generate with AI
                      </Button>
                      <Button variant="outline">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Preview
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
                      <h4 className="font-medium">Client Communication</h4>
                    </div>
                    <div className="space-y-4">
                      <Textarea placeholder="Type a message to the client..." />
                      <Button>
                        <Send className="h-4 w-4 mr-2" />
                        Send Message
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
