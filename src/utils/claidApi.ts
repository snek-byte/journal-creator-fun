
/**
 * Utility functions for integrating with the Claid.ai API
 * for professional image framing and editing
 */

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
    
    // Add frame parameters
    formData.append('frame', frameType);
    formData.append('auto_fit', 'true');
    
    // This would be the actual API call in production
    // For now, we'll use a mock response since we don't have an actual API key
    // In production, you would use:
    /*
    const response = await fetch('https://api.claid.ai/v1/image/edit', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CLAID_API_KEY}`,
      },
      body: formData
    });
    
    const data = await response.blob();
    return URL.createObjectURL(data);
    */
    
    // For now, use our existing canvas-based approach as a fallback
    // This should be replaced with the actual API call when ready
    console.log('Using Canvas fallback method until Claid API is fully integrated');
    return await useFallbackCanvasMethod(imageDataUrl, framePath);
  } catch (error) {
    console.error('Error applying frame with Claid API:', error);
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
  // These would need to be adjusted based on the actual Claid API options
  const frameMapping: Record<string, string> = {
    'basic-border': 'simple',
    'rounded': 'rounded',
    'shadow-box': 'shadow',
    'photo-frame': 'classic',
    'polaroid': 'polaroid',
    'vintage': 'vintage',
    'neon': 'neon',
    // Add more mappings as needed
  };
  
  return frameMapping[frameName] || 'simple';
};

// Fallback method using canvas (our current implementation)
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
        
        // Fill with white background
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Load the base image
        const img = new Image();
        img.crossOrigin = 'anonymous';
        
        img.onload = () => {
          // Draw the frame first
          ctx.drawImage(frame, 0, 0, canvas.width, canvas.height);
          
          // Calculate the clipping area based on the frame
          let clipX, clipY, clipWidth, clipHeight;
          
          // Different frames have different clipping areas
          if (framePath.includes('shadow-box')) {
            // Shadow box needs specific clipping
            clipX = canvas.width * 0.15;
            clipY = canvas.height * 0.15;
            clipWidth = canvas.width * 0.7;
            clipHeight = canvas.height * 0.7;
          } else if (framePath.includes('polaroid')) {
            clipX = canvas.width * 0.1; 
            clipY = canvas.width * 0.1;
            clipWidth = canvas.width * 0.8;
            clipHeight = canvas.height * 0.7; // Polaroid has more space at bottom
          } else {
            // Default clipping area
            clipX = canvas.width * 0.1;
            clipY = canvas.height * 0.1;
            clipWidth = canvas.width * 0.8;
            clipHeight = canvas.height * 0.8;
          }
          
          // Save the canvas state for clipping
          ctx.save();
          
          // Create a clipping path
          ctx.beginPath();
          ctx.rect(clipX, clipY, clipWidth, clipHeight);
          ctx.clip();
          
          // Calculate image scaling to fit the clipping area
          const imgRatio = img.width / img.height;
          const clipRatio = clipWidth / clipHeight;
          
          let drawWidth, drawHeight, offsetX, offsetY;
          
          if (imgRatio > clipRatio) {
            // Image is wider - scale by height
            drawHeight = clipHeight;
            drawWidth = drawHeight * imgRatio;
            offsetX = clipX + (clipWidth - drawWidth) / 2;
            offsetY = clipY;
          } else {
            // Image is taller - scale by width
            drawWidth = clipWidth;
            drawHeight = drawWidth / imgRatio;
            offsetX = clipX;
            offsetY = clipY + (clipHeight - drawHeight) / 2;
          }
          
          // Draw the image within the clipping path
          ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
          
          // Restore canvas state
          ctx.restore();
          
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
