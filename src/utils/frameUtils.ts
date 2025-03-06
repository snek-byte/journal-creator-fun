
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
          // Calculate the scaling ratio to fit the image to the frame
          // while maintaining aspect ratio
          const frameAspect = frame.width / frame.height;
          const imgAspect = img.width / img.height;
          
          let drawWidth, drawHeight, offsetX, offsetY;
          
          if (imgAspect > frameAspect) {
            // Image is wider than frame
            drawHeight = frame.height * 0.85; // Leave some padding
            drawWidth = drawHeight * imgAspect;
            offsetX = (frame.width - drawWidth) / 2;
            offsetY = (frame.height - drawHeight) / 2;
          } else {
            // Image is taller than frame
            drawWidth = frame.width * 0.85; // Leave some padding
            drawHeight = drawWidth / imgAspect;
            offsetX = (frame.width - drawWidth) / 2;
            offsetY = (frame.height - drawHeight) / 2;
          }
          
          // Clear the canvas
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          
          // Apply the user specified scale
          const scaledWidth = drawWidth * scale;
          const scaledHeight = drawHeight * scale;
          
          // Recalculate offsets for the scaled image
          const scaledOffsetX = (frame.width - scaledWidth) / 2;
          const scaledOffsetY = (frame.height - scaledHeight) / 2;
          
          // Draw the image with transformations
          ctx.save();
          
          // Move to the center of where the image should be drawn
          ctx.translate(
            scaledOffsetX + scaledWidth / 2, 
            scaledOffsetY + scaledHeight / 2
          );
          
          // Apply rotation
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
