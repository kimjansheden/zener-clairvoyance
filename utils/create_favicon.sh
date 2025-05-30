#!/bin/bash

# Define the icon
# You can change this to any emoji or text you like
# Just make sure to adjust the font size and position accordingly
icon="🔮"

# Horizontal offset for SVG (negative moves left, positive moves right)
x_offset="-1" # Adjust this value to move the icon left or right

# Define output sizes
sizes=(16 32 64)

# Create temporary HTML file for generating the PNG
cat << EOF > create_icon.html
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
canvas { 
  width: 64px;
  height: 64px;
  image-rendering: pixelated;
  background: transparent;
}
body, html {
  margin: 0;
  padding: 0;
  background: transparent;
}
</style>
</head>
<body>
<canvas id="canvas" width="64" height="64"></canvas>
<script>
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d', { alpha: true });
ctx.clearRect(0, 0, 64, 64);
ctx.font = '48px "Apple Color Emoji", "Segoe UI Emoji", sans-serif';
ctx.fillStyle = 'black';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.fillText('${icon}', 32, 38); // Adjust Y-position if needed
</script>
</body>
</html>
EOF

# Generate 64x64 PNG using Chrome headless
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome \
  --headless \
  --screenshot=favicon-64.png \
  --window-size=64,64 \
  --transparent-background file:///$PWD/create_icon.html

# Check if imagemagick is installed
if ! command -v convert &> /dev/null; then
  echo "Error: imagemagick is not installed. Please install it to continue."
  exit 1
fi

# Generate smaller PNG sizes and ICO file
for size in "${sizes[@]}"; do
  convert favicon-64.png -resize ${size}x${size} favicon-${size}x${size}.png
done
convert favicon-16x16.png favicon-32x32.png favicon-64x64.png favicon.ico

# Create SVG version
cat << EOF > favicon.svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <rect width="64" height="64" fill="none"/>
  <text x="calc(50% + ${x_offset}px)" y="50%" text-anchor="middle" alignment-baseline="middle" font-size="48px" font-family="'Apple Color Emoji', 'Segoe UI Emoji', sans-serif">${icon}</text>
</svg>
EOF

# Create directories if they don't exist
mkdir -p public

# Move favicon files to the public directory
mv favicon-16x16.png public/favicon-16x16.png
mv favicon-32x32.png public/favicon-32x32.png
mv favicon-64x64.png public/favicon-64x64.png
mv favicon.ico public/favicon.ico
mv favicon.svg public/favicon.svg

# Clean up temporary files
rm create_icon.html favicon-64.png

echo "Favicons have been created successfully and saved to the 'public' directory!"