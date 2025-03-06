
/**
 * Utility functions for integrating with the Claid.ai API
 * for professional image framing and editing
 */

// Define the Claid API key - in a real app, this would be an environment variable
// For demo purposes, we'll use a placeholder
const CLAID_API_KEY = 'YOUR_CLAID_API_KEY'; // Replace with actual API key in production

// Supported image formats
const SUPPORTED_FORMATS = {
  BASIC: ['image/jpeg', 'image/png'],
  EXTENDED: ['image/gif', 'image/webp', 'image/svg+xml'],
  ALL: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
};

// Function to detect image format from data URL
const detectImageFormat = (dataUrl: string): string => {
  const matches = dataUrl.match(/^data:([^;]+);base64,/);
  return matches ? matches[1] : 'image/jpeg'; // Default to JPEG if can't detect
};

// Function to call Claid.ai API to apply a frame to an image
export const applyFrameWithClaidApi = async (
  imageDataUrl: string,
  framePath: string
): Promise<string> => {
  // Detect image format
  const imageFormat = detectImageFormat(imageDataUrl);
  console.log(`Detected image format: ${imageFormat}`);
  
  // Convert data URL to blob for upload
  const imageBlob = dataUrlToBlob(imageDataUrl);
  
  try {
    // Create FormData with the image
    const formData = new FormData();
    formData.append('image', imageBlob, `image.${imageFormat.split('/')[1]}`);
    
    // Extract frame type from the path for API parameters
    const frameType = getFrameTypeFromPath(framePath);
    
    console.log(`Applying frame: ${frameType} to image using Claid API`);
    
    // For animated GIFs or more complex formats, use enhanced processing
    const requiresEnhancedProcessing = SUPPORTED_FORMATS.EXTENDED.includes(imageFormat);
    
    // Make the actual API call to Claid.ai
    try {
      // Determine which API endpoint to use based on image format
      const apiEndpoint = requiresEnhancedProcessing 
        ? 'https://api.claid.ai/v1/image/enhance' 
        : 'https://api.claid.ai/v1/image/edit';
      
      const response = await fetch(apiEndpoint, {
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
      
      // Choose the appropriate fallback method based on image format
      if (imageFormat === 'image/gif' || requiresEnhancedProcessing) {
        return await useWebsiteFallbackMethod(imageDataUrl, framePath);
      } else {
        return await useCanvasFallbackMethod(imageDataUrl, framePath);
      }
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

// Define frame metadata for better positioning
interface FrameMetadata {
  inset: InsetPercentage;
  preserveAspectRatio: boolean;
  borderRadius?: number | string;
  clipPath?: string;
}

// Metadata for different frame types
const frameMetadata: Record<string, FrameMetadata> = {
  'default': { inset: 0.1, preserveAspectRatio: true },
  'shadow-box': { inset: 0.15, preserveAspectRatio: true, borderRadius: '4px' },
  'polaroid': { inset: { top: 0.1, right: 0.1, bottom: 0.3, left: 0.1 }, preserveAspectRatio: true },
  'taped': { inset: 0.15, preserveAspectRatio: true },
  'photo-frame': { inset: 0.12, preserveAspectRatio: true },
  'rounded': { inset: 0.08, preserveAspectRatio: true, borderRadius: '8px' },
  'basic-border': { inset: 0.08, preserveAspectRatio: true },
  'circular': { inset: 0.15, preserveAspectRatio: false, borderRadius: '50%' },
  'hexagon': { 
    inset: 0.15, 
    preserveAspectRatio: false, 
    clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)'
  }
};

// Get frame metadata based on frame path
const getFrameMetadata = (framePath: string): FrameMetadata => {
  const frameTypes = Object.keys(frameMetadata);
  const matchedType = frameTypes.find(type => framePath.includes(type));
  return matchedType ? frameMetadata[matchedType] : frameMetadata.default;
};

// Standard canvas fallback method for most image formats
const useCanvasFallbackMethod = async (
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
          // Get frame metadata for accurate positioning
          const metadata = getFrameMetadata(framePath);
          const insetPercentage: InsetPercentage = metadata.inset;
          
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
          
          // Create a clipping path - consider border radius if specified
          ctx.beginPath();
          
          if (metadata.borderRadius) {
            if (typeof metadata.borderRadius === 'string' && metadata.borderRadius === '50%') {
              // Handle circular frames
              const centerX = clipX + clipWidth / 2;
              const centerY = clipY + clipHeight / 2;
              const radius = Math.min(clipWidth, clipHeight) / 2;
              ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            } else {
              // Handle rounded rectangles
              const radius = typeof metadata.borderRadius === 'number' 
                ? metadata.borderRadius
                : Math.min(clipWidth, clipHeight) * 0.1;
              roundRect(ctx, clipX, clipY, clipWidth, clipHeight, radius);
            }
          } else if (metadata.clipPath && metadata.clipPath.includes('polygon')) {
            // Handle polygon clipPath (like hexagon)
            drawPolygonPath(ctx, clipX, clipY, clipWidth, clipHeight, metadata.clipPath);
          } else {
            // Default rectangle
            ctx.rect(clipX, clipY, clipWidth, clipHeight);
          }
          
          ctx.clip();
          
          // Calculate image scaling to fit the clipping area while maintaining aspect ratio
          const imgRatio = img.width / img.height;
          const clipRatio = clipWidth / clipHeight;
          
          let drawWidth: number, drawHeight: number, offsetX: number, offsetY: number;
          
          if (metadata.preserveAspectRatio) {
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
          } else {
            // Don't preserve aspect ratio, fill the entire clipping area
            drawWidth = clipWidth;
            drawHeight = clipHeight;
            offsetX = clipX;
            offsetY = clipY;
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

// Helper function to draw rounded rectangles
function roundRect(
  ctx: CanvasRenderingContext2D, 
  x: number, 
  y: number, 
  width: number, 
  height: number, 
  radius: number
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

// Helper function to draw a polygon path from CSS clip-path
function drawPolygonPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  clipPath: string
) {
  // Parse the polygon points from the clip-path string
  const pointsMatch = clipPath.match(/polygon\((.*)\)/);
  if (!pointsMatch) return;
  
  const pointsStr = pointsMatch[1];
  const points = pointsStr.split(',').map(point => {
    const [xPct, yPct] = point.trim().split(' ');
    const xVal = parseFloat(xPct) / 100 * width + x;
    const yVal = parseFloat(yPct) / 100 * height + y;
    return { x: xVal, y: yVal };
  });
  
  // Draw the polygon
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.closePath();
}

// Website fallback method for complex formats like animated GIFs
const useWebsiteFallbackMethod = async (
  imageDataUrl: string, 
  framePath: string
): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      // Create an offscreen container
      const container = document.createElement('div');
      container.style.position = 'absolute';
      container.style.left = '-9999px';
      container.style.top = '-9999px';
      container.style.width = '640px';
      container.style.height = '640px';
      document.body.appendChild(container);
      
      // Create frame container
      const frameContainer = document.createElement('div');
      frameContainer.style.position = 'relative';
      frameContainer.style.width = '100%';
      frameContainer.style.height = '100%';
      container.appendChild(frameContainer);
      
      // Get frame metadata
      const metadata = getFrameMetadata(framePath);
      const insetPercentage = metadata.inset;
      
      // Calculate insets
      let top: string, right: string, bottom: string, left: string;
      
      if (typeof insetPercentage === 'object') {
        top = `${insetPercentage.top * 100}%`;
        right = `${insetPercentage.right * 100}%`;
        bottom = `${insetPercentage.bottom * 100}%`;
        left = `${insetPercentage.left * 100}%`;
      } else {
        const inset = `${insetPercentage * 100}%`;
        top = right = bottom = left = inset;
      }
      
      // Add the image with proper positioning
      const image = document.createElement('img');
      image.src = imageDataUrl;
      image.style.position = 'absolute';
      image.style.top = top;
      image.style.right = right;
      image.style.bottom = bottom;
      image.style.left = left;
      image.style.width = 'calc(100% - ' + left + ' - ' + right + ')';
      image.style.height = 'calc(100% - ' + top + ' - ' + bottom + ')';
      image.style.objectFit = metadata.preserveAspectRatio ? 'contain' : 'fill';
      
      // Apply special styles based on frame type
      if (metadata.borderRadius) {
        image.style.borderRadius = typeof metadata.borderRadius === 'string' 
          ? metadata.borderRadius 
          : `${metadata.borderRadius}px`;
      }
      
      if (metadata.clipPath) {
        image.style.clipPath = metadata.clipPath;
      }
      
      frameContainer.appendChild(image);
      
      // Add the frame on top
      const frame = document.createElement('img');
      frame.src = framePath.startsWith('http') ? framePath : `${window.location.origin}${framePath}`;
      frame.style.position = 'absolute';
      frame.style.top = '0';
      frame.style.left = '0';
      frame.style.width = '100%';
      frame.style.height = '100%';
      frame.style.pointerEvents = 'none';
      frameContainer.appendChild(frame);
      
      // Use html2canvas to capture the result
      import('html2canvas').then(html2canvasModule => {
        const html2canvas = html2canvasModule.default;
        html2canvas(container, {
          allowTaint: true,
          useCORS: true,
          backgroundColor: null
        }).then(canvas => {
          // Get the data URL and clean up
          const result = canvas.toDataURL('image/png');
          document.body.removeChild(container);
          resolve(result);
        }).catch(error => {
          document.body.removeChild(container);
          console.error('html2canvas error:', error);
          reject(error);
        });
      }).catch(error => {
        document.body.removeChild(container);
        console.error('Failed to load html2canvas:', error);
        reject(error);
      });
      
    } catch (error) {
      console.error('General error in website fallback method:', error);
      reject(error);
    }
  });
};
