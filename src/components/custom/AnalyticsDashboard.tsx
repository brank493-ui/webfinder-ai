'use client';

import { useState, useEffect } from 'react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Globe,
  DollarSign,
  Mail,
  Eye,
  MousePointer,
  Calendar,
  Download,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

interface AnalyticsData {
  period: string;
  visitors: number;
  pageViews: number;
  bounceRate: number;
  avgSessionDuration: number;
}

interface ProjectMetric {
  id: string;
  name: string;
  status: string;
  views: number;
  conversionRate: number;
  revenue: number;
}

const mockAnalytics: AnalyticsData[] = [
  { period: 'Jan', visitors: 1200, pageViews: 3500, bounceRate: 45, avgSessionDuration: 180 },
  { period: 'Feb', visitors: 1500, pageViews: 4200, bounceRate: 42, avgSessionDuration: 195 },
  { period: 'Mar', visitors: 1800, pageViews: 5100, bounceRate: 40, avgSessionDuration: 210 },
  { period: 'Apr', visitors: 2100, pageViews: 6300, bounceRate: 38, avgSessionDuration: 225 },
  { period: 'May', visitors: 2400, pageViews: 7200, bounceRate: 36, avgSessionDuration: 240 },
  { period: 'Jun', visitors: 2800, pageViews: 8400, bounceRate: 35, avgSessionDuration: 255 },
];

const mockProjects: ProjectMetric[] = [
  { id: '1', name: 'TechStartup.com', status: 'live', views: 15420, conversionRate: 3.2, revenue: 149 },
  { id: '2', name: 'Restaurant Pro', status: 'live', views: 8930, conversionRate: 4.5, revenue: 399 },
  { id: '3', name: 'Beauty Salon', status: 'live', views: 12500, conversionRate: 2.8, revenue: 149 },
  { id: '4', name: 'Fitness Center', status: 'in_progress', views: 0, conversionRate: 0, revenue: 0 },
  { id: '5', name: 'Law Firm Elite', status: 'live', views: 6780, conversionRate: 5.1, revenue: 999 },
];

// Simple bar chart component - defined outside of render
function SimpleBarChart({ data, dataKey, color }: { data: AnalyticsData[], dataKey: keyof AnalyticsData, color: string }) {
  const maxValue = Math.max(...data.map(d => d[dataKey] as number));
  
  return (
    <div className="flex items-end gap-2 h-40">
      {data.map((item, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div
            className="w-full rounded-t transition-all duration-300"
            style={{
              height: `${((item[dataKey] as number) / maxValue) * 100}%`,
              backgroundColor: color,
              opacity: 0.7 + (i / data.length) * 0.3,
            }}
          />
          <span className="text-xs text-muted-foreground">{item.period}</span>
        </div>
      ))}
    </div>
  );
}

export function AnalyticsDashboard() {
  const { t } = useLanguageStore();
  const [timeRange, setTimeRange] = useState('30d');
  const [loading, setLoading] = useState(false);
  const [analytics, setAnalytics] = useState(mockAnalytics);
  const [projects, setProjects] = useState(mockProjects);

  // Calculate totals
  const totalVisitors = analytics.reduce((sum, a) => sum + a.visitors, 0);
  const totalPageViews = analytics.reduce((sum, a) => sum + a.pageViews, 0);
  const avgBounceRate = analytics.reduce((sum, a) => sum + a.bounceRate, 0) / analytics.length;
  const totalRevenue = projects.reduce((sum, p) => sum + p.revenue, 0);
  const liveProjects = projects.filter(p => p.status === 'live').length;

  // Calculate trends
  const lastMonth = analytics[analytics.length - 1];
  const prevMonth = analytics[analytics.length - 2];
  const visitorGrowth = ((lastMonth.visitors - prevMonth.visitors) / prevMonth.visitors * 100).toFixed(1);
  const pageViewGrowth = ((lastMonth.pageViews - prevMonth.pageViews) / prevMonth.pageViews * 100).toFixed(1);

  const refreshData = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-blue-600" />
            {t('analytics.title')}
          </h2>
          <p className="text-muted-foreground">
            {t('analytics.subtitle')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[140px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">{t('analytics.last7days')}</SelectItem>
              <SelectItem value="30d">{t('analytics.last30days')}</SelectItem>
              <SelectItem value="90d">{t('analytics.last90days')}</SelectItem>
              <SelectItem value="1y">{t('analytics.lastYear')}</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={refreshData} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-1" />
            {t('analytics.export')}
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('analytics.totalVisitors')}</p>
                <p className="text-2xl font-bold">{totalVisitors.toLocaleString()}</p>
                <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                  <ArrowUpRight className="h-3 w-3" />
                  {visitorGrowth}% {t('analytics.fromLastMonth')}
                </p>
              </div>
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('analytics.pageViews')}</p>
                <p className="text-2xl font-bold">{totalPageViews.toLocaleString()}</p>
                <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                  <ArrowUpRight className="h-3 w-3" />
                  {pageViewGrowth}% {t('analytics.fromLastMonth')}
                </p>
              </div>
              <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
                <Eye className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('analytics.revenue')}</p>
                <p className="text-2xl font-bold">${totalRevenue.toLocaleString()}</p>
                <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                  <ArrowUpRight className="h-3 w-3" />
                  12.5% {t('analytics.fromLastMonth')}
                </p>
              </div>
              <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('analytics.liveProjects')}</p>
                <p className="text-2xl font-bold">{liveProjects}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {projects.filter(p => p.status === 'in_progress').length} {t('analytics.inProgressCount')}
                </p>
              </div>
              <div className="p-3 rounded-full bg-orange-100 dark:bg-orange-900">
                <Globe className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Visitors Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5" />
              {t('analytics.visitorsTrend')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SimpleBarChart data={analytics} dataKey="visitors" color="#3B82F6" />
            <div className="flex justify-between mt-4 text-sm text-muted-foreground">
              <span>Avg: {(totalVisitors / analytics.length).toFixed(0)} {t('analytics.avgVisitorsMonth')}</span>
              <span className="text-green-600">+{visitorGrowth}% {t('analytics.growth')}</span>
            </div>
          </CardContent>
        </Card>

        {/* Page Views Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Eye className="h-5 w-5" />
              {t('analytics.pageViews')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SimpleBarChart data={analytics} dataKey="pageViews" color="#10B981" />
            <div className="flex justify-between mt-4 text-sm text-muted-foreground">
              <span>Avg: {(totalPageViews / analytics.length).toFixed(0)} {t('analytics.views')}/month</span>
              <span className="text-green-600">+{pageViewGrowth}% {t('analytics.growth')}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t('analytics.bounceRate')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{avgBounceRate.toFixed(1)}%</div>
            <p className="text-sm text-green-600 flex items-center gap-1 mt-1">
              <ArrowDownRight className="h-4 w-4" />
              {t('analytics.decreasing')}
            </p>
            <div className="mt-4 h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 rounded-full transition-all"
                style={{ width: `${100 - avgBounceRate}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t('analytics.avgSessionDuration')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {Math.floor(lastMonth.avgSessionDuration / 60)}m {lastMonth.avgSessionDuration % 60}s
            </div>
            <p className="text-sm text-green-600 flex items-center gap-1 mt-1">
              <ArrowUpRight className="h-4 w-4" />
              {t('analytics.improvingEngagement')}
            </p>
            <div className="mt-4 h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all"
                style={{ width: `${(lastMonth.avgSessionDuration / 300) * 100}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t('analytics.conversionRate')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">3.8%</div>
            <p className="text-sm text-green-600 flex items-center gap-1 mt-1">
              <ArrowUpRight className="h-4 w-4" />
              {t('analytics.aboveIndustryAvg')}
            </p>
            <div className="mt-4 h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-500 rounded-full transition-all"
                style={{ width: '38%' }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performing Projects */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t('analytics.topPerformingProjects')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {projects
              .filter(p => p.status === 'live')
              .sort((a, b) => b.views - a.views)
              .slice(0, 5)
              .map((project, i) => (
                <div
                  key={project.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-muted-foreground w-6">
                      #{i + 1}
                    </span>
                    <div>
                      <p className="font-medium">{project.name}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>
                          <Eye className="h-3 w-3 inline mr-1" />
                          {project.views.toLocaleString()} {t('analytics.views')}
                        </span>
                        <span>
                          <MousePointer className="h-3 w-3 inline mr-1" />
                          {project.conversionRate}% {t('analytics.conversion')}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-green-600">
                      ${project.revenue}
                    </p>
                    <Badge variant="outline" className="text-xs">
                      {t('analytics.live')}
                    </Badge>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Traffic Sources */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t('analytics.trafficSources')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { source: t('analytics.direct'), percentage: 35, visitors: 4900 },
              { source: t('analytics.googleSearch'), percentage: 28, visitors: 3920 },
              { source: t('analytics.emailCampaigns'), percentage: 18, visitors: 2520 },
              { source: t('analytics.socialMedia'), percentage: 12, visitors: 1680 },
              { source: t('analytics.referrals'), percentage: 7, visitors: 980 },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <span className="w-28 text-sm">{item.source}</span>
                <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
                <span className="text-sm text-muted-foreground w-24 text-right">
                  {item.visitors.toLocaleString()} ({item.percentage}%)
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
