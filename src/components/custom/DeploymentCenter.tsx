'use client';

import { useState } from 'react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  Rocket,
  Globe,
  Server,
  Shield,
  Zap,
  ExternalLink,
  RefreshCw,
  Settings,
  Terminal,
  Copy,
  CheckCircle,
  AlertCircle,
  Clock,
  Activity,
  Database,
  Cloud,
  Loader2,
  Play,
  Pause,
  RotateCcw,
  Trash2,
} from 'lucide-react';

interface Deployment {
  id: string;
  projectName: string;
  domain: string;
  status: 'building' | 'deploying' | 'live' | 'failed' | 'paused';
  lastDeployed: string;
  buildTime: string;
  framework: string;
  region: string;
  ssl: boolean;
  cdn: boolean;
  analytics: boolean;
  visits: number;
  bandwidth: string;
}

const mockDeployments: Deployment[] = [
  {
    id: 'dep_001',
    projectName: 'TechStartup Website',
    domain: 'techstartup.com',
    status: 'live',
    lastDeployed: '2024-01-20 14:30',
    buildTime: '45s',
    framework: 'Next.js',
    region: 'US East',
    ssl: true,
    cdn: true,
    analytics: true,
    visits: 15420,
    bandwidth: '2.4 GB',
  },
  {
    id: 'dep_002',
    projectName: 'Restaurant Pro',
    domain: 'restaurantpro.net',
    status: 'live',
    lastDeployed: '2024-01-18 09:15',
    buildTime: '32s',
    framework: 'Next.js',
    region: 'EU West',
    ssl: true,
    cdn: true,
    analytics: false,
    visits: 8930,
    bandwidth: '1.1 GB',
  },
  {
    id: 'dep_003',
    projectName: 'Beauty Salon',
    domain: 'beautysalon.org',
    status: 'building',
    lastDeployed: '2024-01-22 16:45',
    buildTime: 'Building...',
    framework: 'Next.js',
    region: 'US West',
    ssl: true,
    cdn: false,
    analytics: true,
    visits: 0,
    bandwidth: '0 MB',
  },
  {
    id: 'dep_004',
    projectName: 'Law Firm Elite',
    domain: 'lawfirmelite.com',
    status: 'failed',
    lastDeployed: '2024-01-21 11:00',
    buildTime: 'Failed at 23s',
    framework: 'Next.js',
    region: 'US East',
    ssl: false,
    cdn: false,
    analytics: false,
    visits: 0,
    bandwidth: '0 MB',
  },
];

const deploymentLogs = [
  { time: '16:45:01', type: 'info', message: 'Build started' },
  { time: '16:45:05', type: 'info', message: 'Installing dependencies...' },
  { time: '16:45:15', type: 'info', message: 'Dependencies installed successfully' },
  { time: '16:45:20', type: 'info', message: 'Running build script...' },
  { time: '16:45:35', type: 'info', message: 'Compiling pages...' },
  { time: '16:45:42', type: 'warning', message: 'Large image detected: hero-bg.jpg (2.5MB)' },
  { time: '16:45:50', type: 'info', message: 'Generating static pages...' },
  { time: '16:46:00', type: 'success', message: 'Build completed successfully' },
  { time: '16:46:05', type: 'info', message: 'Uploading to CDN...' },
  { time: '16:46:20', type: 'success', message: 'Deployment live!' },
];

export function DeploymentCenter() {
  const { t } = useLanguageStore();
  const [deployments, setDeployments] = useState<Deployment[]>(mockDeployments);
  const [selectedDeployment, setSelectedDeployment] = useState<Deployment | null>(null);
  const [showDeployModal, setShowDeployModal] = useState(false);
  const [deploying, setDeploying] = useState(false);

  const liveCount = deployments.filter((d) => d.status === 'live').length;
  const totalVisits = deployments.reduce((sum, d) => sum + d.visits, 0);

  const redeploy = async (id: string) => {
    setDeployments((prev) =>
      prev.map((d) =>
        d.id === id ? { ...d, status: 'building', buildTime: 'Building...' } : d
      )
    );
    
    // Simulate deployment
    await new Promise((resolve) => setTimeout(resolve, 3000));
    
    setDeployments((prev) =>
      prev.map((d) =>
        d.id === id
          ? {
              ...d,
              status: 'live',
              buildTime: '38s',
              lastDeployed: new Date().toLocaleString(),
            }
          : d
      )
    );
  };

  const getStatusBadge = (status: Deployment['status']) => {
    switch (status) {
      case 'building':
        return (
          <Badge className="bg-blue-500">
            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
            {t('deployment.buildingLabel')}
          </Badge>
        );
      case 'deploying':
        return (
          <Badge className="bg-purple-500">
            <Rocket className="h-3 w-3 mr-1" />
            {t('deployment.deploying')}
          </Badge>
        );
      case 'live':
        return (
          <Badge className="bg-green-500">
            <CheckCircle className="h-3 w-3 mr-1" />
            {t('deployment.liveLabel')}
          </Badge>
        );
      case 'failed':
        return (
          <Badge variant="destructive">
            <AlertCircle className="h-3 w-3 mr-1" />
            {t('deployment.failed')}
          </Badge>
        );
      case 'paused':
        return (
          <Badge variant="secondary">
            <Pause className="h-3 w-3 mr-1" />
            {t('deployment.paused')}
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Rocket className="h-6 w-6 text-blue-600" />
            {t('deployment.title')}
          </h2>
          <p className="text-muted-foreground">
            {t('deployment.subtitle')}
          </p>
        </div>
        <Button onClick={() => setShowDeployModal(true)}>
          <Rocket className="h-4 w-4 mr-2" />
          {t('deployment.newDeployment')}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('deployment.liveSites')}</p>
                <p className="text-2xl font-bold text-green-600">{liveCount}</p>
              </div>
              <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
                <Globe className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('deployment.totalVisits')}</p>
                <p className="text-2xl font-bold">{totalVisits.toLocaleString()}</p>
              </div>
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
                <Activity className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('deployment.sslCertificates')}</p>
                <p className="text-2xl font-bold">
                  {deployments.filter((d) => d.ssl).length}
                </p>
              </div>
              <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
                <Shield className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('deployment.cdnEnabled')}</p>
                <p className="text-2xl font-bold">
                  {deployments.filter((d) => d.cdn).length}
                </p>
              </div>
              <div className="p-3 rounded-full bg-orange-100 dark:bg-orange-900">
                <Zap className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Deployments */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t('deployment.activeDeployments')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {deployments.map((deployment) => (
              <div
                key={deployment.id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedDeployment(deployment)}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-muted">
                      <Globe className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">{deployment.projectName}</p>
                      <p className="text-sm text-muted-foreground">{deployment.domain}</p>
                    </div>
                  </div>
                  {getStatusBadge(deployment.status)}
                </div>

                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Server className="h-4 w-4" />
                    {deployment.region}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {deployment.buildTime}
                  </span>
                  <span className="flex items-center gap-1">
                    <Activity className="h-4 w-4" />
                    {deployment.visits.toLocaleString()} {t('deployment.visits')}
                  </span>
                  {deployment.ssl && (
                    <span className="flex items-center gap-1 text-green-600">
                      <Shield className="h-4 w-4" />
                      SSL
                    </span>
                  )}
                  {deployment.cdn && (
                    <span className="flex items-center gap-1 text-orange-600">
                      <Zap className="h-4 w-4" />
                      CDN
                    </span>
                  )}
                </div>

                {deployment.status === 'building' && (
                  <div className="mt-3">
                    <Progress value={60} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1">
                      {t('deployment.building')} 60%
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Deployment Detail Modal */}
      <Dialog
        open={!!selectedDeployment}
        onOpenChange={() => setSelectedDeployment(null)}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedDeployment?.projectName}
              {selectedDeployment && getStatusBadge(selectedDeployment.status)}
            </DialogTitle>
            <DialogDescription>
              {selectedDeployment?.domain}
            </DialogDescription>
          </DialogHeader>

          {selectedDeployment && (
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="flex gap-2">
                {selectedDeployment.status === 'live' && (
                  <Button variant="outline" asChild>
                    <a href={`https://${selectedDeployment.domain}`} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      {t('deployment.visitSite')}
                    </a>
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={() => redeploy(selectedDeployment.id)}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  {t('deployment.redeploy')}
                </Button>
                <Button variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  {t('deployment.settings')}
                </Button>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-4 gap-4">
                <div className="p-4 border rounded-lg text-center">
                  <p className="text-sm text-muted-foreground">{t('deployment.region')}</p>
                  <p className="font-medium">{selectedDeployment.region}</p>
                </div>
                <div className="p-4 border rounded-lg text-center">
                  <p className="text-sm text-muted-foreground">{t('deployment.framework')}</p>
                  <p className="font-medium">{selectedDeployment.framework}</p>
                </div>
                <div className="p-4 border rounded-lg text-center">
                  <p className="text-sm text-muted-foreground">{t('deployment.bandwidth')}</p>
                  <p className="font-medium">{selectedDeployment.bandwidth}</p>
                </div>
                <div className="p-4 border rounded-lg text-center">
                  <p className="text-sm text-muted-foreground">{t('deployment.lastDeploy')}</p>
                  <p className="font-medium">{selectedDeployment.lastDeployed}</p>
                </div>
              </div>

              {/* Build Logs */}
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Terminal className="h-4 w-4" />
                  {t('deployment.buildLogs')}
                </h4>
                <div className="bg-gray-900 text-gray-100 rounded-lg p-4 font-mono text-sm max-h-64 overflow-y-auto">
                  {deploymentLogs.map((log, i) => (
                    <div
                      key={i}
                      className={`flex gap-2 ${
                        log.type === 'error'
                          ? 'text-red-400'
                          : log.type === 'warning'
                          ? 'text-yellow-400'
                          : log.type === 'success'
                          ? 'text-green-400'
                          : ''
                      }`}
                    >
                      <span className="text-gray-500">[{log.time}]</span>
                      <span>{log.message}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <Shield className={`h-5 w-5 ${selectedDeployment.ssl ? 'text-green-500' : 'text-gray-400'}`} />
                  <span className="text-sm">{t('deployment.sslCertificate')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className={`h-5 w-5 ${selectedDeployment.cdn ? 'text-orange-500' : 'text-gray-400'}`} />
                  <span className="text-sm">{t('deployment.cdn')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Activity className={`h-5 w-5 ${selectedDeployment.analytics ? 'text-blue-500' : 'text-gray-400'}`} />
                  <span className="text-sm">{t('deployment.analytics')}</span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* New Deployment Modal */}
      <Dialog open={showDeployModal} onOpenChange={setShowDeployModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('deployment.newDeployment')}</DialogTitle>
            <DialogDescription>
              {t('deployment.deployProduction')}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="p-4 border rounded-lg">
              <p className="font-medium mb-2">{t('deployment.readyToDeploy')}</p>
              <p className="text-sm text-muted-foreground mb-3">
                {t('deployment.projectsReady')}
              </p>
              <div className="space-y-2">
                {['Fitness Center Website', 'Auto Services Website'].map((project, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <span>{project}</span>
                    <Button size="sm">{t('deployment.deploy')}</Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeployModal(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
