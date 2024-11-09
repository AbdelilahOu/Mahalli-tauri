#!/bin/bash

# Check if version number is provided
if [ -z "$1" ]; then
    echo "Please provide a version number (e.g. ./update-version.sh 1.4.8)"
    exit 1
fi

# Get the root directory (parent of scripts folder)
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
NEW_VERSION=$1

# Update package.json in root
sed -i "s/\"version\": \".*\"/\"version\": \"$NEW_VERSION\"/" "$ROOT_DIR/package.json"

# Update package.json in root
sed -i "s/\"version\": \".*\"/\"version\": \"$NEW_VERSION\"/" "$ROOT_DIR/src-tauri/tauri.conf.json"


# Update the first occurrence of version in Cargo.toml
sed -i "1,/^version = / s/version = \".*\"/version = \"$NEW_VERSION\"/" "$ROOT_DIR/src-tauri/Cargo.toml"

# Update RELEASE_VERSION in GitHub workflow
sed -i "s/RELEASE_VERSION: .*/RELEASE_VERSION: $NEW_VERSION/" "$ROOT_DIR/.github/workflows/releases.yml"


echo "Updated version to $NEW_VERSION in:"
echo "- package.json"
echo "- src-tauri/Cargo.toml (first occurrence)"
echo "- .github/workflows/releases.yml"