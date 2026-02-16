import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Menu, X } from 'lucide-react';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
      setActiveSection(id);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        isScrolled
          ? 'bg-white shadow-md'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-900 rounded-lg flex items-center justify-center group-hover:shadow-lg transition-shadow duration-200">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">
              AI Invoice App
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => scrollToSection('features')}
              className={`relative px-4 py-2 text-gray-700 font-medium transition-all duration-200 hover:text-blue-600 group ${
                activeSection === 'features' ? 'text-blue-600' : ''
              }`}
            >
              Features
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300 ease-out"></span>
            </button>
            <button
              onClick={() => scrollToSection('testimonials')}
              className={`relative px-4 py-2 text-gray-700 font-medium transition-all duration-200 hover:text-blue-600 group ${
                activeSection === 'testimonials' ? 'text-blue-600' : ''
              }`}
            >
              Testimonials
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300 ease-out"></span>
            </button>
            <button
              onClick={() => scrollToSection('faq')}
              className={`relative px-4 py-2 text-gray-700 font-medium transition-all duration-200 hover:text-blue-600 group ${
                activeSection === 'faq' ? 'text-blue-600' : ''
              }`}
            >
              FAQ
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300 ease-out"></span>
            </button>
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/login"
              className="relative text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium px-4 py-2 group"
            >
              Login
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300 ease-out"></span>
            </Link>
            <Link
              to="/signup"
              className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
            >
              Sign Up
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-2 border-t border-gray-200 bg-white">
            <button
              onClick={() => scrollToSection('features')}
              className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all duration-200 font-medium"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('testimonials')}
              className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all duration-200 font-medium"
            >
              Testimonials
            </button>
            <button
              onClick={() => scrollToSection('faq')}
              className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all duration-200 font-medium"
            >
              FAQ
            </button>
            <div className="px-4 pt-4 border-t border-gray-200 space-y-3">
              <Link
                to="/login"
                className="block w-full text-center px-6 py-2.5 text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 hover:border-blue-600 hover:text-blue-600 transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="block w-full text-center px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign Up
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;