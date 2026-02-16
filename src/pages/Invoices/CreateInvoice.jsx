import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2, Save, Building2, User, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../utils/axiosInstance";

const CreateInvoice = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [aiText, setAiText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const [formData, setFormData] = useState({
    invoiceNumber: "",
    invoiceDate: new Date().toISOString().split("T")[0],
    dueDate: "",

    billFrom: {
      name: "",
      address: "",
      phone: "",
      email: "",
    },

    billTo: {
      name: "",
      address: "",
      phone: "",
      email: "",
    },

    items: [
      {
        description: "",
        quantity: 1,
        price: "",
        tax: 0,
        total: 0,
      },
    ],

    notes: "",
  });

  /* =============================
     Auto Generate Invoice Number
     ============================= */
  useEffect(() => {
    const ts = Date.now().toString().slice(-6);
    const rnd = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0");

    setFormData((prev) => ({
      ...prev,
      invoiceNumber: `INV-${ts}${rnd}`,
    }));
  }, []);

  /* =============================
     Auto Fill Bill From
     ============================= */
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        billFrom: {
          name: user.businessName || "",
          address: user.businessAddress || "",
          phone: user.businessPhone || "",
          email: user.email || "",
        },
      }));
    }
  }, [user]);

  /* =============================
     AI Generate Handler
     ============================= */
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
      
      // Navigate to the newly created invoice
      if (response.data._id) {
        navigate(`/invoices/${response.data._id}`);
      }
    } catch (error) {
      console.error('Error generating invoice:', error);
      toast.error(error.response?.data?.message || 'Failed to generate invoice');
    } finally {
      setIsGenerating(false);
    }
  };

  /* =============================
     Handlers
     ============================= */

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBillFromChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      billFrom: {
        ...prev.billFrom,
        [name]: value,
      },
    }));
  };

  const handleBillToChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      billTo: {
        ...prev.billTo,
        [name]: value,
      },
    }));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];

    newItems[index][field] = value;

    const qty = Number(newItems[index].quantity) || 0;
    const price = Number(newItems[index].price) || 0;
    const tax = Number(newItems[index].tax) || 0;

    const subtotal = qty * price;
    const taxAmt = subtotal * (tax / 100);

    newItems[index].total = subtotal + taxAmt;

    setFormData((prev) => ({
      ...prev,
      items: newItems,
    }));
  };

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          description: "",
          quantity: 1,
          price: "",
          tax: 0,
          total: 0,
        },
      ],
    }));
  };

  const removeItem = (index) => {
    if (formData.items.length === 1) {
      toast.error("At least one item required");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  /* =============================
     Calculate Totals
     ============================= */
  const calculateTotals = () => {
    let subtotal = 0;
    let taxTotal = 0;

    formData.items.forEach((item) => {
      const qty = Number(item.quantity) || 0;
      const price = Number(item.price) || 0;
      const tax = Number(item.tax) || 0;

      const sub = qty * price;
      const taxAmt = sub * (tax / 100);

      subtotal += sub;
      taxTotal += taxAmt;
    });

    return {
      subtotal,
      taxTotal,
      total: subtotal + taxTotal,
    };
  };

  /* =============================
     SUBMIT (FINAL FIXED)
     ============================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.invoiceNumber || !formData.dueDate) {
      toast.error("Fill invoice details");
      return;
    }

    if (!formData.billTo.name || !formData.billTo.email) {
      toast.error("Fill client details");
      return;
    }

    for (let item of formData.items) {
      if (!item.description || item.price === "") {
        toast.error("Fill all item fields");
        return;
      }
    }

    setIsLoading(true);

    try {
      const { subtotal, taxTotal, total } = calculateTotals();

      // Map items → backend format
      const formattedItems = formData.items.map((item) => ({
        name: item.description.trim(),
        quantity: Number(item.quantity),
        unitPrice: Number(item.price),
        taxPercent: Number(item.tax) || 0,
        total: Number(item.total),
      }));

      const invoiceData = {
        invoiceNumber: formData.invoiceNumber,
        invoiceDate: formData.invoiceDate,
        dueDate: formData.dueDate,

        billFrom: {
          businessName: formData.billFrom.name || "",
          email: formData.billFrom.email || "",
          address: formData.billFrom.address || "",
          phone: formData.billFrom.phone || "",
        },

        billTo: {
          clientName: formData.billTo.name,
          email: formData.billTo.email,
          address: formData.billTo.address || "",
          phone: formData.billTo.phone || "",
        },

        items: formattedItems,

        notes: formData.notes || "",
        paymentTerms: "Net 15",

        subtotal: Number(subtotal),
        taxTotal: Number(taxTotal),
        total: Number(total),
      };

      // Debug
      console.log("SENDING INVOICE:", invoiceData);

      await axiosInstance.post("/invoices", invoiceData);

      toast.success("Invoice created!");
      navigate("/invoices");

    } catch (err) {
      console.error(err);

      toast.error(
        err.response?.data?.message || "Invoice failed"
      );

    } finally {
      setIsLoading(false);
    }
  };

  const { subtotal, taxTotal, total } = calculateTotals();

  /* =============================
     UI
     ============================= */
  return (
    <div className="p-6 max-w-6xl mx-auto">

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Create Invoice</h1>
          <p className="text-gray-600 mt-1">Fill in the details to create a new invoice</p>
        </div>
        {/* AI Button */}
        <button
          onClick={() => setShowAIModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors shadow-sm"
        >
          <Sparkles className="w-5 h-5" />
          Generate with AI
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* ========== INVOICE INFO CARD ========== */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">Invoice Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Invoice Number *
              </label>
              <input
                name="invoiceNumber"
                value={formData.invoiceNumber}
                onChange={handleInputChange}
                placeholder="INV-001"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Invoice Date *
              </label>
              <input
                type="date"
                name="invoiceDate"
                value={formData.invoiceDate}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Due Date *
              </label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>
        </div>

        {/* ========== BILL FROM & BILL TO SECTIONS ========== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* BILL FROM */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="text-blue-600" size={20} />
              <h2 className="text-lg font-semibold text-gray-700">Bill From (Your Business)</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Name *
                </label>
                <input
                  name="name"
                  value={formData.billFrom.name}
                  onChange={handleBillFromChange}
                  placeholder="Your Business Name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.billFrom.email}
                  onChange={handleBillFromChange}
                  placeholder="your@email.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <input
                  name="address"
                  value={formData.billFrom.address}
                  onChange={handleBillFromChange}
                  placeholder="123 Business Street, City"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  name="phone"
                  value={formData.billFrom.phone}
                  onChange={handleBillFromChange}
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* BILL TO */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <User className="text-green-600" size={20} />
              <h2 className="text-lg font-semibold text-gray-700">Bill To (Client)</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Client Name *
                </label>
                <input
                  name="name"
                  value={formData.billTo.name}
                  onChange={handleBillToChange}
                  placeholder="Client Name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.billTo.email}
                  onChange={handleBillToChange}
                  placeholder="client@email.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <input
                  name="address"
                  value={formData.billTo.address}
                  onChange={handleBillToChange}
                  placeholder="456 Client Avenue, City"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  name="phone"
                  value={formData.billTo.phone}
                  onChange={handleBillToChange}
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

        </div>

        {/* ========== ITEMS SECTION ========== */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">

          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-700">Invoice Items</h2>

            <button
              type="button"
              onClick={addItem}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={16} /> Add Item
            </button>
          </div>

          {/* Items Table Header */}
          <div className="hidden md:grid grid-cols-12 gap-2 mb-3 pb-2 border-b border-gray-200 text-sm font-medium text-gray-600">
            <div className="col-span-4">Description</div>
            <div className="col-span-2">Quantity</div>
            <div className="col-span-2">Price (₹)</div>
            <div className="col-span-2">Tax (%)</div>
            <div className="col-span-1">Total (₹)</div>
            <div className="col-span-1"></div>
          </div>

          {/* Items */}
          <div className="space-y-3">
            {formData.items.map((item, i) => (
              <div key={i} className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center">

                <div className="md:col-span-4">
                  <label className="block md:hidden text-xs text-gray-600 mb-1">Description</label>
                  <input
                    value={item.description}
                    onChange={(e) =>
                      handleItemChange(i, "description", e.target.value)
                    }
                    placeholder="Item description"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block md:hidden text-xs text-gray-600 mb-1">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      handleItemChange(i, "quantity", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block md:hidden text-xs text-gray-600 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.price}
                    onChange={(e) =>
                      handleItemChange(i, "price", e.target.value)
                    }
                    placeholder="0.00"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block md:hidden text-xs text-gray-600 mb-1">Tax (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    value={item.tax}
                    onChange={(e) =>
                      handleItemChange(i, "tax", e.target.value)
                    }
                    placeholder="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="md:col-span-1">
                  <label className="block md:hidden text-xs text-gray-600 mb-1">Total</label>
                  <div className="px-3 py-2 bg-gray-50 rounded-lg text-sm font-medium text-gray-700">
                    ₹{item.total.toFixed(2)}
                  </div>
                </div>

                <div className="md:col-span-1 flex justify-end">
                  <button
                    type="button"
                    onClick={() => removeItem(i)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    disabled={formData.items.length === 1}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

              </div>
            ))}
          </div>

        </div>

        {/* ========== TOTALS SECTION ========== */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="max-w-md ml-auto space-y-2">
            <div className="flex justify-between text-gray-700">
              <span>Subtotal:</span>
              <span className="font-medium">₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Tax:</span>
              <span className="font-medium">₹{taxTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-200">
              <span>Total:</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* ========== NOTES SECTION ========== */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Additional Notes
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            placeholder="Payment terms, delivery instructions, or any other notes..."
            rows="4"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>

        {/* ========== BUTTONS ========== */}
        <div className="flex justify-end gap-3">

          <button
            type="button"
            onClick={() => navigate("/invoices")}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <>Creating...</>
            ) : (
              <>
                <Save size={16} />
                Create Invoice
              </>
            )}
          </button>

        </div>

      </form>

      {/* AI Modal */}
      {showAIModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Generate Invoice with AI</h2>
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
    </div>
  );
};

export default CreateInvoice;
