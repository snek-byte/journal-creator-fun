
import { useRef, useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { FramedImage } from './FramedImage';
import { MemeText } from './MemeText';
import { RemoveButton } from './RemoveButton';
import { MemeCanvasPlaceholder } from './MemeCanvasPlaceholder';
import { downloadMemeAsImage } from '@/utils/memeUtils';

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

  // Set up global download function
  useEffect(() => {
    (window as any).downloadMeme = () => downloadMemeAsImage(canvasRef);
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
          {template ? (
            <div className="absolute inset-0">
              <FramedImage
                template={template}
                frame={frame || undefined}
                backgroundColor={backgroundColor}
                onImageLoad={handleImageLoadSuccess}
                onError={handleImageLoadError}
              />
              
              <RemoveButton onRemove={handleBackgroundRemove} />
            </div>
          ) : (
            <MemeCanvasPlaceholder backgroundColor={backgroundColor} />
          )}

          {/* Text layers */}
          <MemeText 
            text={topText}
            position="top"
            font={font}
            fontSize={fontSize}
            fontColor={fontColor}
            strokeColor={strokeColor}
            fontWeight={fontWeight}
            textStyle={textStyle}
            gradient={gradient}
          />
          
          <MemeText 
            text={bottomText}
            position="bottom"
            font={font}
            fontSize={fontSize}
            fontColor={fontColor}
            strokeColor={strokeColor}
            fontWeight={fontWeight}
            textStyle={textStyle}
            gradient={gradient}
          />
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
