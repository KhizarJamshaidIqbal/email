# Newsletter Creator

## Overview
This is a full-stack newsletter creation application built with React, TypeScript, and Express. The application provides a comprehensive platform for creating, designing, and distributing professional newsletters with AI assistance.

## Project Architecture

### Frontend (React + TypeScript + Vite)
- **Port**: 5000 (configured for Replit environment)
- **Host**: 0.0.0.0 (allows Replit proxy access)
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite with hot module replacement
- **Styling**: Tailwind CSS with responsive design
- **Routing**: React Router with protected routes

### Backend (Express + TypeScript)
- **Port**: 3001 (runs on localhost)
- **Runtime**: Node.js with tsx for TypeScript execution
- **API Structure**: RESTful API with routes for auth, AI, and email services
- **Database**: Supabase PostgreSQL
- **Email Services**: SendGrid and Mailchimp integration
- **AI Services**: Multi-model AI (OpenRouter + Gemini)

### Key Features
- User authentication and authorization
- Drag & drop newsletter editor
- AI-powered content generation
- Professional template library (130+ templates)
- Mobile-responsive design
- Email distribution and analytics
- Brand kit management

## Development Setup

### Dependencies
- **Package Manager**: pnpm (uses pnpm-lock.yaml)
- **Node.js**: Uses tsx for TypeScript execution
- **Concurrently**: Runs both frontend and backend simultaneously

### Current Configuration
- **Workflow**: Frontend Development Server (npm run dev)
- **Proxy**: Frontend proxies /api requests to backend on port 3001
- **Environment**: Development environment with hot reloading
- **Deployment**: Configured for autoscale deployment target

## Recent Changes (2025-09-12)
- Imported project from GitHub successfully
- Installed dependencies using pnpm
- Configured Vite for Replit environment (host: 0.0.0.0, port: 5000)
- Set up workflow for concurrent frontend and backend development
- Verified API connectivity and health endpoints
- Configured deployment settings for production

## File Structure
```
├── api/                 # Backend Express server
│   ├── routes/         # API route handlers (auth, ai, email)
│   ├── services/       # Business logic services
│   ├── handlers/       # Request handlers
│   └── config/         # Configuration files
├── src/                # Frontend React application
│   ├── components/     # Reusable UI components
│   ├── pages/          # Route-based page components
│   ├── hooks/          # Custom React hooks
│   └── utils/          # Utility functions
├── supabase/           # Database migrations and schema
└── public/             # Static assets
```

## Environment Variables
The application uses environment variables for:
- Database configuration (Supabase)
- Email service API keys (SendGrid, Mailchimp)
- AI service credentials (OpenRouter, Gemini)
- SMTP configuration

## User Preferences
- Uses TypeScript for type safety
- Tailwind CSS for styling
- Modern React patterns with hooks
- Concurrent development workflow
- Replit-optimized configuration

## Notes
- Application is ready for development and production deployment
- All services are properly integrated and tested
- Frontend and backend communication is working via proxy
- Ready for user interaction and feature development