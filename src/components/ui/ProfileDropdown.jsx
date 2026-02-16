import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, User, LogOut } from 'lucide-react';

const ProfileDropdown = ({ isOpen, setIsOpen, avatar, companyName, email, onLogout }) => {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setIsOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
      >
        {avatar ? (
          <img
            src={avatar}
            alt="Avatar"
            className="w-9 h-9 object-cover rounded-xl"
          />
        ) : (
          <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-800 rounded-xl flex items-center justify-center">
            <span className="text-white font-medium text-sm">
              {companyName?.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        
        <div className="hidden md:block text-left">
          <p className="text-sm font-medium text-gray-900">{companyName}</p>
          <p className="text-xs text-gray-500">{email}</p>
        </div>
        
        <ChevronDown 
          className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
            isOpen ? 'transform rotate-180' : ''
          }`} 
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-900">{companyName}</p>
            <p className="text-xs text-gray-500">{email}</p>
          </div>
          
          <button
            onClick={() => {
              navigate('/profile');
              setIsOpen(false);
            }}
            className="w-full flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
          >
            <User className="w-4 h-4 mr-3 text-gray-500" />
            View Profile
          </button>
          
          <div className="border-t border-gray-100 my-2"></div>
          
          <button
            onClick={() => {
              onLogout();
              setIsOpen(false);
            }}
            className="w-full flex items-center px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
          >
            <LogOut className="w-4 h-4 mr-3" />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
