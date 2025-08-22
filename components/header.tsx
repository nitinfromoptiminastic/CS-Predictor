'use client';

import { User, LogOut, ChevronDown, Eye, Sparkles } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

interface HeaderProps {
  userEmail: string;
  onSignOut: () => void;
}

export function Header({ userEmail, onSignOut }: HeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-200/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <div className="relative mr-4">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-xl shadow-lg">
                <Eye className="h-7 w-7 text-white" />
              </div>
              <div className="absolute -top-1 -right-1">
                <Sparkles className="h-4 w-4 text-yellow-400 animate-pulse" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                CS Predictor
              </h1>
              {/* <p className="text-xs text-gray-500 font-medium">AI-Powered Marketing Analytics</p> */}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* User Menu */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all duration-200 border border-gray-200 hover:border-gray-300 hover:shadow-md"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mr-3">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div className="hidden md:block text-left">
                  <div className="font-medium text-gray-900">{userEmail.split('@')[0]}</div>
                  {/* <div className="text-xs text-gray-500">@optiminastic.com</div> */}
                </div>
                <ChevronDown className={`h-4 w-4 ml-2 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-10">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mr-3">
                        <User className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{userEmail}</div>
                        <div className="text-sm text-gray-500">Optiminastic Team</div>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={onSignOut}
                    className="w-full flex items-center px-4 py-3 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
                  >
                    <LogOut className="h-4 w-4 mr-3" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
