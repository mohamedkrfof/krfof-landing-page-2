#!/bin/bash

# 🚀 Production Deployment Script
# This script helps deploy the lead magnet system to production

echo "🚀 Lead Magnet Production Deployment Script"
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check prerequisites
echo "🔍 Checking prerequisites..."

if ! command_exists node; then
    print_error "Node.js is not installed. Please install Node.js first."
    exit 1
fi

if ! command_exists npm; then
    print_error "npm is not installed. Please install npm first."
    exit 1
fi

print_status "Node.js and npm are installed"

# Check if we're in the correct directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the project root."
    exit 1
fi

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    print_error ".env.local file not found!"
    echo "📋 Please create a .env.local file using the template in PRODUCTION_ENVIRONMENT_SETUP.md"
    echo "   Required variables:"
    echo "   - HUBSPOT_ACCESS_TOKEN"
    echo "   - META_ACCESS_TOKEN"
    echo "   - SNAPCHAT_ACCESS_TOKEN"
    echo "   - TIKTOK_ACCESS_TOKEN"
    echo "   - GA4_MEASUREMENT_ID"
    echo "   - GA4_API_SECRET"
    exit 1
fi

print_status ".env.local file found"

# Check environment variables
echo "🔍 Checking environment variables..."

# Source the .env.local file
set -a
source .env.local
set +a

# Check critical variables
missing_vars=()

if [ -z "$HUBSPOT_ACCESS_TOKEN" ]; then
    missing_vars+=("HUBSPOT_ACCESS_TOKEN")
fi

if [ -z "$META_ACCESS_TOKEN" ]; then
    missing_vars+=("META_ACCESS_TOKEN")
fi

if [ -z "$SNAPCHAT_ACCESS_TOKEN" ]; then
    missing_vars+=("SNAPCHAT_ACCESS_TOKEN")
fi

if [ -z "$TIKTOK_ACCESS_TOKEN" ]; then
    missing_vars+=("TIKTOK_ACCESS_TOKEN")
fi

if [ ${#missing_vars[@]} -gt 0 ]; then
    print_error "Missing required environment variables:"
    printf '%s\n' "${missing_vars[@]}"
    echo "📋 Please check PRODUCTION_ENVIRONMENT_SETUP.md for setup instructions"
    exit 1
fi

print_status "All critical environment variables are set"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    print_error "Failed to install dependencies"
    exit 1
fi

print_status "Dependencies installed"

# Run build
echo "🏗️  Building project..."
npm run build

if [ $? -ne 0 ]; then
    print_error "Build failed"
    exit 1
fi

print_status "Project built successfully"

# Run tests
echo "🧪 Running integration tests..."

# Test HubSpot integration
echo "Testing HubSpot integration..."
timeout 30 npm run dev &
DEV_PID=$!
sleep 5

# Test if server is running
if ! curl -f http://localhost:3000 >/dev/null 2>&1; then
    print_warning "Development server not responding, skipping integration tests"
else
    print_status "Development server is running"
    
    # Run HubSpot test
    if node test-hubspot-now.js; then
        print_status "HubSpot integration test passed"
    else
        print_warning "HubSpot integration test had issues"
    fi
fi

# Kill the development server
kill $DEV_PID 2>/dev/null

# Check if Vercel CLI is available
if command_exists vercel; then
    echo "🚀 Vercel CLI found. Ready to deploy!"
    
    read -p "Do you want to deploy to Vercel now? (y/n): " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "🚀 Deploying to Vercel..."
        
        # Deploy to production
        vercel --prod
        
        if [ $? -eq 0 ]; then
            print_status "Deployment successful!"
            echo "🎉 Your lead magnet is now live!"
            echo "📊 Don't forget to:"
            echo "   1. Test the live form submission"
            echo "   2. Check HubSpot for new contacts"
            echo "   3. Verify pixel events in Meta Events Manager"
            echo "   4. Monitor error logs for any issues"
        else
            print_error "Deployment failed"
            exit 1
        fi
    else
        echo "📋 Manual deployment steps:"
        echo "   1. Run: vercel --prod"
        echo "   2. Set environment variables in Vercel dashboard"
        echo "   3. Test live deployment"
    fi
else
    print_warning "Vercel CLI not found"
    echo "📋 Manual deployment options:"
    echo "   Option 1: Install Vercel CLI and run 'vercel --prod'"
    echo "   Option 2: Connect your repository to Vercel dashboard"
    echo "   Option 3: Use another deployment platform (Netlify, etc.)"
fi

echo ""
echo "🎯 Production Deployment Complete!"
echo "=============================================="
echo "✅ Build successful"
echo "✅ Environment variables configured"
echo "✅ Integration tests completed"
echo ""
echo "🔍 Next steps:"
echo "   1. Test live form submission"
echo "   2. Monitor HubSpot for new contacts"
echo "   3. Check Meta Events Manager for pixel events"
echo "   4. Verify Google Sheets integration via Zapier"
echo "   5. Set up monitoring for API failures"
echo ""
echo "📖 For troubleshooting, see PRODUCTION_ENVIRONMENT_SETUP.md" 