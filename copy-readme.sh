#!/bin/bash

# Define the source and destination paths
SOURCE="README.md"
DESTINATION="packages/react-form-model-controller/README.md"

# Check if the source file exists
if [ ! -f "$SOURCE" ]; then
    echo "Source file '$SOURCE' does not exist."
    exit 1
fi

# Create the destination directory if it doesn't exist
mkdir -p "$(dirname "$DESTINATION")"

# Copy the file
cp "$SOURCE" "$DESTINATION"

# Verify the file was copied
if [ -f "$DESTINATION" ]; then
    echo "README.md successfully copied to $DESTINATION"
else
    echo "Failed to copy README.md"
    exit 1
fi