"""
Startup script for the Content Success AI service
This script initializes all AI models and starts the FastAPI server
"""
import logging
import sys
import os

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

logger = logging.getLogger(__name__)

def check_dependencies():
    """Check if all required dependencies are installed"""
    required_packages = [
        ("transformers", "transformers"), 
        ("torch", "torch"), 
        ("torchvision", "torchvision"), 
        ("cv2", "opencv-python-headless"),
        ("nltk", "nltk"), 
        ("PIL", "pillow"), 
        ("numpy", "numpy"), 
        ("requests", "requests"), 
        ("fastapi", "fastapi"), 
        ("uvicorn", "uvicorn")
    ]
    
    missing_packages = []
    
    for import_name, package_name in required_packages:
        try:
            __import__(import_name)
        except ImportError:
            missing_packages.append(package_name)
    
    if missing_packages:
        logger.error(f"Missing required packages: {missing_packages}")
        logger.error("Please run: pip install -r requirements.txt")
        return False
    
    return True

def initialize_models():
    """Initialize AI models on startup"""
    try:
        logger.info("Initializing AI models...")
        from ai_models import get_ai_service
        
        # This will trigger model loading
        ai_service = get_ai_service()
        logger.info("AI models initialized successfully!")
        
        return True
        
    except Exception as e:
        logger.error(f"Failed to initialize AI models: {e}")
        logger.error("The service will continue with fallback functionality")
        return False

def main():
    """Main startup function"""
    logger.info("Starting Content Success AI Service...")
    
    # Check dependencies
    if not check_dependencies():
        sys.exit(1)
    
    # Initialize models (non-blocking, continues even if models fail)
    initialize_models()
    
    # Start the server
    logger.info("Starting FastAPI server...")
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=False,  # Set to False in production
        workers=1,     # AI models are memory intensive
        log_level="info"
    )

if __name__ == "__main__":
    main()
