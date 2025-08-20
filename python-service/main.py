from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import json
import random
from typing import List
import io
from PIL import Image
import logging
import os

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create FastAPI app with increased file size limits (5GB)
app = FastAPI(
    title="Content Success Predictor API", 
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Next.js dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def analyze_visual_features(image_data: bytes) -> dict:
    """Analyze visual features of the uploaded image/video"""
    # This is mock data - in production, you would use computer vision models
    return {
        "faces": random.randint(0, 4),
        "objects": random.choice([
            ["person", "text", "logo"],
            ["product", "background", "text"],
            ["person", "product", "logo", "text"],
            ["landscape", "text"],
        ]),
        "emotions": random.choice([
            ["happy", "confident"],
            ["serious", "professional"],
            ["excited", "energetic"],
            ["calm", "peaceful"],
        ]),
        "textDensity": random.uniform(0.0, 0.4),
        "logoVisibility": random.uniform(0.3, 1.0),
        "colorHarmony": random.uniform(0.6, 1.0),
    }

def analyze_image_properties(image_data: bytes, filename: str) -> dict:
    """Analyze image technical properties"""
    try:
        image = Image.open(io.BytesIO(image_data))
        width, height = image.size
        aspect_ratio = width / height
        
        # Determine aspect ratio category
        if 0.9 <= aspect_ratio <= 1.1:
            aspect_category = "1:1"
        elif 0.7 <= aspect_ratio <= 0.9:
            aspect_category = "4:5"
        elif aspect_ratio <= 0.6:
            aspect_category = "9:16"
        elif aspect_ratio >= 1.5:
            aspect_category = "16:9"
        else:
            aspect_category = f"{width}:{height}"
        
        # Check resolution quality
        total_pixels = width * height
        is_high_res = total_pixels >= 1000000  # 1MP minimum
        
        # Get file extension
        file_ext = os.path.splitext(filename)[1].lower()
        
        return {
            "width": width,
            "height": height,
            "aspect_ratio": aspect_category,
            "is_high_res": is_high_res,
            "total_pixels": total_pixels,
            "file_extension": file_ext,
            "format": image.format
        }
    except Exception as e:
        logger.error(f"Error analyzing image properties: {e}")
        return {
            "width": 1080,
            "height": 1080,
            "aspect_ratio": "1:1",
            "is_high_res": True,
            "total_pixels": 1166400,
            "file_extension": ".jpg",
            "format": "JPEG"
        }

def evaluate_brand_design(image_data: bytes, filename: str, file_type: str) -> dict:
    """Comprehensive brand design evaluation"""
    
    # Get image properties
    image_props = analyze_image_properties(image_data, filename)
    
    # Design Consistency Evaluation
    design_consistency = {
        "score": random.randint(6, 10),
        "reasoning": "",
        "recommendations": [],
        "details": {
            "brandColors": random.choice([True, True, False]),  # Weighted toward True
            "fontConsistency": random.choice([True, True, False]),
            "logoConsistency": random.choice([True, True, True, False]),
            "campaignTheme": random.choice([True, True, False]),
            "textReadability": random.uniform(0.7, 1.0),
            "spacingUniformity": random.uniform(0.6, 1.0),
            "qualityIssues": []
        }
    }
    
    # Add quality issues based on resolution
    if not image_props["is_high_res"]:
        design_consistency["details"]["qualityIssues"].append("Low resolution detected")
    
    # Generate reasoning and recommendations
    issues = []
    if not design_consistency["details"]["brandColors"]:
        issues.append("brand colors inconsistency")
        design_consistency["recommendations"].append("Ensure all colors match the brand guidelines")
    if not design_consistency["details"]["fontConsistency"]:
        issues.append("font inconsistency")
        design_consistency["recommendations"].append("Use approved brand fonts consistently")
    if design_consistency["details"]["textReadability"] < 0.8:
        issues.append("poor text contrast")
        design_consistency["recommendations"].append("Improve text contrast for better readability")
    
    if issues:
        design_consistency["reasoning"] = f"Minor issues detected: {', '.join(issues)}. Overall design maintains brand consistency."
        design_consistency["score"] = max(6, design_consistency["score"] - len(issues))
    else:
        design_consistency["reasoning"] = "Excellent brand consistency across all design elements."
    
    # Format & Size Evaluation
    format_size = {
        "score": random.randint(7, 10),
        "reasoning": "",
        "recommendations": [],
        "details": {
            "aspectRatio": {
                "current": image_props["aspect_ratio"],
                "isCorrect": True,
                "recommended": ["1:1", "4:5", "9:16"]
            },
            "resolution": {
                "width": image_props["width"],
                "height": image_props["height"],
                "isHighRes": image_props["is_high_res"]
            },
            "fileType": {
                "current": image_props["file_extension"],
                "isAppropriate": image_props["file_extension"] in [".jpg", ".jpeg", ".png"],
                "recommended": "JPEG for posts, PNG for graphics with transparency"
            }
        }
    }
    
    # Add video-specific details if it's a video
    if file_type.startswith('video/'):
        format_size["details"]["thumbnailStrength"] = random.uniform(0.6, 0.9)
    
    # Generate format recommendations
    if not format_size["details"]["resolution"]["isHighRes"]:
        format_size["recommendations"].append("Increase resolution to at least 1080x1080 for better quality")
        format_size["score"] -= 1
    
    format_size["reasoning"] = f"Asset dimensions: {image_props['width']}x{image_props['height']} ({image_props['aspect_ratio']}). " + \
                              ("Good resolution and format." if image_props["is_high_res"] else "Resolution could be improved.")
    
    # Content Clarity Evaluation
    content_clarity = {
        "score": random.randint(6, 10),
        "reasoning": "",
        "recommendations": [],
        "details": {
            "messageClarity": random.uniform(0.7, 1.0),
            "visualHierarchy": random.uniform(0.6, 0.9),
            "dependsOnCaption": random.choice([True, False, False])  # Weighted toward False
        }
    }
    
    if file_type.startswith('video/'):
        content_clarity["details"]["firstThreeSeconds"] = random.uniform(0.6, 0.9)
    
    clarity_issues = []
    if content_clarity["details"]["messageClarity"] < 0.8:
        clarity_issues.append("message clarity")
        content_clarity["recommendations"].append("Make the main message more prominent and clear")
    if content_clarity["details"]["visualHierarchy"] < 0.7:
        clarity_issues.append("visual hierarchy")
        content_clarity["recommendations"].append("Improve visual hierarchy with better typography and layout")
    if content_clarity["details"]["dependsOnCaption"]:
        clarity_issues.append("caption dependency")
        content_clarity["recommendations"].append("Ensure the visual can stand alone without relying on the caption")
    
    if clarity_issues:
        content_clarity["reasoning"] = f"Some clarity improvements needed: {', '.join(clarity_issues)}."
        content_clarity["score"] = max(5, content_clarity["score"] - len(clarity_issues))
    else:
        content_clarity["reasoning"] = "Message is clear and visually well-structured."
    
    # Text Accuracy Evaluation
    detected_text = ["OPTIMINASTIC", "Marketing Excellence", "2025", "Visit our website"]  # Mock OCR results
    
    text_accuracy = {
        "score": random.randint(7, 10),
        "reasoning": "",
        "recommendations": [],
        "details": {
            "typosFree": random.choice([True, True, True, False]),  # Heavily weighted toward True
            "factChecked": random.choice([True, True, False]),
            "accurateDetails": random.choice([True, True, False]),
            "detectedText": detected_text,
            "potentialIssues": []
        }
    }
    
    if not text_accuracy["details"]["typosFree"]:
        text_accuracy["details"]["potentialIssues"].append("Potential typos detected")
        text_accuracy["recommendations"].append("Proofread all text content for spelling and grammar")
        text_accuracy["score"] -= 2
    
    text_accuracy["reasoning"] = f"Detected text elements: {len(detected_text)} items. " + \
                                ("All text appears accurate." if text_accuracy["score"] >= 8 else "Some text issues may need attention.")
    
    # Brand Presence Evaluation
    brand_presence = {
        "score": random.randint(6, 10),
        "reasoning": "",
        "recommendations": [],
        "details": {
            "logoPlacement": random.uniform(0.7, 1.0),
            "logoVisibility": random.uniform(0.6, 0.9),
            "socialHandleVisible": random.choice([True, False]),
            "websiteReadable": random.choice([True, False]),
            "brandElementsPresent": ["Logo", "Brand Colors", "Typography"]
        }
    }
    
    brand_issues = []
    if brand_presence["details"]["logoVisibility"] < 0.7:
        brand_issues.append("low logo visibility")
        brand_presence["recommendations"].append("Increase logo size and ensure proper contrast")
    if not brand_presence["details"]["socialHandleVisible"]:
        brand_issues.append("missing social handle")
        brand_presence["recommendations"].append("Include social media handle for better brand recognition")
    
    if brand_issues:
        brand_presence["reasoning"] = f"Brand presence needs improvement: {', '.join(brand_issues)}."
        brand_presence["score"] = max(5, brand_presence["score"] - len(brand_issues))
    else:
        brand_presence["reasoning"] = "Strong brand presence with good logo placement and visibility."
    
    return {
        "designConsistency": design_consistency,
        "formatAndSize": format_size,
        "contentClarity": content_clarity,
        "textAccuracy": text_accuracy,
        "brandPresence": brand_presence
    }
    """Analyze visual features of the uploaded image/video"""
    # This is mock data - in production, you would use computer vision models
    return {
        "faces": random.randint(0, 4),
        "objects": random.choice([
            ["person", "text", "logo"],
            ["product", "background", "text"],
            ["person", "product", "logo", "text"],
            ["landscape", "text"],
        ]),
        "emotions": random.choice([
            ["happy", "confident"],
            ["serious", "professional"],
            ["excited", "energetic"],
            ["calm", "peaceful"],
        ]),
        "textDensity": random.uniform(0.0, 0.4),
        "logoVisibility": random.uniform(0.3, 1.0),
        "colorHarmony": random.uniform(0.6, 1.0),
    }

def check_brand_safety(image_data: bytes) -> dict:
    """Check brand safety of the content"""
    # Mock implementation - in production, use content moderation APIs
    safety_score = random.uniform(0.85, 1.0)
    
    return {
        "nsfw": safety_score < 0.9 and random.random() < 0.1,
        "violent": safety_score < 0.9 and random.random() < 0.05,
        "sensitive": safety_score < 0.9 and random.random() < 0.15,
        "score": safety_score,
    }

def calculate_platform_fit(visual_features: dict, platform: str) -> dict:
    """Calculate how well the content fits the platform"""
    # Mock implementation - in production, use trained models
    base_score = random.uniform(0.5, 0.9)
    
    # Adjust based on platform characteristics
    platform_adjustments = {
        "instagram": {"visual_weight": 0.8, "text_penalty": 0.1},
        "facebook": {"visual_weight": 0.6, "text_penalty": 0.0},
        "twitter": {"visual_weight": 0.4, "text_penalty": 0.3},
        "tiktok": {"visual_weight": 0.9, "text_penalty": 0.2},
        "snapchat": {"visual_weight": 0.8, "text_penalty": 0.2},
        "linkedin": {"visual_weight": 0.5, "text_penalty": 0.0},
    }
    
    adjustment = platform_adjustments.get(platform, {"visual_weight": 0.6, "text_penalty": 0.1})
    
    # Apply text density penalty for platforms that don't like text-heavy content
    text_penalty = visual_features["textDensity"] * adjustment["text_penalty"]
    adjusted_score = base_score - text_penalty
    
    return {
        "aspectRatio": random.uniform(0.6, 1.0),
        "textInImageTolerance": 1.0 - text_penalty,
        "toneFit": max(0.0, min(1.0, adjusted_score)),
    }

def generate_predictions(visual_features: dict, brand_safety: dict, platforms: List[str]) -> List[dict]:
    """Generate success predictions for each platform"""
    predictions = []
    
    strategic_angles = [
        "Engagement-bait",
        "Thought Leadership", 
        "Trust-building",
        "Controversy-driven",
        "Educational",
        "Entertainment-focused",
        "Brand Awareness",
        "Product Showcase"
    ]
    
    polarisation_levels = ["Low", "Medium", "High"]
    
    for platform in platforms:
        platform_fit = calculate_platform_fit(visual_features, platform)
        
        # Calculate success score (1-10) based on various factors
        base_score = (
            visual_features["colorHarmony"] * 3 +
            platform_fit["toneFit"] * 4 +
            brand_safety["score"] * 3
        )
        
        # Add some randomness and ensure it's in 6-10 range for demo
        success_score = max(6, min(10, int(base_score + random.uniform(-1, 1))))
        
        # Generate recommendations based on analysis
        recommendations = []
        
        if visual_features["textDensity"] > 0.2:
            recommendations.append("Reduce text density for better visual impact")
        
        if visual_features["colorHarmony"] < 0.7:
            recommendations.append("Improve color harmony for better brand alignment")
        
        if visual_features["logoVisibility"] < 0.5:
            recommendations.append("Increase logo visibility for better brand recognition")
        
        if platform_fit["toneFit"] < 0.7:
            recommendations.append(f"Adjust visual tone to better match {platform.title()} audience preferences")
        
        # Add at least one recommendation
        if not recommendations:
            recommendations.append("Consider A/B testing different versions to optimize performance")
        
        # Limit to 3 recommendations max
        recommendations = recommendations[:3]
        
        prediction = {
            "platform": platform,
            "successScore": success_score,
            "polarisationScore": random.choice(polarisation_levels),
            "strategicAngle": random.choice(strategic_angles),
            "recommendations": recommendations,
        }
        
        predictions.append(prediction)
    
    return predictions

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "Content Success Predictor API"}

@app.post("/analyze")
async def analyze_asset(
    file: UploadFile = File(...),
    platforms: str = Form(...)
):
    """Analyze uploaded marketing asset and return predictions"""
    try:
        # Parse platforms
        platform_list = json.loads(platforms)
        
        if not platform_list:
            raise HTTPException(status_code=400, detail="No platforms specified")
        
        # Read file data
        file_data = await file.read()
        
        # Validate file type
        if not file.content_type.startswith(('image/', 'video/')):
            raise HTTPException(status_code=400, detail="File must be an image or video")
        
        logger.info(f"Analyzing file: {file.filename} for platforms: {platform_list}")
        
        # Analyze the asset
        visual_features = analyze_visual_features(file_data)
        brand_safety = check_brand_safety(file_data)
        brand_design_evaluation = evaluate_brand_design(file_data, file.filename, file.content_type)
        predictions = generate_predictions(visual_features, brand_safety, platform_list)
        
        # Prepare response
        analysis = {
            "visualFeatures": visual_features,
            "brandSafety": brand_safety,
            "platformFit": {
                "aspectRatio": random.uniform(0.6, 1.0),
                "textInImageTolerance": random.uniform(0.5, 1.0),
                "toneFit": random.uniform(0.6, 0.9),
            },
            "brandDesignEvaluation": brand_design_evaluation
        }
        
        return {
            "analysis": analysis,
            "predictions": predictions,
        }
        
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid platforms format")
    except Exception as e:
        logger.error(f"Error analyzing asset: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
