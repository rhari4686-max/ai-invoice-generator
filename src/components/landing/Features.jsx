import React from 'react';
import { 
  Sparkles, 
  Zap, 
  FileDown, 
  Cloud, 
  Palette, 
  Smartphone,
  Brain,
  Mail,
  BarChart3
} from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: Brain,
      title: 'AI Invoice Creation',
      description: 'Simply paste text like a client email, and our AI instantly generates a complete, professional invoice.',
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      icon: Mail,
      title: 'Smart Payment Reminders',
      description: 'AI-generated friendly reminder emails for unpaid invoices, sent automatically or on-demand.',
      gradient: 'from-purple-500 to-purple-600'
    },
    {
      icon: BarChart3,
      title: 'AI Financial Insights',
      description: 'Get intelligent analytics on your revenue, outstanding payments, and business performance.',
      gradient: 'from-indigo-500 to-indigo-600'
    },
    {
      icon: FileDown,
      title: 'PDF Export & Print',
      description: 'Download professional invoices as PDF or print with one click. Perfect for offline records.',
      gradient: 'from-green-500 to-green-600'
    },
    {
      icon: Cloud,
      title: 'Cloud Storage',
      description: 'All your invoices are securely stored in the cloud and accessible from anywhere, anytime.',
      gradient: 'from-cyan-500 to-cyan-600'
    },
    {
      icon: Palette,
      title: 'Customizable Branding',
      description: 'Add your logo, customize colors, and create branded invoices that reflect your business.',
      gradient: 'from-pink-500 to-pink-600'
    },
    {
      icon: Smartphone,
      title: 'Fully Responsive',
      description: 'Works seamlessly on desktop, tablet, and mobile. Manage invoices on the go.',
      gradient: 'from-orange-500 to-orange-600'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Create invoices in seconds. Our optimized platform ensures you spend less time on paperwork.',
      gradient: 'from-yellow-500 to-yellow-600'
    },
    {
      icon: Sparkles,
      title: 'Easy to Use',
      description: 'Intuitive interface designed for everyone. No training required, just start creating invoices.',
      gradient: 'from-violet-500 to-violet-600'
    }
  ];

  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full mb-4">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Features</span>
          </div>
          
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Everything You Need to
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Manage Invoices Smarter
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Powered by AI to save you time and help you get paid faster
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group relative bg-white rounded-2xl p-8 border border-gray-200 hover:border-transparent hover:shadow-2xl transition-all duration-300"
              >
                {/* Gradient border on hover */}
                <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10`}></div>
                <div className="absolute inset-0.5 bg-white rounded-2xl -z-10"></div>

                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-r ${feature.gradient} mb-6 transform group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <button
            onClick={() => window.location.href = '/signup'}
            className="inline-flex items-center space-x-2 bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-700 transform hover:-translate-y-1 hover:shadow-xl transition-all duration-200"
          >
            <span>Start Creating Invoices</span>
            <Sparkles className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Features;
