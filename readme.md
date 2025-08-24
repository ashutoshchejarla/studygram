# Overview

This is a quiz application that allows users to upload study materials (PDFs, text files, or YouTube videos) and automatically generates multiple-choice questions using OpenAI's GPT models. The application features a modern React frontend with a card-based quiz interface, file upload functionality, and question management capabilities including liking/favoriting questions.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **UI Components**: Shadcn/ui component library with Radix UI primitives for accessible components
- **Styling**: Tailwind CSS with CSS variables for theming, supporting both light and dark modes
- **State Management**: TanStack React Query for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Animation**: Framer Motion for smooth animations and transitions

## Backend Architecture
- **Runtime**: Node.js with Express.js REST API
- **Language**: TypeScript with ES modules
- **File Processing**: Multer for handling file uploads with support for PDF and text file processing
- **Storage**: In-memory storage implementation with interface for future database integration
- **External Services**: OpenAI GPT-5 integration for question generation and YouTube transcript extraction

## Data Storage Solutions
- **Current Implementation**: In-memory storage using Maps for development/testing
- **Database Ready**: Drizzle ORM configured for PostgreSQL with migration support
- **Schema Design**: Two main entities - Sources (uploaded materials) and Questions (generated quiz questions)
- **Database Provider**: Configured for Neon Database (serverless PostgreSQL)

## Authentication and Authorization
- **Current State**: No authentication system implemented
- **Session Management**: Express session configuration present but not actively used
- **Future Ready**: Infrastructure prepared for session-based authentication

## External Dependencies

### Core Technologies
- **Database**: PostgreSQL via Neon Database (@neondatabase/serverless)
- **ORM**: Drizzle ORM with Drizzle Kit for migrations
- **AI Service**: OpenAI API (configured for GPT-5 model)
- **File Upload**: Multer for multipart form handling

### UI and Styling
- **Component Library**: Radix UI primitives for accessibility
- **CSS Framework**: Tailwind CSS with PostCSS processing
- **Icons**: Lucide React icon library
- **Animations**: Framer Motion for interactive animations

### Development Tools
- **Build Tool**: Vite with React plugin and runtime error overlay
- **Type Checking**: TypeScript with strict configuration
- **Code Quality**: ESBuild for production bundling
- **Development Environment**: Replit-specific plugins and cartographer integration

### Validation and Forms
- **Schema Validation**: Zod for runtime type checking
- **Form Handling**: React Hook Form with Hookform resolvers
- **Database Validation**: Drizzle-Zod integration for schema validation

The application follows a clean separation of concerns with shared TypeScript types, modular component architecture, and a scalable backend structure that can easily transition from in-memory storage to full database integration.

## Recent Updates (August 24, 2025)

### Interface Redesign
- **Instagram Reels Experience**: Implemented full-screen vertical scrolling with smooth animations
- **Bottom Tab Navigation**: Added Material 3 style bottom navigation with Questions, Upload, and Settings tabs
- **Question Cards**: Enhanced with like/share buttons positioned Instagram-style on the right side

### Liked Questions System
- **Collapsible Menu**: Added expandable liked questions section in Settings
- **Real-time Sync**: Questions appear instantly when liked/unliked
- **Compact View**: Organized display with source info and highlighted correct answers

### Enhanced User Experience
- **Smooth Scrolling**: Momentum-based scrolling optimized for mobile and desktop
- **Card Animations**: Fade-in and slide-up effects for each question
- **Theme Options**: AMOLED dark theme and clean white theme with instant switching
- **Upload Workflow**: Dedicated upload tab with automatic question generation

### API Integration
- **Gemini AI**: Switched from OpenAI to Google Gemini 2.5 Pro for question generation
- **Optimized Polling**: Removed excessive API calls for better performance
- **Cache Management**: Intelligent query invalidation for real-time updates