
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
  // Use image format directly instead of website
  const format = OPENFRAME_FORMATS.IMAGE;
  
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
 * Note: For direct image format, we just return the original URL
 * 
 * @param imageDataUrl - The image data URL
 * @param isAnimated - Whether the image is animated
 * @returns The original image URL for direct use by OpenFrame
 */
export const prepareImageForOpenFrame = (
  imageDataUrl: string,
  isAnimated: boolean = false
): string => {
  // For direct image display, return the original URL
  return imageDataUrl;
};

/**
 * Detects if an image is animated (GIF)
 * @param dataUrl - The data URL of the image
 * @returns true if the image is an animated GIF
 */
export const isAnimatedImage = (dataUrl: string): boolean => {
  return dataUrl.includes('image/gif');
};
