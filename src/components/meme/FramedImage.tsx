
import { useState, useEffect } from 'react';

interface FramedImageProps {
  template: string;
  frame: string | undefined;
  onImageLoad?: (dimensions: { width: number, height: number }) => void;
  onError?: () => void;
  backgroundColor?: string;
}

export function FramedImage({ 
  template, 
  frame, 
  onImageLoad, 
  onError, 
  backgroundColor = '#ffffff' 
}: FramedImageProps) {
  const [svgContent, setSvgContent] = useState<string | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [frameLoaded, setFrameLoaded] = useState(false);
  
  // Load frame SVG content
  useEffect(() => {
    if (!frame) {
      setSvgContent(null);
      setFrameLoaded(false);
      return;
    }
    
    fetch(frame)
      .then(response => response.text())
      .then(data => {
        // Make SVG responsive by adding viewBox if missing
        let modifiedSvg = data;
        if (!modifiedSvg.includes('viewBox')) {
          modifiedSvg = modifiedSvg.replace('<svg', '<svg viewBox="0 0 640 640"');
        }
        
        // Create a mask by modifying the SVG
        // Find all shapes with fill="transparent" and make them white for the mask
        modifiedSvg = modifiedSvg.replace(/fill="transparent"/g, 'fill="white"');
        
        setSvgContent(modifiedSvg);
        setFrameLoaded(true);
        console.log("Frame SVG loaded and processed");
      })
      .catch(error => {
        console.error("Error loading frame SVG:", error);
        setSvgContent(null);
        setFrameLoaded(false);
      });
  }, [frame]);
  
  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    setImageLoaded(true);
    if (onImageLoad) {
      onImageLoad({
        width: e.currentTarget.naturalWidth,
        height: e.currentTarget.naturalHeight
      });
    }
    console.log("Image loaded in FramedImage component");
  };
  
  const handleImageError = () => {
    setImageLoaded(false);
    if (onError) {
      onError();
    }
    console.error("Error loading image in FramedImage");
  };
  
  // Determine if we have both the image and frame ready (or just image if no frame)
  const isReady = template && (frame ? frameLoaded && imageLoaded : imageLoaded);
  
  if (!template) {
    return null;
  }
  
  return (
    <div className="relative w-full h-full">
      {/* Background color */}
      <div 
        className="absolute inset-0"
        style={{ backgroundColor }}
      />
      
      {/* The image */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        {frame ? (
          // With frame: Use clip-path or mask
          <div className="relative w-full h-full">
            {/* The image to be framed */}
            <img
              src={template}
              alt="Meme template"
              className="absolute inset-0 w-full h-full object-cover"
              style={{ objectFit: 'cover' }}
              onLoad={handleImageLoad}
              onError={handleImageError}
              crossOrigin="anonymous"
            />
            
            {/* The frame overlay */}
            {svgContent && (
              <div 
                className="absolute inset-0 pointer-events-none z-20"
                dangerouslySetInnerHTML={{ __html: svgContent }}
              />
            )}
          </div>
        ) : (
          // No frame: Just show the image
          <img
            src={template}
            alt="Meme template"
            className="max-w-full max-h-full object-contain"
            onLoad={handleImageLoad}
            onError={handleImageError}
            crossOrigin="anonymous"
          />
        )}
      </div>
    </div>
  );
}
