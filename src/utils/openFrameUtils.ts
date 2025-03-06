
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
  // For animated GIFs or complex frames, we should use website format
  // to properly display with HTML/CSS for better control
  const format = isAnimated ? OPENFRAME_FORMATS.WEBSITE : OPENFRAME_FORMATS.VLC;
  
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
 * Prepare an image for OpenFrame by ensuring it's in the right format
 * @param imageDataUrl - The image data URL
 * @param isAnimated - Whether the image is animated
 * @returns Processed image URL ready for OpenFrame
 */
export const prepareImageForOpenFrame = (
  imageDataUrl: string,
  isAnimated: boolean = false
): string => {
  // For all images, we'll wrap in HTML to ensure proper positioning
  // This gives us better control over how the image displays
  const htmlWrapper = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body, html {
            margin: 0;
            padding: 0;
            height: 100%;
            width: 100%;
            overflow: hidden;
            background: black;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .frame-container {
            width: 80%;
            height: 80%;
            position: relative;
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
        <div class="frame-container">
          <img src="${imageDataUrl}" alt="OpenFrame Artwork" />
        </div>
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
