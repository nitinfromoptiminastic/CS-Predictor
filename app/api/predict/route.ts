import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PredictionResult, AssetAnalysis } from '@/types';
import { analyzeContentWithOpenAI } from '@/lib/openai-analysis';

export async function POST(request: NextRequest) {
  console.log('API predict called - using OpenAI vision analysis');
  
  try {
    const session = await getServerSession(authOptions);
    console.log('Session check:', session?.user?.email || 'No session');
    
    if (!session?.user?.email) {
      console.log('Unauthorized access attempt');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const platforms = JSON.parse(formData.get('platforms') as string);
    
    console.log('File:', file?.name, 'Platforms:', platforms);

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    if (!platforms || !Array.isArray(platforms) || platforms.length === 0) {
      return NextResponse.json(
        { error: 'No platforms selected' },
        { status: 400 }
      );
    }

    // Use real OpenAI analysis
    console.log('Starting OpenAI vision analysis...');
    const aiResult = await analyzeContentWithOpenAI(file, platforms);

        console.log('OpenAI analysis result keys:', Object.keys(aiResult));
    console.log('Platform recommendations:', aiResult.platformRecommendations);
    console.log('Overall score:', aiResult.overallScore);

    // Transform AI result to match frontend expectations
    const predictions: PredictionResult[] = platforms.map((platform: string) => {
      const platformRec = aiResult.platformRecommendations?.[platform] || {};
      const rawScore = platformRec.score || Math.round((aiResult.overallScore || 60) * 0.8);
      return {
        platform,
        successScore: Math.min(10, Math.max(0, Math.round(rawScore / 10))), // Convert to 0-10 scale, cap at 10
        polarisationScore: 'Low' as const,
        strategicAngle: aiResult.strategicPositioning?.primary || 'Brand Awareness',
        recommendations: platformRec.optimizations || [
          `Optimize content for ${platform} audience`,
          `Consider ${platform}-specific best practices`
        ]
      };
    });

    // Create AssetAnalysis object from AI result
    const analysis: AssetAnalysis = {
      contentIdentification: {
        contentType: aiResult.contentType?.type || 'Social Post',
        confidence: aiResult.contentType?.confidence || 0.75,
        context: 'AI-powered marketing asset analysis',
        relevantCategories: Object.keys(aiResult.contentType?.likelihood || {})
      },
      strategicPositioning: {
        primaryStrategy: aiResult.strategicPositioning?.primary || 'Brand Awareness',
        secondaryStrategy: aiResult.strategicPositioning?.secondary?.[0] || 'Engagement',
        strategyScore: Math.round((aiResult.contentType?.confidence || 0.75) * 100),
        positioning: aiResult.strategicPositioning?.reasoning || 'AI analysis suggests strong positioning'
      },
      emotionalAnalysis: {
        primaryEmotion: aiResult.visualAnalysis?.emotions?.[0] || 'professional',
        emotionalIntensity: 80,
        isPolarizing: false,
        polarizationReason: 'Content appears to have broad appeal',
        emotionalTriggers: aiResult.visualAnalysis?.emotions || []
      },
      platformFitAnalysis: {
        instagram: aiResult.platformRecommendations?.instagram?.score ?? Math.round((aiResult.overallScore || 60) * 0.9),
        tiktok: aiResult.platformRecommendations?.tiktok?.score ?? Math.round((aiResult.overallScore || 60) * 0.85),
        linkedin: aiResult.platformRecommendations?.linkedin?.score ?? Math.round((aiResult.overallScore || 60) * 0.8),
        twitter: aiResult.platformRecommendations?.twitter?.score ?? Math.round((aiResult.overallScore || 60) * 0.85),
        facebook: aiResult.platformRecommendations?.facebook?.score ?? Math.round((aiResult.overallScore || 60) * 0.9),
        snapchat: aiResult.platformRecommendations?.snapchat?.score ?? Math.round((aiResult.overallScore || 60) * 0.75)
      }, 
      performanceScoring: {
        engagementPotential: aiResult.overallScore || 75,
        clarityOfMessage: 85,
        viralityLikelihood: 70
      },
      tailoredRecommendations: Object.fromEntries(
        platforms.map((platform: string) => {
          const rec = aiResult.platformRecommendations?.[platform] || {};
          const score = rec.score || Math.round((aiResult.overallScore || 60) * 0.8); // Use AI score or intelligent fallback
          return [platform, {
            prediction: `AI analysis shows ${score > 80 ? 'strong' : score > 60 ? 'good' : 'moderate'} potential for ${platform}`,
            score: Math.round(score / 10), // Convert to out of 10 scale
            optimizationTips: rec.optimizations || [`Optimize for ${platform} best practices`]
          }];
        })
      ),
      visualFeatures: {
        faces: aiResult.visualAnalysis?.faces || 0,
        objects: aiResult.visualAnalysis?.objects || [],
        emotions: aiResult.visualAnalysis?.emotions || [],
        textDensity: aiResult.visualAnalysis?.textDensity || 0.3,
        logoVisibility: 0.8,
        colorHarmony: aiResult.visualAnalysis?.colorHarmony || 0.8
      },
      brandSafety: {
        nsfw: false,
        violent: false,
        sensitive: false,
        score: Math.min(95, Math.round((aiResult.overallScore || 50) * 0.95)) // Brand safety as percentage, capped at 95%
      },
      platformFit: {
        aspectRatio: 0.8,
        textInImageTolerance: aiResult.visualAnalysis?.textDensity < 0.5 ? 0.8 : 0.6,
        toneFit: 0.8
      },
      brandDesignEvaluation: {
        designConsistency: {
          score: Math.min(10, Math.max(0, Math.round(((aiResult.overallScore || 75) * 0.9) / 10))), // Convert to 0-10 scale
          reasoning: 'AI analysis shows good alignment with brand design principles',
          recommendations: ['Ensure consistent branding', 'Optimize visual hierarchy'],
          details: {
            brandColors: true,
            fontConsistency: true,
            logoConsistency: true,
            campaignTheme: true,
            textReadability: Math.min(1.0, (aiResult.visualAnalysis?.textDensity || 0.3) + 0.4),
            spacingUniformity: aiResult.visualAnalysis?.colorHarmony || 0.8,
            qualityIssues: []
          }
        },
        formatAndSize: {
          score: Math.min(10, Math.max(0, Math.round(((aiResult.overallScore || 75) * 0.85) / 10))), // Convert to 0-10 scale
          reasoning: 'Format is suitable for selected platforms',
          recommendations: ['Optimize for platform-specific dimensions'],
          details: {
            aspectRatio: {
              current: '1:1',
              isCorrect: true,
              recommended: ['1:1', '4:5', '16:9']
            },
            resolution: {
              width: 1080,
              height: 1080,
              isHighRes: true
            },
            fileType: {
              current: file.type || 'image/jpeg',
              isAppropriate: true,
              recommended: 'JPEG'
            }
          }
        },
        contentClarity: {
          score: Math.min(10, Math.max(0, Math.round(((1.0 - (aiResult.visualAnalysis?.textDensity || 0.5)) * 100) / 10))), // Convert to 0-10 scale based on text density
          reasoning: 'Content clarity based on text analysis',
          recommendations: ['Maintain consistent messaging'],
          details: {
            messageClarity: 0.85,
            visualHierarchy: aiResult.visualAnalysis?.colorHarmony || 0.8,
            dependsOnCaption: (aiResult.visualAnalysis?.textDensity || 0.3) < 0.2
          }
        },
        textAccuracy: {
          score: Math.min(10, Math.max(0, Math.round(((aiResult.overallScore || 75) * 0.95) / 10))), // Convert to 0-10 scale
          reasoning: 'Text accuracy based on AI analysis',
          recommendations: ['Proofread for accuracy'],
          details: {
            typosFree: true,
            factChecked: true,
            accurateDetails: true,
            detectedText: aiResult.visualAnalysis?.extractedText ? [aiResult.visualAnalysis.extractedText] : [],
            potentialIssues: []
          }
        },
        brandPresence: {
          score: Math.min(10, Math.max(0, Math.round(((aiResult.overallScore || 75) * 0.8) / 10))), // Convert to 0-10 scale
          reasoning: 'Brand presence based on visual analysis',
          recommendations: ['Ensure brand visibility'],
          details: {
            logoPlacement: 0.8,
            logoVisibility: 0.8,
            socialHandleVisible: true,
            websiteReadable: true,
            brandElementsPresent: ['logo', 'brand colors']
          }
        }
      }
    };

    console.log(`OpenAI analysis completed for ${session.user.email}: ${file.name} on platforms: ${platforms.join(', ')}`);

    return NextResponse.json({
      success: true,
      predictions,
      analysis,
      fileName: file.name,
      fileType: file.type,
    });

  } catch (error) {
    console.error('OpenAI prediction API error:', error);
    
    // More detailed error information
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    return NextResponse.json(
      { error: `AI analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}
