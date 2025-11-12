#!/bin/bash

echo "🚀 Mentor Interview Platform - Quick Start"
echo "=========================================="
echo ""

# Check if node is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js found: $(node --version)"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please edit .env and add your Supabase credentials!"
    echo ""
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Setup complete!"
    echo ""
    echo "Next steps:"
    echo "1. Edit .env file with your Supabase credentials"
    echo "2. Run 'npm start' to start development server"
    echo "3. Read SETUP_GUIDE.md for detailed instructions"
    echo ""
    echo "Happy coding! 🎉"
else
    echo ""
    echo "❌ Installation failed. Please check the error messages above."
    exit 1
fi
