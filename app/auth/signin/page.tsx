'use client';

import { signIn, getProviders } from 'next-auth/react';
import { useEffect, useState, Suspense } from 'react';
import { LogIn } from 'lucide-react';
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
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Content Success Predictor
          </h2>
          <p className="text-gray-600">
            Sign in to analyze your marketing assets
          </p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md">
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
          
          {errorParam && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              Authentication error: {errorParam}
            </div>
          )}

          {Object.values(providers).map((provider: Provider) => (
            <button
              key={provider.name}
              onClick={() => handleSignIn(provider.id)}
              className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <LogIn className="h-5 w-5 mr-2" />
              Sign in with {provider.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div>Loading...</div>
      </div>
    }>
      <SignInContent />
    </Suspense>
  );
}
