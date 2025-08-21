'use client';

import { signIn, getProviders } from 'next-auth/react';
import { useEffect, useState, Suspense } from 'react';
import { LogIn, Sparkles, Eye, Shield, BarChart3, Target } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

interface Provider {
  id: string;
  name: string;
  type: string;
  signinUrl: string;
  callbackUrl: string;
}

function SignInContent() {
  const [providers, setProviders] = useState<Record<string, Provider> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const errorParam = searchParams.get('error');

  useEffect(() => {
    const loadProviders = async () => {
      try {
        const res = await getProviders();
        setProviders(res);
      } catch (err) {
        setError('Failed to load authentication providers');
        console.error('Error loading providers:', err);
      }
    };
    loadProviders();
  }, []);

  const handleSignIn = async (providerId: string) => {
    try {
      setError(null);
      console.log('Signing in with provider:', providerId);
      const result = await signIn(providerId, { callbackUrl });
      console.log('Sign in result:', result);
    } catch (err) {
      console.error('Sign in error:', err);
      setError('Failed to sign in. Please try again.');
    }
  };

  if (!providers) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-pulse">
            <Eye className="h-10 w-10 text-white" />
          </div>
          <p className="text-lg font-medium text-gray-700">Loading authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute top-40 right-20 w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-full opacity-20 animate-bounce"></div>
      <div className="absolute bottom-32 left-20 w-12 h-12 bg-gradient-to-r from-pink-400 to-red-500 rounded-full opacity-20 animate-pulse"></div>

      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full space-y-8">
          {/* Logo and Header */}
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 rounded-2xl shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300">
                  <Eye className="h-10 w-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2">
                  <Sparkles className="h-6 w-6 text-yellow-400 animate-spin" />
                </div>
              </div>
            </div>
            
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-4">
              CS Predictor
            </h1>
            
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              AI-powered insights for your marketing assets across all platforms
            </p>

            {/* Feature highlights */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="text-center p-3 bg-white/50 rounded-xl backdrop-blur-sm">
                <BarChart3 className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                <p className="text-xs font-medium text-gray-700">Performance Analytics</p>
              </div>
              <div className="text-center p-3 bg-white/50 rounded-xl backdrop-blur-sm">
                <Target className="h-6 w-6 text-green-600 mx-auto mb-2" />
                <p className="text-xs font-medium text-gray-700">Multi-Platform</p>
              </div>
              <div className="text-center p-3 bg-white/50 rounded-xl backdrop-blur-sm">
                <Shield className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                <p className="text-xs font-medium text-gray-700">100% Secure</p>
              </div>
            </div>
          </div>

          {/* Login Card */}
          <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/20">
            <div className="space-y-6">
              {error && (
                <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                  {error}
                </div>
              )}
              
              {errorParam && (
                <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                  Authentication error: {errorParam}
                </div>
              )}

              <div className="flex items-center justify-center text-sm text-gray-500 bg-gray-50 rounded-lg p-3">
                <Shield className="h-4 w-4 mr-2" />
                Restricted to @optiminastic.com accounts only
              </div>
              
              {Object.values(providers).map((provider: Provider) => (
                <button
                  key={provider.name}
                  onClick={() => handleSignIn(provider.id)}
                  className="w-full group relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 ease-out"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out"></div>
                  <div className="relative flex items-center justify-center">
                    <LogIn className="h-5 w-5 mr-3" />
                    Sign in with {provider.name}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="text-center space-y-4">
            <div className="flex justify-center space-x-6 text-xs text-gray-400">
              <span className="flex items-center">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                Secure
              </span>
              <span className="flex items-center">
                <div className="w-2 h-2 bg-blue-400 rounded-full mr-2 animate-pulse"></div>
                Private
              </span>
              <span className="flex items-center">
                <div className="w-2 h-2 bg-purple-400 rounded-full mr-2 animate-pulse"></div>
                No Storage
              </span>
            </div>
            
            <p className="text-xs text-gray-400">
              © 2025 Optiminastic. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-pulse">
            <Eye className="h-10 w-10 text-white" />
          </div>
          <p className="text-lg font-medium text-gray-700">Loading...</p>
        </div>
      </div>
    }>
      <SignInContent />
    </Suspense>
  );
}
