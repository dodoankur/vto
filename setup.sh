#!/bin/bash

# Virtual Try-On App Setup Script
echo "🕶️ Setting up Virtual Try-On Web Application..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "✅ .env file created. Please edit it with your configuration."
fi

# Create necessary directories
echo "📁 Creating necessary directories..."
mkdir -p backend/uploads
mkdir -p backend/processed
mkdir -p backend/static
mkdir -p frontend/public

# Set permissions
chmod +x setup.sh

echo "🚀 Starting services with Docker Compose..."
docker-compose up -d

echo "⏳ Waiting for services to start..."
sleep 10

# Check if services are running
echo "🔍 Checking service status..."
docker-compose ps

echo ""
echo "✅ Setup complete!"
echo ""
echo "🌐 Access your application:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:8000"
echo "   API Documentation: http://localhost:8000/docs"
echo "   Admin Panel: http://localhost:3000/admin"
echo ""
echo "📚 Next steps:"
echo "   1. Edit .env file with your configuration"
echo "   2. Upload frame images to the admin panel"
echo "   3. Test the virtual try-on functionality"
echo ""
echo "🛠️ Useful commands:"
echo "   docker-compose logs -f          # View logs"
echo "   docker-compose down             # Stop services"
echo "   docker-compose restart          # Restart services"
echo ""
