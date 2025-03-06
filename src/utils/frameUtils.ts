
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
 * Creates a preview of the image with the frame
 */
export const createFramePreview = (
  imageElement: HTMLImageElement,
  frameElement: HTMLImageElement,
  container: HTMLElement,
  scale: number = 1,
  rotation: number = 0
): void => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) return;
  
  // Set canvas dimensions based on container
  canvas.width = container.clientWidth;
  canvas.height = container.clientHeight;
  
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Draw the image with transformations
  ctx.save();
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate((rotation * Math.PI) / 180);
  ctx.scale(scale, scale);
  ctx.drawImage(imageElement, -imageElement.width / 2, -imageElement.height / 2);
  ctx.restore();
  
  // Draw the frame
  ctx.drawImage(frameElement, 0, 0, canvas.width, canvas.height);
  
  // Replace the content of the container with the canvas
  container.innerHTML = '';
  container.appendChild(canvas);
};
