import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, CheckCircle } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative bg-gradient-to-br from-slate-50 to-blue-50 pt-32 pb-20 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4" />
            AI-Powered Invoice Generation
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 mb-6 animate-fade-in-up">
            AI-Powered Invoicing.
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Made Effortless.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-slate-600 mb-10 max-w-3xl mx-auto animate-fade-in-up animation-delay-200">
            Create professional invoices in seconds with AI automation. 
            Streamline your billing process and get paid faster.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 animate-fade-in-up animation-delay-400">
            <Link
              to="/signup"
              className="group px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-lg flex items-center gap-2 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/login"
              className="px-8 py-4 bg-white hover:bg-slate-50 text-slate-800 rounded-xl font-semibold text-lg border-2 border-slate-200 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Sign In
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto mt-16 animate-fade-in-up animation-delay-600">
            <div className="flex flex-col items-center">
              <div className="text-4xl font-bold text-slate-900 mb-2">10K+</div>
              <div className="text-slate-600">Active Users</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-4xl font-bold text-slate-900 mb-2">500K+</div>
              <div className="text-slate-600">Invoices Created</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-4xl font-bold text-slate-900 mb-2">99.9%</div>
              <div className="text-slate-600">Uptime</div>
            </div>
          </div>

          {/* Features List */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-16">
            <div className="flex items-start gap-3 text-left">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">AI-Powered Creation</h3>
                <p className="text-sm text-slate-600">Generate invoices from plain text instantly</p>
              </div>
            </div>
            <div className="flex items-start gap-3 text-left">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Smart Reminders</h3>
                <p className="text-sm text-slate-600">Auto-generate payment reminder emails</p>
              </div>
            </div>
            <div className="flex items-start gap-3 text-left">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Dashboard Insights</h3>
                <p className="text-sm text-slate-600">Get AI-powered financial analytics</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom animations */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out;
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        
        .animation-delay-400 {
          animation-delay: 0.4s;
        }
        
        .animation-delay-600 {
          animation-delay: 0.6s;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </section>
  );
};

export default Hero;
