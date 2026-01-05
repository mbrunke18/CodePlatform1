#!/bin/bash

echo "Building VEXOR for production..."

# Build frontend with Vite
echo "Building frontend..."
vite build

# Build backend with esbuild
echo "Building backend..."
esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist

# Copy data files
echo "Copying data files..."
mkdir -p dist/seeds/data
cp -r server/seeds/data/* dist/seeds/data/

echo "✅ Build complete! Data files copied to dist/seeds/data/"
