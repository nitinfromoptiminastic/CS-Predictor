'use client';

import { User, LogOut, Eye } from 'lucide-react';
import { useState } from 'react';
import { AuditLogs } from './audit-logs';

interface HeaderProps {
  userEmail: string;
  onSignOut: () => void;
}

export function Header({ userEmail, onSignOut }: HeaderProps) {
  const [showAuditLogs, setShowAuditLogs] = useState(false);

  return (
    <>
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Eye className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">
                CS Predictor
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              
              <div className="flex items-center text-sm text-gray-600">
                <User className="h-4 w-4 mr-2" />
                {userEmail}
              </div>
              
              <button
                onClick={onSignOut}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {showAuditLogs && (
        <AuditLogs 
          onClose={() => setShowAuditLogs(false)} 
          userEmail={userEmail}
        />
      )}
    </>
  );
}
