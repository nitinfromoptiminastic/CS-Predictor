'use client';

import { BrandDesignEvaluation } from '@/types';
import { CheckCircle, AlertTriangle, XCircle, Eye, Image as ImageIcon, Type, Award, Palette } from 'lucide-react';

interface BrandDesignEvaluationProps {
  evaluation?: BrandDesignEvaluation;
}

export function BrandDesignEvaluationComponent({ evaluation }: BrandDesignEvaluationProps) {
  if (!evaluation) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Brand design evaluation not available for this analysis.</p>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-emerald-700 bg-emerald-50';
    if (score >= 6) return 'text-amber-700 bg-amber-50';
    return 'text-red-700 bg-red-50';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 8) return <CheckCircle className="h-5 w-5 text-emerald-600" />;
    if (score >= 6) return <AlertTriangle className="h-5 w-5 text-amber-600" />;
    return <XCircle className="h-5 w-5 text-red-600" />;
  };

  const categories = [
    {
      title: "Design Consistency",
      icon: <Palette className="h-6 w-6 text-blue-700" />,
      data: evaluation.designConsistency,
      details: [
        { label: "Brand Colors", value: evaluation.designConsistency.details.brandColors ? "✓ Consistent" : "✗ Needs work" },
        { label: "Font Consistency", value: evaluation.designConsistency.details.fontConsistency ? "✓ Consistent" : "✗ Needs work" },
        { label: "Logo Consistency", value: evaluation.designConsistency.details.logoConsistency ? "✓ Consistent" : "✗ Needs work" },
        { label: "Campaign Theme", value: evaluation.designConsistency.details.campaignTheme ? "✓ Aligned" : "✗ Misaligned" },
        { label: "Text Readability", value: `${(evaluation.designConsistency.details.textReadability * 100).toFixed(0)}%` },
        { label: "Spacing Uniformity", value: `${(evaluation.designConsistency.details.spacingUniformity * 100).toFixed(0)}%` }
      ]
    },
    {
      title: "Format & Size",
      icon: <ImageIcon className="h-6 w-6 text-purple-700" />,
      data: evaluation.formatAndSize,
      details: [
        { label: "Aspect Ratio", value: evaluation.formatAndSize.details.aspectRatio.current },
        { label: "Resolution", value: `${evaluation.formatAndSize.details.resolution.width}×${evaluation.formatAndSize.details.resolution.height}` },
        { label: "High Resolution", value: evaluation.formatAndSize.details.resolution.isHighRes ? "✓ High quality" : "✗ Low quality" },
        { label: "File Type", value: evaluation.formatAndSize.details.fileType.current },
        { label: "Type Appropriate", value: evaluation.formatAndSize.details.fileType.isAppropriate ? "✓ Appropriate" : "✗ Consider alternatives" }
      ]
    },
    {
      title: "Content Clarity",
      icon: <Eye className="h-6 w-6 text-indigo-700" />,
      data: evaluation.contentClarity,
      details: [
        { label: "Message Clarity", value: `${(evaluation.contentClarity.details.messageClarity * 100).toFixed(0)}%` },
        { label: "Visual Hierarchy", value: `${(evaluation.contentClarity.details.visualHierarchy * 100).toFixed(0)}%` },
        { label: "Caption Independent", value: !evaluation.contentClarity.details.dependsOnCaption ? "✓ Self-contained" : "✗ Needs caption" }
      ]
    },
    {
      title: "Text Accuracy",
      icon: <Type className="h-6 w-6 text-emerald-700" />,
      data: evaluation.textAccuracy,
      details: [
        { label: "Typo Free", value: evaluation.textAccuracy.details.typosFree ? "✓ No typos" : "✗ Typos found" },
        { label: "Fact Checked", value: evaluation.textAccuracy.details.factChecked ? "✓ Verified" : "⚠ Needs verification" },
        { label: "Accurate Details", value: evaluation.textAccuracy.details.accurateDetails ? "✓ Accurate" : "✗ Inaccurate" },
        { label: "Text Elements", value: evaluation.textAccuracy.details.detectedText.length }
      ]
    },
    {
      title: "Brand Presence",
      icon: <Award className="h-6 w-6 text-orange-700" />,
      data: evaluation.brandPresence,
      details: [
        { label: "Logo Placement", value: `${(evaluation.brandPresence.details.logoPlacement * 100).toFixed(0)}%` },
        { label: "Logo Visibility", value: `${(evaluation.brandPresence.details.logoVisibility * 100).toFixed(0)}%` },
        { label: "Social Handle", value: evaluation.brandPresence.details.socialHandleVisible ? "✓ Visible" : "✗ Missing" },
        { label: "Website Readable", value: evaluation.brandPresence.details.websiteReadable ? "✓ Readable" : "✗ Hard to read" }
      ]
    }
  ];

  const overallScore = Math.round(
    (evaluation.designConsistency.score +
     evaluation.formatAndSize.score +
     evaluation.contentClarity.score +
     evaluation.textAccuracy.score +
     evaluation.brandPresence.score) / 5
  );

  return (
    <div className="space-y-6">
      {/* Overall Score */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 p-6 rounded-lg shadow-sm">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Brand Design Evaluation</h2>
          <div className={`text-4xl font-bold mb-2 px-4 py-2 rounded-lg inline-block ${getScoreColor(overallScore)}`}>
            {overallScore}/10
          </div>
          <p className="text-gray-700 font-medium">Overall Design Quality Score</p>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="grid gap-6">
        {categories.map((category, index) => (
          <div key={index} className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                {category.icon}
                <h3 className="text-lg font-semibold text-gray-900 ml-3">
                  {category.title}
                </h3>
              </div>
              <div className="flex items-center">
                {getScoreIcon(category.data.score)}
                <span className={`text-xl font-bold ml-2 px-3 py-1 rounded-lg ${getScoreColor(category.data.score)}`}>
                  {category.data.score}/10
                </span>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-gray-800 mb-3 leading-relaxed">{category.data.reasoning}</p>
              
              {/* Details Grid */}
              <div className="grid md:grid-cols-2 gap-3 mb-4">
                {category.details.map((detail, detailIndex) => (
                  <div key={detailIndex} className="flex justify-between items-center bg-gray-100 border border-gray-200 px-3 py-2 rounded">
                    <span className="text-sm text-gray-700 font-medium">{detail.label}:</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {typeof detail.value === 'boolean' ? (
                        detail.value ? (
                          <CheckCircle className="h-4 w-4 text-emerald-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )
                      ) : (
                        detail.value
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            {category.data.recommendations.length > 0 && (
              <div className="border-t border-gray-200 pt-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Recommendations:</h4>
                <ul className="space-y-1">
                  {category.data.recommendations.map((rec, recIndex) => (
                    <li key={recIndex} className="text-sm text-gray-700 flex items-start leading-relaxed">
                      <span className="text-blue-700 mr-2 font-bold">•</span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Detected Text Summary */}
      {evaluation.textAccuracy.details.detectedText.length > 0 && (
        <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
            <Type className="h-5 w-5 mr-2 text-emerald-700" />
            Detected Text Elements
          </h3>
          <div className="flex flex-wrap gap-2">
            {evaluation.textAccuracy.details.detectedText.map((text, index) => (
              <span
                key={index}
                className="inline-block bg-blue-100 border border-blue-200 text-blue-800 text-sm px-3 py-1 rounded-full font-medium"
              >
                "{text}"
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
