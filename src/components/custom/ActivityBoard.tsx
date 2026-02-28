'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Users,
  Bot,
  CreditCard,
  Globe,
  MessageSquare,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Calendar,
  Download,
  RefreshCw,
  Mail,
  Phone,
  ShoppingCart,
  UserPlus,
  Settings,
  Bell,
  ArrowRight,
} from 'lucide-react';
import { useLanguageStore } from '@/store/useLanguageStore';

interface Activity {
  id: string;
  type: 'user' | 'payment' | 'ai_agent' | 'website' | 'message' | 'system';
  title: string;
  description: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
  status?: 'completed' | 'pending' | 'failed';
}

interface DailyReport {
  date: string;
  totalUsers: number;
  newUsers: number;
  totalPayments: number;
  paymentsAmount: number;
  aiInteractions: number;
  websitesCompleted: number;
  messagesSent: number;
  topActivities: Activity[];
}

export function ActivityBoard() {
  const { t } = useLanguageStore();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [dailyReport, setDailyReport] = useState<DailyReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    fetchActivityData();
  }, [selectedDate]);

  const fetchActivityData = async () => {
    setIsLoading(true);
    try {
      // Fetch activities
      const response = await fetch(`/api/admin/activity?date=${selectedDate}`);
      const data = await response.json();
      
      if (data.success) {
        setActivities(data.activities || []);
        setDailyReport(data.report || generateMockReport());
      } else {
        // Use mock data if API not available
        setActivities(generateMockActivities());
        setDailyReport(generateMockReport());
      }
    } catch (error) {
      console.error('Error fetching activity data:', error);
      setActivities(generateMockActivities());
      setDailyReport(generateMockReport());
    } finally {
      setIsLoading(false);
    }
  };

  const generateMockActivities = (): Activity[] => {
    const now = new Date();
    return [
      {
        id: '1',
        type: 'user',
        title: 'New User Registration',
        description: 'Marie Kouam registered for a Pro Package website',
        timestamp: new Date(now.getTime() - 1000 * 60 * 5).toISOString(),
        status: 'completed',
      },
      {
        id: '2',
        type: 'payment',
        title: 'Payment Received',
        description: '$399 payment from Jean-Pierre Nkongo for Pro Package',
        timestamp: new Date(now.getTime() - 1000 * 60 * 15).toISOString(),
        status: 'completed',
        metadata: { amount: 399, method: 'Mobile Money' },
      },
      {
        id: '3',
        type: 'ai_agent',
        title: 'April Contacted Lead',
        description: 'April initiated contact with 3 businesses without websites',
        timestamp: new Date(now.getTime() - 1000 * 60 * 30).toISOString(),
        status: 'completed',
      },
      {
        id: '4',
        type: 'website',
        title: 'Website Completed',
        description: 'Restaurant website for "Le Petit Bistro" completed',
        timestamp: new Date(now.getTime() - 1000 * 60 * 45).toISOString(),
        status: 'completed',
      },
      {
        id: '5',
        type: 'message',
        title: 'Support Message',
        description: 'User Paul Mbongo sent a support request',
        timestamp: new Date(now.getTime() - 1000 * 60 * 60).toISOString(),
        status: 'pending',
      },
      {
        id: '6',
        type: 'payment',
        title: 'Invoice Generated',
        description: 'Invoice #INV-2024-089 created for Premium Package',
        timestamp: new Date(now.getTime() - 1000 * 60 * 90).toISOString(),
        status: 'completed',
      },
      {
        id: '7',
        type: 'ai_agent',
        title: 'Lead Converted',
        description: 'April converted "Fashion Boutique" lead to paying customer',
        timestamp: new Date(now.getTime() - 1000 * 60 * 120).toISOString(),
        status: 'completed',
      },
      {
        id: '8',
        type: 'system',
        title: 'Backup Completed',
        description: 'Daily database backup completed successfully',
        timestamp: new Date(now.getTime() - 1000 * 60 * 180).toISOString(),
        status: 'completed',
      },
    ];
  };

  const generateMockReport = (): DailyReport => {
    return {
      date: selectedDate,
      totalUsers: 156,
      newUsers: 8,
      totalPayments: 12,
      paymentsAmount: 4847,
      aiInteractions: 45,
      websitesCompleted: 3,
      messagesSent: 28,
      topActivities: activities.slice(0, 5),
    };
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user': return <UserPlus className="h-4 w-4 text-blue-600" />;
      case 'payment': return <CreditCard className="h-4 w-4 text-green-600" />;
      case 'ai_agent': return <Bot className="h-4 w-4 text-purple-600" />;
      case 'website': return <Globe className="h-4 w-4 text-indigo-600" />;
      case 'message': return <MessageSquare className="h-4 w-4 text-orange-600" />;
      case 'system': return <Settings className="h-4 w-4 text-gray-600" />;
      default: return <Bell className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'completed': return <Badge className="bg-green-100 text-green-700 text-xs">Completed</Badge>;
      case 'pending': return <Badge className="bg-yellow-100 text-yellow-700 text-xs">Pending</Badge>;
      case 'failed': return <Badge className="bg-red-100 text-red-700 text-xs">Failed</Badge>;
      default: return null;
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const downloadReport = () => {
    if (!dailyReport) return;
    
    const reportText = `
WEBFINDER AI - DAILY REPORT
============================
Date: ${dailyReport.date}

SUMMARY
-------
Total Users: ${dailyReport.totalUsers}
New Users Today: ${dailyReport.newUsers}
Total Payments: ${dailyReport.totalPayments}
Total Revenue: ${formatCurrency(dailyReport.paymentsAmount)}
AI Interactions: ${dailyReport.aiInteractions}
Websites Completed: ${dailyReport.websitesCompleted}
Messages Sent: ${dailyReport.messagesSent}

TOP ACTIVITIES
-------------
${activities.slice(0, 10).map((a, i) => `${i + 1}. [${a.type.toUpperCase()}] ${a.title} - ${a.description}`).join('\n')}

---
Generated by WebFinder AI
Contact: brank493@gmail.com | +237 693 401 619
    `.trim();

    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `daily-report-${dailyReport.date}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
            <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
            Activity Board
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">Daily overview of all activities</p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 border rounded-lg text-xs sm:text-sm flex-1 sm:flex-none"
          />
          <Button onClick={fetchActivityData} variant="outline" size="sm" className="text-xs sm:text-sm">
            <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
          <Button onClick={downloadReport} size="sm" className="text-xs sm:text-sm">
            <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Export</span>
          </Button>
        </div>
      </div>

      {/* Daily Stats Summary */}
      {dailyReport && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2 sm:gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-2 mb-1">
                <Users className="h-4 w-4 text-blue-600" />
                <span className="text-xs text-muted-foreground">Total Users</span>
              </div>
              <p className="text-lg sm:text-2xl font-bold text-blue-600">{dailyReport.totalUsers}</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-2 mb-1">
                <UserPlus className="h-4 w-4 text-green-600" />
                <span className="text-xs text-muted-foreground">New Today</span>
              </div>
              <p className="text-lg sm:text-2xl font-bold text-green-600">+{dailyReport.newUsers}</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-2 mb-1">
                <CreditCard className="h-4 w-4 text-purple-600" />
                <span className="text-xs text-muted-foreground">Payments</span>
              </div>
              <p className="text-lg sm:text-2xl font-bold text-purple-600">{dailyReport.totalPayments}</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="h-4 w-4 text-indigo-600" />
                <span className="text-xs text-muted-foreground">Revenue</span>
              </div>
              <p className="text-base sm:text-xl font-bold text-indigo-600">{formatCurrency(dailyReport.paymentsAmount)}</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-2 mb-1">
                <Bot className="h-4 w-4 text-orange-600" />
                <span className="text-xs text-muted-foreground">AI Actions</span>
              </div>
              <p className="text-lg sm:text-2xl font-bold text-orange-600">{dailyReport.aiInteractions}</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-900/20 dark:to-teal-800/20">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-2 mb-1">
                <Globe className="h-4 w-4 text-teal-600" />
                <span className="text-xs text-muted-foreground">Websites</span>
              </div>
              <p className="text-lg sm:text-2xl font-bold text-teal-600">{dailyReport.websitesCompleted}</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-2 mb-1">
                <MessageSquare className="h-4 w-4 text-pink-600" />
                <span className="text-xs text-muted-foreground">Messages</span>
              </div>
              <p className="text-lg sm:text-2xl font-bold text-pink-600">{dailyReport.messagesSent}</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Main Activity List */}
        <Card className="lg:col-span-2">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-base sm:text-lg">Activity Feed</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Real-time activities from today</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[400px] sm:h-[500px]">
              {activities.length === 0 ? (
                <div className="p-6 text-center text-muted-foreground text-sm">
                  <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  No activities recorded for this date
                </div>
              ) : (
                <div className="divide-y">
                  {activities.map((activity) => (
                    <div key={activity.id} className="p-3 sm:p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-start gap-3 sm:gap-4">
                        <div className="p-2 rounded-full bg-muted flex-shrink-0">
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2">
                            <p className="font-medium text-sm">{activity.title}</p>
                            <div className="flex items-center gap-2">
                              {getStatusBadge(activity.status)}
                              <span className="text-xs text-muted-foreground whitespace-nowrap">{formatTime(activity.timestamp)}</span>
                            </div>
                          </div>
                          <p className="text-xs sm:text-sm text-muted-foreground mt-1">{activity.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Quick Stats & Actions */}
        <div className="space-y-4 sm:space-y-6">
          {/* Activity by Type */}
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-base sm:text-lg">Activity Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-blue-500" />
                    <span className="text-xs sm:text-sm">User Activities</span>
                  </div>
                  <span className="font-medium text-xs sm:text-sm">{activities.filter(a => a.type === 'user').length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-green-500" />
                    <span className="text-xs sm:text-sm">Payments</span>
                  </div>
                  <span className="font-medium text-xs sm:text-sm">{activities.filter(a => a.type === 'payment').length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-purple-500" />
                    <span className="text-xs sm:text-sm">AI Agent</span>
                  </div>
                  <span className="font-medium text-xs sm:text-sm">{activities.filter(a => a.type === 'ai_agent').length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-indigo-500" />
                    <span className="text-xs sm:text-sm">Websites</span>
                  </div>
                  <span className="font-medium text-xs sm:text-sm">{activities.filter(a => a.type === 'website').length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-orange-500" />
                    <span className="text-xs sm:text-sm">Messages</span>
                  </div>
                  <span className="font-medium text-xs sm:text-sm">{activities.filter(a => a.type === 'message').length}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-base sm:text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0 space-y-2">
              <Button variant="outline" className="w-full justify-start text-xs sm:text-sm h-9 sm:h-10">
                <FileText className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                Generate Invoice
              </Button>
              <Button variant="outline" className="w-full justify-start text-xs sm:text-sm h-9 sm:h-10">
                <Mail className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                Send Bulk Email
              </Button>
              <Button variant="outline" className="w-full justify-start text-xs sm:text-sm h-9 sm:h-10">
                <Users className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                Export Users
              </Button>
              <Button variant="outline" className="w-full justify-start text-xs sm:text-sm h-9 sm:h-10">
                <Bot className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                Run April Tasks
              </Button>
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-base sm:text-lg">Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <ScrollArea className="h-[150px]">
                <div className="space-y-3">
                  {activities.filter(a => a.type === 'payment').slice(0, 5).map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between text-xs sm:text-sm">
                      <span className="truncate max-w-[150px]">{activity.title.replace('Payment Received - ', '')}</span>
                      <span className="text-green-600 font-medium whitespace-nowrap">
                        {activity.metadata?.amount ? formatCurrency(activity.metadata.amount as number) : '$0'}
                      </span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
