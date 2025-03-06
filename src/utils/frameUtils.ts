
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
          
          // For shadow-box, draw everything in correct order
          if (framePath.includes('shadow-box')) {
            // First draw a white background for the shadow box
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Then draw the image centered in the frame's inner area
            ctx.save();
            
            // Move to center for rotation
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            
            ctx.translate(centerX, centerY);
            ctx.rotate((rotation * Math.PI) / 180);
            
            // Calculate the properly scaled image dimensions
            const imageSize = Math.min(scaledWidth, scaledHeight);
            const scaledImageWidth = imgAspect >= 1 ? imageSize : imageSize * imgAspect;
            const scaledImageHeight = imgAspect >= 1 ? imageSize / imgAspect : imageSize;
            
            // Draw the image centered
            ctx.drawImage(
              img,
              -scaledImageWidth / 2,
              -scaledImageHeight / 2,
              scaledImageWidth,
              scaledImageHeight
            );
            
            ctx.restore();
            
            // Now draw the frame on top
            ctx.drawImage(frame, 0, 0, canvas.width, canvas.height);
          } else {
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
    return 95; // Increased padding for shadow box
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
