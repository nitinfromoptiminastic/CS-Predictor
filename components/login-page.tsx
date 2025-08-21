'use client';

import { signIn } from 'next-auth/react';
import { LogIn, Shield, Eye } from 'lucide-react';

export function LoginPage() {
  const handleSignIn = async () => {
    try {
      console.log("Attempting to sign in with Google");
      const result = await signIn('google', { 
        callbackUrl: '/',
        redirect: false 
      });
      console.log("Sign in result:", result);
      
      if (result?.error) {
        console.error("Sign in error:", result.error);
      }
    } catch (error) {
      console.error("Sign in exception:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-blue-600 p-3 rounded-full">
              <Eye className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            CS Predictor
          </h2>
          <p className="text-gray-600">
            Predict marketing asset performance across platforms
          </p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md">
          <div className="space-y-4">
            <div className="flex items-center text-sm text-gray-600">
              <Shield className="h-4 w-4 mr-2" />
              Restricted to @optiminastic.com accounts
            </div>
            
            <button
              onClick={handleSignIn}
              className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <LogIn className="h-5 w-5 mr-2" />
              Sign in with Google Workspace
            </button>
          </div>
        </div>

        <div className="text-center text-xs text-gray-500">
          <p>Secure • Private • No asset storage</p>
        </div>
      </div>
    </div>
  );
}
