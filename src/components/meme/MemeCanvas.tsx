
import { useRef, useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import html2canvas from 'html2canvas';

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
  backgroundColor = '#ffffff'
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
          {template && (
            <img
              src={template}
              alt="Background template"
              className="absolute inset-0 w-full h-full object-cover"
              onLoad={handleImageLoad}
              onError={handleImageError}
              crossOrigin="anonymous"
            />
          )}

          <div
            className="absolute top-0 left-0 right-0 flex items-start justify-center pt-4 z-10"
            style={textStyle1}
          >
            {topText}
          </div>
          
          <div
            className="absolute bottom-0 left-0 right-0 flex items-end justify-center pb-4 z-10"
            style={textStyle1}
          >
            {bottomText}
          </div>

          {frame && (
            <img
              src={frame}
              alt="Frame"
              className="absolute inset-0 w-full h-full object-cover z-20 pointer-events-none"
              onLoad={handleFrameLoad}
              onError={handleFrameError}
              crossOrigin="anonymous"
            />
          )}
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
