'use client';

import { useState } from 'react';
import { PredictionResult, AssetAnalysis } from '@/types';
import { PLATFORMS } from '@/lib/constants';
import { ReportService } from '@/lib/report-service';
import { BrandDesignEvaluationComponent } from './brand-design-evaluation';
import { ArrowLeft, Download, TrendingUp, Target, Shield, Palette } from 'lucide-react';

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

      {/* 5-Step Content Analysis Framework */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl shadow-sm border border-blue-100">
        <div className="flex items-center mb-6">
          <Target className="h-6 w-6 text-blue-600 mr-3" />
          <h3 className="text-xl font-bold text-gray-900">5-Step Content Analysis Framework</h3>
        </div>
        
        <div className="space-y-6">
          {/* Step 1 - Content Identification (MANDATORY) */}
          <div className="bg-white p-5 rounded-lg shadow-sm border-l-4 border-blue-500">
            <div className="flex items-center mb-3">
              <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">1</span>
              <h4 className="text-lg font-semibold text-gray-900">Content Identification (MANDATORY)</h4>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <span className="text-sm font-medium text-gray-600">Content Type:</span>
                <div className="mt-1">
                  <span className="inline-block px-4 py-2 bg-blue-100 text-blue-800 text-sm font-bold rounded-lg">
                    {results.analysis.contentIdentification?.contentType || 'N/A'}
                  </span>
                </div>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">Confidence Level:</span>
                <div className="mt-1 flex items-center">
                  <div className="flex-1 bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-blue-600 h-3 rounded-full" 
                      style={{ width: `${(results.analysis.contentIdentification?.confidence || 0) * 100}%` }}
                    ></div>
                  </div>
                  <span className="ml-3 text-sm font-semibold text-gray-900">
                    {((results.analysis.contentIdentification?.confidence || 0) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm font-medium text-gray-600">Why categorized this way:</span>
              <p className="text-sm text-gray-700 mt-1 italic">
                &ldquo;{results.analysis.contentIdentification?.context || 'No analysis available'}&rdquo;
              </p>
            </div>
          </div>

          {/* Step 2 - Strategy & Emotion */}
          <div className="bg-white p-5 rounded-lg shadow-sm border-l-4 border-green-500">
            <div className="flex items-center mb-3">
              <span className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">2</span>
              <h4 className="text-lg font-semibold text-gray-900">Strategy & Emotion</h4>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <span className="text-sm font-medium text-gray-600">Strategy Tags:</span>
                <div className="mt-1 space-y-1">
                  <span className="inline-block px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full mr-1 capitalize">
                    {results.analysis.strategicPositioning?.primaryStrategy || 'N/A'}
                  </span>
                  {results.analysis.strategicPositioning?.secondaryStrategy && (
                    <span className="inline-block px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full capitalize">
                      {results.analysis.strategicPositioning.secondaryStrategy}
                    </span>
                  )}
                </div>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">Primary Emotion:</span>
                <div className="mt-1">
                  <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full capitalize">
                    {results.analysis.emotionalAnalysis?.primaryEmotion || 'N/A'}
                  </span>
                </div>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">Polarization:</span>
                <div className="mt-1">
                  <span className={`inline-block px-3 py-1 text-sm font-bold rounded-full ${
                    results.analysis.emotionalAnalysis?.isPolarizing 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {results.analysis.emotionalAnalysis?.isPolarizing ? 'YES' : 'NO'}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  {results.analysis.emotionalAnalysis?.polarizationReason || 'No analysis available'}
                </p>
              </div>
            </div>
          </div>

          {/* Step 3 - Platform Fit (0-100) */}
          <div className="bg-white p-5 rounded-lg shadow-sm border-l-4 border-purple-500">
            <div className="flex items-center mb-3">
              <span className="bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">3</span>
              <h4 className="text-lg font-semibold text-gray-900">Platform Fit (0-100)</h4>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
              {Object.entries(results.analysis.platformFitAnalysis || {}).map(([platform, score]) => (
                <div key={platform} className="text-center bg-gray-50 p-3 rounded-lg">
                  <div className="text-xs font-medium text-gray-600 uppercase mb-1">
                    {platform === 'twitter' ? 'X' : platform}
                  </div>
                  <div className="text-xl font-bold text-purple-600">
                    {score}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Step 4 - Performance Scores (0-100) */}
          <div className="bg-white p-5 rounded-lg shadow-sm border-l-4 border-orange-500">
            <div className="flex items-center mb-3">
              <span className="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">4</span>
              <h4 className="text-lg font-semibold text-gray-900">Performance Scores (0-100)</h4>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center bg-blue-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {results.analysis.performanceScoring?.engagementPotential || 0}
                </div>
                <p className="text-sm font-medium text-gray-700">Engagement Potential</p>
              </div>
              <div className="text-center bg-green-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {results.analysis.performanceScoring?.clarityOfMessage || 0}
                </div>
                <p className="text-sm font-medium text-gray-700">Clarity of Message</p>
              </div>
              <div className="text-center bg-purple-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-purple-600 mb-1">
                  {results.analysis.performanceScoring?.viralityLikelihood || 0}
                </div>
                <p className="text-sm font-medium text-gray-700">Virality Likelihood</p>
              </div>
            </div>
          </div>
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
          {/* Step 5 - Tailored Recommendations */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl shadow-sm border border-green-100">
            <div className="flex items-center mb-6">
              <span className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">5</span>
              <h3 className="text-xl font-bold text-gray-900">Platform-Specific Tailored Recommendations</h3>
            </div>
            
            <div className="grid gap-6">
              {results.analysis.tailoredRecommendations && Object.entries(results.analysis.tailoredRecommendations).map(([platform, recommendation]) => (
                <div key={platform} className="bg-white p-5 rounded-lg shadow-sm border">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="bg-gray-100 px-3 py-1 rounded-full text-sm font-semibold text-gray-700 capitalize mr-3">
                        {platform === 'twitter' ? 'X' : platform}
                      </div>
                      <div className="text-lg font-bold text-green-600">
                        Score: {recommendation.score}
                      </div>
                    </div>
                    <div className="flex-1 ml-4">
                      <div className="bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full transition-all duration-500" 
                          style={{ width: `${recommendation.score}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">AI Prediction:</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {recommendation.prediction}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Optimization Tips:</h4>
                    <ul className="space-y-1">
                      {recommendation.optimizationTips.map((tip, index) => (
                        <li key={index} className="text-gray-600 text-sm flex items-start">
                          <span className="text-green-500 mr-2 mt-1">•</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-orange-50 to-red-50 p-6 rounded-xl shadow-sm border border-orange-100">
            <div className="flex items-center mb-4">
              <span className="bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">5</span>
              <h3 className="text-xl font-bold text-gray-900">Tailored Recommendations (3-4 Max)</h3>
              <div className="ml-auto text-sm text-orange-700 bg-orange-100 px-3 py-1 rounded-full font-medium">
                Content-specific • Actionable • No vague tips
              </div>
            </div>

            <div className="grid gap-6">
              {results.predictions.map((prediction) => {
                const platform = PLATFORMS.find(p => p.id === prediction.platform);
                
                return (
                  <div key={prediction.platform} className="bg-white p-6 rounded-lg shadow-sm border border-orange-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center mr-4 ${platform?.color}`}>
                          <span className="text-white font-bold text-lg">
                            {platform?.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <h4 className="text-xl font-bold text-gray-900">
                            {platform?.name}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {prediction.strategicAngle}
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className={`text-3xl font-bold ${getSuccessColor(prediction.successScore)}`}>
                          {prediction.successScore}/10
                        </div>
                        <p className="text-sm text-gray-600">Success Score</p>
                        <div className="mt-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${getPolarisationColor(prediction.polarisationScore)}`}>
                            {prediction.polarisationScore} Polarization
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-orange-50 p-4 rounded-lg">
                      <h5 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                        💡 Platform-Specific Actionable Recommendations
                      </h5>
                      <div className="space-y-3">
                        {prediction.recommendations.map((rec, index) => (
                          <div key={index} className="flex items-start">
                            <span className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5 flex-shrink-0">
                              {index + 1}
                            </span>
                            <p className="text-sm text-gray-800 font-medium leading-relaxed">
                              {rec}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
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
