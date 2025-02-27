#!/bin/bash

# Exit on any error
set -e

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "npm is not installed. Please install npm first."
    exit 1
fi

echo "Installing dependencies..."
npm install --no-save typescript

echo "Running the return type fixer..."
if [ "$#" -eq 0 ]; then
    # No arguments provided, show usage
    echo "Usage: $0 [file_paths...]"
    echo "Example: $0 app/components/*.tsx"
    exit 1
else
    # Run on specified files
    node scripts/add-return-types.js "$@"
fi

echo "Done! Please check your files and run 'npm run lint' to verify the changes."