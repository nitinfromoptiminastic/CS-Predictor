'use client';

import { useState, useRef, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { User, LogOut, ChevronDown, Eye, Sparkles } from 'lucide-react';
import { FileUpload } from './file-upload';
import { PlatformSelector } from './platform-selector';
import { Results } from './results';
import SubscriptionError from './subscription-error';
import { PredictionResult, AssetAnalysis } from '@/types';

export function Dashboard() {
  const { data: session } = useSession();
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSubscriptionError, setShowSubscriptionError] = useState(false);
  const [subscriptionErrorData, setSubscriptionErrorData] = useState<{ billingUrl?: string }>({});
  const menuRef = useRef<HTMLDivElement>(null);
  const [results, setResults] = useState<{
    predictions: PredictionResult[];
    analysis: AssetAnalysis;
    fileName: string;
    fileType: string;
  } | null>(null);

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

  const handleAnalyze = async () => {
    if (!uploadedFile || selectedPlatforms.length === 0) {
      return;
    }

    setIsAnalyzing(true);
    try {
      const formData = new FormData();
      formData.append('file', uploadedFile);
      formData.append('platforms', JSON.stringify(selectedPlatforms));

      const response = await fetch('/api/predict', {
        method: 'POST',
        body: formData,
        // Add timeout for video processing
        signal: AbortSignal.timeout(120000), // 2 minutes timeout
      });

      const data = await response.json();
      
      // Check if the response was successful
      if (!response.ok) {
        // Handle API errors
        if (data.error === 'SUBSCRIPTION_EXPIRED') {
          setSubscriptionErrorData({ billingUrl: data.billingUrl });
          setShowSubscriptionError(true);
        } else {
          console.error('API Error:', data.error);
          alert(`Analysis failed: ${data.error || 'Server error occurred'}`);
        }
        return;
      }
      
      if (data.success) {
        setResults({
          predictions: data.predictions,
          analysis: data.analysis,
          fileName: data.fileName,
          fileType: data.fileType,
        });
      } else {
        // Check for subscription errors
        if (data.error === 'SUBSCRIPTION_EXPIRED') {
          setSubscriptionErrorData({ billingUrl: data.billingUrl });
          setShowSubscriptionError(true);
        } else {
          console.error('Analysis failed:', data.error);
          alert(`Analysis failed: ${data.error}`);
        }
      }
    } catch (error) {
      console.error('Error analyzing asset:', error);
      
      // Check for specific error types
      if (error instanceof DOMException && error.name === 'TimeoutError') {
        alert('Analysis timed out. Video processing can take up to 2 minutes. Please try again.');
      } else if (error instanceof DOMException && error.name === 'AbortError') {
        alert('Analysis was cancelled due to timeout. Please try with a smaller file.');
      } else if (error instanceof TypeError && error.message.includes('fetch')) {
        alert('Network error occurred. Please check your connection and try again.');
      } else {
        alert(`Analysis failed: ${error instanceof Error ? error.message : 'Unknown error occurred'}`);
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSignOut = async () => {
    const confirmed = window.confirm('Are you sure you want to sign out?');
    if (confirmed) {
      try {
        await signOut({ 
          callbackUrl: '/auth/signin',
          redirect: true 
        });
      } catch (error) {
        console.error('Sign out error:', error);
        // Fallback to force sign out
        await signOut();
      }
    }
  };

  const handleReset = () => {
    setUploadedFile(null);
    setSelectedPlatforms([]);
    setResults(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
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
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all duration-200 border border-gray-200 hover:border-gray-300 hover:shadow-md"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mr-3">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <div className="hidden md:block text-left">
                    <div className="font-medium text-gray-900">{session?.user?.email?.split('@')[0] || ''}</div>
                    <div className="text-xs text-gray-500">@optiminastic.com</div>
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
                          <div className="font-medium text-gray-900">{session?.user?.email || ''}</div>
                          <div className="text-sm text-gray-500">Optiminastic Team</div>
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={handleSignOut}
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
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!results ? (
          <div className="space-y-12">
            {/* Hero Section */}
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-6 leading-tight">
                Predict Your Content&apos;s Success
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed mb-8">
               We turn “hope it works” into “know it wins.”
              </p>
            </div>

            {/* Upload and Analysis Section */}
            <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
              <div className="bg-white/70 backdrop-blur-sm p-4 rounded-2xl shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
                <div className="mb-3">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">Upload Your Asset</h3>
                  <p className="text-gray-600 text-sm">Support for images and videos up to 5GB</p>
                </div>
                <FileUpload 
                  onFileSelect={setUploadedFile} 
                  selectedFile={uploadedFile} 
                />
              </div>
              
              <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">Select Platforms</h3>
                  <p className="text-gray-600 text-sm">Choose where you want to analyze performance</p>
                </div>
                <PlatformSelector
                  selectedPlatforms={selectedPlatforms}
                  onPlatformChange={setSelectedPlatforms}
                />
              </div>
            </div>

            {/* Analyze Button */}
            <div className="flex justify-center">
              <button
                onClick={handleAnalyze}
                disabled={!uploadedFile || selectedPlatforms.length === 0 || isAnalyzing}
                className="group relative px-12 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-lg"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out"></div>
                <span className="relative flex items-center justify-center text-lg">
                  {isAnalyzing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Analyzing Asset...
                    </>
                  ) : (
                    <>
                      🚀 Analyze Asset Performance
                    </>
                  )}
                </span>
              </button>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mt-16">
              <div className="text-center p-6 bg-white/50 rounded-xl backdrop-blur-sm">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎯</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Success Prediction</h3>
                <p className="text-gray-600">Get precise performance scores for each platform</p>
              </div>
              <div className="text-center p-6 bg-white/50 rounded-xl backdrop-blur-sm">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📊</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Polarisation Analysis</h3>
                <p className="text-gray-600">Understand audience reaction and engagement patterns</p>
              </div>
              <div className="text-center p-6 bg-white/50 rounded-xl backdrop-blur-sm">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💡</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Strategic Insights</h3>
                <p className="text-gray-600">Receive actionable recommendations for optimization</p>
              </div>
            </div>
          </div>
        ) : (
          <Results 
            results={results}
            onReset={handleReset}
            userEmail={session?.user?.email || ''}
          />
        )}
      </main>
      
      {/* Subscription Error Modal */}
      {showSubscriptionError && (
        <SubscriptionError 
          billingUrl={subscriptionErrorData.billingUrl}
          onClose={() => setShowSubscriptionError(false)}
        />
      )}
    </div>
  );
}
