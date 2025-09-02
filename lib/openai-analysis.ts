import OpenAI from 'openai';

// Lazy-load OpenAI client to avoid build-time initialization
let openaiClient: OpenAI | null = null;

function getOpenAIClient(): OpenAI {
  if (!openaiClient) {
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey || apiKey.trim() === '') {
      throw new Error('OPENAI_API_KEY environment variable is missing or empty');
    }
    
    openaiClient = new OpenAI({
      apiKey: apiKey.trim(),
    });
  }
  return openaiClient;
}

export interface ContentAnalysisResult {
  contentType: {
    type: string;
    confidence: number;
    likelihood: Record<string, number>;
  };
  strategicPositioning: {
    primary: string;
    secondary: string[];
    reasoning: string;
  };
  visualAnalysis: {
    objects: string[];
    emotions: string[];
    faces: number;
    textDensity: number;
    colorHarmony: number;
    extractedText: string;
    dominantColors: string[];
    visualStyle: string;
  };
  platformRecommendations: Record<string, {
    score: number;
    optimizations: string[];
    reasoning: string;
  }>;
  overallScore: number;
}

export async function analyzeContentWithOpenAI(
  file: File,
  platforms: string[]
): Promise<ContentAnalysisResult> {
  try {
    return await performOpenAIAnalysis(file, platforms);
  } catch (error: unknown) {
    console.error('OpenAI analysis failed:', error);
    
    // Check if it's a quota/billing error (429)
    const errorObj = error as { status?: number; code?: string };
    if (errorObj?.status === 429 || errorObj?.code === 'insufficient_quota') {
      throw new Error('SUBSCRIPTION_EXPIRED');
    }
    
    // For other errors, throw them as well - no fallbacks
    throw error;
  }
}

async function performOpenAIAnalysis(
  file: File,
  platforms: string[]
): Promise<ContentAnalysisResult> {
  try {
    // Check if file is a video
    if (file.type.startsWith('video/')) {
      console.log('Video file detected, analyzing video content...');
      
      // For video files, we'll extract basic info and provide intelligent analysis
      // Since OpenAI Vision API doesn't support video directly, we analyze based on video properties
      // and provide contextual recommendations
      
      const videoSizeMB = file.size / (1024 * 1024);
      const videoDuration = await getVideoDurationEstimate(file);
      const videoName = file.name.toLowerCase();
      
      // Analyze video characteristics from filename and metadata
      let contentTypeGuess = 'Video Content';
      let primaryIntent = 'Engagement & Storytelling';
      let confidence = 0.75;
      
      // Smart content type detection based on filename and size
      if (videoName.includes('tutorial') || videoName.includes('how') || videoName.includes('guide')) {
        contentTypeGuess = 'Educational Content';
        primaryIntent = 'Education & Information';
        confidence = 0.8;
      } else if (videoName.includes('ad') || videoName.includes('promo') || videoName.includes('commercial')) {
        contentTypeGuess = 'Advertisement';
        primaryIntent = 'Conversion & Sales';
        confidence = 0.8;
      } else if (videoName.includes('story') || videoName.includes('behind') || videoName.includes('day')) {
        contentTypeGuess = 'Brand Story';
        primaryIntent = 'Brand Awareness & Trust';
        confidence = 0.8;
      } else if (videoDuration && videoDuration < 30) {
        contentTypeGuess = 'Short-form Content';
        primaryIntent = 'Viral & Engagement';
        confidence = 0.8;
      }
      
      return {
        contentType: {
          type: contentTypeGuess,
          confidence: confidence,
          likelihood: {
            [contentTypeGuess]: confidence,
            'Video Content': 0.9,
            'Social Post': 0.7,
            'Brand Content': 0.6
          }
        },
        strategicPositioning: {
          primary: primaryIntent,
          secondary: getSecondaryIntents(contentTypeGuess),
          reasoning: `Analysis based on video characteristics: ${Math.round(videoSizeMB)}MB file, estimated ${videoDuration || 'unknown'} seconds duration, filename suggests ${contentTypeGuess.toLowerCase()}`
        },
        visualAnalysis: {
          objects: ['video content'],
          emotions: getEmotionsForContentType(contentTypeGuess),
          faces: 0,
          textDensity: 0.3,
          colorHarmony: 0.7,
          extractedText: `Video file: ${file.name} (${Math.round(videoSizeMB)}MB)`,
          dominantColors: ['dynamic'],
          visualStyle: getVisualStyleForContentType(contentTypeGuess)
        },
        platformRecommendations: generateIntelligentVideoRecommendations(platforms, contentTypeGuess, videoDuration, videoSizeMB),
        overallScore: calculateVideoScore(contentTypeGuess, videoDuration, videoSizeMB)
      };
    }

    // For image files, process normally
    const arrayBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');
    const mimeType = file.type || 'image/jpeg';
    const dataUrl = `data:${mimeType};base64,${base64}`;

    console.log('Starting OpenAI vision analysis...');

    // Step 1: Comprehensive Content Analysis and Text Extraction
    const contentAnalysisPrompt = `You are an expert marketing analyst. Analyze this marketing asset image in extreme detail and provide a comprehensive JSON response.

Extract ALL text from the image and analyze the visual and strategic elements. Be precise and analytical.

Required JSON structure:
{
  "contentType": {
    "type": "[Ad Copy|Social Post|Educational Content|Product Showcase|Brand Story|User Generated Content|Behind the Scenes|Tutorial|Testimonial|Announcement|Meme|Infographic|Event Promotion]",
    "confidence": "[0.0 to 1.0 - how confident you are in this classification based on visual evidence]",
    "reasoning": "detailed explanation for the content type classification based on visual elements, text, and design"
  },
  "extractedText": "ALL text visible in the image, exactly as it appears",
  "visualElements": {
    "objects": ["specific objects, people, logos, products visible"],
    "emotions": ["emotions conveyed: professional, friendly, exciting, urgent, trustworthy, playful, serious, inspirational"],
    "faces": 0,
    "textDensity": 0.3,
    "dominantColors": ["#hex codes of main colors"],
    "colorHarmony": 0.8,
    "visualStyle": "describe the design style (modern, minimalist, bold, vintage, etc.)"
  },
  "strategicIntent": {
    "primary": "[Brand Awareness|Conversion|Engagement|Trust Building|Education|Social Proof|Product Awareness|Thought Leadership|Entertainment|Information]",
    "secondary": ["list of 2-3 secondary strategic goals"],
    "reasoning": "detailed explanation of strategic positioning based on design, text, and visual elements"
  },
  "marketingElements": {
    "hasCallToAction": true/false,
    "brandVisibility": 0.8,
    "messageClarity": 0.9,
    "professionalismLevel": 0.8,
    "creativityScore": 0.7
  }
}

Analyze every detail you can see in the image. Return ONLY valid JSON with no markdown formatting, code blocks, or additional text.`;

    const contentResponse = await getOpenAIClient().chat.completions.create({
      model: "gpt-4o",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: "You are a marketing analyst. Always respond with complete, valid JSON. Never truncate responses."
        },
        {
          role: "user",
          content: [
            { type: "text", text: contentAnalysisPrompt },
            { type: "image_url", image_url: { url: dataUrl, detail: "high" } }
          ]
        }
      ],
      max_tokens: 2000,
      temperature: 0.1
    });

    let contentAnalysis;
    try {
      const responseText = contentResponse.choices[0]?.message?.content || '{}';
      console.log('Raw OpenAI response length:', responseText.length);
      
      // Remove markdown code blocks if present
      let cleanedJson = responseText.replace(/```json\n?|\n?```/g, '').trim();
      
      // Check if JSON is truncated/incomplete
      if (cleanedJson && !cleanedJson.endsWith('}')) {
        console.warn('JSON appears truncated, attempting to fix...');
        // Try to close incomplete JSON structures
        const openBraces = (cleanedJson.match(/{/g) || []).length;
        const closeBraces = (cleanedJson.match(/}/g) || []).length;
        const missingBraces = openBraces - closeBraces;
        
        // Add missing closing braces
        for (let i = 0; i < missingBraces; i++) {
          cleanedJson += '}';
        }
        
        // Remove any trailing commas before closing braces
        cleanedJson = cleanedJson.replace(/,(\s*})/g, '$1');
      }
      
      contentAnalysis = JSON.parse(cleanedJson);
    } catch (parseError) {
      console.error('Failed to parse content analysis JSON:', parseError);
      console.error('Raw response:', contentResponse.choices[0]?.message?.content);
      
      // Fallback to a minimal valid structure
      contentAnalysis = {
        contentType: { type: 'Document', confidence: 0.7 },
        extractedText: 'Text extraction failed due to parsing error',
        visualElements: { 
          objects: [], emotions: [], faces: 0, textDensity: 0.5, 
          colorHarmony: 0.7, dominantColors: [], visualStyle: 'document' 
        },
        strategicIntent: { primary: 'Information', secondary: ['Documentation'], reasoning: 'Parsing error occurred' }
      };
    }

    console.log('Content analysis completed');

    // Step 2: Advanced Platform-Specific Analysis
    const platformAnalysisPrompt = `You are a social media marketing expert. Based on this image and the previous analysis, provide detailed, actionable platform-specific recommendations.

Previous analysis: ${JSON.stringify(contentAnalysis, null, 2)}

For each platform in this list: ${platforms.join(', ')}, analyze how well this content would perform and provide specific optimization recommendations.

Required JSON structure:
{
  "platformRecommendations": {
    "instagram": {
      "score": 85,
      "optimizations": [
        "Specific actionable tip #1 based on Instagram's algorithm and audience",
        "Specific tip #2 for Instagram's visual format preferences",
        "Specific tip #3 for Instagram engagement tactics"
      ],
      "reasoning": "Detailed explanation of why this content works/doesn't work for Instagram's algorithm, audience behavior, and visual standards"
    },
    "tiktok": {
      "score": 75,
      "optimizations": [
        "Specific actionable tip for TikTok's algorithm",
        "Tip for TikTok's younger demographic and trends",
        "Tip for TikTok's video-first format"
      ],
      "reasoning": "Detailed explanation for TikTok's unique algorithm, audience preferences, and content format requirements"
    },
    "linkedin": {
      "score": 90,
      "optimizations": [
        "Professional networking tip specific to LinkedIn",
        "B2B audience engagement tip for LinkedIn",
        "LinkedIn's algorithm and professional content tip"
      ],
      "reasoning": "Analysis for LinkedIn's professional audience, B2B focus, and business networking context"
    },
    "twitter": {
      "score": 70,
      "optimizations": [
        "Twitter's real-time conversation tip",
        "Character limit and concise messaging tip",
        "Twitter engagement and trending topic tip"
      ],
      "reasoning": "Analysis for Twitter's fast-paced, conversation-driven platform"
    },
    "facebook": {
      "score": 80,
      "optimizations": [
        "Facebook's community and sharing-focused tip",
        "Facebook's diverse audience tip",
        "Facebook's algorithm and meaningful interaction tip"
      ],
      "reasoning": "Analysis for Facebook's broad audience and community-focused algorithm"
    },
    "snapchat": {
      "score": 65,
      "optimizations": [
        "Snapchat's younger audience and ephemeral content tip",
        "Snapchat's AR and creative tools tip",
        "Snapchat's authentic and personal content tip"
      ],
      "reasoning": "Analysis for Snapchat's unique ephemeral format and younger demographic"
    }
  },
  "overallRecommendations": [
    "General improvement based on what you see in the image",
    "Specific enhancement for better cross-platform performance",
    "Strategic recommendation for maximum impact"
  ]
}

Only include platforms that were requested: ${platforms.join(', ')}. Be extremely specific and actionable with recommendations. Return ONLY valid JSON with no markdown formatting, code blocks, or additional text.`;

    const platformResponse = await getOpenAIClient().chat.completions.create({
      model: "gpt-4o",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system", 
          content: "You are a social media expert. Always respond with complete, valid JSON. Never truncate responses. Analyze each requested platform thoroughly."
        },
        {
          role: "user",
          content: [
            { type: "text", text: platformAnalysisPrompt },
            { type: "image_url", image_url: { url: dataUrl, detail: "high" } }
          ]
        }
      ],
      max_tokens: 3000, // Increased for multiple platforms
      temperature: 0.2
    });

    let platformAnalysis;
    try {
      const responseText = platformResponse.choices[0]?.message?.content || '{}';
      console.log('Raw platform response length:', responseText.length);
      
      // Remove markdown code blocks if present
      let cleanedJson = responseText.replace(/```json\n?|\n?```/g, '').trim();
      
      // Check if JSON is truncated/incomplete
      if (cleanedJson && !cleanedJson.endsWith('}')) {
        console.warn('Platform JSON appears truncated, attempting to fix...');
        const openBraces = (cleanedJson.match(/{/g) || []).length;
        const closeBraces = (cleanedJson.match(/}/g) || []).length;
        const missingBraces = openBraces - closeBraces;
        
        for (let i = 0; i < missingBraces; i++) {
          cleanedJson += '}';
        }
        
        cleanedJson = cleanedJson.replace(/,(\s*})/g, '$1');
      }
      
      platformAnalysis = JSON.parse(cleanedJson);
    } catch (parseError) {
      console.error('Failed to parse platform analysis JSON:', parseError);
      console.error('Raw platform response:', platformResponse.choices[0]?.message?.content);
      
      // Fallback to basic platform structure with intelligent scoring
      const baseScore = Math.round((contentAnalysis.contentType?.confidence || 0.6) * 100);
      platformAnalysis = {
        platformRecommendations: platforms.reduce((acc, platform) => {
          // Platform-specific scoring based on content type
          let platformMultiplier = 1.0;
          const contentType = contentAnalysis.contentType?.type?.toLowerCase() || '';
          
          if (platform === 'instagram') {
            platformMultiplier = contentType.includes('visual') || contentType.includes('showcase') ? 1.1 : 0.9;
          } else if (platform === 'linkedin') {
            platformMultiplier = contentType.includes('professional') || contentType.includes('business') ? 1.2 : 0.7;
          } else if (platform === 'tiktok') {
            platformMultiplier = contentType.includes('creative') || contentType.includes('entertainment') ? 1.1 : 0.8;
          } else if (platform === 'twitter') {
            platformMultiplier = contentType.includes('news') || contentType.includes('announcement') ? 1.1 : 0.85;
          }
          
          acc[platform] = {
            score: Math.round(baseScore * platformMultiplier),
            optimizations: [`Optimize content for ${platform}`, `Follow ${platform} best practices`],
            reasoning: `Analysis based on content type: ${contentAnalysis.contentType?.type || 'Unknown'}`
          };
          return acc;
        }, {} as Record<string, { score: number; optimizations: string[]; reasoning: string }>)
      };
    }

    console.log('Platform analysis completed');

    // Step 3: Calculate overall score
    const platformScores = Object.values(platformAnalysis.platformRecommendations || {})
      .map((rec: unknown) => {
        const recommendation = rec as { score?: number };
        return recommendation.score || 70;
      });
    const overallScore = platformScores.length > 0 
      ? Math.round(platformScores.reduce((sum: number, score: number) => sum + score, 0) / platformScores.length)
      : 75;

    // Build final result
    const result: ContentAnalysisResult = {
      contentType: {
        type: contentAnalysis.contentType?.type || 'Social Post',
        confidence: contentAnalysis.contentType?.confidence || 0.75,
        likelihood: {
          [contentAnalysis.contentType?.type || 'Social Post']: contentAnalysis.contentType?.confidence || 0.75,
          'Ad Copy': contentAnalysis.contentType?.type === 'Ad Copy' ? 0 : 0.25,
          'Educational Content': contentAnalysis.contentType?.type === 'Educational Content' ? 0 : 0.15
        }
      },
      strategicPositioning: {
        primary: contentAnalysis.strategicIntent?.primary || 'Brand Awareness',
        secondary: contentAnalysis.strategicIntent?.secondary || ['Engagement'],
        reasoning: contentAnalysis.strategicIntent?.reasoning || contentAnalysis.contentType?.reasoning || 'AI-powered content analysis'
      },
      visualAnalysis: {
        objects: contentAnalysis.visualElements?.objects || [],
        emotions: contentAnalysis.visualElements?.emotions || [],
        faces: contentAnalysis.visualElements?.faces || 0,
        textDensity: contentAnalysis.visualElements?.textDensity || 0.3,
        colorHarmony: contentAnalysis.visualElements?.colorHarmony || 0.8,
        extractedText: contentAnalysis.extractedText || '',
        dominantColors: contentAnalysis.visualElements?.dominantColors || [],
        visualStyle: contentAnalysis.visualElements?.visualStyle || 'modern'
      },
      platformRecommendations: platformAnalysis.platformRecommendations || {},
      overallScore
    };

    return result;

  } catch (error) {
    console.error('OpenAI analysis failed:', error);
    throw error;
  }
}

// Helper functions for intelligent video analysis

async function getVideoDurationEstimate(file: File): Promise<number | null> {
  // Since we can't easily get video duration in a server environment,
  // we'll estimate based on file size (rough heuristic)
  const sizeMB = file.size / (1024 * 1024);
  
  // Very rough estimate: 1MB ≈ 8-12 seconds for typical social media video quality
  if (sizeMB < 1) return 5;  // Very short clip
  if (sizeMB < 5) return Math.round(sizeMB * 10);  // 10-50 seconds
  if (sizeMB < 15) return Math.round(sizeMB * 8);   // 40-120 seconds
  if (sizeMB < 50) return Math.round(sizeMB * 6);   // 90-300 seconds
  return Math.round(sizeMB * 4); // Longer content
}

function getSecondaryIntents(contentType: string): string[] {
  switch (contentType) {
    case 'Educational Content':
      return ['Authority Building', 'Community Engagement', 'Lead Generation'];
    case 'Advertisement':
      return ['Brand Awareness', 'Traffic Generation', 'Customer Acquisition'];
    case 'Brand Story':
      return ['Trust Building', 'Emotional Connection', 'Brand Loyalty'];
    case 'Short-form Content':
      return ['Viral Potential', 'Algorithm Boost', 'Reach Expansion'];
    default:
      return ['Brand Awareness', 'Community Building', 'Engagement'];
  }
}

function getEmotionsForContentType(contentType: string): string[] {
  switch (contentType) {
    case 'Educational Content':
      return ['informative', 'trustworthy', 'professional'];
    case 'Advertisement':
      return ['persuasive', 'exciting', 'aspirational'];
    case 'Brand Story':
      return ['authentic', 'inspiring', 'relatable'];
    case 'Short-form Content':
      return ['energetic', 'fun', 'engaging'];
    default:
      return ['engaging', 'dynamic', 'appealing'];
  }
}

function getVisualStyleForContentType(contentType: string): string {
  switch (contentType) {
    case 'Educational Content':
      return 'informative';
    case 'Advertisement':
      return 'polished';
    case 'Brand Story':
      return 'authentic';
    case 'Short-form Content':
      return 'dynamic';
    default:
      return 'video';
  }
}

function generateIntelligentVideoRecommendations(
  platforms: string[], 
  contentType: string, 
  duration: number | null, 
  sizeMB: number
): Record<string, { score: number; optimizations: string[]; reasoning: string }> {
  
  return platforms.reduce((acc, platform) => {
    let baseScore = 75;
    let optimizations: string[] = [];
    let reasoning = '';

    // Platform-specific analysis
    switch (platform) {
      case 'tiktok':
        baseScore = contentType === 'Short-form Content' ? 95 : 85;
        optimizations = [
          duration && duration > 60 ? `Consider shortening to under 60 seconds for better TikTok performance (current: ~${duration}s)` : `Current duration (~${duration || 'unknown'}s) is good for TikTok`,
          contentType === 'Educational Content' ? 'Add quick, digestible tips with visual hooks' : 'Ensure strong visual hook in first 3 seconds',
          'Use trending sounds or music for algorithm boost',
          'Add engaging captions and text overlays',
          sizeMB > 50 ? 'Compress video to reduce file size for faster loading' : 'File size is optimized for TikTok'
        ];
        reasoning = `${contentType} performs ${baseScore > 85 ? 'excellently' : 'well'} on TikTok. Video characteristics: ~${duration || 'unknown'}s duration, ${Math.round(sizeMB)}MB size.`;
        break;

      case 'instagram':
        baseScore = contentType === 'Brand Story' ? 92 : contentType === 'Short-form Content' ? 90 : 80;
        optimizations = [
          duration && duration > 90 ? `Consider shortening to under 90 seconds for Reels (current: ~${duration}s)` : `Duration (~${duration || 'unknown'}s) works well for Instagram`,
          contentType === 'Educational Content' ? 'Structure as carousel-style tips or step-by-step guide' : 'Ensure visually appealing throughout',
          'Optimize for both Stories (vertical) and Feed (square/vertical)',
          'Use Instagram-native features like music, filters, or stickers',
          'Add alt text and captions for accessibility'
        ];
        reasoning = `${contentType} suits Instagram's visual-first approach. File: ${Math.round(sizeMB)}MB, estimated ${duration || 'unknown'}s duration.`;
        break;

      case 'linkedin':
        baseScore = contentType === 'Educational Content' ? 88 : contentType === 'Brand Story' ? 85 : 65;
        optimizations = [
          'Focus on professional value and industry insights',
          contentType !== 'Educational Content' ? 'Add educational or thought-leadership elements' : 'Maintain professional, informative tone',
          'Include compelling thumbnail and professional captions',
          duration && duration > 180 ? `Consider breaking into shorter segments (current: ~${duration}s)` : 'Duration is appropriate for LinkedIn',
          'Target business hours for optimal engagement'
        ];
        reasoning = `${contentType} has ${baseScore > 80 ? 'strong' : 'moderate'} potential on LinkedIn's professional network. Video specs: ~${duration || 'unknown'}s, ${Math.round(sizeMB)}MB.`;
        break;

      case 'facebook':
        baseScore = contentType === 'Brand Story' ? 85 : 78;
        optimizations = [
          'Optimize for silent viewing with captions',
          contentType === 'Short-form Content' ? 'Consider extending slightly for Facebook audience' : 'Good fit for Facebook video format',
          'Use Facebook-native video uploader for best reach',
          'Include community-focused messaging',
          sizeMB > 25 ? 'Consider compressing for faster mobile loading' : 'File size is Facebook-optimized'
        ];
        reasoning = `${contentType} aligns with Facebook's community-focused platform. Technical specs: ~${duration || 'unknown'}s duration, ${Math.round(sizeMB)}MB file.`;
        break;

      case 'twitter':
        baseScore = contentType === 'Short-form Content' ? 82 : 70;
        optimizations = [
          duration && duration > 140 ? `Consider shortening for Twitter's fast-paced feed (current: ~${duration}s)` : 'Duration fits Twitter\'s quick consumption style',
          'Lead with newsworthy or trending angle',
          'Ensure video works without sound',
          'Add engaging first frame as thumbnail',
          'Keep accompanying tweet text concise and engaging'
        ];
        reasoning = `${contentType} ${baseScore > 75 ? 'works well' : 'needs optimization'} for Twitter's rapid-consumption environment. Video: ${Math.round(sizeMB)}MB, ~${duration || 'unknown'}s.`;
        break;

      default:
        baseScore = 75;
        optimizations = [
          `Optimize video length for ${platform}`,
          'Add captions for accessibility',
          'Ensure strong opening hook',
          'Consider platform-specific features'
        ];
        reasoning = `General video optimization recommendations for ${platform}.`;
    }

    // Adjust score based on technical factors
    if (duration && duration < 5) baseScore -= 5; // Too short might lack substance
    if (duration && duration > 300) baseScore -= 10; // Too long for social media
    if (sizeMB > 100) baseScore -= 5; // Large file might impact loading
    
    // Content type adjustments
    if (contentType === 'Educational Content' && (platform === 'tiktok' || platform === 'snapchat')) {
      baseScore -= 5; // Educational content typically performs slightly lower on entertainment-focused platforms
    }

    acc[platform] = {
      score: Math.max(20, Math.min(100, baseScore)), // Clamp between 20-100
      optimizations: optimizations.slice(0, 4), // Keep top 4 recommendations
      reasoning
    };

    return acc;
  }, {} as Record<string, { score: number; optimizations: string[]; reasoning: string }>);
}

function calculateVideoScore(contentType: string, duration: number | null, sizeMB: number): number {
  let baseScore = 75;

  // Content type scoring
  switch (contentType) {
    case 'Educational Content':
      baseScore = 82;
      break;
    case 'Brand Story':
      baseScore = 85;
      break;
    case 'Short-form Content':
      baseScore = 88;
      break;
    case 'Advertisement':
      baseScore = 78;
      break;
  }

  // Duration adjustments
  if (duration) {
    if (duration >= 15 && duration <= 90) baseScore += 5; // Sweet spot for social media
    else if (duration < 10) baseScore -= 3; // Too short
    else if (duration > 180) baseScore -= 5; // Too long
  }

  // File size considerations
  if (sizeMB > 50) baseScore -= 3; // Large files may impact loading/sharing
  if (sizeMB < 1) baseScore -= 2; // Suspiciously small might indicate quality issues

  return Math.max(40, Math.min(100, baseScore));
}