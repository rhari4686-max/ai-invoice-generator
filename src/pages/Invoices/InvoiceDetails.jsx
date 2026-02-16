import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Download, 
  Printer, 
  Trash2, 
  CheckCircle, 
  XCircle,
  Mail,
  Calendar,
  Building2,
  User,
  FileText
} from 'lucide-react';
import toast from 'react-hot-toast';
import axiosInstance from '../../utils/axiosInstance';

const InvoiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [invoice, setInvoice] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Fetch invoice details
  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get(`/invoices/${id}`);
        setInvoice(response.data);
      } catch (error) {
        console.error('Error fetching invoice:', error);
        toast.error('Failed to load invoice');
        navigate('/invoices');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchInvoice();
    }
  }, [id, navigate]);

  // Format date to Indian format (DD-MMM-YYYY)
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleString('en-US', { month: 'short' });
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Format currency to Indian Rupees
  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined) return '₹0.00';
    return `₹${Number(amount).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  // Update invoice status
  const handleStatusUpdate = async (newStatus) => {
    try {
      setIsUpdatingStatus(true);
      await axiosInstance.put(`/invoices/${id}`, { status: newStatus });
      setInvoice({ ...invoice, status: newStatus });
      toast.success(`Invoice marked as ${newStatus}`);
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Delete invoice
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this invoice?')) {
      return;
    }

    try {
      await axiosInstance.delete(`/invoices/${id}`);
      toast.success('Invoice deleted successfully');
      navigate('/invoices');
    } catch (error) {
      console.error('Error deleting invoice:', error);
      toast.error('Failed to delete invoice');
    }
  };

  // Print invoice
  const handlePrint = () => {
    window.print();
  };

  // Download as PDF - FIXED VERSION
  const handleDownload = () => {
    // Set document title for PDF filename
    const originalTitle = document.title;
    document.title = `Invoice_${invoice.invoiceNumber}`;
    
    // Show instruction toast
    toast.success('Opening print dialog - Select "Save as PDF" as destination', {
      duration: 4000,
    });
    
    // Open print dialog after short delay
    setTimeout(() => {
      window.print();
      // Restore original title after print dialog closes
      setTimeout(() => {
        document.title = originalTitle;
      }, 1000);
    }, 500);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading invoice...</p>
        </div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <FileText size={48} className="text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Invoice Not Found</h2>
          <button
            onClick={() => navigate('/invoices')}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Invoices
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Action Bar - Hide on Print */}
      <div className="bg-white border-b border-gray-200 print:hidden">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/invoices')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Back to Invoices</span>
            </button>

            <div className="flex items-center gap-3">
              {/* Status Toggle */}
              {invoice.status === 'unpaid' ? (
                <button
                  onClick={() => handleStatusUpdate('paid')}
                  disabled={isUpdatingStatus}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors"
                >
                  <CheckCircle size={16} />
                  Mark as Paid
                </button>
              ) : (
                <button
                  onClick={() => handleStatusUpdate('unpaid')}
                  disabled={isUpdatingStatus}
                  className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:bg-gray-400 transition-colors"
                >
                  <XCircle size={16} />
                  Mark as Unpaid
                </button>
              )}

              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Printer size={16} />
                Print
              </button>

              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Download size={16} />
                Download
              </button>

              <button
                onClick={handleDelete}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <Trash2 size={16} />
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Document */}
      <div className="max-w-4xl mx-auto p-6 print:p-0">
        <div className="bg-white rounded-lg shadow-lg print:shadow-none">
          
          {/* Invoice Header */}
          <div className="p-8 border-b-2 border-gray-200">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">INVOICE</h1>
                <div className="flex items-center gap-2 text-gray-600">
                  <FileText size={16} />
                  <span className="font-medium">{invoice.invoiceNumber}</span>
                </div>
              </div>

              {/* Status Badge */}
              <div className={`px-4 py-2 rounded-full font-semibold text-sm ${
                invoice.status === 'paid'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-orange-100 text-orange-800'
              }`}>
                {invoice.status === 'paid' ? '✓ PAID' : '● UNPAID'}
              </div>
            </div>

            {/* Invoice Dates */}
            <div className="mt-6 flex gap-8 text-sm">
              <div>
                <p className="text-gray-600 mb-1">Invoice Date</p>
                <div className="flex items-center gap-2 font-medium text-gray-900">
                  <Calendar size={16} />
                  {formatDate(invoice.invoiceDate)}
                </div>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Due Date</p>
                <div className="flex items-center gap-2 font-medium text-gray-900">
                  <Calendar size={16} />
                  {formatDate(invoice.dueDate)}
                </div>
              </div>
            </div>
          </div>

          {/* Bill From & Bill To */}
          <div className="p-8 grid grid-cols-2 gap-8 border-b border-gray-200">
            
            {/* Bill From */}
            <div>
              <div className="flex items-center gap-2 text-blue-600 mb-3">
                <Building2 size={20} />
                <h2 className="font-semibold text-lg">From</h2>
              </div>
              <div className="text-gray-800">
                <p className="font-bold text-lg mb-2">
                  {invoice.billFrom?.businessName || 'N/A'}
                </p>
                {invoice.billFrom?.email && (
                  <p className="flex items-center gap-2 text-sm mb-1">
                    <Mail size={14} />
                    {invoice.billFrom.email}
                  </p>
                )}
                {invoice.billFrom?.phone && (
                  <p className="text-sm mb-1">{invoice.billFrom.phone}</p>
                )}
                {invoice.billFrom?.address && (
                  <p className="text-sm text-gray-600 mt-2">
                    {invoice.billFrom.address}
                  </p>
                )}
              </div>
            </div>

            {/* Bill To */}
            <div>
              <div className="flex items-center gap-2 text-green-600 mb-3">
                <User size={20} />
                <h2 className="font-semibold text-lg">To</h2>
              </div>
              <div className="text-gray-800">
                <p className="font-bold text-lg mb-2">
                  {invoice.billTo?.clientName || 'N/A'}
                </p>
                {invoice.billTo?.email && (
                  <p className="flex items-center gap-2 text-sm mb-1">
                    <Mail size={14} />
                    {invoice.billTo.email}
                  </p>
                )}
                {invoice.billTo?.phone && (
                  <p className="text-sm mb-1">{invoice.billTo.phone}</p>
                )}
                {invoice.billTo?.address && (
                  <p className="text-sm text-gray-600 mt-2">
                    {invoice.billTo.address}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="p-8">
            <h2 className="font-semibold text-lg text-gray-900 mb-4">Invoice Items</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-300">
                    <th className="text-left py-3 px-2 font-semibold text-gray-700">Description</th>
                    <th className="text-center py-3 px-2 font-semibold text-gray-700 w-20">Qty</th>
                    <th className="text-right py-3 px-2 font-semibold text-gray-700 w-32">Price</th>
                    <th className="text-right py-3 px-2 font-semibold text-gray-700 w-24">Tax</th>
                    <th className="text-right py-3 px-2 font-semibold text-gray-700 w-32">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items && invoice.items.length > 0 ? (
                    invoice.items.map((item, index) => (
                      <tr key={index} className="border-b border-gray-200">
                        <td className="py-3 px-2 text-gray-800">{item.name || item.description}</td>
                        <td className="py-3 px-2 text-center text-gray-800">{item.quantity}</td>
                        <td className="py-3 px-2 text-right text-gray-800">
                          {formatCurrency(item.unitPrice || item.price)}
                        </td>
                        <td className="py-3 px-2 text-right text-gray-600">
                          {item.taxPercent || item.tax || 0}%
                        </td>
                        <td className="py-3 px-2 text-right font-medium text-gray-900">
                          {formatCurrency(item.total)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="py-6 text-center text-gray-500">
                        No items found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="mt-6 ml-auto max-w-xs">
              <div className="space-y-2">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal:</span>
                  <span className="font-medium">{formatCurrency(invoice.subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Tax:</span>
                  <span className="font-medium">{formatCurrency(invoice.taxTotal)}</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t-2 border-gray-300">
                  <span>Total:</span>
                  <span>{formatCurrency(invoice.total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Notes Section */}
          {invoice.notes && (
            <div className="p-8 bg-gray-50 border-t border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">Additional Notes</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{invoice.notes}</p>
            </div>
          )}

          {/* Footer */}
          <div className="p-8 border-t border-gray-200 text-center text-sm text-gray-600">
            <p>Thank you for your business!</p>
            {invoice.paymentTerms && (
              <p className="mt-1">Payment Terms: {invoice.paymentTerms}</p>
            )}
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx>{`
        @media print {
          @page {
            margin: 0.5in;
          }
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
        }
      `}</style>
    </div>
  );
};

export default InvoiceDetails;
