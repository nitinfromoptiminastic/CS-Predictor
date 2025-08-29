# Content Success - AI-Powered Marketing Asset Analyzer

## Overview
Content Success is an internal web application for Optiminastic that predicts how marketing assets (images, videos, text) will perform across multiple social media platforms using genuine AI models and machine learning.

## Features

### 🤖 Real AI Analysis
- **Object Detection**: Facebook DETR model for identifying visual elements
- **Emotion Recognition**: DistilRoBERTa for emotional content analysis
- **Sentiment Analysis**: RoBERTa for sentiment scoring
- **NSFW Detection**: Automated content safety screening
- **OCR**: Microsoft TrOCR for text extraction from images
- **Content Classification**: Ollama LLM for intelligent content type determination

### 📊 5-Step Content Analysis
1. **Content Identification**: AI-driven content type classification with confidence scores
2. **Strategic Positioning**: Emotional strategy analysis and positioning recommendations
3. **Emotional Analysis**: Comprehensive emotion detection and polarization assessment
4. **Platform Fit Analysis**: Performance scoring across 7 major social media platforms
5. **Performance Scoring**: Engagement potential, message clarity, and virality likelihood

### 🎯 Platform-Specific Predictions
- Instagram, TikTok, LinkedIn, Twitter, YouTube, Facebook, Snapchat
- Custom optimization tips for each platform
- Performance scores based on platform-specific algorithms

### 🔒 Enterprise Security
- Google Workspace SSO integration
- Domain-restricted access (@optiminastic.com)
- Secure file handling with 5GB upload limit
- Privacy-first architecture (no external data sharing)

## Setup Instructions

### Prerequisites
- Node.js 18+
- npm or yarn
- Hugging Face API account
- Ollama local installation (for LLM inference)

### 1. Clone and Install
```bash
git clone <repository-url>
cd content-success
npm install
```

### 2. Environment Configuration
Create a `.env.local` file with the following variables:

```bash
# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret

# AI Model APIs
HUGGING_FACE_API_KEY=your_hugging_face_api_key_here
OLLAMA_API_URL=http://localhost:11434
```

### 3. Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Configure OAuth consent screen for your domain

### 4. Hugging Face API Setup
1. Create account at [Hugging Face](https://huggingface.co/)
2. Go to Settings → Access Tokens
3. Create a new token with read access
4. Add token to `.env.local` as `HUGGING_FACE_API_KEY`

### 5. Ollama Setup (Local LLM)
```bash
# Install Ollama
curl -fsSL https://ollama.ai/install.sh | sh

# Pull required model
ollama pull llama3.1

# Start Ollama service
ollama serve
```

### 6. Run the Application
```bash
# Development mode
npm run dev

# Production build
npm run build
npm start
```

## AI Models Used

### Hugging Face Models
- **Object Detection**: `facebook/detr-resnet-50`
- **Emotion Recognition**: `j-hartmann/emotion-english-distilroberta-base`
- **Sentiment Analysis**: `cardiffnlp/twitter-roberta-base-sentiment-latest`
- **NSFW Detection**: `Falconsai/nsfw_image_detection`
- **OCR**: `microsoft/trocr-base-printed`

### Local LLM (Ollama)
- **Content Classification**: `llama3.1`
- **Platform Predictions**: `llama3.1`
- **Strategic Analysis**: `llama3.1`

## Usage

1. **Upload Asset**: Drag and drop or select marketing assets (images/videos up to 5GB)
2. **Select Platforms**: Choose target social media platforms for analysis
3. **Analyze**: Click "Analyze Asset Performance" to run AI analysis
4. **Review Results**: Get comprehensive 5-step analysis with platform-specific recommendations
5. **Optimize**: Apply AI-generated optimization tips for better performance

## Technical Architecture

- **Frontend**: Next.js 15 with App Router, TypeScript, TailwindCSS
- **Authentication**: NextAuth.js with Google OAuth
- **AI Integration**: Axios-based HTTP clients for Hugging Face APIs and Ollama
- **File Handling**: Built-in Next.js file upload with 5GB limit
- **State Management**: React hooks and server components
- **Styling**: Modern glassmorphism design with gradients and animations

## Performance Considerations

- **Parallel Processing**: All AI models run concurrently for faster analysis
- **Error Handling**: Graceful degradation with fallback predictions
- **Caching**: Browser-based caching for uploaded assets
- **Timeout Management**: 30s timeout for Hugging Face, 60s for Ollama
- **Memory Optimization**: Efficient buffer handling for large files

## Security Features

- Domain-restricted authentication
- Secure file upload validation
- HTTPS-only cookies in production
- No external data sharing
- Local AI inference option (Ollama)
- Content safety screening (NSFW detection)

## Development

```bash
# Run development server
npm run dev

# Type checking
npm run type-check

# Linting
npm run lint

# Build for production
npm run build
```

## Support

For technical support or questions about the Content Success platform, please contact the Optiminastic development team.

## License

This software is proprietary to Optiminastic and is not licensed for external use or distribution.
