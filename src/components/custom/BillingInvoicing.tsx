'use client';

import { useState } from 'react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  CreditCard,
  FileText,
  Download,
  Send,
  Plus,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
  Printer,
  Mail,
  Calendar,
  Filter,
  Search,
  Loader2,
  Building,
  User,
  Globe,
} from 'lucide-react';

interface Invoice {
  id: string;
  number: string;
  client: string;
  clientEmail: string;
  project: string;
  amount: number;
  currency: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  issueDate: string;
  dueDate: string;
  paidDate?: string;
  items: InvoiceItem[];
}

interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

const mockInvoices: Invoice[] = [
  {
    id: 'inv_001',
    number: 'INV-2024-001',
    client: 'TechStartup Inc.',
    clientEmail: 'billing@techstartup.com',
    project: 'Corporate Website',
    amount: 399,
    currency: 'USD',
    status: 'paid',
    issueDate: '2024-01-15',
    dueDate: '2024-02-15',
    paidDate: '2024-01-20',
    items: [
      { description: 'Pro Package - Website Development', quantity: 1, unitPrice: 399, total: 399 },
    ],
  },
  {
    id: 'inv_002',
    number: 'INV-2024-002',
    client: 'Restaurant Pro LLC',
    clientEmail: 'accounts@restaurantpro.com',
    project: 'Restaurant Website',
    amount: 599,
    currency: 'USD',
    status: 'sent',
    issueDate: '2024-01-18',
    dueDate: '2024-02-18',
    items: [
      { description: 'Premium Package - Website Development', quantity: 1, unitPrice: 599, total: 599 },
    ],
  },
  {
    id: 'inv_003',
    number: 'INV-2024-003',
    client: 'Beauty Salon',
    clientEmail: 'info@beautysalon.com',
    project: 'Salon Website + Booking',
    amount: 749,
    currency: 'USD',
    status: 'overdue',
    issueDate: '2024-01-01',
    dueDate: '2024-01-15',
    items: [
      { description: 'Premium Package - Website Development', quantity: 1, unitPrice: 599, total: 599 },
      { description: 'Booking System Add-on', quantity: 1, unitPrice: 150, total: 150 },
    ],
  },
  {
    id: 'inv_004',
    number: 'INV-2024-004',
    client: 'Fitness Center',
    clientEmail: 'admin@fitnesscenter.com',
    project: 'Gym Website',
    amount: 399,
    currency: 'USD',
    status: 'draft',
    issueDate: '2024-01-22',
    dueDate: '2024-02-22',
    items: [
      { description: 'Pro Package - Website Development', quantity: 1, unitPrice: 399, total: 399 },
    ],
  },
];

export function BillingInvoicing() {
  const { t } = useLanguageStore();
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
  const [filter, setFilter] = useState<'all' | Invoice['status']>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewInvoiceModal, setShowNewInvoiceModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newInvoice, setNewInvoice] = useState({
    client: '',
    email: '',
    project: '',
    amount: '',
    package: 'pro',
  });

  // Calculate stats
  const totalRevenue = invoices
    .filter((i) => i.status === 'paid')
    .reduce((sum, i) => sum + i.amount, 0);
  const pendingAmount = invoices
    .filter((i) => i.status === 'sent')
    .reduce((sum, i) => sum + i.amount, 0);
  const overdueAmount = invoices
    .filter((i) => i.status === 'overdue')
    .reduce((sum, i) => sum + i.amount, 0);
  const draftCount = invoices.filter((i) => i.status === 'draft').length;

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesFilter = filter === 'all' || invoice.status === filter;
    const matchesSearch =
      !searchQuery ||
      invoice.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.project.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const createInvoice = async () => {
    setCreating(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const invoice: Invoice = {
      id: `inv_${Date.now()}`,
      number: `INV-2024-${String(invoices.length + 1).padStart(3, '0')}`,
      client: newInvoice.client,
      clientEmail: newInvoice.email,
      project: newInvoice.project,
      amount: parseInt(newInvoice.amount) || 399,
      currency: 'USD',
      status: 'draft',
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      items: [
        {
          description: `${newInvoice.package.charAt(0).toUpperCase() + newInvoice.package.slice(1)} Package - Website Development`,
          quantity: 1,
          unitPrice: parseInt(newInvoice.amount) || 399,
          total: parseInt(newInvoice.amount) || 399,
        },
      ],
    };

    setInvoices([invoice, ...invoices]);
    setCreating(false);
    setShowNewInvoiceModal(false);
    setNewInvoice({ client: '', email: '', project: '', amount: '', package: 'pro' });
  };

  const sendInvoice = (id: string) => {
    setInvoices((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: 'sent' } : i))
    );
  };

  const markAsPaid = (id: string) => {
    setInvoices((prev) =>
      prev.map((i) =>
        i.id === id
          ? { ...i, status: 'paid', paidDate: new Date().toISOString().split('T')[0] }
          : i
      )
    );
  };

  const getStatusBadge = (status: Invoice['status']) => {
    switch (status) {
      case 'draft':
        return <Badge variant="secondary">Draft</Badge>;
      case 'sent':
        return <Badge className="bg-blue-500">Sent</Badge>;
      case 'paid':
        return <Badge className="bg-green-500">Paid</Badge>;
      case 'overdue':
        return <Badge variant="destructive">Overdue</Badge>;
      case 'cancelled':
        return <Badge variant="outline">Cancelled</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <CreditCard className="h-6 w-6 text-blue-600" />
            {t('billing.title')}
          </h2>
          <p className="text-muted-foreground">
            {t('billing.subtitle')}
          </p>
        </div>
        <Dialog open={showNewInvoiceModal} onOpenChange={setShowNewInvoiceModal}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              {t('billing.newInvoice')}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('billing.createInvoice')}</DialogTitle>
              <DialogDescription>
                {t('billing.createInvoiceDesc')}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('billing.clientName')}</label>
                <Input
                  placeholder={t('billing.clientNamePlaceholder')}
                  value={newInvoice.client}
                  onChange={(e) => setNewInvoice({ ...newInvoice, client: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('billing.clientEmail')}</label>
                <Input
                  type="email"
                  placeholder={t('billing.clientEmailPlaceholder')}
                  value={newInvoice.email}
                  onChange={(e) => setNewInvoice({ ...newInvoice, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('billing.projectName')}</label>
                <Input
                  placeholder={t('billing.projectNamePlaceholder')}
                  value={newInvoice.project}
                  onChange={(e) => setNewInvoice({ ...newInvoice, project: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('billing.packageLabel')}</label>
                  <Select
                    value={newInvoice.package}
                    onValueChange={(v) => setNewInvoice({ ...newInvoice, package: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">{t('billing.standardPackage')}</SelectItem>
                      <SelectItem value="pro">{t('billing.proPackage')}</SelectItem>
                      <SelectItem value="premium">{t('billing.premiumPackage')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('billing.amountLabel')}</label>
                  <Input
                    type="number"
                    placeholder="399"
                    value={newInvoice.amount}
                    onChange={(e) => setNewInvoice({ ...newInvoice, amount: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowNewInvoiceModal(false)}>
                Cancel
              </Button>
              <Button onClick={createInvoice} disabled={creating || !newInvoice.client}>
                {creating ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <FileText className="h-4 w-4 mr-2" />
                )}
                {t('billing.createInvoice')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('billing.totalRevenue')}</p>
                <p className="text-2xl font-bold text-green-600">
                  ${totalRevenue.toLocaleString()}
                </p>
              </div>
              <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('billing.pending')}</p>
                <p className="text-2xl font-bold text-blue-600">
                  ${pendingAmount.toLocaleString()}
                </p>
              </div>
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('billing.overdue')}</p>
                <p className="text-2xl font-bold text-red-600">
                  ${overdueAmount.toLocaleString()}
                </p>
              </div>
              <div className="p-3 rounded-full bg-red-100 dark:bg-red-900">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('billing.draftInvoices')}</p>
                <p className="text-2xl font-bold">{draftCount}</p>
              </div>
              <div className="p-3 rounded-full bg-gray-100 dark:bg-gray-900">
                <FileText className="h-6 w-6 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={t('billing.searchInvoices')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-[250px]"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Select value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
            <SelectTrigger className="w-[140px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('billing.allInvoices')}</SelectItem>
              <SelectItem value="draft">{t('billing.draft')}</SelectItem>
              <SelectItem value="sent">{t('billing.sent')}</SelectItem>
              <SelectItem value="paid">{t('billing.paid')}</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Invoices List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t('billing.invoices')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredInvoices.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>{t('billing.noInvoices')}</p>
              </div>
            ) : (
              filteredInvoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-muted">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{invoice.number}</span>
                        {getStatusBadge(invoice.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {invoice.client} • {invoice.project}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                        <span>Issued: {invoice.issueDate}</span>
                        <span>Due: {invoice.dueDate}</span>
                        {invoice.paidDate && <span>Paid: {invoice.paidDate}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-bold text-lg">
                        ${invoice.amount.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">{invoice.currency}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      {invoice.status === 'draft' && (
                        <Button size="sm" onClick={() => sendInvoice(invoice.id)}>
                          <Send className="h-4 w-4 mr-1" />
                          {t('billing.send')}
                        </Button>
                      )}
                      {invoice.status === 'sent' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => markAsPaid(invoice.id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          {t('billing.markPaid')}
                        </Button>
                      )}
                      {invoice.status === 'overdue' && (
                        <>
                          <Button size="sm" variant="destructive">
                            <Mail className="h-4 w-4 mr-1" />
                            {t('billing.remind')}
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => markAsPaid(invoice.id)}>
                            {t('billing.markPaid')}
                          </Button>
                        </>
                      )}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="ghost">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Invoice {invoice.number}</DialogTitle>
                          </DialogHeader>
                          <div className="py-4">
                            {/* Invoice Preview */}
                            <div className="border rounded-lg p-6">
                              <div className="flex justify-between items-start mb-8">
                                <div>
                                  <h3 className="text-xl font-bold">WebFinder</h3>
                                  <p className="text-sm text-muted-foreground">
                                    Professional Website Services
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="font-semibold">{invoice.number}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {invoice.issueDate}
                                  </p>
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-8 mb-8">
                                <div>
                                  <p className="text-sm text-muted-foreground">{t('billing.billTo')}</p>
                                  <p className="font-medium">{invoice.client}</p>
                                  <p className="text-sm">{invoice.clientEmail}</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm text-muted-foreground">{t('billing.dueDate')}</p>
                                  <p className="font-medium">{invoice.dueDate}</p>
                                </div>
                              </div>
                              <table className="w-full mb-8">
                                <thead>
                                  <tr className="border-b">
                                    <th className="text-left py-2">{t('billing.description')}</th>
                                    <th className="text-right py-2">{t('billing.qty')}</th>
                                    <th className="text-right py-2">{t('billing.price')}</th>
                                    <th className="text-right py-2">{t('billing.total')}</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {invoice.items.map((item, i) => (
                                    <tr key={i} className="border-b">
                                      <td className="py-3">{item.description}</td>
                                      <td className="text-right">{item.quantity}</td>
                                      <td className="text-right">${item.unitPrice}</td>
                                      <td className="text-right">${item.total}</td>
                                    </tr>
                                  ))}
                                </tbody>
                                <tfoot>
                                  <tr>
                                    <td colSpan={3} className="text-right py-3 font-semibold">
                                      {t('billing.total')}
                                    </td>
                                    <td className="text-right font-bold text-lg">
                                      ${invoice.amount}
                                    </td>
                                  </tr>
                                </tfoot>
                              </table>
                              {getStatusBadge(invoice.status)}
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline">
                              <Printer className="h-4 w-4 mr-2" />
                              {t('billing.print')}
                            </Button>
                            <Button variant="outline">
                              <Download className="h-4 w-4 mr-2" />
                              {t('billing.downloadPdf')}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
