'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Globe,
  Users,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  RefreshCw,
  ExternalLink,
  MessageSquare,
} from 'lucide-react';
import { useLanguageStore } from '@/store/useLanguageStore';

interface DashboardStats {
  totalBusinesses: number;
  businessesWithoutWebsite: number;
  totalProjects: number;
  pendingPayments: number;
  completedProjects: number;
  inProgressProjects: number;
  totalRevenue: number;
}

interface RecentProject {
  id: string;
  business: {
    name: string;
    category: string | null;
    email: string | null;
    phone: string | null;
  };
  package: string;
  status: string;
  paymentStatus: string;
  amount: number | null;
  createdAt: string;
}

export function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentProjects, setRecentProjects] = useState<RecentProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { t } = useLanguageStore();

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats');
      const data = await response.json();

      if (data.success) {
        setStats(data.stats);
        setRecentProjects(data.recentProjects || []);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchStats();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const statCards = [
    {
      title: t('admin.totalBusinesses'),
      value: stats?.totalBusinesses || 0,
      icon: Globe,
      color: 'text-blue-600',
      bg: 'bg-blue-100',
    },
    {
      title: t('admin.withoutWebsites'),
      value: stats?.businessesWithoutWebsite || 0,
      icon: AlertCircle,
      color: 'text-red-600',
      bg: 'bg-red-100',
    },
    {
      title: t('admin.activeProjects'),
      value: stats?.totalProjects || 0,
      icon: Users,
      color: 'text-green-600',
      bg: 'bg-green-100',
    },
    {
      title: t('admin.totalRevenue'),
      value: `$${(stats?.totalRevenue || 0).toLocaleString()}`,
      icon: DollarSign,
      color: 'text-purple-600',
      bg: 'bg-purple-100',
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">{t('admin.title')}</h1>
          <p className="text-sm sm:text-base text-muted-foreground">{t('admin.subtitle')}</p>
        </div>
        <Button onClick={handleRefresh} disabled={refreshing} variant="outline" className="w-full sm:w-auto">
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          {t('admin.refresh')}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-3 sm:gap-4 grid-cols-2 md:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.bg}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Additional Stats Row */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-yellow-100">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t('admin.pendingPayments')}</p>
                <p className="text-2xl font-bold">{stats?.pendingPayments || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-blue-100">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t('admin.inProgress')}</p>
                <p className="text-2xl font-bold">{stats?.inProgressProjects || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-green-100">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t('admin.completed')}</p>
                <p className="text-2xl font-bold">{stats?.completedProjects || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Projects */}
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-lg sm:text-xl">{t('admin.recentProjects')}</CardTitle>
        </CardHeader>
        <CardContent className="p-0 sm:p-6">
          <div className="overflow-x-auto">
            <Table className="min-w-[600px]">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs sm:text-sm">{t('admin.business')}</TableHead>
                  <TableHead className="text-xs sm:text-sm">{t('admin.package')}</TableHead>
                  <TableHead className="text-xs sm:text-sm">{t('admin.status')}</TableHead>
                  <TableHead className="text-xs sm:text-sm hidden sm:table-cell">{t('admin.payment')}</TableHead>
                  <TableHead className="text-xs sm:text-sm">{t('admin.amount')}</TableHead>
                  <TableHead className="text-xs sm:text-sm hidden md:table-cell">{t('admin.date')}</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
            <TableBody>
              {recentProjects.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8 text-sm">
                    {t('admin.noProjects')}
                  </TableCell>
                </TableRow>
              ) : (
                recentProjects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium text-sm">{project.business.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {project.business.category || t('admin.noCategory')}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          project.package === 'premium'
                            ? 'default'
                            : project.package === 'pro'
                            ? 'secondary'
                            : 'outline'
                        }
                        className="text-xs"
                      >
                        {project.package.charAt(0).toUpperCase() + project.package.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          project.status === 'completed'
                            ? 'default'
                            : project.status === 'in_progress'
                            ? 'secondary'
                            : 'outline'
                        }
                        className="text-xs"
                      >
                        {project.status.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge
                        variant={
                          project.paymentStatus === 'paid'
                            ? 'default'
                            : project.paymentStatus === 'pending'
                            ? 'secondary'
                            : 'destructive'
                        }
                        className="text-xs"
                      >
                        {project.paymentStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      ${project.amount?.toLocaleString() || '0'}
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-sm">
                      {new Date(project.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button size="sm" variant="ghost">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
