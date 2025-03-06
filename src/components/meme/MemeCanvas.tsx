
import { useRef, useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import html2canvas from 'html2canvas';
import { X } from 'lucide-react';

interface MemeCanvasProps {
  template: string;
  topText: string;
  bottomText: string;
  font: string;
  fontSize: number;
  fontColor: string;
  strokeColor: string;
  fontWeight: string;
  textStyle: string;
  gradient: string;
  frame?: string;
  backgroundColor?: string;
  onTemplateClick?: () => void;
  onBackgroundRemove?: () => void;
}

export function MemeCanvas({
  template,
  topText,
  bottomText,
  font,
  fontSize,
  fontColor,
  strokeColor,
  fontWeight,
  textStyle,
  gradient,
  frame = '',
  backgroundColor = '#ffffff',
  onTemplateClick,
  onBackgroundRemove
}: MemeCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageHeight, setImageHeight] = useState(0);
  const [imageWidth, setImageWidth] = useState(0);
  const [frameLoaded, setFrameLoaded] = useState(false);
  const [frameError, setFrameError] = useState(false);

  useEffect(() => {
    console.log("MemeCanvas received template:", template ? "Has data (length: " + template.length + ")" : "Empty");
  }, [template]);

  const textStyle1 = {
    fontFamily: font,
    fontSize: `${fontSize}px`,
    fontWeight: fontWeight as any,
    color: fontColor,
    textStroke: `2px ${strokeColor}`,
    WebkitTextStroke: `2px ${strokeColor}`,
    textAlign: 'center' as const,
    textTransform: 'uppercase' as const,
    wordBreak: 'break-word' as const,
    padding: '0 10px',
    fontStyle: textStyle?.includes('italic') ? 'italic' : 'normal',
    textDecoration: textStyle?.includes('underline') ? 'underline' : 'none',
    background: gradient || 'transparent',
    WebkitBackgroundClip: gradient ? 'text' : 'border-box',
    WebkitTextFillColor: gradient ? 'transparent' : fontColor,
    backgroundClip: gradient ? 'text' : 'border-box'
  };

  const handleFrameLoad = () => {
    setFrameLoaded(true);
    setFrameError(false);
    console.log("Frame loaded successfully");
  };

  const handleFrameError = () => {
    console.error("Error loading frame:", frame);
    setFrameError(true);
    setFrameLoaded(false);
  };

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    setImageLoaded(true);
    setImageError(false);
    setImageHeight(e.currentTarget.naturalHeight);
    setImageWidth(e.currentTarget.naturalWidth);
    console.log("Image loaded successfully, dimensions:", e.currentTarget.naturalWidth, "x", e.currentTarget.naturalHeight);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.error("Error loading image template. Image URL starts with:", template?.substring(0, 30));
    setImageError(true);
    setImageLoaded(false);
  };

  const handleCanvasClick = () => {
    if (onTemplateClick && !template) {
      console.log("Canvas clicked, opening file selector");
      onTemplateClick();
    }
  };

  const handleBackgroundRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onBackgroundRemove) {
      console.log("Remove button clicked");
      onBackgroundRemove();
    }
  };

  const downloadMeme = async () => {
    if (!canvasRef.current) {
      console.error("Canvas not ready");
      return;
    }

    try {
      console.log("Starting to generate image");
      const canvas = await html2canvas(canvasRef.current, {
        allowTaint: true,
        useCORS: true,
        logging: false,
        backgroundColor: null,
      });

      const link = document.createElement('a');
      link.download = 'my-creation.png';
      link.href = canvas.toDataURL('image/png');
      console.log("Image generated successfully, downloading");
      link.click();
    } catch (error) {
      console.error("Error generating image:", error);
    }
  };

  useEffect(() => {
    (window as any).downloadMeme = downloadMeme;
    return () => {
      delete (window as any).downloadMeme;
    };
  }, []);

  return (
    <Card className="p-3 w-full flex justify-center bg-gray-100">
      <div 
        ref={canvasRef}
        className="relative meme-canvas inline-block"
        style={{ maxWidth: '100%' }}
      >
        <div 
          className="relative overflow-hidden"
          style={{ 
            width: '640px', 
            height: '640px',
            maxWidth: '100%',
            backgroundColor: backgroundColor || '#ffffff'
          }}
          onClick={handleCanvasClick}
        >
          {/* Background color layer */}
          <div 
            className="absolute inset-0"
            style={{ backgroundColor: backgroundColor || '#ffffff', zIndex: 1 }}
          />
          
          {/* Main content container with either template or placeholder */}
          <div className="absolute inset-0 flex items-center justify-center" style={{ zIndex: 10 }}>
            {template ? (
              <>
                <img
                  src={template}
                  alt="Background template"
                  className="max-w-full max-h-full object-contain"
                  style={{ 
                    position: 'relative',
                    zIndex: 15
                  }}
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                  crossOrigin="anonymous"
                />
                
                <button 
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
                  onClick={handleBackgroundRemove}
                  title="Remove background"
                  style={{ zIndex: 50 }}
                >
                  <X className="w-4 h-4" />
                </button>
              </>
            ) : (
              <div className="text-gray-400 text-center p-4 cursor-pointer">
                Click to add your photo
              </div>
            )}
          </div>

          {/* Frame layer - now correctly positioned over the image */}
          {frame && (
            <div 
              className="absolute inset-0 flex items-center justify-center pointer-events-none" 
              style={{ zIndex: 20 }}
            >
              <div className="relative w-full h-full">
                <img
                  src={frame}
                  alt="Frame"
                  className="absolute inset-0 w-full h-full object-fill"
                  onLoad={handleFrameLoad}
                  onError={handleFrameError}
                  crossOrigin="anonymous"
                />
              </div>
            </div>
          )}

          {/* Text layers - positioned above everything else */}
          <div
            className="absolute top-0 left-0 right-0 flex items-start justify-center pt-4"
            style={{
              ...textStyle1,
              zIndex: 30
            }}
          >
            {topText}
          </div>
          
          <div
            className="absolute bottom-0 left-0 right-0 flex items-end justify-center pb-4"
            style={{
              ...textStyle1,
              zIndex: 30
            }}
          >
            {bottomText}
          </div>
        </div>
      </div>
    </Card>
  );
}

export function downloadMeme() {
  if (typeof window !== 'undefined' && (window as any).downloadMeme) {
    (window as any).downloadMeme();
  } else {
    console.error("Download function not available");
  }
}
