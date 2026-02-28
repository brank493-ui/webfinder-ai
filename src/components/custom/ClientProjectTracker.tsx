'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAuthStore } from '@/store/useAuthStore';
import {
  Globe,
  Clock,
  CheckCircle,
  MessageSquare,
  FileText,
  Download,
  Upload,
  Eye,
  Send,
  Bell,
  Calendar,
  ChevronRight,
  Loader2,
  Play,
  Pause,
  Image as ImageIcon,
  Paperclip,
  ExternalLink,
} from 'lucide-react';

interface ProjectUpdate {
  id: string;
  date: string;
  title: string;
  description: string;
  type: 'milestone' | 'update' | 'delivery' | 'revision';
  attachments?: { name: string; url: string }[];
}

interface ProjectMilestone {
  id: string;
  title: string;
  status: 'completed' | 'in_progress' | 'pending';
  completedAt?: string;
}

interface ProjectMessage {
  id: string;
  sender: 'client' | 'team';
  senderName: string;
  content: string;
  timestamp: string;
  isRead: boolean;
}

interface ClientProject {
  id: string;
  businessName: string;
  package: 'standard' | 'pro' | 'premium';
  status: 'pending' | 'in_progress' | 'review' | 'completed';
  progress: number;
  startDate: string;
  estimatedCompletion: string;
  domain: string;
  milestones: ProjectMilestone[];
  updates: ProjectUpdate[];
  messages: ProjectMessage[];
  currentPhase: string;
  nextMilestone: string;
}

const mockProject: ClientProject = {
  id: 'proj_001',
  businessName: 'Your Business',
  package: 'pro',
  status: 'in_progress',
  progress: 65,
  startDate: '2024-01-15',
  estimatedCompletion: '2024-02-15',
  domain: 'yourbusiness.com',
  currentPhase: 'Development',
  nextMilestone: 'Homepage Completion',
  milestones: [
    { id: '1', title: 'Planning & Requirements', status: 'completed', completedAt: '2024-01-16' },
    { id: '2', title: 'Design Mockups', status: 'completed', completedAt: '2024-01-20' },
    { id: '3', title: 'Homepage Development', status: 'in_progress' },
    { id: '4', title: 'Inner Pages', status: 'pending' },
    { id: '5', title: 'Functionality Integration', status: 'pending' },
    { id: '6', title: 'Testing & QA', status: 'pending' },
    { id: '7', title: 'Launch', status: 'pending' },
  ],
  updates: [
    {
      id: '1',
      date: '2024-01-22 14:30',
      title: 'Homepage Design Approved',
      description: 'Your homepage design has been completed and approved. We are now moving to development phase.',
      type: 'milestone',
    },
    {
      id: '2',
      date: '2024-01-21 10:00',
      title: 'Development Started',
      description: 'Our team has started coding your website. The homepage structure is being built.',
      type: 'update',
    },
    {
      id: '3',
      date: '2024-01-20 16:45',
      title: 'Design Revisions Complete',
      description: 'All requested changes have been implemented. Ready for final approval.',
      type: 'revision',
    },
    {
      id: '4',
      date: '2024-01-18 09:15',
      title: 'Initial Design Delivered',
      description: 'First draft of your website design is ready for review.',
      type: 'delivery',
      attachments: [
        { name: 'homepage-mockup.png', url: '#' },
        { name: 'mobile-preview.png', url: '#' },
      ],
    },
  ],
  messages: [
    {
      id: '1',
      sender: 'team',
      senderName: 'WebFinder Team',
      content: 'Welcome to your project portal! We\'re excited to build your website. The first design draft will be ready in 2-3 days.',
      timestamp: '2024-01-15 10:30',
      isRead: true,
    },
    {
      id: '2',
      sender: 'client',
      senderName: 'You',
      content: 'Thank you! I\'m looking forward to seeing the designs. Can we add a gallery section?',
      timestamp: '2024-01-15 14:22',
      isRead: true,
    },
    {
      id: '3',
      sender: 'team',
      senderName: 'WebFinder Team',
      content: 'Absolutely! We\'ve noted the gallery request. It will be included in the design.',
      timestamp: '2024-01-15 15:00',
      isRead: true,
    },
    {
      id: '4',
      sender: 'team',
      senderName: 'WebFinder Team',
      content: 'Your homepage design is ready! Please check the Updates tab to review and provide feedback.',
      timestamp: '2024-01-22 14:35',
      isRead: false,
    },
  ],
};

export function ClientProjectTracker() {
  const { user } = useAuthStore();
  const [project, setProject] = useState<ClientProject>(mockProject);
  const [newMessage, setNewMessage] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  const getMilestoneIcon = (status: ProjectMilestone['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'in_progress':
        return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: ClientProject['status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'in_progress':
        return <Badge className="bg-blue-500">In Progress</Badge>;
      case 'review':
        return <Badge className="bg-purple-500">Under Review</Badge>;
      case 'completed':
        return <Badge className="bg-green-500">Completed</Badge>;
    }
  };

  const getUpdateTypeBadge = (type: ProjectUpdate['type']) => {
    switch (type) {
      case 'milestone':
        return <Badge className="bg-green-500">Milestone</Badge>;
      case 'update':
        return <Badge variant="outline">Update</Badge>;
      case 'delivery':
        return <Badge className="bg-purple-500">Delivery</Badge>;
      case 'revision':
        return <Badge className="bg-orange-500">Revision</Badge>;
    }
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const message: ProjectMessage = {
      id: `msg_${Date.now()}`,
      sender: 'client',
      senderName: 'You',
      content: newMessage,
      timestamp: new Date().toLocaleString(),
      isRead: true,
    };

    setProject((prev) => ({
      ...prev,
      messages: [...prev.messages, message],
    }));
    setNewMessage('');
  };

  const completedMilestones = project.milestones.filter((m) => m.status === 'completed').length;
  const totalMilestones = project.milestones.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600">
                <Globe className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">WebFinder</h1>
                <p className="text-sm text-muted-foreground">Client Portal</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                Welcome, {user?.name || 'Client'}
              </span>
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Project Header */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold">{project.businessName}</h2>
                  {getStatusBadge(project.status)}
                  <Badge variant="outline" className="capitalize">
                    {project.package} Package
                  </Badge>
                </div>
                <p className="text-muted-foreground">
                  Domain: {project.domain} • Started: {project.startDate}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Est. Completion</p>
                <p className="font-semibold">{project.estimatedCompletion}</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">
                  Progress: {project.progress}%
                </span>
                <span className="text-sm text-muted-foreground">
                  {completedMilestones}/{totalMilestones} milestones
                </span>
              </div>
              <Progress value={project.progress} className="h-3" />
              <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                <span>Current Phase: {project.currentPhase}</span>
                <span>Next: {project.nextMilestone}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="files">Files</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{completedMilestones}</p>
                      <p className="text-sm text-muted-foreground">Completed</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
                      <Loader2 className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">
                        {project.milestones.filter((m) => m.status === 'in_progress').length}
                      </p>
                      <p className="text-sm text-muted-foreground">In Progress</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900">
                      <MessageSquare className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{project.messages.length}</p>
                      <p className="text-sm text-muted-foreground">Messages</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900">
                      <Clock className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">
                        {Math.ceil(
                          (new Date(project.estimatedCompletion).getTime() - Date.now()) /
                            (1000 * 60 * 60 * 24)
                        )}
                      </p>
                      <p className="text-sm text-muted-foreground">Days Left</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Milestones Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Project Milestones</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {project.milestones.map((milestone, index) => (
                    <div key={milestone.id} className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full border-2 bg-white dark:bg-gray-800">
                        {getMilestoneIcon(milestone.status)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{milestone.title}</span>
                          {milestone.completedAt && (
                            <span className="text-sm text-muted-foreground">
                              {milestone.completedAt}
                            </span>
                          )}
                        </div>
                        {index < project.milestones.length - 1 && milestone.status === 'completed' && (
                          <div className="w-0.5 h-4 bg-green-500 ml-4 mt-1" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Updates */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Updates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {project.updates.slice(0, 3).map((update) => (
                    <div key={update.id} className="flex gap-4 p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {getUpdateTypeBadge(update.type)}
                          <span className="font-medium">{update.title}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{update.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">{update.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button
                  variant="ghost"
                  className="w-full mt-4"
                  onClick={() => setActiveTab('timeline')}
                >
                  View All Updates <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Timeline Tab */}
          <TabsContent value="timeline">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Project Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {project.updates.map((update, index) => (
                    <div key={update.id} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-4 h-4 rounded-full ${
                            update.type === 'milestone'
                              ? 'bg-green-500'
                              : update.type === 'delivery'
                              ? 'bg-purple-500'
                              : update.type === 'revision'
                              ? 'bg-orange-500'
                              : 'bg-blue-500'
                          }`}
                        />
                        {index < project.updates.length - 1 && (
                          <div className="w-0.5 flex-1 bg-border mt-2" />
                        )}
                      </div>
                      <div className="flex-1 pb-6">
                        <div className="flex items-center gap-2 mb-1">
                          {getUpdateTypeBadge(update.type)}
                          <span className="font-medium">{update.title}</span>
                        </div>
                        <p className="text-muted-foreground">{update.description}</p>
                        <p className="text-sm text-muted-foreground mt-2">{update.date}</p>
                        
                        {update.attachments && update.attachments.length > 0 && (
                          <div className="mt-3 flex gap-2">
                            {update.attachments.map((att, i) => (
                              <Button key={i} variant="outline" size="sm">
                                <Download className="h-4 w-4 mr-2" />
                                {att.name}
                              </Button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="messages">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Messages with Team
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-[500px] overflow-y-auto mb-4">
                  {project.messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender === 'client' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] p-4 rounded-lg ${
                          msg.sender === 'client'
                            ? 'bg-blue-500 text-white'
                            : 'bg-muted'
                        }`}
                      >
                        <p className="text-xs font-medium mb-1 opacity-75">
                          {msg.senderName}
                        </p>
                        <p className="text-sm">{msg.content}</p>
                        <p
                          className={`text-xs mt-2 ${
                            msg.sender === 'client' ? 'text-blue-100' : 'text-muted-foreground'
                          }`}
                        >
                          {msg.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <Input
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      className="flex-1"
                    />
                    <Button onClick={sendMessage}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Files Tab */}
          <TabsContent value="files">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center justify-between">
                  <span>Project Files</span>
                  <Button size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload File
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: 'design-mockup-v1.png', size: '2.4 MB', type: 'image', date: 'Jan 18' },
                    { name: 'design-mockup-v2.png', size: '2.8 MB', type: 'image', date: 'Jan 20' },
                    { name: 'content-guide.pdf', size: '156 KB', type: 'document', date: 'Jan 15' },
                    { name: 'logo-final.png', size: '89 KB', type: 'image', date: 'Jan 16' },
                  ].map((file, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-muted">
                          {file.type === 'image' ? (
                            <ImageIcon className="h-5 w-5 text-blue-500" />
                          ) : (
                            <FileText className="h-5 w-5 text-orange-500" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{file.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {file.size} • {file.date}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
