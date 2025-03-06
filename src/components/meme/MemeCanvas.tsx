
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

  // Text styling
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

  // Handle frame load
  const handleFrameLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    setFrameLoaded(true);
    setFrameError(false);
    console.log("Frame loaded successfully");
  };

  // Handle frame error
  const handleFrameError = () => {
    console.error("Error loading frame:", frame);
    setFrameError(true);
    setFrameLoaded(false);
  };

  // Handle image load and size
  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    setImageLoaded(true);
    setImageError(false);
    setImageHeight(e.currentTarget.naturalHeight);
    setImageWidth(e.currentTarget.naturalWidth);
    console.log("Image loaded successfully");
  };

  // Handle image error
  const handleImageError = () => {
    console.error("Error loading image template:", template);
    setImageError(true);
    setImageLoaded(false);
  };

  // Handle canvas click
  const handleCanvasClick = () => {
    if (onTemplateClick) {
      onTemplateClick();
    }
  };

  // Download function (exposed to parent via ref)
  const downloadMeme = async () => {
    if (!canvasRef.current) {
      console.error("Canvas not ready");
      return;
    }

    try {
      const canvas = await html2canvas(canvasRef.current, {
        allowTaint: true,
        useCORS: true,
        logging: false,
        backgroundColor: null,
      });

      const link = document.createElement('a');
      link.download = 'my-creation.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error("Error generating image:", error);
    }
  };

  // Expose download function to parent
  useEffect(() => {
    // Make downloadMeme available on the window for the parent component
    (window as any).downloadMeme = downloadMeme;
    return () => {
      delete (window as any).downloadMeme;
    };
  }, []);

  // Special styling for specific frames
  const isCollageFrame = frame && frame.includes('collage');
  const isBirthdayFrame = frame && frame.includes('birthday');
  const isInstantPhotoFrame = frame && frame.includes('instant-photo');
  const isSocialMediaFrame = frame && frame.includes('social-media');

  // Function to handle background removal
  const handleBackgroundRemove = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering canvas click
    if (onBackgroundRemove) {
      onBackgroundRemove();
    }
  };

  return (
    <Card className="p-3 w-full flex justify-center bg-gray-100">
      <div 
        ref={canvasRef}
        className="relative meme-canvas inline-block"
        style={{ maxWidth: '100%' }}
      >
        <div 
          className="bg-white relative"
          style={{ 
            width: '640px', 
            height: '640px',
            maxWidth: '100%',
            backgroundColor: backgroundColor || '#ffffff'
          }}
        >
          {/* Background or template image layer */}
          {template ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <img
                src={template}
                alt="Background template"
                className="max-w-full max-h-full object-contain"
                onLoad={handleImageLoad}
                onError={handleImageError}
                crossOrigin="anonymous"
                style={{zIndex: 1}}
              />
              {/* Remove background button */}
              <button 
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors z-50"
                onClick={handleBackgroundRemove}
                title="Remove background"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div 
              className="absolute inset-0 flex items-center justify-center bg-gray-50 cursor-pointer"
              onClick={handleCanvasClick}
            >
              <p className="text-gray-400 text-center p-4">Click to add your photo</p>
            </div>
          )}

          {/* Frame layer */}
          {frame && (
            <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
              <img
                src={frame}
                alt="Frame"
                className="max-w-full max-h-full object-contain"
                onLoad={handleFrameLoad}
                onError={handleFrameError}
                crossOrigin="anonymous"
                style={{ 
                  mixBlendMode: 'normal',
                  opacity: 1
                }}
              />
            </div>
          )}

          {/* Text layers */}
          <div
            className="absolute top-0 left-0 right-0 flex items-start justify-center pt-4 z-40"
            style={textStyle1}
          >
            {topText}
          </div>
          
          <div
            className="absolute bottom-0 left-0 right-0 flex items-end justify-center pb-4 z-40"
            style={textStyle1}
          >
            {bottomText}
          </div>
        </div>
      </div>
    </Card>
  );
}

// Make the download function accessible
export function downloadMeme() {
  if (typeof window !== 'undefined' && (window as any).downloadMeme) {
    (window as any).downloadMeme();
  } else {
    console.error("Download function not available");
  }
}
