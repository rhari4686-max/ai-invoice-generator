import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Eye, 
  Trash2, 
  CheckCircle, 
  XCircle,
  Sparkles,
  Plus,
  FileText,
  Calendar,
  Mail,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';
import axiosInstance from '../../utils/axiosInstance';

const AllInvoices = () => {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [showAIModal, setShowAIModal] = useState(false);
  const [aiText, setAiText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Reminder feature states
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [reminderEmail, setReminderEmail] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isGeneratingReminder, setIsGeneratingReminder] = useState(false);

  useEffect(() => {
    fetchInvoices();
  }, []);

  useEffect(() => {
    filterInvoices();
  }, [searchTerm, statusFilter, invoices]);

  const fetchInvoices = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get('/invoices');
      const data = Array.isArray(response.data) ? response.data : [];
      setInvoices(data);
    } catch (error) {
      console.error('Error fetching invoices:', error);
      toast.error('Failed to load invoices');
      setInvoices([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filterInvoices = () => {
    if (!Array.isArray(invoices)) {
      setFilteredInvoices([]);
      return;
    }

    let filtered = [...invoices];

    if (statusFilter !== 'all') {
      filtered = filtered.filter(inv => inv.status === statusFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(inv =>
        inv.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.billTo?.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.billTo?.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredInvoices(filtered);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this invoice?')) {
      return;
    }

    try {
      await axiosInstance.delete(`/invoices/${id}`);
      toast.success('Invoice deleted successfully');
      fetchInvoices();
    } catch (error) {
      console.error('Error deleting invoice:', error);
      toast.error('Failed to delete invoice');
    }
  };

  const handleStatusUpdate = async (id, currentStatus) => {
    const newStatus = currentStatus === 'paid' ? 'unpaid' : 'paid';

    try {
      await axiosInstance.put(`/invoices/${id}`, { status: newStatus });
      toast.success(`Invoice marked as ${newStatus}`);
      fetchInvoices();
    } catch (error) {
      console.error('Error updating invoice:', error);
      toast.error('Failed to update invoice status');
    }
  };

  const handleAIGenerate = async () => {
    if (!aiText.trim()) {
      toast.error('Please enter some text to generate invoice');
      return;
    }

    setIsGenerating(true);

    try {
      const response = await axiosInstance.post('/ai/parse-text', {
        text: aiText
      });
      
      toast.success('Invoice generated successfully!');
      setShowAIModal(false);
      setAiText('');
      
      if (response.data._id) {
        navigate(`/invoices/${response.data._id}`);
      } else {
        fetchInvoices();
      }
    } catch (error) {
      console.error('Error generating invoice:', error);
      toast.error(error.response?.data?.message || 'Failed to generate invoice');
    } finally {
      setIsGenerating(false);
    }
  };

  // Generate AI Reminder
  const handleGenerateReminder = async (invoice) => {
    setSelectedInvoice(invoice);
    setIsGeneratingReminder(true);
    setShowReminderModal(true);
    setReminderEmail('');

    try {
      const response = await axiosInstance.post(`/ai/reminder/${invoice._id}`);
      setReminderEmail(response.data.reminderEmail || 'Failed to generate email');
      toast.success('Reminder email generated!');
    } catch (error) {
      console.error('Error generating reminder:', error);
      toast.error('Failed to generate reminder email');
      setReminderEmail('Failed to generate reminder email. Please try again.');
    } finally {
      setIsGeneratingReminder(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(reminderEmail);
    toast.success('Email copied to clipboard!');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    try {
      return new Date(date).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">All Invoices</h1>
          <p className="text-slate-600 mt-1">Manage and track all your invoices</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowAIModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors shadow-sm"
          >
            <Sparkles className="w-5 h-5" />
            Create with AI
          </button>
          <Link
            to="/invoices/new"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-sm"
          >
            <Plus className="w-5 h-5" />
            New Invoice
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by invoice number, client name, or email..."
            className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="pl-10 pr-10 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white cursor-pointer min-w-[150px]"
          >
            <option value="all">All Status</option>
            <option value="paid">Paid</option>
            <option value="unpaid">Unpaid</option>
          </select>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredInvoices.length === 0 ? (
          <div className="text-center py-16">
            <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-700 mb-2">
              {searchTerm || statusFilter !== 'all' ? 'No invoices found' : 'No invoices yet'}
            </h3>
            <p className="text-slate-500 mb-6">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filters' 
                : 'Create your first invoice to get started'}
            </p>
            {!searchTerm && statusFilter === 'all' && (
              <Link
                to="/invoices/new"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-sm"
              >
                <Plus className="w-5 h-5" />
                Create Invoice
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-slate-700 uppercase tracking-wider">Invoice #</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-slate-700 uppercase tracking-wider">Client</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-slate-700 uppercase tracking-wider">Date</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-slate-700 uppercase tracking-wider">Due Date</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-slate-700 uppercase tracking-wider">Amount</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-slate-700 uppercase tracking-wider">Status</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-slate-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice._id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-6 text-sm font-medium text-slate-800">
                      {invoice.invoiceNumber}
                    </td>
                    <td className="py-4 px-6 text-sm">
                      <div>
                        <div className="font-medium text-slate-800">
                          {invoice.billTo?.clientName || 'N/A'}
                        </div>
                        <div className="text-slate-500 text-xs mt-0.5">
                          {invoice.billTo?.email || ''}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-slate-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        {formatDate(invoice.invoiceDate)}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-slate-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        {formatDate(invoice.dueDate)}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm font-semibold text-slate-800">
                      {formatCurrency(invoice.total)}
                    </td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => handleStatusUpdate(invoice._id, invoice.status)}
                        className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                          invoice.status === 'paid'
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                        }`}
                      >
                        {invoice.status === 'paid' ? (
                          <>
                            <CheckCircle className="w-3.5 h-3.5" />
                            Paid
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3.5 h-3.5" />
                            Unpaid
                          </>
                        )}
                      </button>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/invoices/${invoice._id}`}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        
                        {/* Reminder button - only for unpaid invoices */}
                        {invoice.status === 'unpaid' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleGenerateReminder(invoice);
                            }}
                            className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                            title="Generate Payment Reminder"
                          >
                            <Mail className="w-4 h-4" />
                          </button>
                        )}
                        
                        <button
                          onClick={() => handleDelete(invoice._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* AI Generate Invoice Modal */}
      {showAIModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Create Invoice with AI</h2>
                <p className="text-slate-600 text-sm mt-1">Paste email or text, and AI will generate the invoice</p>
              </div>
            </div>

            <textarea
              value={aiText}
              onChange={(e) => setAiText(e.target.value)}
              rows="10"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent mb-4 resize-none"
              placeholder="Example: Create invoice for Rahul Sharma at rahul@tech.com for 10 hours of web development at ₹5000/hour"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowAIModal(false);
                  setAiText('');
                }}
                className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAIGenerate}
                disabled={isGenerating || !aiText.trim()}
                className="flex items-center gap-2 px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate Invoice
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Reminder Email Modal */}
      {showReminderModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">AI-Generated Reminder</h2>
                  <p className="text-slate-600 text-sm mt-1">
                    {selectedInvoice ? `Invoice ${selectedInvoice.invoiceNumber}` : 'Payment Reminder'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowReminderModal(false);
                  setReminderEmail('');
                  setSelectedInvoice(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {isGeneratingReminder ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-gray-600">Generating professional reminder email...</p>
              </div>
            ) : (
              <>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-gray-700">Subject: Payment Reminder - {selectedInvoice?.invoiceNumber}</span>
                    <button
                      onClick={copyToClipboard}
                      className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Copy Email
                    </button>
                  </div>
                  <div className="bg-white border border-gray-300 rounded p-4 max-h-96 overflow-y-auto">
                    <pre className="text-sm text-gray-800 whitespace-pre-wrap font-sans leading-relaxed">
                      {reminderEmail}
                    </pre>
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => {
                      setShowReminderModal(false);
                      setReminderEmail('');
                      setSelectedInvoice(null);
                    }}
                    className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-medium transition-colors"
                  >
                    Close
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AllInvoices;
