/**
 * Applies a frame to an image and returns the composite as a data URL
 */
export const applyFrameToImage = async (
  imageDataUrl: string,
  framePath: string,
  scale: number = 1,
  rotation: number = 0
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
      
      // Handle SVG frame loading from jsDelivr CDN if needed
      const frameUrl = framePath.startsWith('http') 
        ? framePath 
        : `${window.location.origin}${framePath}`;
      
      frame.onload = () => {
        // Set canvas dimensions based on the frame
        canvas.width = frame.width;
        canvas.height = frame.height;
        
        // Load the base image
        const img = new Image();
        img.crossOrigin = 'anonymous';
        
        img.onload = () => {
          // Clear the canvas and set white background
          ctx.fillStyle = 'white';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          // Special handling for shadow-box frame
          if (framePath.includes('shadow-box')) {
            // Draw the white background and frame first
            ctx.drawImage(frame, 0, 0, canvas.width, canvas.height);
            
            // Calculate dimensions for the inner area of the shadow box (fixed for this frame)
            const innerX = 120;  // Matches the clipPath in the SVG
            const innerY = 120;
            const innerWidth = 400;  // Matches the clipPath in the SVG
            const innerHeight = 400;
            
            // Calculate scaling to fit the image properly within the inner area
            const imgAspect = img.width / img.height;
            const innerAspect = innerWidth / innerHeight;
            
            let drawWidth, drawHeight, offsetX, offsetY;
            
            if (imgAspect > innerAspect) {
              // Image is wider - constrain by width
              drawWidth = innerWidth * 0.9; // Use only 90% to ensure margin
              drawHeight = drawWidth / imgAspect;
              offsetX = innerX + (innerWidth - drawWidth) / 2;
              offsetY = innerY + (innerHeight - drawHeight) / 2;
            } else {
              // Image is taller - constrain by height
              drawHeight = innerHeight * 0.9; // Use only 90% to ensure margin
              drawWidth = drawHeight * imgAspect;
              offsetX = innerX + (innerWidth - drawWidth) / 2;
              offsetY = innerY + (innerHeight - drawHeight) / 2;
            }
            
            // Apply rotation if needed
            if (rotation !== 0) {
              const centerX = innerX + innerWidth / 2;
              const centerY = innerY + innerHeight / 2;
              
              ctx.save();
              ctx.translate(centerX, centerY);
              ctx.rotate((rotation * Math.PI) / 180);
              
              // Create clipping path for the image
              ctx.beginPath();
              const clipWidth = innerWidth * 0.9;
              const clipHeight = innerHeight * 0.9;
              ctx.rect(-clipWidth/2, -clipHeight/2, clipWidth, clipHeight);
              ctx.clip();
              
              // Apply user scale (limited for shadow box)
              const safeScale = Math.min(scale, 1.2); // Limit scale to prevent overflow
              
              // Draw the image centered and properly scaled
              ctx.drawImage(
                img,
                -drawWidth * safeScale / 2,
                -drawHeight * safeScale / 2,
                drawWidth * safeScale,
                drawHeight * safeScale
              );
              
              ctx.restore();
            } else {
              // No rotation, apply scale directly
              const safeScale = Math.min(scale, 1.2); // Limit scale to prevent overflow
              const scaledWidth = drawWidth * safeScale;
              const scaledHeight = drawHeight * safeScale;
              
              // Recalculate position to keep centered
              const centeredX = innerX + (innerWidth - scaledWidth) / 2;
              const centeredY = innerY + (innerHeight - scaledHeight) / 2;
              
              // Create clipping path for the image
              ctx.save();
              ctx.beginPath();
              ctx.rect(innerX, innerY, innerWidth, innerHeight);
              ctx.clip();
              
              // Draw the image
              ctx.drawImage(img, centeredX, centeredY, scaledWidth, scaledHeight);
              ctx.restore();
            }
          } else {
            // For all other frames, use original approach
            // Calculate frame-specific padding
            let padding = calculatePadding(framePath);
            
            // Calculate inner dimensions (the area where the image should fit)
            const innerWidth = frame.width - (padding * 2);
            const innerHeight = frame.height - (padding * 2);
            
            // Calculate image aspect ratio
            const imgAspect = img.width / img.height;
            const innerAspect = innerWidth / innerHeight;
            
            // Calculate drawing dimensions to fit image within padding
            let drawWidth, drawHeight, offsetX, offsetY;
            
            if (imgAspect > innerAspect) {
              // Image is wider than inner frame - constrain by width
              drawWidth = innerWidth;
              drawHeight = drawWidth / imgAspect;
              offsetX = padding;
              offsetY = padding + (innerHeight - drawHeight) / 2;
            } else {
              // Image is taller than inner frame - constrain by height
              drawHeight = innerHeight;
              drawWidth = drawHeight * imgAspect;
              offsetX = padding + (innerWidth - drawWidth) / 2;
              offsetY = padding;
            }
            
            // Apply user scale factor
            const scaledWidth = drawWidth * scale;
            const scaledHeight = drawHeight * scale;
            
            // Recalculate offsets after scaling (keep image centered)
            const centeredOffsetX = padding + (innerWidth - scaledWidth) / 2;
            const centeredOffsetY = padding + (innerHeight - scaledHeight) / 2;
            
            // For all other frames, use standard approach
            
            // Draw the image with transformations
            ctx.save();
            
            // Move to center point for rotation
            const centerX = centeredOffsetX + scaledWidth / 2;
            const centerY = centeredOffsetY + scaledHeight / 2;
            
            ctx.translate(centerX, centerY);
            ctx.rotate((rotation * Math.PI) / 180);
            
            // Draw the image centered
            ctx.drawImage(
              img,
              -scaledWidth / 2,
              -scaledHeight / 2,
              scaledWidth,
              scaledHeight
            );
            
            ctx.restore();
            
            // Draw the frame on top
            ctx.drawImage(frame, 0, 0, canvas.width, canvas.height);
          }
          
          // Get the final composite image as a data URL
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
      console.error('General error in applyFrameToImage:', error);
      reject(error);
    }
  });
};

/**
 * Calculate appropriate padding based on frame type
 */
const calculatePadding = (framePath: string): number => {
  if (framePath.includes('shadow-box')) {
    return 120; // Increased padding for shadow box to ensure image fits properly
  } else if (framePath.includes('polaroid')) {
    return 90; // Polaroid has more padding at the bottom
  } else if (framePath.includes('certificate') || framePath.includes('fancy')) {
    return 80; // More decorative frames need more padding
  } else if (framePath.includes('taped') || framePath.includes('instant-photo')) {
    return 75; // These frames need specific padding
  } else if (framePath.includes('rounded') || framePath.includes('basic-border')) {
    return 40; // Simple frames need less padding
  } else {
    return 60; // Default padding for other frames
  }
};

/**
 * Creates a preview of an image with SVG frame overlay
 * This function creates a non-destructive preview where the image and frame remain separate
 */
export const getFramedImageDimensions = (
  imageWidth: number,
  imageHeight: number,
  containerWidth: number,
  containerHeight: number
): { width: number; height: number } => {
  // Calculate the aspect ratio of the image and container
  const imageAspect = imageWidth / imageHeight;
  const containerAspect = containerWidth / containerHeight;
  
  // Determine the dimensions to fit the image within the container
  let width, height;
  
  if (imageAspect > containerAspect) {
    // Image is wider than container (relative to height)
    width = containerWidth;
    height = width / imageAspect;
  } else {
    // Image is taller than container (relative to width)
    height = containerHeight;
    width = height * imageAspect;
  }
  
  return { width, height };
};

/**
 * Creates a proper clipping mask for the image based on the frame dimensions
 */
export const clipImageToFrame = (
  frameElement: SVGSVGElement,
  imageElement: HTMLImageElement
): void => {
  // Extract the main shape from the SVG frame
  const paths = frameElement.querySelectorAll('path, rect, circle, polygon');
  
  if (paths.length > 0) {
    // Use the first shape for clipping (typically the main frame shape)
    const mainPath = paths[0];
    
    // Get the clip path ID
    const clipId = `frame-clip-${Date.now()}`;
    
    // Create a clip path element
    const clipPath = document.createElementNS('http://www.w3.org/2000/svg', 'clipPath');
    clipPath.setAttribute('id', clipId);
    
    // Clone the path to use in the clip path
    const clonedPath = mainPath.cloneNode(true) as SVGElement;
    clipPath.appendChild(clonedPath);
    
    // Add the clip path to the frame SVG
    frameElement.appendChild(clipPath);
    
    // Apply the clip path to the image
    imageElement.style.clipPath = `url(#${clipId})`;
  }
};
