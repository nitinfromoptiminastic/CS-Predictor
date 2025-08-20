# Python Model Service for Content Success Predictor

This directory contains the Python FastAPI service that provides AI-powered analysis of marketing assets.

## Setup

1. Create a Python virtual environment:
```bash
python -m venv model_service
source model_service/bin/activate  # On Windows: model_service\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run the service:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## Development

The service currently returns mock data for development purposes. In production, you would:

1. Train ML models using PyTorch/TensorFlow/HuggingFace
2. Implement actual image/video analysis
3. Add brand safety detection
4. Implement platform-specific scoring algorithms

## API Endpoints

- `POST /analyze` - Analyze uploaded asset and return predictions
- `GET /health` - Health check endpoint
