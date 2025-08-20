# Development Setup Guide

This guide will help you set up the Content Success Predictor for development.

## Prerequisites

- **Node.js** (v18 or later)
- **Python** (v3.9 or later)
- **Git**
- **Google Cloud Console access** (for OAuth setup)

## Quick Start

### Option 1: Automated Setup (Windows)
```bash
# Clone the repository
git clone <repository-url>
cd content-success

# Run the automated setup
./start.bat
```

### Option 2: Manual Setup

#### 1. Install Dependencies
```bash
# Install Node.js dependencies
npm install

# Set up Python virtual environment
cd python-service
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cd ..
```

#### 2. Environment Configuration

Copy the environment template:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your values:
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-here
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
PYTHON_MODEL_SERVICE_URL=http://localhost:8000
```

#### 3. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Choose "Web application"
6. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google`
7. Copy Client ID and Client Secret to `.env.local`

#### 4. Start Services

**Terminal 1 - Python Service:**
```bash
cd python-service
source venv/bin/activate  # Windows: venv\Scripts\activate
python main.py
```

**Terminal 2 - Next.js Frontend:**
```bash
npm run dev
```

## Development URLs

- **Frontend:** http://localhost:3000
- **Python API:** http://localhost:8000
- **API Documentation:** http://localhost:8000/docs

## Project Structure

```
content-success/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── auth/              # Auth pages
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── dashboard.tsx     # Main dashboard
│   ├── file-upload.tsx   # File upload component
│   └── ...
├── lib/                   # Utilities and services
│   ├── auth.ts           # NextAuth configuration
│   ├── model-service.ts  # ML service client
│   └── ...
├── python-service/        # Python ML service
│   ├── main.py           # FastAPI app
│   ├── requirements.txt  # Python dependencies
│   └── ...
├── types/                 # TypeScript definitions
└── public/               # Static assets
```

## Key Features to Test

1. **Authentication Flow**
   - Visit http://localhost:3000
   - Should show login page
   - Click "Sign in with Google Workspace"
   - Only @optiminastic.com emails should work

2. **Asset Upload**
   - Drag and drop images/videos
   - File preview should appear
   - Maximum 50MB file size

3. **Platform Selection**
   - Select multiple platforms
   - Each platform shows different characteristics
   - "Select All" and "Clear" buttons work

4. **Analysis Flow**
   - Upload file + select platforms
   - Click "Analyze Asset"
   - Should show loading state
   - Results page with scores and recommendations

5. **PDF Export**
   - Click "Download Report" in results
   - Should generate PDF with all analysis data

6. **Audit Logs**
   - Click "History" in header
   - Should show all analysis activities
   - Filter by "My Activity" or "All Activity"

## Development Notes

### Mock Data
- The Python service currently returns mock predictions
- Brand safety checks are simulated
- Visual feature analysis uses random data

### Production Deployment
For production, you'll need to:
1. Train actual ML models
2. Set up a proper database for audit logs
3. Configure production Google OAuth
4. Deploy to secure cloud infrastructure
5. Add proper error monitoring

### Common Issues

**Authentication not working:**
- Check Google OAuth configuration
- Ensure redirect URI matches exactly
- Verify @optiminastic.com domain restriction

**Python service not starting:**
- Check if port 8000 is available
- Ensure all dependencies are installed
- Check Python version compatibility

**File upload failing:**
- Check file size (max 50MB)
- Ensure supported file types (images, videos)
- Check Python service is running

## API Testing

Test the Python service directly:
```bash
curl -X POST "http://localhost:8000/analyze" \
  -F "file=@test-image.jpg" \
  -F "platforms=[\"instagram\", \"facebook\"]"
```

Health check:
```bash
curl http://localhost:8000/health
```

## TypeScript & Linting

Check for type errors:
```bash
npx tsc --noEmit
```

Run linting:
```bash
npm run lint
```

## Security Notes

- Assets are never stored on disk
- All processing happens in memory
- Google Workspace domain restriction enforced
- Audit logs track all activities
- HTTPS required in production
