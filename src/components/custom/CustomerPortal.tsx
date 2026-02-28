'use client';

import { useState } from 'react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Clock,
  CheckCircle,
  FileText,
  MessageSquare,
  CreditCard,
  Globe,
  Download,
  Upload,
  Eye,
  Calendar,
  AlertCircle,
  Sparkles,
  Send,
  Paperclip,
  Image as ImageIcon,
  File,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';

interface ClientProject {
  id: string;
  name: string;
  businessName: string;
  status: 'pending' | 'in_progress' | 'review' | 'completed';
  package: 'standard' | 'pro' | 'premium';
  progress: number;
  startDate: string;
  estimatedCompletion: string;
  websiteUrl?: string;
  paymentStatus: 'pending' | 'partial' | 'paid';
  amount: number;
  paidAmount: number;
}

interface ProjectUpdate {
  id: string;
  date: string;
  title: string;
  description: string;
  type: 'milestone' | 'update' | 'delivery';
}

interface Message {
  id: string;
  sender: 'client' | 'team';
  content: string;
  timestamp: string;
  attachments?: { name: string; type: string; size: string }[];
}

const mockProject: ClientProject = {
  id: 'proj_001',
  name: 'TechStartup Website',
  businessName: 'TechStartup Inc.',
  status: 'in_progress',
  package: 'pro',
  progress: 65,
  startDate: '2024-01-15',
  estimatedCompletion: '2024-02-15',
  paymentStatus: 'partial',
  amount: 399,
  paidAmount: 200,
};

const mockUpdates: ProjectUpdate[] = [
  {
    id: '1',
    date: '2024-01-20',
    title: 'Homepage Design Complete',
    description: 'We\'ve finished the homepage design and it\'s ready for your review.',
    type: 'milestone',
  },
  {
    id: '2',
    date: '2024-01-18',
    title: 'Content Integration',
    description: 'Your content has been integrated into the website structure.',
    type: 'update',
  },
  {
    id: '3',
    date: '2024-01-16',
    title: 'Project Started',
    description: 'Development has begun on your new website.',
    type: 'milestone',
  },
];

const mockMessages: Message[] = [
  {
    id: '1',
    sender: 'team',
    content: 'Welcome to your project portal! We\'ll keep you updated on progress here.',
    timestamp: '2024-01-15 10:30',
  },
  {
    id: '2',
    sender: 'client',
    content: 'Thank you! Looking forward to seeing the first draft.',
    timestamp: '2024-01-15 14:22',
  },
  {
    id: '3',
    sender: 'team',
    content: 'The homepage design is ready. Please check the Preview tab.',
    timestamp: '2024-01-20 09:15',
  },
];

export function CustomerPortal() {
  const { t } = useLanguageStore();
  const [project] = useState<ClientProject>(mockProject);
  const [updates] = useState<ProjectUpdate[]>(mockUpdates);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const getStatusColor = (status: ClientProject['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500';
      case 'in_progress':
        return 'bg-blue-500';
      case 'review':
        return 'bg-purple-500';
      case 'completed':
        return 'bg-green-500';
    }
  };

  const getStatusLabel = (status: ClientProject['status']) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'in_progress':
        return 'In Progress';
      case 'review':
        return 'Under Review';
      case 'completed':
        return 'Completed';
    }
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    
    const msg: Message = {
      id: `msg_${Date.now()}`,
      sender: 'client',
      content: newMessage,
      timestamp: new Date().toLocaleString(),
    };
    
    setMessages([...messages, msg]);
    setNewMessage('');
  };

  return (
    <div className="space-y-6">
      {/* Project Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{project.name}</h1>
          <p className="text-muted-foreground">{project.businessName}</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className={`${getStatusColor(project.status)} text-white`}>
            {getStatusLabel(project.status)}
          </Badge>
          <Badge variant="outline" className="capitalize">
            {project.package} Package
          </Badge>
        </div>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold">{t('tracking.progress')}</h3>
              <p className="text-sm text-muted-foreground">
                Estimated completion: {project.estimatedCompletion}
              </p>
            </div>
            <span className="text-3xl font-bold text-blue-600">{project.progress}%</span>
          </div>
          <Progress value={project.progress} className="h-3" />
          
          <div className="grid grid-cols-4 gap-4 mt-6">
            <div className="text-center">
              <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center mx-auto mb-2">
                <CheckCircle className="h-5 w-5" />
              </div>
              <span className="text-xs">Planning</span>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center mx-auto mb-2">
                <CheckCircle className="h-5 w-5" />
              </div>
              <span className="text-xs">Design</span>
            </div>
            <div className="text-center">
              <div className={`w-10 h-10 rounded-full ${project.progress >= 50 ? 'bg-blue-500' : 'bg-gray-300'} text-white flex items-center justify-center mx-auto mb-2`}>
                {project.progress >= 75 ? <CheckCircle className="h-5 w-5" /> : '3'}
              </div>
              <span className="text-xs">Development</span>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 rounded-full bg-gray-300 text-white flex items-center justify-center mx-auto mb-2">
                4
              </div>
              <span className="text-xs">Launch</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">{t('portal.myProjects')}</TabsTrigger>
          <TabsTrigger value="preview">{t('editor.preview')}</TabsTrigger>
          <TabsTrigger value="messages">{t('portal.messages')}</TabsTrigger>
          <TabsTrigger value="billing">{t('portal.invoices')}</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6 mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  {t('tracking.timeline')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {updates.map((update, i) => (
                    <div key={update.id} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            update.type === 'milestone'
                              ? 'bg-blue-500'
                              : update.type === 'delivery'
                              ? 'bg-green-500'
                              : 'bg-gray-400'
                          }`}
                        />
                        {i < updates.length - 1 && <div className="w-0.5 h-full bg-border mt-1" />}
                      </div>
                      <div className="pb-4">
                        <p className="font-medium">{update.title}</p>
                        <p className="text-sm text-muted-foreground">{update.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">{update.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start" variant="outline">
                    <Eye className="h-4 w-4 mr-2" />
                    Preview Website
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    View Project Brief
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Content
                  </Button>
                  <Button
                    className="w-full justify-start"
                    variant="outline"
                    onClick={() => setShowPaymentModal(true)}
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Make Payment
                  </Button>
                </CardContent>
              </Card>

              {/* Files */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Project Files</span>
                    <Button size="sm" variant="ghost">
                      <Upload className="h-4 w-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {[
                      { name: 'logo.png', type: 'image', size: '245 KB' },
                      { name: 'content.docx', type: 'document', size: '56 KB' },
                      { name: 'brand-guidelines.pdf', type: 'document', size: '1.2 MB' },
                    ].map((file, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-2 border rounded-lg"
                      >
                        <div className="flex items-center gap-2">
                          {file.type === 'image' ? (
                            <ImageIcon className="h-4 w-4 text-blue-500" />
                          ) : (
                            <File className="h-4 w-4 text-orange-500" />
                          )}
                          <span className="text-sm">{file.name}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">{file.size}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Preview Tab */}
        <TabsContent value="preview" className="mt-6">
          <Card>
            <CardContent className="p-0">
              <div className="border-b p-4 flex items-center justify-between">
                <span className="font-medium">Website Preview</span>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                  <Button variant="outline" size="sm">
                    <ExternalLink className="h-4 w-4 mr-1" />
                    Open Full
                  </Button>
                </div>
              </div>
              <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <div className="text-center text-white">
                  <Globe className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-xl font-medium">Website Preview</p>
                  <p className="text-sm opacity-75">Your website preview will appear here</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center gap-4 mt-6">
            <Button variant="outline">
              Request Changes
            </Button>
            <Button className="bg-green-600 hover:bg-green-700">
              <CheckCircle className="h-4 w-4 mr-2" />
              Approve Design
            </Button>
          </div>
        </TabsContent>

        {/* Messages Tab */}
        <TabsContent value="messages" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Project Messages
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-[400px] overflow-y-auto">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === 'client' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] p-3 rounded-lg ${
                        msg.sender === 'client'
                          ? 'bg-blue-500 text-white'
                          : 'bg-muted'
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                      <p className={`text-xs mt-1 ${msg.sender === 'client' ? 'text-blue-100' : 'text-muted-foreground'}`}>
                        {msg.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 mt-4 pt-4 border-t">
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
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing Tab */}
        <TabsContent value="billing" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Payment Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Package</span>
                  <span className="font-medium capitalize">{project.package}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Amount</span>
                  <span className="font-medium">${project.amount}</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Paid</span>
                  <span className="font-medium">${project.paidAmount}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-4">
                  <span>Remaining</span>
                  <span>${project.amount - project.paidAmount}</span>
                </div>
                <Button
                  className="w-full"
                  onClick={() => setShowPaymentModal(true)}
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Pay Now (${project.amount - project.paidAmount})
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Initial Deposit</p>
                      <p className="text-xs text-muted-foreground">Jan 15, 2024</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-green-600">$200.00</p>
                      <Badge variant="outline" className="text-xs">Paid</Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Final Payment</p>
                      <p className="text-xs text-muted-foreground">Due on completion</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">$199.00</p>
                      <Badge variant="secondary" className="text-xs">Pending</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Payment Modal */}
      <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Make Payment</DialogTitle>
            <DialogDescription>
              Complete your payment to continue your project
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="text-center py-4 border rounded-lg">
              <p className="text-sm text-muted-foreground">Amount Due</p>
              <p className="text-3xl font-bold">${project.amount - project.paidAmount}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Payment Methods</p>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" className="h-auto py-3">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Card
                </Button>
                <Button variant="outline" className="h-auto py-3">
                  📱 Mobile Money
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPaymentModal(false)}>
              Cancel
            </Button>
            <Button>Pay Now</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
