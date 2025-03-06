
import { useRef, useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import html2canvas from 'html2canvas';
import { X } from 'lucide-react';
import { FramedImage } from './FramedImage';

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

  useEffect(() => {
    console.log("MemeCanvas received template:", template ? "Has data (length: " + template.length + ")" : "Empty");
    console.log("MemeCanvas received frame:", frame || "No frame");
  }, [template, frame]);

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

  const handleImageLoadSuccess = (dimensions: { width: number, height: number }) => {
    setImageLoaded(true);
    setImageError(false);
    setImageHeight(dimensions.height);
    setImageWidth(dimensions.width);
    console.log("Image loaded successfully, dimensions:", dimensions.width, "x", dimensions.height);
  };

  const handleImageLoadError = () => {
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
            maxWidth: '100%'
          }}
          onClick={handleCanvasClick}
        >
          {/* Background color and template image with frame */}
          {template ? (
            <div className="absolute inset-0">
              <FramedImage
                template={template}
                frame={frame || undefined}
                backgroundColor={backgroundColor}
                onImageLoad={handleImageLoadSuccess}
                onError={handleImageLoadError}
              />
              
              <button 
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors z-50"
                onClick={handleBackgroundRemove}
                title="Remove background"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
              {/* Background color layer when no image */}
              <div 
                className="absolute inset-0"
                style={{ backgroundColor: backgroundColor || '#ffffff' }}
              />

              {/* Placeholder if no image */}
              <div className="absolute inset-0 flex items-center justify-center cursor-pointer z-10">
                <p className="text-gray-400 text-center p-4">Click to add your photo</p>
              </div>
            </>
          )}

          {/* Text layers - positioned above everything else */}
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

export function downloadMeme() {
  if (typeof window !== 'undefined' && (window as any).downloadMeme) {
    (window as any).downloadMeme();
  } else {
    console.error("Download function not available");
  }
}
