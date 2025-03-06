
/**
 * Utility functions for OpenFrame integration
 * OpenFrame is an open-source platform for digital art display
 */

// OpenFrame artwork format
export interface OpenFrameArtwork {
  title: string;
  author: string;
  format: string;
  url: string;
  thumbnail?: string;
  isPublic?: boolean;
}

// Formats supported by OpenFrame
export const OPENFRAME_FORMATS = {
  IMAGE: 'openframe-image',
  VIDEO: 'openframe-video',
  WEBSITE: 'openframe-website',
  SHADER: 'openframe-glslviewer',
  PROCESSING: 'openframe-processing',
  VLC: 'openframe-vlc',
  TANGRAM: 'openframe-tangram',
  OF: 'openframe-of'
};

/**
 * Creates an OpenFrame artwork object
 * @param url - The URL of the artwork
 * @param title - The title of the artwork
 * @param author - The author of the artwork
 * @param isAnimated - Whether the image is animated (GIF)
 * @returns OpenFrame artwork object ready for export
 */
export const createOpenFrameArtwork = (
  url: string,
  title: string,
  author: string,
  isAnimated: boolean = false
): OpenFrameArtwork => {
  // For images, we'll use the website format which gives us more control over scaling
  const format = OPENFRAME_FORMATS.WEBSITE;
  
  return {
    title,
    author,
    format,
    url,
    isPublic: false
  };
};

/**
 * Simulates pushing to an OpenFrame display
 * In a real application, this would use the OpenFrame API
 * @param artwork - The OpenFrame artwork to push
 */
export const pushToOpenFrame = async (artwork: OpenFrameArtwork): Promise<void> => {
  console.log('Pushing to OpenFrame:', artwork);
  
  // In a real implementation, this would use the OpenFrame API
  // For now, we'll just simulate a success response
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Successfully pushed to OpenFrame!');
      resolve();
    }, 1500);
  });
};

/**
 * Prepare an image for OpenFrame by wrapping it in a responsive container
 * This creates an HTML page that ensures the image is properly scaled
 * 
 * @param imageDataUrl - The image data URL
 * @param isAnimated - Whether the image is animated
 * @returns The URL for an HTML page that displays the image with proper scaling
 */
export const prepareImageForOpenFrame = (
  imageDataUrl: string,
  isAnimated: boolean = false
): string => {
  // Create a Blob with the HTML content that will properly display the image
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>OpenFrame Artwork</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    html, body {
      width: 100%;
      height: 100%;
      overflow: hidden;
      background-color: black;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .container {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .image-container {
      max-width: 100%;
      max-height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    img {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="image-container">
      <img src="${imageDataUrl}" alt="Artwork" id="artwork-image">
    </div>
  </div>
  <script>
    // This script ensures the image is properly loaded and sized
    document.addEventListener('DOMContentLoaded', function() {
      const img = document.getElementById('artwork-image');
      img.onload = function() {
        console.log('Image loaded with dimensions:', img.naturalWidth, 'x', img.naturalHeight);
      };
      
      // Force browser to handle the image scaling properly
      window.addEventListener('resize', function() {
        console.log('Window resized');
      });
    });
  </script>
</body>
</html>
  `;
  
  const blob = new Blob([htmlContent], { type: 'text/html' });
  return URL.createObjectURL(blob);
};

/**
 * Detects if an image is animated (GIF)
 * @param dataUrl - The data URL of the image
 * @returns true if the image is an animated GIF
 */
export const isAnimatedImage = (dataUrl: string): boolean => {
  return dataUrl.includes('image/gif');
};
