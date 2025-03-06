
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
 * Creates an OpenFrame artwork object from an image
 * @param imageDataUrl - The data URL of the image
 * @param title - The title of the artwork
 * @param author - The author of the artwork
 * @param isAnimated - Whether the image is animated (GIF)
 * @returns OpenFrame artwork object ready for export
 */
export const createOpenFrameArtwork = (
  imageDataUrl: string,
  title: string,
  author: string,
  isAnimated: boolean = false
): OpenFrameArtwork => {
  // Always use website format for better control over image positioning and scaling
  const format = OPENFRAME_FORMATS.WEBSITE;
  
  return {
    title,
    author,
    format,
    url: imageDataUrl,
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
 * Prepare an image for OpenFrame by ensuring it's in the right format and size
 * @param imageDataUrl - The image data URL
 * @param isAnimated - Whether the image is animated
 * @returns Processed image URL ready for OpenFrame
 */
export const prepareImageForOpenFrame = (
  imageDataUrl: string,
  isAnimated: boolean = false
): string => {
  // Provide a robust wrapper with image sizing controls
  // The key is to use CSS that will absolutely force the image to fit within constraints
  const htmlWrapper = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>OpenFrame Artwork</title>
        <style>
          /* Reset and core styles */
          body, html {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
            background-color: #000000;
          }
          
          /* Main display container */
          .frame-display {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          /* Image container - this is sized to match the selected frame */
          .frame-container {
            position: relative;
            width: 85%;  /* Size within the viewport */
            height: 85%;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          /* This ensures the image fits inside the frame */
          .image-container {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
          }
          
          /* Image-specific styling */
          img {
            max-width: 95%;  /* Slightly smaller than container for padding effect */
            max-height: 95%;
            object-fit: contain; /* This maintains aspect ratio */
            display: block;
          }

          /* For SVG frames (if used in the future) */
          .frame-svg {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 10;
            pointer-events: none;
          }
        </style>
      </head>
      <body>
        <div class="frame-display">
          <div class="frame-container">
            <div class="image-container">
              <img src="${imageDataUrl}" alt="Framed Artwork" id="artwork-image" />
            </div>
          </div>
        </div>
        
        <script>
          document.addEventListener('DOMContentLoaded', function() {
            const img = document.getElementById('artwork-image');
            
            // Force image to reload and trigger sizing calculations
            img.onload = function() {
              console.log('Image loaded with dimensions:', img.naturalWidth, 'x', img.naturalHeight);
              
              // Additional resizing logic can be added here if needed
              // This ensures we have a chance to make adjustments after the image loads
            };
            
            // Force reload
            const src = img.src;
            img.src = '';
            setTimeout(() => {
              img.src = src;
            }, 10);
          });
        </script>
      </body>
    </html>
  `;
  
  // Return the HTML as a data URL
  return `data:text/html;charset=utf-8,${encodeURIComponent(htmlWrapper)}`;
};

/**
 * Detects if an image is animated (GIF)
 * @param dataUrl - The data URL of the image
 * @returns true if the image is an animated GIF
 */
export const isAnimatedImage = (dataUrl: string): boolean => {
  return dataUrl.includes('image/gif');
};
