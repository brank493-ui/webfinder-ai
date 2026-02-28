'use client';

import { useState } from 'react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Bell,
  Check,
  CheckCheck,
  X,
  MessageSquare,
  CreditCard,
  AlertTriangle,
  CheckCircle,
  Clock,
  Globe,
  User,
  Sparkles,
  Settings,
  Trash2,
  MoreHorizontal,
} from 'lucide-react';

interface Notification {
  id: string;
  type: 'message' | 'payment' | 'project' | 'alert' | 'system';
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'message',
    title: 'New message from TechStartup Inc.',
    description: 'They want to discuss additional features for their website.',
    timestamp: '2 minutes ago',
    read: false,
    actionUrl: '#',
    actionLabel: 'View Message',
  },
  {
    id: '2',
    type: 'payment',
    title: 'Payment received',
    description: '$399.00 payment from Restaurant Pro completed via Orange Money.',
    timestamp: '15 minutes ago',
    read: false,
    actionUrl: '#',
    actionLabel: 'View Transaction',
  },
  {
    id: '3',
    type: 'project',
    title: 'Project ready for review',
    description: 'Beauty Salon website is complete and awaiting client approval.',
    timestamp: '1 hour ago',
    read: false,
    actionUrl: '#',
    actionLabel: 'Review Project',
  },
  {
    id: '4',
    type: 'alert',
    title: 'Domain expiring soon',
    description: 'myrestaurant.net will expire in 30 days. Renew now to avoid downtime.',
    timestamp: '2 hours ago',
    read: true,
    actionUrl: '#',
    actionLabel: 'Renew Domain',
  },
  {
    id: '5',
    type: 'system',
    title: 'New template available',
    description: 'Health & Wellness Pro template has been added to the library.',
    timestamp: '3 hours ago',
    read: true,
  },
  {
    id: '6',
    type: 'message',
    title: 'New lead from website',
    description: 'A new business has requested a website quote through your landing page.',
    timestamp: '5 hours ago',
    read: true,
    actionUrl: '#',
    actionLabel: 'View Lead',
  },
  {
    id: '7',
    type: 'project',
    title: 'Project started',
    description: 'Fitness Center website development has begun.',
    timestamp: '1 day ago',
    read: true,
  },
  {
    id: '8',
    type: 'payment',
    title: 'Payment pending',
    description: 'Law Firm Elite has an outstanding balance of $499.00.',
    timestamp: '2 days ago',
    read: true,
    actionUrl: '#',
    actionLabel: 'Send Reminder',
  },
];

export function NotificationCenter() {
  const { t } = useLanguageStore();
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'message':
        return <MessageSquare className="h-5 w-5 text-blue-500" />;
      case 'payment':
        return <CreditCard className="h-5 w-5 text-green-500" />;
      case 'project':
        return <Globe className="h-5 w-5 text-purple-500" />;
      case 'alert':
        return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      case 'system':
        return <Sparkles className="h-5 w-5 text-indigo-500" />;
    }
  };

  const filteredNotifications =
    filter === 'all' ? notifications : notifications.filter((n) => !n.read);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Bell className="h-6 w-6 text-blue-600" />
            {t('notifications.title')}
          </h2>
          {unreadCount > 0 && (
            <Badge className="bg-blue-500">{unreadCount} {t('notifications.new')}</Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            {t('notifications.all')}
          </Button>
          <Button
            variant={filter === 'unread' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('unread')}
          >
            {t('notifications.unread')} ({unreadCount})
          </Button>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead}>
              <CheckCheck className="h-4 w-4 mr-1" />
              {t('notifications.markAllRead')}
            </Button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
                <Bell className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{notifications.length}</p>
                <p className="text-sm text-muted-foreground">{t('notifications.total')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {notifications.filter((n) => n.read).length}
                </p>
                <p className="text-sm text-muted-foreground">{t('notifications.read')}</p>
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
                <p className="text-2xl font-bold">{unreadCount}</p>
                <p className="text-sm text-muted-foreground">{t('notifications.unreadLabel')}</p>
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
                <p className="text-2xl font-bold">
                  {notifications.filter((n) => n.type === 'message').length}
                </p>
                <p className="text-sm text-muted-foreground">{t('notifications.messages')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notifications List */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">{t('notifications.recentNotifications')}</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px]">
            {filteredNotifications.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>{t('notifications.noNotifications')}</p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`flex items-start gap-4 p-4 rounded-lg border transition-colors ${
                      notification.read
                        ? 'bg-background'
                        : 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800'
                    }`}
                  >
                    <div className="flex-shrink-0 mt-1">
                      {getIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p
                          className={`font-medium ${
                            notification.read ? '' : 'text-blue-900 dark:text-blue-100'
                          }`}
                        >
                          {notification.title}
                        </p>
                        {!notification.read && (
                          <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {notification.description}
                      </p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs text-muted-foreground">
                          {notification.timestamp}
                        </span>
                        {notification.actionUrl && (
                          <Button
                            size="sm"
                            variant="link"
                            className="h-auto p-0 text-xs"
                          >
                            {notification.actionLabel}
                          </Button>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => markAsRead(notification.id)}
                          title={t('notifications.markAsRead')}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteNotification(notification.id)}
                        title={t('notifications.delete')}
                        className="text-muted-foreground hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Settings className="h-5 w-5" />
            {t('notifications.notificationPreferences')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { label: t('notifications.newMessages'), type: 'message', enabled: true },
              { label: t('notifications.paymentNotifications'), type: 'payment', enabled: true },
              { label: t('notifications.projectUpdates'), type: 'project', enabled: true },
              { label: t('notifications.alertsWarnings'), type: 'alert', enabled: true },
              { label: t('notifications.systemUpdates'), type: 'system', enabled: false },
            ].map((pref) => (
              <div
                key={pref.type}
                className="flex items-center justify-between py-2"
              >
                <span>{pref.label}</span>
                <Button
                  variant={pref.enabled ? 'default' : 'outline'}
                  size="sm"
                >
                  {pref.enabled ? t('notifications.enabled') : t('notifications.disabled')}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
