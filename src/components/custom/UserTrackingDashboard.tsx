'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
  Globe,
  Clock,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  CreditCard,
  FileText,
  Eye,
  Calendar,
  Mail,
  Phone,
  Building2,
  Sparkles,
  ArrowRight,
  RefreshCw,
  ExternalLink,
  Image as ImageIcon,
  Palette,
  Layout,
  Settings,
  Send,
  Paperclip,
  User,
  Shield,
  Zap,
  ClipboardList,
  Edit,
} from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import Image from 'next/image';

interface ProjectTimeline {
  stage: string;
  status: 'completed' | 'current' | 'upcoming';
  date?: string;
  description: string;
}

interface ProjectUpdate {
  id: string;
  date: string;
  title: string;
  description: string;
  type: 'milestone' | 'update' | 'message';
}

interface WebsitePreview {
  desktopUrl: string;
  mobileUrl: string;
  lastUpdated: string;
}

interface UserTrackingDashboardProps {
  onEditOnboarding?: () => void;
}

export function UserTrackingDashboard({ onEditOnboarding }: UserTrackingDashboardProps) {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('overview');
  const [message, setMessage] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  // Mock project data - in real app, this would come from API
  const project = {
    id: 'proj_1',
    businessName: user?.name || 'Your Business',
    package: 'pro' as const,
    status: 'in_progress',
    progress: 65,
    createdAt: '2024-01-15',
    estimatedDelivery: '2024-02-15',
    websiteUrl: null,
    brief: {
      services: 'Web Design, SEO Optimization, Contact Form',
      style: 'modern',
      colors: ['#2563EB', '#1E40AF', '#FFFFFF'],
      features: ['Contact Form', 'Gallery', 'About Us', 'Services'],
      pages: ['Home', 'About', 'Services', 'Gallery', 'Contact'],
      domain: 'mybusiness.com',
      notes: 'Modern and clean design preferred',
    },
  };

  const timeline: ProjectTimeline[] = [
    {
      stage: 'Project Initiated',
      status: 'completed',
      date: 'Jan 15, 2024',
      description: 'Your project was created and assigned to our team',
    },
    {
      stage: 'Requirements Gathered',
      status: 'completed',
      date: 'Jan 17, 2024',
      description: 'We collected all your requirements and preferences',
    },
    {
      stage: 'Design Phase',
      status: 'completed',
      date: 'Jan 25, 2024',
      description: 'Initial design concepts were created and approved',
    },
    {
      stage: 'Development',
      status: 'current',
      date: 'In Progress',
      description: 'Your website is being built with your specifications',
    },
    {
      stage: 'Review & Testing',
      status: 'upcoming',
      description: 'Quality assurance and your review',
    },
    {
      stage: 'Launch',
      status: 'upcoming',
      description: 'Your website goes live!',
    },
  ];

  const updates: ProjectUpdate[] = [
    {
      id: '1',
      date: 'Jan 28, 2024',
      title: 'Homepage Design Completed',
      description: 'The homepage design has been finalized with your modern aesthetic preferences. Moving on to inner pages.',
      type: 'milestone',
    },
    {
      id: '2',
      date: 'Jan 26, 2024',
      title: 'Color Scheme Applied',
      description: 'Applied your chosen blue color scheme across all components for a cohesive look.',
      type: 'update',
    },
    {
      id: '3',
      date: 'Jan 25, 2024',
      title: 'Design Approval Received',
      description: 'Thank you for approving the initial design concepts!',
      type: 'message',
    },
  ];

  const previewImages = [
    { id: 1, label: 'Homepage', url: '/logo.svg' },
    { id: 2, label: 'About Page', url: '/logo.svg' },
    { id: 3, label: 'Services', url: '/logo.svg' },
    { id: 4, label: 'Contact', url: '/logo.svg' },
  ];

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API refresh
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setRefreshing(false);
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      // In real app, this would send to API
      console.log('Sending message:', message);
      setMessage('');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'in_progress':
        return 'bg-blue-500';
      case 'review':
        return 'bg-yellow-500';
      case 'pending':
        return 'bg-gray-400';
      default:
        return 'bg-gray-400';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500 hover:bg-green-600">Completed</Badge>;
      case 'in_progress':
        return <Badge className="bg-blue-500 hover:bg-blue-600">In Progress</Badge>;
      case 'review':
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">In Review</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPackageInfo = (pkg: string) => {
    switch (pkg) {
      case 'standard':
        return { name: 'Standard', price: '$149', color: 'text-gray-600' };
      case 'pro':
        return { name: 'Pro', price: '$399', color: 'text-blue-600' };
      case 'premium':
        return { name: 'Premium', price: '$999', color: 'text-purple-600' };
      default:
        return { name: 'Standard', price: '$149', color: 'text-gray-600' };
    }
  };

  const packageInfo = getPackageInfo(project.package);

  // Get initials for avatar fallback
  const getUserInitials = (name: string | undefined) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  // Format date for display
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* User Profile Header Card */}
      <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0 overflow-hidden">
        <CardContent className="p-0">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 p-6">
            {/* User Avatar */}
            <div className="relative">
              <Avatar className="h-20 w-20 border-4 border-white/30 shadow-xl">
                <AvatarImage 
                  src={user?.avatar} 
                  alt={user?.name || 'User'} 
                  className="object-cover"
                />
                <AvatarFallback className="bg-white/20 text-white text-2xl font-bold">
                  {getUserInitials(user?.name)}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1 border-2 border-white">
                <CheckCircle2 className="h-4 w-4 text-white" />
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-2xl font-bold">{user?.name || 'Guest User'}</h2>
                <Badge variant="secondary" className="bg-white/20 text-white border-0">
                  {user?.role === 'owner' ? (
                    <>
                      <Shield className="h-3 w-3 mr-1" />
                      Admin
                    </>
                  ) : (
                    <>
                      <User className="h-3 w-3 mr-1" />
                      User
                    </>
                  )}
                </Badge>
                {user?.provider && (
                  <Badge variant="outline" className="bg-white/10 text-white border-white/30 capitalize">
                    {user?.provider === 'google' ? (
                      <>
                        <Zap className="h-3 w-3 mr-1" />
                        Google
                      </>
                    ) : user?.provider === 'code' ? (
                      <>
                        <FileText className="h-3 w-3 mr-1" />
                        Access Code
                      </>
                    ) : (
                      <>
                        <Mail className="h-3 w-3 mr-1" />
                        Email
                      </>
                    )}
                  </Badge>
                )}
              </div>
              <p className="text-blue-100 mt-1">{user?.email}</p>
              {user?.createdAt && (
                <p className="text-sm text-blue-200 mt-1">
                  Member since {formatDate(user.createdAt)}
                </p>
              )}
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col gap-2 w-full md:w-auto">
              {onEditOnboarding && (
                <Button 
                  variant="secondary" 
                  className="bg-white/20 text-white hover:bg-white/30 w-full md:w-auto"
                  onClick={onEditOnboarding}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Project Info
                </Button>
              )}
              <Button 
                variant="secondary" 
                className="bg-white text-blue-600 hover:bg-blue-50 w-full md:w-auto"
                asChild
              >
                <a href="mailto:brank493@gmail.com">
                  <Mail className="h-4 w-4 mr-2" />
                  Contact Support
                </a>
              </Button>
              <Button 
                variant="outline" 
                className="bg-transparent border-white/30 text-white hover:bg-white/10 w-full md:w-auto"
                asChild
              >
                <a href="tel:+237693401619">
                  <Phone className="h-4 w-4 mr-2" />
                  Call Us
                </a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Globe className="h-6 w-6 text-blue-600" />
            Your Website Project
          </h1>
          <p className="text-muted-foreground">
            Track the progress of your website development in real-time
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          {getStatusBadge(project.status)}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Layout className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Package</p>
                <p className={`font-semibold ${packageInfo.color}`}>{packageInfo.name}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Progress</p>
                <p className="font-semibold">{project.progress}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Calendar className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Est. Delivery</p>
                <p className="font-semibold">Feb 15, 2024</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-orange-100 rounded-lg">
                <FileText className="h-4 w-4 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pages</p>
                <p className="font-semibold">{project.brief.pages.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Bar */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Overall Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={project.progress} className="h-3" />
          <p className="text-sm text-muted-foreground mt-2">
            {project.progress >= 75
              ? 'Almost there! Final touches being applied.'
              : project.progress >= 50
              ? 'Great progress! Development is well underway.'
              : project.progress >= 25
              ? 'Your website is taking shape!'
              : 'Your project has been initiated.'}
          </p>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Project Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Project Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Business Name</p>
                  <p className="font-medium">{project.businessName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Services</p>
                  <p className="font-medium">{project.brief.services}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Domain</p>
                  <p className="font-medium">{project.brief.domain || 'Not selected'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Design Style</p>
                  <Badge variant="outline" className="capitalize">{project.brief.style}</Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Color Scheme</p>
                  <div className="flex gap-2 mt-1">
                    {project.brief.colors.map((color, i) => (
                      <div
                        key={i}
                        className="w-8 h-8 rounded-lg border shadow-sm"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Features & Pages */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Features & Pages
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Included Features</p>
                  <div className="flex flex-wrap gap-2">
                    {project.brief.features.map((feature, i) => (
                      <Badge key={i} variant="secondary">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Pages</p>
                  <div className="flex flex-wrap gap-2">
                    {project.brief.pages.map((page, i) => (
                      <Badge key={i} variant="outline">
                        {page}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Updates */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Updates</CardTitle>
              <CardDescription>Latest progress on your website</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {updates.map((update) => (
                  <div key={update.id} className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        update.type === 'milestone'
                          ? 'bg-green-100'
                          : update.type === 'message'
                          ? 'bg-blue-100'
                          : 'bg-gray-100'
                      }`}>
                        {update.type === 'milestone' ? (
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                        ) : update.type === 'message' ? (
                          <MessageSquare className="h-5 w-5 text-blue-600" />
                        ) : (
                          <Sparkles className="h-5 w-5 text-gray-600" />
                        )}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{update.title}</p>
                        <span className="text-sm text-muted-foreground">{update.date}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{update.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Timeline Tab */}
        <TabsContent value="timeline" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Project Timeline</CardTitle>
              <CardDescription>
                Track each stage of your website development
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                {timeline.map((stage, index) => (
                  <div key={index} className="flex gap-4 pb-8 last:pb-0">
                    {/* Timeline line */}
                    {index !== timeline.length - 1 && (
                      <div
                        className={`absolute left-5 w-0.5 h-12 ${
                          stage.status === 'completed'
                            ? 'bg-green-500'
                            : 'bg-gray-200'
                        }`}
                        style={{ top: `${index * 80 + 40}px` }}
                      />
                    )}
                    {/* Status circle */}
                    <div
                      className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center ${
                        stage.status === 'completed'
                          ? 'bg-green-500 text-white'
                          : stage.status === 'current'
                          ? 'bg-blue-500 text-white ring-4 ring-blue-100'
                          : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      {stage.status === 'completed' ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : stage.status === 'current' ? (
                        <Clock className="h-5 w-5" />
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-gray-400" />
                      )}
                    </div>
                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{stage.stage}</p>
                        {stage.status === 'current' && (
                          <Badge className="bg-blue-500">Current</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {stage.date || 'Upcoming'}
                      </p>
                      <p className="text-sm mt-1">{stage.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preview Tab */}
        <TabsContent value="preview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Website Preview
              </CardTitle>
              <CardDescription>
                Preview your website as it's being built
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {previewImages.map((image) => (
                  <div key={image.id} className="group relative">
                    <div className="aspect-video bg-muted rounded-lg border-2 border-dashed flex items-center justify-center overflow-hidden">
                      <Image
                        src={image.url}
                        alt={image.label}
                        width={200}
                        height={150}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <p className="text-sm text-center mt-2 font-medium">{image.label}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-800">Preview Coming Soon</p>
                    <p className="text-sm text-blue-600">
                      Full website preview will be available once development reaches 80% completion.
                      You'll be able to view and provide feedback before launch.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Messages Tab */}
        <TabsContent value="messages" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Communication
              </CardTitle>
              <CardDescription>
                Send messages to the development team
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Messages */}
              <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto">
                <div className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-blue-600 text-white">FB</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="bg-muted rounded-lg p-3">
                      <p className="text-sm">
                        Welcome to your project dashboard! Feel free to message us with any questions
                        or changes you'd like to make.
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">WebFinder Team - Jan 15</p>
                  </div>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              {/* Message Input */}
              <div className="space-y-3">
                <Textarea
                  placeholder="Type your message here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                />
                <div className="flex justify-between items-center">
                  <Button variant="outline" size="sm">
                    <Paperclip className="h-4 w-4 mr-2" />
                    Attach File
                  </Button>
                  <Button onClick={handleSendMessage} disabled={!message.trim()}>
                    <Send className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Payment Info Card */}
      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <CreditCard className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="font-medium">Payment Status</p>
                <p className="text-sm text-muted-foreground">
                  Package: {packageInfo.name} ({packageInfo.price})
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-green-500">Paid</Badge>
              <Button variant="outline" size="sm">
                View Invoice
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Support */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <MessageSquare className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium">Need Help?</p>
                <p className="text-sm text-muted-foreground">
                  Contact our support team for assistance
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" asChild>
                <a href="mailto:brank493@gmail.com">
                  <Mail className="h-4 w-4 mr-2" />
                  Email Support
                </a>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a href="tel:+237693401619">
                  <Phone className="h-4 w-4 mr-2" />
                  Call Us
                </a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
