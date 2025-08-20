'use client';

import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { Header } from './header';
import { FileUpload } from './file-upload';
import { PlatformSelector } from './platform-selector';
import { Results } from './results';
import { PredictionResult, AssetAnalysis } from '@/types';

export function Dashboard() {
  const { data: session } = useSession();
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<{
    predictions: PredictionResult[];
    analysis: AssetAnalysis;
    fileName: string;
    fileType: string;
  } | null>(null);

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
      });

      const data = await response.json();
      
      if (data.success) {
        setResults({
          predictions: data.predictions,
          analysis: data.analysis,
          fileName: data.fileName,
          fileType: data.fileType,
        });
      } else {
        console.error('Analysis failed:', data.error);
      }
    } catch (error) {
      console.error('Error analyzing asset:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setUploadedFile(null);
    setSelectedPlatforms([]);
    setResults(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        userEmail={session?.user?.email || ''} 
        onSignOut={() => signOut()} 
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!results ? (
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Predict Asset Performance
              </h1>
              <p className="text-lg text-gray-600">
                Upload your marketing asset and select target platforms to get AI-powered insights
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <FileUpload 
                onFileSelect={setUploadedFile} 
                selectedFile={uploadedFile} 
              />
              
              <PlatformSelector
                selectedPlatforms={selectedPlatforms}
                onPlatformChange={setSelectedPlatforms}
              />
            </div>

            <div className="flex justify-center">
              <button
                onClick={handleAnalyze}
                disabled={!uploadedFile || selectedPlatforms.length === 0 || isAnalyzing}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {isAnalyzing ? 'Analyzing...' : 'Analyze Asset'}
              </button>
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
    </div>
  );
}
