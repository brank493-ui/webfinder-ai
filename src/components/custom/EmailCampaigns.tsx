'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Mail,
  Send,
  Users,
  Eye,
  MousePointer,
  TrendingUp,
  Plus,
  Loader2,
  Copy,
  Edit,
  Trash2,
  BarChart3,
} from 'lucide-react';

interface EmailCampaign {
  id: string;
  name: string;
  subject: string;
  status: 'draft' | 'scheduled' | 'sent';
  recipients: number;
  openRate?: number;
  clickRate?: number;
  sentAt?: string;
  template: string;
}

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  preview: string;
  category: string;
}

const mockCampaigns: EmailCampaign[] = [
  {
    id: '1',
    name: 'Website Launch Offer',
    subject: 'Get your business online today!',
    status: 'sent',
    recipients: 150,
    openRate: 24.5,
    clickRate: 8.2,
    sentAt: '2024-01-15',
    template: 'outreach',
  },
  {
    id: '2',
    name: 'Follow-up Campaign',
    subject: 'Still thinking about your website?',
    status: 'sent',
    recipients: 85,
    openRate: 32.1,
    clickRate: 12.5,
    sentAt: '2024-01-10',
    template: 'followup',
  },
  {
    id: '3',
    name: 'January Promo',
    subject: '20% off all website packages!',
    status: 'scheduled',
    recipients: 200,
    template: 'promo',
  },
  {
    id: '4',
    name: 'Restaurant Outreach',
    subject: 'Your restaurant deserves a website',
    status: 'draft',
    recipients: 0,
    template: 'outreach',
  },
];

const emailTemplates: EmailTemplate[] = [
  {
    id: 'outreach',
    name: 'Initial Outreach',
    subject: 'Get your business online with a professional website',
    preview: 'Hi {business_name},\n\nI noticed that your business doesn\'t have a website yet...',
    category: 'Outreach',
  },
  {
    id: 'followup',
    name: 'Follow-up Email',
    subject: 'Following up on your website needs',
    preview: 'Hi {business_name},\n\nI wanted to follow up on my previous email...',
    category: 'Follow-up',
  },
  {
    id: 'promo',
    name: 'Promotional Offer',
    subject: 'Special offer just for you!',
    preview: 'Hi {business_name},\n\nWe\'re offering a special discount on our website packages...',
    category: 'Promotion',
  },
  {
    id: 'welcome',
    name: 'Welcome Email',
    subject: 'Welcome to WebFinder!',
    preview: 'Hi {name},\n\nThank you for choosing WebFinder for your website...',
    category: 'Onboarding',
  },
];

export function EmailCampaigns() {
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>(mockCampaigns);
  const [creating, setCreating] = useState(false);
  const [newCampaign, setNewCampaign] = useState({
    name: '',
    subject: '',
    template: 'outreach',
    content: '',
  });

  const createCampaign = async () => {
    setCreating(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const campaign: EmailCampaign = {
      id: `campaign_${Date.now()}`,
      name: newCampaign.name,
      subject: newCampaign.subject,
      status: 'draft',
      recipients: 0,
      template: newCampaign.template,
    };

    setCampaigns([campaign, ...campaigns]);
    setCreating(false);
    setNewCampaign({ name: '', subject: '', template: 'outreach', content: '' });
  };

  const sendCampaign = async (campaignId: string) => {
    // Simulate sending
    const updated = campaigns.map((c) =>
      c.id === campaignId
        ? { ...c, status: 'sent' as const, sentAt: new Date().toISOString().split('T')[0] }
        : c
    );
    setCampaigns(updated);
  };

  const getStatusBadge = (status: EmailCampaign['status']) => {
    switch (status) {
      case 'draft':
        return <Badge variant="secondary">Draft</Badge>;
      case 'scheduled':
        return <Badge className="bg-blue-500">Scheduled</Badge>;
      case 'sent':
        return <Badge className="bg-green-500">Sent</Badge>;
    }
  };

  // Calculate stats
  const totalSent = campaigns.filter((c) => c.status === 'sent').length;
  const totalRecipients = campaigns
    .filter((c) => c.status === 'sent')
    .reduce((sum, c) => sum + c.recipients, 0);
  const avgOpenRate =
    campaigns
      .filter((c) => c.openRate)
      .reduce((sum, c) => sum + (c.openRate || 0), 0) /
    campaigns.filter((c) => c.openRate).length || 0;
  const avgClickRate =
    campaigns
      .filter((c) => c.clickRate)
      .reduce((sum, c) => sum + (c.clickRate || 0), 0) /
    campaigns.filter((c) => c.clickRate).length || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Mail className="h-6 w-6 text-blue-600" />
            Email Campaigns
          </h2>
          <p className="text-muted-foreground">
            Create and manage email outreach campaigns
          </p>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Campaign
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Email Campaign</DialogTitle>
              <DialogDescription>
                Create a new email campaign to reach potential clients
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="campaignName">Campaign Name</Label>
                <Input
                  id="campaignName"
                  placeholder="e.g., Restaurant Outreach January"
                  value={newCampaign.name}
                  onChange={(e) =>
                    setNewCampaign({ ...newCampaign, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Email Subject</Label>
                <Input
                  id="subject"
                  placeholder="e.g., Get your business online today!"
                  value={newCampaign.subject}
                  onChange={(e) =>
                    setNewCampaign({ ...newCampaign, subject: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Template</Label>
                <Select
                  value={newCampaign.template}
                  onValueChange={(v) =>
                    setNewCampaign({ ...newCampaign, template: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {emailTemplates.map((t) => (
                      <SelectItem key={t.id} value={t.id}>
                        {t.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Preview</Label>
                <Textarea
                  value={
                    emailTemplates.find((t) => t.id === newCampaign.template)
                      ?.preview || ''
                  }
                  rows={6}
                  readOnly
                  className="bg-muted"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={createCampaign} disabled={creating}>
                {creating ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Plus className="h-4 w-4 mr-2" />
                )}
                Create Campaign
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
                <Send className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalSent}</p>
                <p className="text-sm text-muted-foreground">Campaigns Sent</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900">
                <Users className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalRecipients}</p>
                <p className="text-sm text-muted-foreground">Total Recipients</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900">
                <Eye className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{avgOpenRate.toFixed(1)}%</p>
                <p className="text-sm text-muted-foreground">Avg Open Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900">
                <MousePointer className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{avgClickRate.toFixed(1)}%</p>
                <p className="text-sm text-muted-foreground">Avg Click Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Campaigns List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Campaigns</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {campaigns.map((campaign) => (
              <div
                key={campaign.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-muted">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{campaign.name}</span>
                      {getStatusBadge(campaign.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {campaign.subject}
                    </p>
                    {campaign.status === 'sent' && (
                      <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                        <span>
                          <Users className="h-3 w-3 inline mr-1" />
                          {campaign.recipients} recipients
                        </span>
                        <span>
                          <Eye className="h-3 w-3 inline mr-1" />
                          {campaign.openRate}% opens
                        </span>
                        <span>
                          <MousePointer className="h-3 w-3 inline mr-1" />
                          {campaign.clickRate}% clicks
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {campaign.status === 'draft' && (
                    <>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => sendCampaign(campaign.id)}
                      >
                        <Send className="h-4 w-4 mr-1" />
                        Send
                      </Button>
                    </>
                  )}
                  {campaign.status === 'scheduled' && (
                    <Button variant="outline" size="sm">
                      <BarChart3 className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  )}
                  {campaign.status === 'sent' && (
                    <Button variant="outline" size="sm">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      Analytics
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Email Templates */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center justify-between">
            Email Templates
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Create Template
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {emailTemplates.map((template) => (
              <div
                key={template.id}
                className="p-4 border rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{template.name}</span>
                  <Badge variant="outline">{template.category}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  {template.subject}
                </p>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {template.preview}
                </p>
                <div className="flex gap-2 mt-3">
                  <Button variant="outline" size="sm">
                    <Copy className="h-4 w-4 mr-1" />
                    Duplicate
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
