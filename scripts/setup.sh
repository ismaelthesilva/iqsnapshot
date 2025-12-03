#!/bin/bash

# The $1 IQ Snapshot - Setup Script
# Run this script after cloning the repository

set -e

echo "🧠 Setting up The \$1 IQ Snapshot..."
echo ""

# Check Node.js version
echo "📦 Checking Node.js version..."
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
  echo "❌ Error: Node.js 18 or higher is required (current: $(node -v))"
  exit 1
fi
echo "✓ Node.js version: $(node -v)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install
echo "✓ Dependencies installed"
echo ""

# Check for .env.local
if [ ! -f .env.local ]; then
  echo "⚙️  Creating .env.local from .env.local.example..."
  cp .env.local.example .env.local
  echo "✓ Created .env.local"
  echo ""
  echo "⚠️  IMPORTANT: Edit .env.local and add your API keys:"
  echo "   - STRIPE_SECRET_KEY"
  echo "   - STRIPE_WEBHOOK_SECRET"
  echo "   - RESEND_API_KEY"
  echo "   - FROM_EMAIL"
  echo "   - AFFILIATE_VSL_URL"
  echo ""
  echo "   Run 'stripe listen --forward-to localhost:3000/api/stripe/webhook'"
  echo "   to get your webhook secret for local development."
  echo ""
else
  echo "✓ .env.local already exists"
  echo ""
fi

# Check Stripe CLI
echo "🔑 Checking for Stripe CLI..."
if command -v stripe &> /dev/null; then
  echo "✓ Stripe CLI installed: $(stripe --version)"
  echo ""
  echo "To start webhook forwarding, run:"
  echo "  stripe listen --forward-to localhost:3000/api/stripe/webhook"
else
  echo "⚠️  Stripe CLI not found. Install it to test webhooks locally:"
  echo "  brew install stripe/stripe-cli/stripe"
  echo "  OR download from: https://stripe.com/docs/stripe-cli"
fi
echo ""

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "  1. Edit .env.local with your API keys"
echo "  2. Run 'stripe listen --forward-to localhost:3000/api/stripe/webhook' in a new terminal"
echo "  3. Run 'npm run dev' to start the development server"
echo "  4. Visit http://localhost:3000"
echo ""
echo "📖 See README.md for full documentation"
