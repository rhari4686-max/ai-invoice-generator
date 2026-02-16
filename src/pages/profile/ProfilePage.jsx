import React, { useState, useEffect } from 'react';
import { User, Building2, Mail, Phone, MapPin, Save, Edit2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import axiosInstance from '../../utils/axiosInstance';

const ProfilePage = () => {
  const { user, setUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    businessName: '',
    businessAddress: '',
    businessPhone: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        email: user.email || '',
        businessName: user.businessName || '',
        businessAddress: user.businessAddress || '',
        businessPhone: user.businessPhone || ''
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.fullName || !formData.email) {
      toast.error('Name and email are required');
      return;
    }

    if (!formData.email.includes('@')) {
      toast.error('Please enter a valid email');
      return;
    }

    setIsLoading(true);

    try {
      const response = await axiosInstance.put('/auth/profile', formData);
      
      // Update user in context and localStorage
      const updatedUser = response.data;
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      toast.success('Profile updated successfully!');
      setIsEditing(false);
      
      // Force re-fetch to update context
      window.location.reload();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset to original values
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        email: user.email || '',
        businessName: user.businessName || '',
        businessAddress: user.businessAddress || '',
        businessPhone: user.businessPhone || ''
      });
    }
    setIsEditing(false);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Profile Settings</h1>
            <p className="text-slate-600">Manage your account and business information</p>
          </div>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              <Edit2 className="w-4 h-4" />
              Edit Profile
            </button>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Personal Information Card */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Personal Information</h2>
              <p className="text-slate-600 text-sm">Your account details</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              {isEditing ? (
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              ) : (
                <div className="flex items-center gap-2 px-4 py-3 bg-slate-50 rounded-lg text-slate-700">
                  <User className="w-5 h-5 text-slate-400" />
                  {formData.fullName || 'Not set'}
                </div>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              {isEditing ? (
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              ) : (
                <div className="flex items-center gap-2 px-4 py-3 bg-slate-50 rounded-lg text-slate-700">
                  <Mail className="w-5 h-5 text-slate-400" />
                  {formData.email || 'Not set'}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Business Information Card */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Business Information</h2>
              <p className="text-slate-600 text-sm">This info will appear on your invoices</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Business Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Business Name
              </label>
              {isEditing ? (
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Your Company LLC"
                  />
                </div>
              ) : (
                <div className="flex items-center gap-2 px-4 py-3 bg-slate-50 rounded-lg text-slate-700">
                  <Building2 className="w-5 h-5 text-slate-400" />
                  {formData.businessName || 'Not set'}
                </div>
              )}
            </div>

            {/* Business Address */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Business Address
              </label>
              {isEditing ? (
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                  <textarea
                    name="businessAddress"
                    value={formData.businessAddress}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="123 Business St, City, State, ZIP"
                  />
                </div>
              ) : (
                <div className="flex items-start gap-2 px-4 py-3 bg-slate-50 rounded-lg text-slate-700">
                  <MapPin className="w-5 h-5 text-slate-400 mt-0.5" />
                  <span className="whitespace-pre-wrap">{formData.businessAddress || 'Not set'}</span>
                </div>
              )}
            </div>

            {/* Business Phone */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Business Phone
              </label>
              {isEditing ? (
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="tel"
                    name="businessPhone"
                    value={formData.businessPhone}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              ) : (
                <div className="flex items-center gap-2 px-4 py-3 bg-slate-50 rounded-lg text-slate-700">
                  <Phone className="w-5 h-5 text-slate-400" />
                  {formData.businessPhone || 'Not set'}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons - Only show when editing */}
        {isEditing && (
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        )}
      </form>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center">
              <span className="text-blue-700 font-bold text-sm">ℹ</span>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-blue-900 mb-1">About Your Profile</h3>
            <p className="text-blue-700 text-sm">
              Your business information will automatically appear on all invoices you create. 
              Make sure to keep it up to date for professional-looking invoices.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
