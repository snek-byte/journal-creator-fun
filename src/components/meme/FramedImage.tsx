
import { useState, useEffect, useRef } from 'react';

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
  const svgContainerRef = useRef<HTMLDivElement>(null);
  
  // Load frame SVG content
  useEffect(() => {
    if (!frame) {
      setSvgContent(null);
      console.log("No frame selected, cleared frame content");
      return;
    }
    
    console.log("Loading frame from:", frame);
    
    // Use a more aggressive cache buster
    const cacheBuster = `?cache=${new Date().getTime()}`;
    
    fetch(`${frame}${cacheBuster}`)
      .then(response => {
        console.log("Frame fetch response status:", response.status);
        if (!response.ok) {
          throw new Error(`Failed to load frame: ${response.status}`);
        }
        return response.text();
      })
      .then(data => {
        console.log("Received SVG content, length:", data.length);
        if (data.length > 0) {
          setSvgContent(data);
          // Force repaint after SVG content is set
          setTimeout(() => {
            if (svgContainerRef.current) {
              svgContainerRef.current.style.opacity = '0.99';
              setTimeout(() => {
                if (svgContainerRef.current) {
                  svgContainerRef.current.style.opacity = '1';
                }
              }, 10);
            }
          }, 10);
        } else {
          console.error("Received empty SVG content");
          setSvgContent(null);
        }
      })
      .catch(error => {
        console.error("Error loading frame SVG:", error, "Frame path:", frame);
        setSvgContent(null);
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
    if (onError) {
      onError();
    }
    console.error("Error loading image in FramedImage");
  };
  
  // Debug rendering
  useEffect(() => {
    console.log("Frame rendering state:", { 
      hasFrame: Boolean(frame), 
      hasSvgContent: Boolean(svgContent),
      frameUrl: frame,
      svgContentLength: svgContent ? svgContent.length : 0
    });
  }, [frame, svgContent]);
  
  return (
    <div className="relative w-full h-full">
      {/* Background color */}
      <div 
        className="absolute inset-0"
        style={{ backgroundColor }}
      />
      
      {/* The image */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        {/* The template image */}
        <img
          src={template}
          alt="Meme template"
          className={frame ? "absolute inset-0 w-full h-full object-cover" : "max-w-full max-h-full object-contain"}
          onLoad={handleImageLoad}
          onError={handleImageError}
          crossOrigin="anonymous"
        />
        
        {/* The frame overlay */}
        {frame && svgContent && (
          <div 
            ref={svgContainerRef}
            className="absolute inset-0 pointer-events-none z-30"
            dangerouslySetInnerHTML={{ __html: svgContent }}
            style={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              width: '100%', 
              height: '100%',
              zIndex: 30
            }}
          />
        )}
      </div>
    </div>
  );
}
