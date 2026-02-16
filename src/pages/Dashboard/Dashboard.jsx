import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  DollarSign, 
  CheckCircle,
  XCircle,
  Plus,
  Calendar,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import axiosInstance from '../../utils/axiosInstance';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalInvoices: 0,
    paidInvoices: 0,
    unpaidInvoices: 0,
    totalRevenue: 0
  });
  const [recentInvoices, setRecentInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [insightsLoading, setInsightsLoading] = useState(false);
  const [aiInsights, setAiInsights] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/invoices');
      
      // ✅ FIX: Handle both response formats
      const invoices = Array.isArray(response.data) 
        ? response.data 
        : (Array.isArray(response.data.data) ? response.data.data : []);

      // Calculate stats
      const total = invoices.length;
      const paid = invoices.filter(inv => inv.status === 'paid').length;
      const unpaid = invoices.filter(inv => inv.status === 'unpaid').length;
      const revenue = invoices
        .filter(inv => inv.status === 'paid')
        .reduce((sum, inv) => sum + (inv.total || 0), 0);

      setStats({
        totalInvoices: total,
        paidInvoices: paid,
        unpaidInvoices: unpaid,
        totalRevenue: revenue
      });

      // Get recent 5 invoices
      const recent = invoices
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);
      setRecentInvoices(recent);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const generateAIInsights = async () => {
    try {
      setInsightsLoading(true);
      const response = await axiosInstance.get('/ai/insights');
      setAiInsights(response.data.insights || 'No insights available.');
      toast.success('AI insights generated!');
    } catch (error) {
      console.error('Error generating insights:', error);
      toast.error('Failed to generate insights');
    } finally {
      setInsightsLoading(false);
    }
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
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, '0');
    const month = d.toLocaleString('en-US', { month: 'short' });
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Stats Cards - AT THE TOP */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Invoices</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalInvoices}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Paid</p>
              <p className="text-3xl font-bold text-green-600">{stats.paidInvoices}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Unpaid</p>
              <p className="text-3xl font-bold text-orange-600">{stats.unpaidInvoices}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <XCircle className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-600 mb-1">Total Revenue</p>
              <p className="text-2xl font-bold text-blue-600 truncate">{formatCurrency(stats.totalRevenue)}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center ml-3">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions - RIGHT BELOW CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={() => navigate('/invoices/new')}
          className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg p-6 hover:from-blue-700 hover:to-blue-800 transition-all shadow-sm hover:shadow-md text-left"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <Plus className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">Create New Invoice</h3>
              <p className="text-blue-100 text-sm">Generate a new invoice for your client</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => navigate('/invoices')}
          className="bg-white border border-gray-200 text-gray-900 rounded-lg p-6 hover:border-blue-600 hover:bg-blue-50 transition-all shadow-sm hover:shadow-md text-left"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">Manage Invoices</h3>
              <p className="text-gray-600 text-sm">View and manage all your invoices</p>
            </div>
          </div>
        </button>
      </div>

      {/* AI Insights Section */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <h2 className="text-lg font-bold text-gray-900">AI Insights</h2>
          </div>
          <button
            onClick={generateAIInsights}
            disabled={insightsLoading || stats.totalInvoices === 0}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm font-medium"
          >
            {insightsLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Generate Insights
              </>
            )}
          </button>
        </div>

        {aiInsights ? (
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <p className="text-gray-700 whitespace-pre-line leading-relaxed">{aiInsights}</p>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            {stats.totalInvoices === 0 ? (
              <p>Create some invoices to get AI-powered insights about your business!</p>
            ) : (
              <p>Click "Generate Insights" to get AI-powered analysis of your invoices</p>
            )}
          </div>
        )}
      </div>

      {/* Recent Invoices */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Recent Invoices</h2>
          <button
            onClick={() => navigate('/invoices')}
            className="text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            View All
          </button>
        </div>

        {recentInvoices.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No invoices yet</h3>
            <p className="text-gray-500 mb-6">Get started by creating your first invoice</p>
            <button
              onClick={() => navigate('/invoices/new')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <Plus className="w-5 h-5" />
              Create Invoice
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Invoice #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {recentInvoices.map((invoice) => (
                  <tr 
                    key={invoice._id}
                    onClick={() => navigate(`/invoices/${invoice._id}`)}
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {invoice.invoiceNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {invoice.billTo?.clientName || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {formatDate(invoice.invoiceDate)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      {formatCurrency(invoice.total)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {invoice.status === 'paid' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <CheckCircle className="w-3.5 h-3.5" />
                          Paid
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                          <AlertCircle className="w-3.5 h-3.5" />
                          Unpaid
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
