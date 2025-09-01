# Content Success Predictor

An internal web app for Optiminastic that predicts how marketing assets (images/videos) will perform across multiple platforms using AI-powered analysis.

## Features

- **Authentication**: Google Workspace SSO restricted to @optiminastic.com
- **Asset Upload**: Drag-and-drop images/videos (processed in-memory only)
- **Platform Analysis**: Multi-platform predictions (Instagram, Facebook, X, TikTok, Snapchat, LinkedIn)
- **AI Predictions**: Success scores, polarisation analysis, strategic insights
- **Brand Safety**: NSFW, violent, and sensitive content detection
- **Reporting**: Downloadable PDF reports
- **Audit Logs**: Track all user activities
- **Privacy**: No asset storage, processed in-memory only

## Tech Stack

### Frontend & Backend
- **Next.js 15** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **NextAuth.js** for Google Workspace authentication
- **React components** with modern hooks

### AI/ML Service
- **Python FastAPI** for model serving
- **PyTorch/TensorFlow** for ML models (production)
- **Computer Vision** for image/video analysis
- **Content Moderation** for brand safety

## Quick Start

### 1. Frontend Setup

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your credentials

# Run development server
npm run dev
```

### 2. OpenAI Setup

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Create an account and add billing information
3. Generate an API key
4. Add the API key to `.env.local`

### 3. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google`
6. Set environment variables in `.env.local`

## Environment Variables

Create `.env.local` with:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-here
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
OPENAI_API_KEY=your-openai-api-key
```

## User Flow

1. **Login** → Google Workspace authentication (@optiminastic.com only)
2. **Upload** → Drag & drop marketing asset
3. **Select Platforms** → Choose target social platforms
4. **Predict** → AI analyzes and scores content
5. **Review Results** → View success scores, polarisation, recommendations
6. **Download Report** → Export PDF for client/internal use

## Security Features

- **No Storage**: Assets processed in-memory, immediately discarded
- **Domain Restriction**: Only @optiminastic.com emails allowed
- **Audit Logging**: All activities tracked with timestamps
- **Brand Safety**: Always-on content moderation
- **HTTPS**: All communications encrypted (production)

## Development Notes

### Current State
- Uses real OpenAI GPT-4O Vision API for analysis
- In-memory audit logging (production should use database)
- Brand safety checks are simulated

### Production Deployment
1. Train and deploy actual ML models
2. Set up proper database for audit logs
3. Configure production Google OAuth
4. Deploy to secure cloud infrastructure
5. Set up monitoring and logging

## Contributing

1. Follow TypeScript strict mode
2. Use ESLint and Prettier
3. Test all authentication flows
4. Ensure responsive design
5. Maintain security best practices

## License

Internal use only - Optiminastic
