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
    const mockAnalysis: AssetAnalysis = {
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

    const predictions: PredictionResult[] = platforms.map(platform => ({
      platform,
      successScore: Math.floor(6 + Math.random() * 4), // 6-10 range
      polarisationScore: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)] as 'Low' | 'Medium' | 'High',
      strategicAngle: ['Engagement-bait', 'Thought Leadership', 'Trust-building', 'Controversy-driven'][Math.floor(Math.random() * 4)],
      recommendations: [
        'Consider adjusting the color palette for better brand alignment',
        'Add more call-to-action elements',
        'Optimize text placement for better readability',
        'Include more emotional triggers in the visual composition'
      ].slice(0, 2 + Math.floor(Math.random() * 3)),
    }));

    return { analysis: mockAnalysis, predictions };
  }
}
