
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
      
      // Load the base image
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        // Set canvas dimensions based on the image
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw the image with transformations
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.scale(scale, scale);
        ctx.drawImage(img, -img.width / 2, -img.height / 2, img.width, img.height);
        ctx.restore();
        
        // Load the frame
        const frame = new Image();
        frame.crossOrigin = 'anonymous';
        
        frame.onload = () => {
          // Draw the frame - resize to match the canvas dimensions
          ctx.drawImage(frame, 0, 0, canvas.width, canvas.height);
          
          // Get the final composite image as a data URL
          const compositeImage = canvas.toDataURL('image/png');
          resolve(compositeImage);
        };
        
        frame.onerror = () => {
          reject(new Error(`Failed to load frame from: ${framePath}`));
        };
        
        frame.src = framePath;
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load the selected image'));
      };
      
      img.src = imageDataUrl;
      
    } catch (error) {
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

