#!/bin/bash

# Setup script for Payment Dashboard environment variables
# This script helps you create the .env file with your API credentials

echo "🚀 Payment Dashboard Environment Setup"
echo "======================================"
echo ""

# Check if .env already exists
if [ -f ".env" ]; then
    echo "⚠️  .env file already exists!"
    read -p "Do you want to overwrite it? (y/N): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Setup cancelled."
        exit 1
    fi
fi

echo "📝 Creating .env file..."
echo ""

# Get API endpoint
read -p "Enter API endpoint (default: https://mo-graphql.microapps-staging.com): " endpoint
endpoint=${endpoint:-"https://mo-graphql.microapps-staging.com"}

# Get API key
read -p "Enter your API key: " api_key

if [ -z "$api_key" ]; then
    echo "❌ API key is required!"
    exit 1
fi

# Create .env file
cat > .env << EOF
# API Configuration
# Generated on $(date)
REACT_APP_API_ENDPOINT=$endpoint
REACT_APP_API_KEY=$api_key
EOF

echo ""
echo "✅ .env file created successfully!"
echo ""
echo "🔒 Security reminder:"
echo "   - Your .env file is already in .gitignore"
echo "   - Never commit API keys to version control"
echo "   - Keep your API keys secure and private"
echo ""
echo "🚀 You can now run 'npm start' to start the development server"
