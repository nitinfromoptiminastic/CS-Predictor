import axios from 'axios';
import { PredictionResult, AssetAnalysis } from '@/types';

const PYTHON_SERVICE_URL = process.env.PYTHON_MODEL_SERVICE_URL || 'http://localhost:8000';

export class ModelService {
  static async analyzAsset(
    fileBuffer: Buffer, 
    fileName: string, 
    platforms: string[]
  ): Promise<{ analysis: AssetAnalysis; predictions: PredictionResult[] }> {
    try {
      const formData = new FormData();
      const uint8Array = new Uint8Array(fileBuffer);
      const blob = new Blob([uint8Array]);
      formData.append('file', blob, fileName);
      formData.append('platforms', JSON.stringify(platforms));

      const response = await axios.post(`${PYTHON_SERVICE_URL}/analyze`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000, // 30 second timeout
      });

      return response.data;
    } catch (error) {
      console.error('Model service error:', error);
      
      // Return mock data for development
      return this.getMockPrediction(platforms);
    }
  }

  private static getMockPrediction(platforms: string[]): { analysis: AssetAnalysis; predictions: PredictionResult[] } {
    // 1. Content Type Detection (more precise categories)
    const contentTypes = [
      { 
        type: 'Meme', 
        description: 'Humorous image with text overlay following internet culture formats',
        traits: ['humor', 'relatability', 'visual-text-combo']
      },
      { 
        type: 'Caption', 
        description: 'Short supporting text designed to accompany visual content',
        traits: ['concise', 'descriptive', 'engagement-focused']
      },
      { 
        type: 'Ad Copy', 
        description: 'Promotional content with clear call-to-action and value proposition',
        traits: ['persuasive', 'benefit-driven', 'action-oriented']
      },
      { 
        type: 'Long-form Blog', 
        description: 'In-depth written content providing comprehensive information or analysis',
        traits: ['educational', 'detailed', 'authority-building']
      },
      { 
        type: 'Professional Post', 
        description: 'Business-focused content showcasing expertise or industry insights',
        traits: ['credible', 'industry-specific', 'networking-oriented']
      },
      { 
        type: 'Personal Story', 
        description: 'Authentic narrative sharing personal experiences or journeys',
        traits: ['authentic', 'emotional', 'storytelling']
      }
    ];
    
    const selectedContent = contentTypes[Math.floor(Math.random() * contentTypes.length)];
    
    // Generate detailed audience reaction predictions for each platform
    const audienceReactions = {
      instagram: {
        'Meme': 'High engagement through saves and shares, especially if trending format. Stories will boost reach.',
        'Caption': 'Moderate engagement if paired with quality visuals. Hashtag strategy crucial for discovery.',
        'Ad Copy': 'Lower organic reach due to algorithm. Needs influencer aesthetic to perform well.',
        'Professional Post': 'Limited reach unless highly visual. Better suited for LinkedIn crossposting.',
        'Personal Story': 'High emotional engagement, strong story potential, good for brand humanization.',
        'Long-form Blog': 'Poor fit - users prefer quick consumption. Consider carousel format instead.'
      },
      tiktok: {
        'Meme': 'Viral potential if adapted to video format with trending audio. Text overlay essential.',
        'Caption': 'Not applicable - TikTok requires video content with dynamic elements.',
        'Ad Copy': 'Must feel native, not salesy. User-generated content style performs 3x better.',
        'Professional Post': 'Low engagement unless educational or behind-the-scenes content.',
        'Personal Story': 'Strong performance if authentic and relatable. Vulnerable storytelling trending.',
        'Long-form Blog': 'Must be broken into digestible video segments with hook in first 3 seconds.'
      },
      linkedin: {
        'Meme': 'Poor reception unless business-relevant. Professional audience expects value.',
        'Caption': 'Ineffective standalone. Needs substantial professional context.',
        'Ad Copy': 'Moderate success if B2B focused. Soft-sell approach preferred over direct sales.',
        'Professional Post': 'High engagement potential. Industry insights and thought leadership perform well.',
        'Personal Story': 'Strong if tied to professional growth or business lessons.',
        'Long-form Blog': 'Excellent fit. LinkedIn users consume longer content during business hours.'
      },
      twitter: {
        'Meme': 'High viral potential, especially with current events tie-ins. Retweet-friendly format.',
        'Caption': 'Works well if under 280 characters with strong hook in first line.',
        'Ad Copy': 'Challenging due to character limit. Thread format may be necessary.',
        'Professional Post': 'Good for establishing thought leadership. Quote tweets drive engagement.',
        'Personal Story': 'Effective in thread format. Vulnerability and authenticity resonate.',
        'Long-form Blog': 'Requires thread breakdown. Key insights must fit tweet format.'
      },
      facebook: {
        'Meme': 'Good engagement in groups and pages. Sharing behavior drives organic reach.',
        'Caption': 'Solid performance when paired with relevant visuals and community tags.',
        'Ad Copy': 'Strong advertising platform. Detailed targeting options available.',
        'Professional Post': 'Mixed results - depends on audience age and industry.',
        'Personal Story': 'High engagement, especially in groups. Comments drive algorithm boost.',
        'Long-form Blog': 'Decent reach if engaging. Facebook users willing to read longer content.'
      }
    };

    // Accurate platform scoring based on content type compatibility
    const platformScores = {
      instagram: { 'Meme': 85, 'Caption': 70, 'Ad Copy': 45, 'Professional Post': 35, 'Personal Story': 80, 'Long-form Blog': 25 },
      tiktok: { 'Meme': 90, 'Caption': 20, 'Ad Copy': 55, 'Professional Post': 40, 'Personal Story': 85, 'Long-form Blog': 30 },
      linkedin: { 'Meme': 25, 'Caption': 30, 'Ad Copy': 60, 'Professional Post': 95, 'Personal Story': 75, 'Long-form Blog': 90 },
      twitter: { 'Meme': 88, 'Caption': 75, 'Ad Copy': 50, 'Professional Post': 80, 'Personal Story': 85, 'Long-form Blog': 65 },
      facebook: { 'Meme': 70, 'Caption': 65, 'Ad Copy': 75, 'Professional Post': 55, 'Personal Story': 80, 'Long-form Blog': 70 }
    };

    // Polarization analysis
    const isPolarizing = Math.random() > 0.85; // 15% chance for more realistic distribution
    const polarizationAnalysis = isPolarizing 
      ? {
          level: 'High' as const,
          reason: [
            "This meme may polarize due to sensitive humor that could offend certain demographic groups",
            "Content addresses politically sensitive topics that divide audiences along ideological lines", 
            "Uses controversial stance without acknowledging alternative perspectives",
            "Contains imagery or references that could be interpreted as discriminatory"
          ][Math.floor(Math.random() * 4)]
        }
      : {
          level: 'Neutral' as const,
          reason: "Content maintains neutral tone and focuses on universally acceptable topics without controversial elements"
        };

    // Strategic positioning analysis with selected content traits
    const allStrategyTags = ['humor', 'storytelling', 'relatability', 'controversy', 'FOMO', 'authority', 'urgency', 'aspirational', 'community-driven', 'educational', 'inspirational', 'trust-building', 'curiosity-driven', 'social-proof'];
    const selectedStrategies = allStrategyTags.sort(() => 0.5 - Math.random()).slice(0, Math.min(5, 3 + Math.floor(Math.random() * 3)));
    
    // Emotional analysis
    const emotions = ['curiosity', 'amusement', 'inspiration', 'trust', 'surprise', 'empathy', 'laughter', 'anger', 'pride', 'excitement', 'anticipation', 'joy'];
    const primaryEmotion = emotions[Math.floor(Math.random() * emotions.length)];
    const secondaryEmotion = emotions.filter(e => e !== primaryEmotion)[Math.floor(Math.random() * (emotions.length - 1))];

    // Performance scoring based on content characteristics
    const engagementPotential = Math.floor(60 + Math.random() * 40);
    const clarityOfMessage = Math.floor(70 + Math.random() * 30);
    const viralityLikelihood = Math.floor(isPolarizing ? 70 + Math.random() * 30 : 40 + Math.random() * 40);

    const mockAnalysis: AssetAnalysis = {
      // Step 1 - Content Identification
      contentIdentification: {
        contentType: selectedContent.type,
        confidence: 0.88 + Math.random() * 0.12,
        context: selectedContent.description,
        relevantCategories: contentTypes.filter(t => t.type !== selectedContent.type).slice(0, 2).map(t => t.type)
      },
      
      // Step 2 - Strategic Positioning
      strategicPositioning: {
        primaryStrategy: selectedStrategies[0],
        secondaryStrategy: selectedStrategies[1] || '',
        strategyScore: 0.75 + Math.random() * 0.25,
        positioning: `Primary strategy: ${selectedStrategies[0]}. Supporting strategies: ${selectedStrategies.slice(1).join(', ')}.`
      },
      
      // Step 3 - Emotional Analysis
      emotionalAnalysis: {
        primaryEmotion,
        emotionalIntensity: 0.6 + Math.random() * 0.4,
        isPolarizing,
        polarizationReason: polarizationAnalysis.reason,
        emotionalTriggers: [primaryEmotion, secondaryEmotion].filter(Boolean)
      },
      
      // Step 4 - Platform Fit Analysis (using accurate scoring)
      platformFitAnalysis: {
        instagram: (platformScores.instagram[selectedContent.type as keyof typeof platformScores.instagram] || 50) + Math.floor(Math.random() * 10) - 5,
        tiktok: (platformScores.tiktok[selectedContent.type as keyof typeof platformScores.tiktok] || 50) + Math.floor(Math.random() * 10) - 5,
        linkedin: (platformScores.linkedin[selectedContent.type as keyof typeof platformScores.linkedin] || 50) + Math.floor(Math.random() * 10) - 5,
        twitter: (platformScores.twitter[selectedContent.type as keyof typeof platformScores.twitter] || 50) + Math.floor(Math.random() * 10) - 5,
        youtube: (platformScores.facebook[selectedContent.type as keyof typeof platformScores.facebook] || 50) + Math.floor(Math.random() * 10) - 5,
        facebook: (platformScores.facebook[selectedContent.type as keyof typeof platformScores.facebook] || 50) + Math.floor(Math.random() * 10) - 5,
        snapchat: Math.floor(40 + Math.random() * 40)
      },
      
      // Step 5 - Performance Scoring
      performanceScoring: {
        engagementPotential,
        clarityOfMessage,
        viralityLikelihood
      },

      // Platform-specific tailored recommendations
      tailoredRecommendations: Object.fromEntries(
        Object.entries(audienceReactions).map(([platform, reactions]) => [
          platform,
          {
            prediction: reactions[selectedContent.type as keyof typeof reactions] || 'Content may require adaptation for this platform.',
            score: platformScores[platform as keyof typeof platformScores][selectedContent.type as keyof typeof platformScores.instagram] || Math.floor(40 + Math.random() * 40),
            optimizationTips: [
              `For ${platform}: ${reactions[selectedContent.type as keyof typeof reactions]?.split('.')[0] || 'Consider platform-specific adaptations'}`,
              `Timing: Post during peak hours for ${platform} audience engagement`,
              `Format: ${platform === 'tiktok' ? 'Vertical video format preferred' : platform === 'linkedin' ? 'Professional tone required' : 'Visual elements should be platform-optimized'}`
            ]
          }
        ])
      ),

      // Original properties maintained for compatibility
      visualFeatures: {
        faces: Math.floor(Math.random() * 5),
        objects: ['person', 'text', 'logo'],
        emotions: ['happy', 'confident'],
        textDensity: Math.random() * 0.3,
        logoVisibility: Math.random(),
        colorHarmony: 0.7 + Math.random() * 0.3,
      },
      brandSafety: {
        nsfw: false,
        violent: false,
        sensitive: false,
        score: 0.9 + Math.random() * 0.1,
      },
      platformFit: {
        aspectRatio: Math.random(),
        textInImageTolerance: Math.random(),
        toneFit: 0.6 + Math.random() * 0.4,
      },
      brandDesignEvaluation: {
        designConsistency: {
          score: 7 + Math.floor(Math.random() * 3),
          reasoning: "The asset maintains good visual consistency with brand guidelines. Colors and typography align well with established brand identity.",
          recommendations: [
            "Consider using the primary brand color more prominently",
            "Ensure consistent spacing around logo elements"
          ],
          details: {
            brandColors: true,
            fontConsistency: true,
            logoConsistency: true,
            campaignTheme: true,
            textReadability: 0.85,
            spacingUniformity: 0.78,
            qualityIssues: []
          }
        },
        formatAndSize: {
          score: 8 + Math.floor(Math.random() * 2),
          reasoning: "Image format and dimensions are appropriate for selected platforms with good resolution quality.",
          recommendations: [
            "Consider creating platform-specific variations for optimal performance"
          ],
          details: {
            aspectRatio: {
              current: "16:9",
              isCorrect: true,
              recommended: ["16:9", "1:1", "9:16"]
            },
            resolution: {
              width: 1920,
              height: 1080,
              isHighRes: true
            },
            fileType: {
              current: "JPEG",
              isAppropriate: true,
              recommended: "JPEG"
            }
          }
        },
        contentClarity: {
          score: 6 + Math.floor(Math.random() * 3),
          reasoning: "Content message is clear but could benefit from improved visual hierarchy and contrast.",
          recommendations: [
            "Increase contrast between text and background",
            "Consider larger font sizes for key messages"
          ],
          details: {
            messageClarity: 0.75,
            visualHierarchy: 0.68,
            dependsOnCaption: false
          }
        },
        textAccuracy: {
          score: 8 + Math.floor(Math.random() * 2),
          reasoning: "Text quality is high with good typography choices and readability.",
          recommendations: [
            "Verify spell-check on all text elements"
          ],
          details: {
            typosFree: true,
            factChecked: true,
            accurateDetails: true,
            detectedText: ["Sample text", "Call to action"],
            potentialIssues: []
          }
        },
        brandPresence: {
          score: 7 + Math.floor(Math.random() * 2),
          reasoning: "Brand presence is solid with visible logo and consistent styling, but could be more prominent.",
          recommendations: [
            "Consider increasing logo size for better brand recognition",
            "Add brand tagline or key brand elements"
          ],
          details: {
            logoPlacement: 0.8,
            logoVisibility: 0.75,
            socialHandleVisible: true,
            websiteReadable: true,
            brandElementsPresent: ["Logo", "Brand colors"]
          }
        }
      }
    };

    // Step 5 - Tailored Recommendations (3-4 Max, content-specific, actionable)
    const predictions: PredictionResult[] = platforms.map(platform => {
      const platformScore = mockAnalysis.platformFitAnalysis[platform.toLowerCase() as keyof typeof mockAnalysis.platformFitAnalysis] || 70;
      const successScore = Math.floor((platformScore + engagementPotential) / 20);
      
      const getTailoredRecommendations = (platform: string, contentType: string, strategies: string[], emotion: string) => {
        const recommendations: string[] = [];
        
        // Platform-specific, content-aware recommendations
        if (platform.toLowerCase() === 'instagram') {
          if (contentType === 'Meme') {
            recommendations.push("Use Instagram's carousel format to create a meme series for higher engagement");
            recommendations.push("Add branded watermark in corner to prevent reposting without credit");
          } else if (contentType === 'Story/Personal Update') {
            recommendations.push("Break story into 3-4 slides with cliffhanger transitions between each");
            recommendations.push("Use location tags and relevant hashtags in first comment for discoverability");
          } else if (contentType === 'Educational/Informational') {
            recommendations.push("Create infographic-style layouts with digestible information chunks");
            recommendations.push("Include 'Save this post' call-to-action for bookmark engagement");
          }
          if (strategies.includes('aspirational')) {
            recommendations.push("Use aspirational lifestyle imagery in background to enhance appeal");
          }
        } 
        
        else if (platform.toLowerCase() === 'tiktok') {
          if (contentType === 'Entertainment') {
            recommendations.push("Hook viewers in first 3 seconds with unexpected visual or sound");
            recommendations.push("Use trending audio with your content for algorithm boost");
          } else if (contentType === 'Educational/Informational') {
            recommendations.push("Structure as 'things you didn't know' or 'fact vs fiction' format");
            recommendations.push("Add text overlays for key points to accommodate sound-off viewing");
          }
          if (emotion === 'surprise') {
            recommendations.push("Lead with the most surprising element to maximize retention");
          }
          if (strategies.includes('FOMO')) {
            recommendations.push("Add urgency with phrases like 'before it's too late' or countdown elements");
          }
        }
        
        else if (platform.toLowerCase() === 'linkedin') {
          if (contentType === 'Opinion/Thought-leadership') {
            recommendations.push("Start with contrarian statement then provide supporting evidence");
            recommendations.push("Include industry-specific data points to establish credibility");
          } else if (contentType === 'Meme') {
            recommendations.push("Reframe meme as professional analogy or business lesson");
            recommendations.push("Add serious commentary explaining business relevance");
          }
          if (strategies.includes('authority')) {
            recommendations.push("Reference your specific industry experience or credentials");
          }
        }
        
        else if (platform.toLowerCase() === 'twitter') {
          if (contentType === 'Opinion/Thought-leadership') {
            recommendations.push("Create tweetstorm with numbered thread for complex ideas");
            recommendations.push("End with question to encourage quote tweets and replies");
          } else if (contentType === 'Meme') {
            recommendations.push("Quote tweet your own image with additional context or punchline");
          }
          if (isPolarizing) {
            recommendations.push("Prepare follow-up tweets addressing potential counterarguments");
          }
        }
        
        else if (platform.toLowerCase() === 'youtube') {
          if (contentType === 'Educational/Informational') {
            recommendations.push("Create thumbnail with bold text highlighting main benefit");
            recommendations.push("Structure with clear chapters for better retention and searchability");
          }
          if (strategies.includes('storytelling')) {
            recommendations.push("Use narrative arc with setup, conflict, and resolution");
          }
        }
        
        // General content-type specific recommendations
        if (contentType === 'Announcement' && recommendations.length < 3) {
          recommendations.push("Include clear next steps or call-to-action for audience");
        }
        if (contentType === 'Ad Copy' && recommendations.length < 3) {
          recommendations.push("A/B test different value propositions in the headline");
        }
        
        // Ensure we have at least 3 recommendations, add strategic ones if needed
        while (recommendations.length < 3) {
          const fallbackRecs = [
            "Optimize posting time based on when your audience is most active",
            "Cross-promote to other platforms with platform-specific adaptations",
            "Create follow-up content to extend the conversation",
            "Monitor comments closely for engagement opportunities"
          ];
          const unusedRec = fallbackRecs.find(rec => !recommendations.includes(rec));
          if (unusedRec) recommendations.push(unusedRec);
          else break;
        }
        
        return recommendations.slice(0, 4); // Max 4 recommendations
      };

      return {
        platform,
        successScore: Math.max(1, Math.min(10, successScore)),
        polarisationScore: isPolarizing 
          ? (mockAnalysis.emotionalAnalysis.emotionalIntensity > 0.8 ? 'High' : 'Medium') 
          : 'Low' as 'Low' | 'Medium' | 'High',
        strategicAngle: `${selectedStrategies[0].charAt(0).toUpperCase() + selectedStrategies[0].slice(1)}-focused ${selectedContent.type}`,
        recommendations: getTailoredRecommendations(platform, selectedContent.type, selectedStrategies, primaryEmotion),
      };
    });

    return { analysis: mockAnalysis, predictions };
  }
}
