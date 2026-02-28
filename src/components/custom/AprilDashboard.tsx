'use client';

import { useState, useEffect, useRef } from 'react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Bot,
  Search,
  Users,
  MessageSquare,
  BarChart3,
  Send,
  Plus,
  RefreshCw,
  CheckCircle,
  Clock,
  AlertCircle,
  Sparkles,
  FileText,
  UserPlus,
  Mail,
  Phone,
  Building2,
  Globe,
  ChevronRight,
  Eye,
  Zap,
} from 'lucide-react';

interface Lead {
  id: string;
  businessName: string;
  businessEmail?: string;
  businessPhone?: string;
  businessAddress?: string;
  businessCategory?: string;
  status: string;
  credentialNumber?: string;
  priority: string;
  aprilScore?: number;
  aprilNotes?: string;
  createdAt: string;
  _count?: { conversations: number };
}

interface Message {
  role: 'april' | 'lead' | 'owner';
  content: string;
  metadata?: Record<string, unknown>;
}

interface Stats {
  totalLeads: number;
  newLeads: number;
  contacted: number;
  responded: number;
  converted: number;
  avgScore: number;
}

interface BusinessSearchResult {
  name: string;
  address?: string;
  phone?: string;
  category?: string;
  hasWebsite: boolean;
}

export function AprilDashboard() {
  const { t } = useLanguageStore();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [conversation, setConversation] = useState<Message[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [searchResults, setSearchResults] = useState<BusinessSearchResult[]>([]);
  const [searchLocation, setSearchLocation] = useState('');
  const [searchCategory, setSearchCategory] = useState('');
  const [showNewLeadDialog, setShowNewLeadDialog] = useState(false);
  const [newLeadData, setNewLeadData] = useState({
    businessName: '',
    businessEmail: '',
    businessPhone: '',
    businessCategory: '',
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch stats and leads on mount
  useEffect(() => {
    fetchStats();
    fetchLeads();
  }, []);

  // Scroll to bottom of conversation
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);

  // Fetch conversation when lead is selected
  useEffect(() => {
    if (selectedLead) {
      fetchConversation(selectedLead.id);
    }
  }, [selectedLead]);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/april?action=stats');
      const data = await res.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchLeads = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/april');
      const data = await res.json();
      if (data.success) {
        setLeads(data.leads);
      }
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchConversation = async (leadId: string) => {
    try {
      const res = await fetch(`/api/april?action=conversation&leadId=${leadId}`);
      const data = await res.json();
      if (data.success) {
        setConversation(data.conversation);
      }
    } catch (error) {
      console.error('Error fetching conversation:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedLead) return;

    const messageToSend = newMessage;
    setNewMessage('');
    
    // Add message optimistically
    setConversation(prev => [...prev, { role: 'owner', content: messageToSend }]);
    
    try {
      await fetch('/api/april', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'owner_message',
          data: { leadId: selectedLead.id, message: messageToSend },
        }),
      });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleAprilChat = async (message: string) => {
    if (!selectedLead) return;

    setIsLoading(true);
    try {
      const res = await fetch('/api/april/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId: selectedLead.id,
          message,
          language: 'en',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setConversation(prev => [
          ...prev,
          { role: 'lead', content: message },
          { role: 'april', content: data.response },
        ]);
      }
    } catch (error) {
      console.error('Error chatting with April:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInitiateContact = async (leadId: string) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/april', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'initiate_contact',
          data: { leadId },
        }),
      });
      const data = await res.json();
      if (data.success) {
        fetchConversation(leadId);
        fetchLeads();
      }
    } catch (error) {
      console.error('Error initiating contact:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateReport = async (leadId: string) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/april', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate_report',
          data: { leadId },
        }),
      });
      const data = await res.json();
      if (data.success) {
        alert(`Report generated!\n\nScore: ${data.report.score}/100\n\n${data.report.summary}`);
        fetchLeads();
      }
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConvertToUser = async (lead: Lead) => {
    const email = lead.businessEmail || prompt('Enter email for user:');
    if (!email) return;

    setIsLoading(true);
    try {
      const res = await fetch('/api/april', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'convert_to_user',
          data: {
            leadId: lead.id,
            userData: {
              email,
              name: lead.businessName,
              phone: lead.businessPhone,
            },
          },
        }),
      });
      const data = await res.json();
      if (data.success) {
        alert(`User created! Credential number: ${data.credentialNumber}`);
        fetchLeads();
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      console.error('Error converting lead:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchBusinesses = async () => {
    if (!searchLocation.trim()) return;

    setIsLoading(true);
    try {
      const res = await fetch('/api/april', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'search_businesses',
          data: {
            location: searchLocation,
            category: searchCategory,
            limit: 10,
          },
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSearchResults(data.businesses);
      }
    } catch (error) {
      console.error('Error searching businesses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateLead = async () => {
    if (!newLeadData.businessName.trim()) return;

    setIsLoading(true);
    try {
      const res = await fetch('/api/april', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_lead',
          data: {
            ...newLeadData,
            source: 'manual',
          },
        }),
      });
      const data = await res.json();
      if (data.success) {
        setShowNewLeadDialog(false);
        setNewLeadData({ businessName: '', businessEmail: '', businessPhone: '', businessCategory: '' });
        fetchLeads();
      }
    } catch (error) {
      console.error('Error creating lead:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddBusinessAsLead = async (business: BusinessSearchResult) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/april', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_lead',
          data: {
            businessName: business.name,
            businessAddress: business.address,
            businessPhone: business.phone,
            businessCategory: business.category,
            source: 'april_search',
          },
        }),
      });
      const data = await res.json();
      if (data.success) {
        fetchLeads();
        setSearchResults(prev => prev.filter(b => b.name !== business.name));
      }
    } catch (error) {
      console.error('Error adding business:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-500';
      case 'contacted': return 'bg-yellow-500';
      case 'responded': return 'bg-purple-500';
      case 'qualified': return 'bg-green-500';
      case 'converted': return 'bg-emerald-500';
      case 'declined': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getMessageColor = (role: string) => {
    switch (role) {
      case 'april': return 'bg-blue-100 dark:bg-blue-900';
      case 'lead': return 'bg-gray-100 dark:bg-gray-800';
      case 'owner': return 'bg-purple-100 dark:bg-purple-900';
      default: return 'bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-4 sm:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="relative">
              <Avatar className="h-12 w-12 sm:h-16 sm:w-16 border-4 border-blue-200 shadow-lg">
                <AvatarImage src="/april-avatar.png" alt="April" />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-lg sm:text-xl font-bold">
                  A
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1 sm:p-1.5 border-2 border-white">
                <Zap className="h-2 w-2 sm:h-3 sm:w-3 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
                <Bot className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
                April
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                AI Business Development Agent
              </p>
            </div>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="outline" onClick={() => { fetchStats(); fetchLeads(); }}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Dialog open={showNewLeadDialog} onOpenChange={setShowNewLeadDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Lead
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Lead</DialogTitle>
                  <DialogDescription>
                    Manually add a potential client for April to contact.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div>
                    <Label htmlFor="businessName">Business Name *</Label>
                    <Input
                      id="businessName"
                      value={newLeadData.businessName}
                      onChange={(e) => setNewLeadData(prev => ({ ...prev, businessName: e.target.value }))}
                      placeholder="Business name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="businessEmail">Email</Label>
                    <Input
                      id="businessEmail"
                      type="email"
                      value={newLeadData.businessEmail}
                      onChange={(e) => setNewLeadData(prev => ({ ...prev, businessEmail: e.target.value }))}
                      placeholder="email@business.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="businessPhone">Phone</Label>
                    <Input
                      id="businessPhone"
                      value={newLeadData.businessPhone}
                      onChange={(e) => setNewLeadData(prev => ({ ...prev, businessPhone: e.target.value }))}
                      placeholder="+1 234 567 8900"
                    />
                  </div>
                  <div>
                    <Label htmlFor="businessCategory">Category</Label>
                    <Input
                      id="businessCategory"
                      value={newLeadData.businessCategory}
                      onChange={(e) => setNewLeadData(prev => ({ ...prev, businessCategory: e.target.value }))}
                      placeholder="Restaurant, Retail, etc."
                    />
                  </div>
                  <Button className="w-full" onClick={handleCreateLead} disabled={isLoading}>
                    Create Lead
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 sm:gap-4 mb-6 sm:mb-8">
            <Card>
              <CardContent className="p-3 sm:pt-4">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                  <span className="text-xl sm:text-2xl font-bold">{stats.totalLeads}</span>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground">Total Leads</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3 sm:pt-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600" />
                  <span className="text-xl sm:text-2xl font-bold">{stats.newLeads}</span>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground">New</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3 sm:pt-4">
                <div className="flex items-center gap-2">
                  <Send className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                  <span className="text-xl sm:text-2xl font-bold">{stats.contacted}</span>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground">Contacted</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3 sm:pt-4">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600" />
                  <span className="text-xl sm:text-2xl font-bold">{stats.responded}</span>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground">Responded</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3 sm:pt-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                  <span className="text-xl sm:text-2xl font-bold">{stats.converted}</span>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground">Converted</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3 sm:pt-4">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600" />
                  <span className="text-xl sm:text-2xl font-bold">{stats.avgScore}</span>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground">Avg Score</p>
              </CardContent>
            </Card>
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-4 sm:mb-6 h-auto">
            <TabsTrigger value="dashboard" className="text-xs sm:text-sm py-2">
              <Users className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Leads</span>
              <span className="sm:hidden">Leads</span>
            </TabsTrigger>
            <TabsTrigger value="search" className="text-xs sm:text-sm py-2">
              <Search className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Find Businesses</span>
              <span className="sm:hidden">Search</span>
            </TabsTrigger>
            <TabsTrigger value="chat" disabled={!selectedLead} className="text-xs sm:text-sm py-2">
              <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Conversation</span>
              <span className="sm:hidden">Chat</span>
            </TabsTrigger>
          </TabsList>

          {/* Leads Tab */}
          <TabsContent value="dashboard">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              {/* Leads List */}
              <Card className="md:col-span-1">
                <CardHeader>
                  <CardTitle className="text-lg">All Leads</CardTitle>
                  <CardDescription>
                    Click to view conversation
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-[500px]">
                    {leads.length === 0 ? (
                      <div className="p-4 text-center text-muted-foreground">
                        No leads yet. Add one or search for businesses.
                      </div>
                    ) : (
                      leads.map((lead) => (
                        <div
                          key={lead.id}
                          className={`p-4 border-b cursor-pointer hover:bg-muted/50 transition-colors ${
                            selectedLead?.id === lead.id ? 'bg-muted' : ''
                          }`}
                          onClick={() => setSelectedLead(lead)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10">
                                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                                  {lead.businessName.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{lead.businessName}</p>
                                <p className="text-xs text-muted-foreground">
                                  {lead.businessCategory || 'No category'}
                                </p>
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                              <Badge className={`${getStatusColor(lead.status)} text-white text-xs`}>
                                {lead.status}
                              </Badge>
                              {lead.aprilScore !== null && lead.aprilScore !== undefined && (
                                <span className="text-xs text-muted-foreground">
                                  Score: {lead.aprilScore}
                                </span>
                              )}
                            </div>
                          </div>
                          {lead._count && (
                            <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                              <MessageSquare className="h-3 w-3" />
                              {lead._count.conversations} messages
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Lead Details */}
              <Card className="md:col-span-2">
                {selectedLead ? (
                  <>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">{selectedLead.businessName}</CardTitle>
                          <CardDescription>
                            Added {new Date(selectedLead.createdAt).toLocaleDateString()}
                          </CardDescription>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleGenerateReport(selectedLead.id)}
                          >
                            <FileText className="h-4 w-4 mr-1" />
                            Report
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleConvertToUser(selectedLead)}
                          >
                            <UserPlus className="h-4 w-4 mr-1" />
                            Convert
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Status</p>
                          <Badge className={`${getStatusColor(selectedLead.status)} text-white`}>
                            {selectedLead.status}
                          </Badge>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Priority</p>
                          <Badge variant="outline" className={getPriorityColor(selectedLead.priority)}>
                            {selectedLead.priority}
                          </Badge>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Mail className="h-3 w-3" /> Email
                          </p>
                          <p className="text-sm">{selectedLead.businessEmail || 'Not provided'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Phone className="h-3 w-3" /> Phone
                          </p>
                          <p className="text-sm">{selectedLead.businessPhone || 'Not provided'}</p>
                        </div>
                      </div>

                      {selectedLead.aprilNotes && (
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg mb-4">
                          <p className="text-sm font-medium flex items-center gap-1">
                            <Sparkles className="h-4 w-4 text-blue-600" />
                            April's Notes
                          </p>
                          <p className="text-sm text-muted-foreground">{selectedLead.aprilNotes}</p>
                        </div>
                      )}

                      <Separator className="my-4" />

                      {/* Quick Actions */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {selectedLead.status === 'new' && (
                          <Button onClick={() => handleInitiateContact(selectedLead.id)}>
                            <Send className="h-4 w-4 mr-2" />
                            April Initiate Contact
                          </Button>
                        )}
                        <Button variant="outline" onClick={() => setActiveTab('chat')}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Full Conversation
                        </Button>
                      </div>

                      {/* Mini Conversation Preview */}
                      <div>
                        <p className="text-sm font-medium mb-2">Recent Messages</p>
                        <ScrollArea className="h-[200px] border rounded-lg p-2">
                          {conversation.length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-4">
                              No conversation yet. Click "April Initiate Contact" to start.
                            </p>
                          ) : (
                            conversation.slice(-5).map((msg, i) => (
                              <div
                                key={i}
                                className={`p-2 rounded-lg mb-2 ${getMessageColor(msg.role)}`}
                              >
                                <p className="text-xs font-medium uppercase mb-1">{msg.role}</p>
                                <p className="text-sm">{msg.content}</p>
                              </div>
                            ))
                          )}
                        </ScrollArea>
                      </div>
                    </CardContent>
                  </>
                ) : (
                  <CardContent className="flex items-center justify-center h-[400px]">
                    <div className="text-center text-muted-foreground">
                      <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Select a lead to view details</p>
                    </div>
                  </CardContent>
                )}
              </Card>
            </div>
          </TabsContent>

          {/* Search Tab */}
          <TabsContent value="search">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Find Businesses Without Websites
                </CardTitle>
                <CardDescription>
                  Let April search for potential clients in your area
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 mb-6">
                  <div className="flex-1">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={searchLocation}
                      onChange={(e) => setSearchLocation(e.target.value)}
                      placeholder="City, Country"
                    />
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="category">Category (Optional)</Label>
                    <Input
                      id="category"
                      value={searchCategory}
                      onChange={(e) => setSearchCategory(e.target.value)}
                      placeholder="Restaurant, Retail, etc."
                    />
                  </div>
                  <div className="flex items-end">
                    <Button onClick={handleSearchBusinesses} disabled={isLoading || !searchLocation}>
                      <Search className="h-4 w-4 mr-2" />
                      Search
                    </Button>
                  </div>
                </div>

                {searchResults.length > 0 && (
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Found {searchResults.length} businesses without websites
                    </p>
                    <div className="grid gap-4 md:grid-cols-2">
                      {searchResults.map((business, i) => (
                        <Card key={i}>
                          <CardContent className="pt-4">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-medium">{business.name}</h3>
                                <p className="text-sm text-muted-foreground">
                                  {business.category || 'General'}
                                </p>
                                {business.address && (
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {business.address}
                                  </p>
                                )}
                                {business.phone && (
                                  <p className="text-xs text-muted-foreground">
                                    {business.phone}
                                  </p>
                                )}
                              </div>
                              <Button
                                size="sm"
                                onClick={() => handleAddBusinessAsLead(business)}
                              >
                                <Plus className="h-4 w-4 mr-1" />
                                Add as Lead
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Chat Tab */}
          <TabsContent value="chat">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                        {selectedLead?.businessName?.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{selectedLead?.businessName}</CardTitle>
                      <CardDescription>
                        Conversation with {selectedLead?.businessName}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge className={`${getStatusColor(selectedLead?.status || 'new')} text-white`}>
                    {selectedLead?.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {/* Messages */}
                <ScrollArea className="h-[400px] border rounded-lg p-4 mb-4">
                  {conversation.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                      <Bot className="h-12 w-12 mb-4 opacity-50" />
                      <p>No conversation yet</p>
                      <Button
                        className="mt-4"
                        onClick={() => selectedLead && handleInitiateContact(selectedLead.id)}
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Start Conversation
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {conversation.map((msg, i) => (
                        <div
                          key={i}
                          className={`flex ${msg.role === 'owner' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-[80%] p-3 rounded-lg ${getMessageColor(msg.role)}`}>
                            <div className="flex items-center gap-2 mb-1">
                              {msg.role === 'april' && <Bot className="h-4 w-4 text-blue-600" />}
                              {msg.role === 'lead' && <Users className="h-4 w-4 text-gray-600" />}
                              {msg.role === 'owner' && <Sparkles className="h-4 w-4 text-purple-600" />}
                              <span className="text-xs font-medium uppercase">{msg.role}</span>
                            </div>
                            <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                          </div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  )}
                </ScrollArea>

                {/* Input */}
                <div className="flex gap-2">
                  <Textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message as the owner..."
                    className="min-h-[60px]"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Press Enter to send. Messages are sent as the owner.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
