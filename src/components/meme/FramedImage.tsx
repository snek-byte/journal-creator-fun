
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
      console.log("No frame selected, cleared frame content");
      return;
    }
    
    console.log("Loading frame from:", frame);
    
    fetch(frame)
      .then(response => {
        console.log("Frame fetch response status:", response.status);
        if (!response.ok) {
          throw new Error(`Failed to load frame: ${response.status}`);
        }
        return response.text();
      })
      .then(data => {
        // Make SVG responsive by adding viewBox if missing
        let modifiedSvg = data;
        if (!modifiedSvg.includes('viewBox')) {
          modifiedSvg = modifiedSvg.replace('<svg', '<svg viewBox="0 0 640 640"');
        }
        
        // Set SVG content and mark as loaded
        setSvgContent(modifiedSvg);
        setFrameLoaded(true);
        console.log("Frame SVG loaded and processed successfully:", frame);
      })
      .catch(error => {
        console.error("Error loading frame SVG:", error, "Frame path:", frame);
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
          // With frame: Use a container to position both image and frame
          <div className="relative w-full h-full">
            {/* The template image as background */}
            <img
              src={template}
              alt="Meme template"
              className="absolute inset-0 w-full h-full object-cover"
              onLoad={handleImageLoad}
              onError={handleImageError}
              crossOrigin="anonymous"
            />
            
            {/* The frame overlay */}
            {svgContent && (
              <div 
                className="absolute inset-0 pointer-events-none" 
                style={{ zIndex: 30 }}
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
