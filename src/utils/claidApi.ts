
/**
 * Utility functions for integrating with the Claid.ai API
 * for professional image framing and editing
 */

// Define the Claid API key - in a real app, this would be an environment variable
// For demo purposes, we'll use a placeholder
const CLAID_API_KEY = 'YOUR_CLAID_API_KEY'; // Replace with actual API key in production

// Function to call Claid.ai API to apply a frame to an image
export const applyFrameWithClaidApi = async (
  imageDataUrl: string,
  framePath: string
): Promise<string> => {
  // Convert data URL to blob for upload
  const imageBlob = dataUrlToBlob(imageDataUrl);
  
  try {
    // Create FormData with the image
    const formData = new FormData();
    formData.append('image', imageBlob, 'image.jpg');
    
    // Extract frame type from the path for API parameters
    const frameType = getFrameTypeFromPath(framePath);
    
    console.log(`Applying frame: ${frameType} to image using Claid API`);
    
    // Make the actual API call to Claid.ai
    try {
      const response = await fetch('https://api.claid.ai/v1/image/edit', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${CLAID_API_KEY}`,
          // No Content-Type header when using FormData
        },
        body: formData
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Claid API error:', errorText);
        throw new Error(`Claid API responded with status: ${response.status}`);
      }
      
      // Get the processed image as a blob
      const resultBlob = await response.blob();
      return URL.createObjectURL(resultBlob);
    } catch (apiError) {
      console.error('Error calling Claid API:', apiError);
      console.log('Falling back to canvas method...');
      return await useFallbackCanvasMethod(imageDataUrl, framePath);
    }
  } catch (error) {
    console.error('Error in applyFrameWithClaidApi:', error);
    throw error;
  }
};

// Helper function to convert data URL to Blob
const dataUrlToBlob = (dataUrl: string): Blob => {
  const arr = dataUrl.split(',');
  const mime = arr[0].match(/:(.*?);/)![1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  
  return new Blob([u8arr], { type: mime });
};

// Helper to map our frame paths to Claid API frame types
const getFrameTypeFromPath = (framePath: string): string => {
  // Extract the frame name from the path
  const frameName = framePath.split('/').pop()?.replace('.svg', '') || '';
  
  // Map our frame names to Claid frame types
  // These mappings should be adjusted based on available Claid API options
  const frameMapping: Record<string, string> = {
    'basic-border': 'simple',
    'rounded': 'rounded',
    'shadow-box': 'shadow',
    'photo-frame': 'classic',
    'polaroid': 'polaroid',
    'vintage': 'vintage',
    'neon': 'neon',
    'wave': 'wave',
    'ribbon-box': 'ribbon',
    'social-media': 'social',
    'zigzag': 'zigzag',
    'taped': 'taped',
    'torn-paper': 'torn',
    'puzzle': 'puzzle',
    'triangle-pattern': 'triangle',
    'watercolor': 'watercolor',
    'scalloped': 'scalloped',
    'dashed-box': 'dashed',
    'dotted': 'dotted',
    'circular': 'circular',
    'double-box': 'double',
    'minimalist': 'minimal',
    'layered-box': 'layered',
    'grunge': 'grunge',
    'box-corners': 'corners',
    'comic': 'comic',
    'hexagon': 'hexagon',
    'geometric': 'geometric',
    'birthday': 'birthday',
    'abstract': 'abstract',
    'instant-photo': 'instant',
    'certificate': 'certificate',
    'art-deco': 'artdeco',
    'landscape': 'landscape',
    'grid-box': 'grid',
    'floral': 'floral',
    'collage': 'collage',
    'fancy-box': 'fancy',
    'pixel': 'pixel',
  };
  
  return frameMapping[frameName] || 'simple';
};

// Define a type for inset percentages to properly handle both uniform and non-uniform insets
type InsetPercentage = number | {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

// Improved fallback method using canvas
const useFallbackCanvasMethod = async (
  imageDataUrl: string,
  framePath: string
): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      // Create the canvas element
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }
      
      // Load the frame first to get its dimensions
      const frame = new Image();
      frame.crossOrigin = 'anonymous';
      
      const frameUrl = framePath.startsWith('http') 
        ? framePath 
        : `${window.location.origin}${framePath}`;
      
      frame.onload = () => {
        // Set canvas dimensions based on the frame
        canvas.width = frame.width;
        canvas.height = frame.height;
        
        // Fill with transparent background
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Load the base image
        const img = new Image();
        img.crossOrigin = 'anonymous';
        
        img.onload = () => {
          // Calculate frame inset percentage based on the frame type
          let insetPercentage: InsetPercentage = 0.1; // Default 10% inset
          
          if (framePath.includes('shadow-box')) {
            insetPercentage = 0.15; // 15% inset for shadow box
          } else if (framePath.includes('polaroid')) {
            insetPercentage = { top: 0.1, right: 0.1, bottom: 0.3, left: 0.1 }; // Polaroid has more space at bottom
          } else if (framePath.includes('taped')) {
            insetPercentage = 0.15; // 15% for taped photos
          } else if (framePath.includes('photo-frame')) {
            insetPercentage = 0.12; // 12% for photo frames
          }
          
          // Calculate the clipping area based on the frame and inset percentage
          let clipX: number, clipY: number, clipWidth: number, clipHeight: number;
          
          if (typeof insetPercentage === 'object') {
            // Handle non-uniform insets (like polaroid)
            clipX = canvas.width * insetPercentage.left;
            clipY = canvas.height * insetPercentage.top;
            clipWidth = canvas.width * (1 - insetPercentage.left - insetPercentage.right);
            clipHeight = canvas.height * (1 - insetPercentage.top - insetPercentage.bottom);
          } else {
            // Uniform insets on all sides
            clipX = canvas.width * insetPercentage;
            clipY = canvas.height * insetPercentage;
            clipWidth = canvas.width * (1 - 2 * insetPercentage);
            clipHeight = canvas.height * (1 - 2 * insetPercentage);
          }
          
          // Save the canvas state before clipping
          ctx.save();
          
          // Create a clipping path
          ctx.beginPath();
          ctx.rect(clipX, clipY, clipWidth, clipHeight);
          ctx.clip();
          
          // Calculate image scaling to fit the clipping area while maintaining aspect ratio
          const imgRatio = img.width / img.height;
          const clipRatio = clipWidth / clipHeight;
          
          let drawWidth: number, drawHeight: number, offsetX: number, offsetY: number;
          
          if (imgRatio > clipRatio) {
            // Image is wider - scale by height and center horizontally
            drawHeight = clipHeight;
            drawWidth = drawHeight * imgRatio;
            offsetX = clipX + (clipWidth - drawWidth) / 2;
            offsetY = clipY;
          } else {
            // Image is taller - scale by width and center vertically
            drawWidth = clipWidth;
            drawHeight = drawWidth / imgRatio;
            offsetX = clipX;
            offsetY = clipY + (clipHeight - drawHeight) / 2;
          }
          
          // Draw the image within the clipping path
          ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
          
          // Restore canvas state (removes clipping)
          ctx.restore();
          
          // Now draw the frame on top
          ctx.drawImage(frame, 0, 0, canvas.width, canvas.height);
          
          // Get the final composite image
          const compositeImage = canvas.toDataURL('image/png');
          resolve(compositeImage);
        };
        
        img.onerror = (error) => {
          console.error('Image load error:', error);
          reject(new Error('Failed to load the selected image'));
        };
        
        img.src = imageDataUrl;
      };
      
      frame.onerror = (error) => {
        console.error('Frame load error:', error);
        reject(new Error(`Failed to load frame from: ${framePath}`));
      };
      
      frame.src = frameUrl;
    } catch (error) {
      console.error('General error in canvas fallback method:', error);
      reject(error);
    }
  });
};
