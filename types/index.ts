export interface PlatformConfig {
  id: string;
  name: string;
  icon: string;
  color: string;
  aspectRatios: string[];
  textTolerance: 'low' | 'medium' | 'high';
  visualTone: string[];
}

export interface PredictionResult {
  platform: string;
  successScore: number;
  polarisationScore: 'Low' | 'Medium' | 'High';
  strategicAngle: string;
  recommendations: string[];
}

export interface BrandDesignEvaluation {
  designConsistency: {
    score: number;
    reasoning: string;
    recommendations: string[];
    details: {
      brandColors: boolean;
      fontConsistency: boolean;
      logoConsistency: boolean;
      campaignTheme: boolean;
      textReadability: number;
      spacingUniformity: number;
      qualityIssues: string[];
    };
  };
  formatAndSize: {
    score: number;
    reasoning: string;
    recommendations: string[];
    details: {
      aspectRatio: {
        current: string;
        isCorrect: boolean;
        recommended: string[];
      };
      resolution: {
        width: number;
        height: number;
        isHighRes: boolean;
      };
      fileType: {
        current: string;
        isAppropriate: boolean;
        recommended: string;
      };
      thumbnailStrength?: number; // For video content
    };
  };
  contentClarity: {
    score: number;
    reasoning: string;
    recommendations: string[];
    details: {
      messageClarity: number;
      visualHierarchy: number;
      carouselFlow?: number;
      firstThreeSeconds?: number; // For video content
      dependsOnCaption: boolean;
    };
  };
  textAccuracy: {
    score: number;
    reasoning: string;
    recommendations: string[];
    details: {
      typosFree: boolean;
      factChecked: boolean;
      accurateDetails: boolean;
      detectedText: string[];
      potentialIssues: string[];
    };
  };
  brandPresence: {
    score: number;
    reasoning: string;
    recommendations: string[];
    details: {
      logoPlacement: number;
      logoVisibility: number;
      socialHandleVisible: boolean;
      websiteReadable: boolean;
      brandElementsPresent: string[];
    };
  };
}

export interface AssetAnalysis {
  // Enhanced Content Analysis Framework
  contentIdentification: {
    contentType: string;
    confidence: number;
    context: string;
    relevantCategories: string[];
  };
  strategicPositioning: {
    primaryStrategy: string;
    secondaryStrategy: string;
    strategyScore: number;
    positioning: string;
  };
  emotionalAnalysis: {
    primaryEmotion: string;
    emotionalIntensity: number;
    isPolarizing: boolean;
    polarizationReason: string;
    emotionalTriggers: string[];
  };
  platformFitAnalysis: {
    instagram: number;
    tiktok: number;
    linkedin: number;
    twitter: number;
    youtube: number;
    facebook: number;
    snapchat: number;
  };
  performanceScoring: {
    engagementPotential: number;
    clarityOfMessage: number;
    viralityLikelihood: number;
  };
  tailoredRecommendations: {
    [platform: string]: {
      prediction: string;
      score: number;
      optimizationTips: string[];
    };
  };
  // Original analysis properties
  visualFeatures: {
    faces: number;
    objects: string[];
    emotions: string[];
    textDensity: number;
    logoVisibility: number;
    colorHarmony: number;
  };
  brandSafety: {
    nsfw: boolean;
    violent: boolean;
    sensitive: boolean;
    score: number;
  };
  platformFit: {
    aspectRatio: number;
    textInImageTolerance: number;
    toneFit: number;
  };
  brandDesignEvaluation: BrandDesignEvaluation;
}

export interface AuditLog {
  id: string;
  userId: string;
  userEmail: string;
  action: string;
  timestamp: Date;
  platforms: string[];
  fileName?: string;
  fileType?: string;
}
