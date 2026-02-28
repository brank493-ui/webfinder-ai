'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  FileText,
  Download,
  Edit3,
  Plus,
  Trash2,
  Save,
  Send,
  Printer,
  Copy,
  Check,
} from 'lucide-react';
import { useLanguageStore } from '@/store/useLanguageStore';

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface InvoiceData {
  invoiceNumber: string;
  date: string;
  dueDate: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientAddress: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  notes: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
}

const USD_TO_CFA = 612; // Exchange rate

export function InvoiceGenerator() {
  const { t } = useLanguageStore();
  const [isEditing, setIsEditing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [copied, setCopied] = useState(false);

  const [invoice, setInvoice] = useState<InvoiceData>({
    invoiceNumber: `INV-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
    date: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    clientAddress: '',
    items: [
      { id: '1', description: 'Website Development - Pro Package', quantity: 1, unitPrice: 399, total: 399 },
    ],
    subtotal: 399,
    tax: 0,
    total: 399,
    notes: 'Thank you for choosing WebFinder AI!\n\nPayment can be made via Mobile Money (MTN/Orange) or bank transfer.\n\nContact: +237 693 401 619',
    status: 'draft',
  });

  const updateInvoice = (field: keyof InvoiceData, value: any) => {
    setInvoice(prev => ({ ...prev, [field]: value }));
  };

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: String(Date.now()),
      description: '',
      quantity: 1,
      unitPrice: 0,
      total: 0,
    };
    setInvoice(prev => ({
      ...prev,
      items: [...prev.items, newItem],
    }));
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    setInvoice(prev => {
      const items = prev.items.map(item => {
        if (item.id === id) {
          const updated = { ...item, [field]: value };
          updated.total = updated.quantity * updated.unitPrice;
          return updated;
        }
        return item;
      });
      const subtotal = items.reduce((sum, item) => sum + item.total, 0);
      return { ...prev, items, subtotal, total: subtotal + prev.tax };
    });
  };

  const removeItem = (id: string) => {
    setInvoice(prev => {
      const items = prev.items.filter(item => item.id !== id);
      const subtotal = items.reduce((sum, item) => sum + item.total, 0);
      return { ...prev, items, subtotal, total: subtotal + prev.tax };
    });
  };

  const formatCurrency = (amount: number, showCFA = true) => {
    const usd = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
    
    if (showCFA) {
      const cfa = Math.round(amount * USD_TO_CFA);
      return `${usd} (≈ ${cfa.toLocaleString()} CFA)`;
    }
    return usd;
  };

  const downloadInvoice = () => {
    const invoiceHTML = generateInvoiceHTML();
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(invoiceHTML);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const copyInvoiceLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/invoice/${invoice.invoiceNumber}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const generateInvoiceHTML = () => {
    return `
<!DOCTYPE html>
<html>
<head>
  <title>Invoice ${invoice.invoiceNumber}</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; }
    .header { display: flex; justify-content: space-between; align-items: start; margin-bottom: 40px; }
    .logo { font-size: 24px; font-weight: bold; color: #2563eb; }
    .invoice-info { text-align: right; }
    .invoice-title { font-size: 28px; color: #333; margin-bottom: 10px; }
    .status { padding: 5px 15px; border-radius: 20px; font-size: 14px; text-transform: uppercase; }
    .status-draft { background: #f3f4f6; color: #6b7280; }
    .status-sent { background: #dbeafe; color: #2563eb; }
    .status-paid { background: #dcfce7; color: #16a34a; }
    .parties { display: flex; justify-content: space-between; margin-bottom: 40px; }
    .party { width: 45%; }
    .party-label { font-size: 12px; color: #6b7280; text-transform: uppercase; margin-bottom: 5px; }
    .party-content { font-size: 14px; line-height: 1.6; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
    th { text-align: left; padding: 15px; background: #f9fafb; border-bottom: 2px solid #e5e7eb; }
    td { padding: 15px; border-bottom: 1px solid #e5e7eb; }
    .totals { margin-left: auto; width: 300px; }
    .totals-row { display: flex; justify-content: space-between; padding: 10px 0; }
    .totals-row.total { font-size: 20px; font-weight: bold; border-top: 2px solid #e5e7eb; padding-top: 15px; }
    .notes { background: #f9fafb; padding: 20px; border-radius: 8px; margin-top: 30px; }
    .notes-title { font-weight: bold; margin-bottom: 10px; }
    .footer { margin-top: 50px; text-align: center; color: #6b7280; font-size: 12px; }
    .footer a { color: #2563eb; text-decoration: none; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="logo">🌐 WebFinder AI</div>
      <p style="color: #6b7280; margin-top: 5px;">Professional Website Development</p>
    </div>
    <div class="invoice-info">
      <div class="invoice-title">INVOICE</div>
      <div class="status status-${invoice.status}">${invoice.status}</div>
      <p style="margin-top: 15px; color: #6b7280;">
        <strong>Invoice #:</strong> ${invoice.invoiceNumber}<br>
        <strong>Date:</strong> ${invoice.date}<br>
        <strong>Due:</strong> ${invoice.dueDate}
      </p>
    </div>
  </div>

  <div class="parties">
    <div class="party">
      <div class="party-label">From</div>
      <div class="party-content">
        <strong>WebFinder AI</strong><br>
        Cameroon, West Africa<br>
        brank493@gmail.com<br>
        +237 693 401 619
      </div>
    </div>
    <div class="party">
      <div class="party-label">Bill To</div>
      <div class="party-content">
        <strong>${invoice.clientName || 'Client Name'}</strong><br>
        ${invoice.clientEmail}<br>
        ${invoice.clientPhone}<br>
        ${invoice.clientAddress}
      </div>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Description</th>
        <th>Qty</th>
        <th>Unit Price</th>
        <th>Total</th>
      </tr>
    </thead>
    <tbody>
      ${invoice.items.map(item => `
        <tr>
          <td>${item.description}</td>
          <td>${item.quantity}</td>
          <td>${formatCurrency(item.unitPrice, false)}</td>
          <td>${formatCurrency(item.total, false)}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <div class="totals">
    <div class="totals-row">
      <span>Subtotal:</span>
      <span>${formatCurrency(invoice.subtotal, false)}</span>
    </div>
    ${invoice.tax > 0 ? `
    <div class="totals-row">
      <span>Tax:</span>
      <span>${formatCurrency(invoice.tax, false)}</span>
    </div>
    ` : ''}
    <div class="totals-row total">
      <span>Total:</span>
      <span>${formatCurrency(invoice.total)}</span>
    </div>
  </div>

  ${invoice.notes ? `
  <div class="notes">
    <div class="notes-title">Notes</div>
    <p style="white-space: pre-line;">${invoice.notes}</p>
  </div>
  ` : ''}

  <div class="footer">
    <p>Thank you for your business!</p>
    <p>
      WebFinder AI | brank493@gmail.com | +237 693 401 619<br>
      <a href="https://webfinder-ai.vercel.app">webfinder-ai.vercel.app</a>
    </p>
  </div>
</body>
</html>
    `;
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
            <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
            Invoice Generator
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">Create and send professional invoices</p>
        </div>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <Button variant="outline" onClick={() => setIsEditing(!isEditing)} className="flex-1 sm:flex-none text-xs sm:text-sm h-9 sm:h-10">
            <Edit3 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            {isEditing ? 'Preview' : 'Edit'}
          </Button>
          <Button onClick={downloadInvoice} className="flex-1 sm:flex-none text-xs sm:text-sm h-9 sm:h-10">
            <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            Download
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Invoice Form */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* Invoice Details */}
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-base sm:text-lg">Invoice Details</CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div>
                  <Label className="text-xs sm:text-sm">Invoice Number</Label>
                  <Input
                    value={invoice.invoiceNumber}
                    onChange={(e) => updateInvoice('invoiceNumber', e.target.value)}
                    disabled={!isEditing}
                    className="h-9 sm:h-10 text-xs sm:text-sm"
                  />
                </div>
                <div>
                  <Label className="text-xs sm:text-sm">Date</Label>
                  <Input
                    type="date"
                    value={invoice.date}
                    onChange={(e) => updateInvoice('date', e.target.value)}
                    disabled={!isEditing}
                    className="h-9 sm:h-10 text-xs sm:text-sm"
                  />
                </div>
                <div>
                  <Label className="text-xs sm:text-sm">Due Date</Label>
                  <Input
                    type="date"
                    value={invoice.dueDate}
                    onChange={(e) => updateInvoice('dueDate', e.target.value)}
                    disabled={!isEditing}
                    className="h-9 sm:h-10 text-xs sm:text-sm"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Client Information */}
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-base sm:text-lg">Client Information</CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <Label className="text-xs sm:text-sm">Client Name</Label>
                  <Input
                    value={invoice.clientName}
                    onChange={(e) => updateInvoice('clientName', e.target.value)}
                    placeholder="John Doe"
                    disabled={!isEditing}
                    className="h-9 sm:h-10 text-xs sm:text-sm"
                  />
                </div>
                <div>
                  <Label className="text-xs sm:text-sm">Email</Label>
                  <Input
                    type="email"
                    value={invoice.clientEmail}
                    onChange={(e) => updateInvoice('clientEmail', e.target.value)}
                    placeholder="client@example.com"
                    disabled={!isEditing}
                    className="h-9 sm:h-10 text-xs sm:text-sm"
                  />
                </div>
                <div>
                  <Label className="text-xs sm:text-sm">Phone</Label>
                  <Input
                    value={invoice.clientPhone}
                    onChange={(e) => updateInvoice('clientPhone', e.target.value)}
                    placeholder="+237 6XX XXX XXX"
                    disabled={!isEditing}
                    className="h-9 sm:h-10 text-xs sm:text-sm"
                  />
                </div>
                <div>
                  <Label className="text-xs sm:text-sm">Address</Label>
                  <Input
                    value={invoice.clientAddress}
                    onChange={(e) => updateInvoice('clientAddress', e.target.value)}
                    placeholder="City, Country"
                    disabled={!isEditing}
                    className="h-9 sm:h-10 text-xs sm:text-sm"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Invoice Items */}
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base sm:text-lg">Items</CardTitle>
                {isEditing && (
                  <Button size="sm" onClick={addItem} className="text-xs sm:text-sm h-8 sm:h-9">
                    <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    Add Item
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0 space-y-4">
              {invoice.items.map((item, index) => (
                <div key={item.id} className="space-y-3">
                  {index > 0 && <Separator />}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-4 items-end">
                    <div className="sm:col-span-6">
                      <Label className="text-xs sm:text-sm">Description</Label>
                      <Input
                        value={item.description}
                        onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                        placeholder="Item description"
                        disabled={!isEditing}
                        className="h-9 sm:h-10 text-xs sm:text-sm"
                      />
                    </div>
                    <div className="grid grid-cols-3 sm:col-span-5 gap-2">
                      <div>
                        <Label className="text-xs sm:text-sm">Qty</Label>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                          disabled={!isEditing}
                          className="h-9 sm:h-10 text-xs sm:text-sm"
                        />
                      </div>
                      <div>
                        <Label className="text-xs sm:text-sm">Price ($)</Label>
                        <Input
                          type="number"
                          value={item.unitPrice}
                          onChange={(e) => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                          disabled={!isEditing}
                          className="h-9 sm:h-10 text-xs sm:text-sm"
                        />
                      </div>
                      <div>
                        <Label className="text-xs sm:text-sm">Total</Label>
                        <Input
                          value={`$${item.total}`}
                          disabled
                          className="h-9 sm:h-10 text-xs sm:text-sm bg-muted"
                        />
                      </div>
                    </div>
                    {isEditing && invoice.items.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 hover:text-red-700 h-9 w-9 sm:h-10 sm:w-10"
                      >
                        <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-base sm:text-lg">Notes</CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <Textarea
                value={invoice.notes}
                onChange={(e) => updateInvoice('notes', e.target.value)}
                placeholder="Add any additional notes..."
                disabled={!isEditing}
                rows={4}
                className="text-xs sm:text-sm"
              />
            </CardContent>
          </Card>
        </div>

        {/* Invoice Summary */}
        <div className="space-y-4 sm:space-y-6">
          <Card className="sticky top-4">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-base sm:text-lg">Summary</CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0 space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between text-xs sm:text-sm">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(invoice.subtotal)}</span>
                </div>
                {invoice.tax > 0 && (
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span>Tax:</span>
                    <span>{formatCurrency(invoice.tax)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between text-base sm:text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-blue-600">{formatCurrency(invoice.total)}</span>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label className="text-xs sm:text-sm">Status</Label>
                <div className="flex gap-2 flex-wrap">
                  {['draft', 'sent', 'paid'].map((status) => (
                    <Badge
                      key={status}
                      variant={invoice.status === status ? 'default' : 'outline'}
                      className={`cursor-pointer capitalize text-xs ${
                        invoice.status === status ? 'bg-blue-600' : ''
                      }`}
                      onClick={() => isEditing && updateInvoice('status', status)}
                    >
                      {status}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Button className="w-full text-xs sm:text-sm h-9 sm:h-10" onClick={downloadInvoice}>
                  <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  Download PDF
                </Button>
                <Button variant="outline" className="w-full text-xs sm:text-sm h-9 sm:h-10" onClick={copyInvoiceLink}>
                  {copied ? (
                    <>
                      <Check className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                      Link Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                      Copy Share Link
                    </>
                  )}
                </Button>
                <Button variant="outline" className="w-full text-xs sm:text-sm h-9 sm:h-10">
                  <Send className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  Send to Client
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
