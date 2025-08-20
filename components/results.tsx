'use client';

import { useState } from 'react';
import { PredictionResult, AssetAnalysis } from '@/types';
import { PLATFORMS } from '@/lib/constants';
import { ReportService } from '@/lib/report-service';
import { BrandDesignEvaluationComponent } from './brand-design-evaluation';
import { ArrowLeft, Download, TrendingUp, AlertTriangle, Target, Shield, Palette } from 'lucide-react';

interface ResultsProps {
  results: {
    predictions: PredictionResult[];
    analysis: AssetAnalysis;
    fileName: string;
    fileType: string;
  };
  onReset: () => void;
  userEmail: string;
}

export function Results({ results, onReset, userEmail }: ResultsProps) {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [activeTab, setActiveTab] = useState<'platforms' | 'brand-design'>('platforms');

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    try {
      const pdf = ReportService.generatePDF(
        results.predictions,
        results.analysis,
        results.fileName,
        userEmail
      );
      pdf.save(`content-success-report-${Date.now()}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const getPolarisationColor = (score: string) => {
    switch (score) {
      case 'Low': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'High': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSuccessColor = (score: number) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onReset}
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Analyze New Asset
        </button>
        
        <button
          onClick={handleDownloadPDF}
          disabled={isGeneratingPDF}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
        >
          <Download className="h-4 w-4 mr-2" />
          {isGeneratingPDF ? 'Generating PDF...' : 'Download Report'}
        </button>
      </div>

      {/* Asset Info */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-center mb-4">
          <Target className="h-6 w-6 text-blue-600 mr-3" />
          <h2 className="text-xl font-semibold text-gray-900">
            Analysis Results for {results.fileName}
          </h2>
        </div>
      </div>

            {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow-sm border mb-6">
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('platforms')}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'platforms'
                ? 'border-blue-500 text-blue-600 bg-blue-50'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <TrendingUp className="h-4 w-4 inline mr-2" />
            Platform Predictions
          </button>
          <button
            onClick={() => setActiveTab('brand-design')}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'brand-design'
                ? 'border-blue-500 text-blue-600 bg-blue-50'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Palette className="h-4 w-4 inline mr-2" />
            Brand Design Evaluation
          </button>
        </div>
      </div>

      {/* Brand Safety Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-center mb-4">
          <Shield className="h-6 w-6 text-green-600 mr-3" />
          <h3 className="text-lg font-semibold text-gray-900">Brand Safety</h3>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <div className="text-2xl font-bold text-green-600 mb-2">
              {(results.analysis.brandSafety.score * 100).toFixed(1)}%
            </div>
            <p className="text-gray-600">Safety Score</p>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">NSFW Content:</span>
              <span className={results.analysis.brandSafety.nsfw ? 'text-red-600' : 'text-green-600'}>
                {results.analysis.brandSafety.nsfw ? 'Detected' : 'Clear'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Violent Content:</span>
              <span className={results.analysis.brandSafety.violent ? 'text-red-600' : 'text-green-600'}>
                {results.analysis.brandSafety.violent ? 'Detected' : 'Clear'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Sensitive Content:</span>
              <span className={results.analysis.brandSafety.sensitive ? 'text-red-600' : 'text-green-600'}>
                {results.analysis.brandSafety.sensitive ? 'Detected' : 'Clear'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'platforms' ? (
        <>
          {/* Platform Predictions */}
          <div className="space-y-6">
            <div className="flex items-center">
              <TrendingUp className="h-6 w-6 text-blue-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">Platform Predictions</h3>
            </div>

            <div className="grid gap-6">
              {results.predictions.map((prediction) => {
                const platform = PLATFORMS.find(p => p.id === prediction.platform);
                
                return (
                  <div key={prediction.platform} className="bg-white p-6 rounded-lg shadow-sm border">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${platform?.color}`}>
                          <span className="text-white font-semibold text-sm">
                            {platform?.name.charAt(0)}
                          </span>
                        </div>
                        <h4 className="text-lg font-semibold text-gray-900">
                          {platform?.name}
                        </h4>
                      </div>
                      
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${getSuccessColor(prediction.successScore)}`}>
                          {prediction.successScore}/10
                        </div>
                        <p className="text-sm text-gray-600">Success Score</p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <span className="text-sm text-gray-600">Polarisation:</span>
                        <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getPolarisationColor(prediction.polarisationScore)}`}>
                          {prediction.polarisationScore}
                        </span>
                      </div>
                      
                      <div className="md:col-span-2">
                        <span className="text-sm text-gray-600">Strategy:</span>
                        <span className="ml-2 text-sm font-medium text-gray-900">
                          {prediction.strategicAngle}
                        </span>
                      </div>
                    </div>

                    <div>
                      <h5 className="text-sm font-medium text-gray-900 mb-2">Recommendations:</h5>
                      <ul className="space-y-1">
                        {prediction.recommendations.map((rec, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-start">
                            <span className="text-blue-600 mr-2">•</span>
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Visual Features Summary */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center mb-4">
                <AlertTriangle className="h-6 w-6 text-orange-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">Visual Analysis</h3>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <div className="text-xl font-bold text-gray-900 mb-1">
                    {results.analysis.visualFeatures.faces}
                  </div>
                  <p className="text-sm text-gray-600">Faces Detected</p>
                </div>
                
                <div>
                  <div className="text-xl font-bold text-gray-900 mb-1">
                    {(results.analysis.visualFeatures.textDensity * 100).toFixed(1)}%
                  </div>
                  <p className="text-sm text-gray-600">Text Density</p>
                </div>
                
                <div>
                  <div className="text-xl font-bold text-gray-900 mb-1">
                    {(results.analysis.visualFeatures.colorHarmony * 100).toFixed(1)}%
                  </div>
                  <p className="text-sm text-gray-600">Color Harmony</p>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Brand Design Evaluation */}
          <BrandDesignEvaluationComponent evaluation={results.analysis.brandDesignEvaluation} />
        </>
      )}
    </div>
  );
}
