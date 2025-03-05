
import React, { useRef, useEffect } from "react";
import { Meme } from "@/types/meme";

interface MemeCanvasProps {
  meme: Meme;
  width: number;
  height: number;
}

export function MemeCanvas({ meme, width, height }: MemeCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Load and draw the template image
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = meme.template;
    
    img.onload = () => {
      // Calculate aspect ratio and sizing
      const aspectRatio = img.width / img.height;
      let drawWidth = canvas.width;
      let drawHeight = canvas.width / aspectRatio;
      
      if (drawHeight > canvas.height) {
        drawHeight = canvas.height;
        drawWidth = canvas.height * aspectRatio;
      }
      
      // Center the image
      const xOffset = (canvas.width - drawWidth) / 2;
      const yOffset = (canvas.height - drawHeight) / 2;
      
      // Draw the image
      ctx.drawImage(img, xOffset, yOffset, drawWidth, drawHeight);
      
      // Configure text style
      ctx.textAlign = "center";
      ctx.font = `bold ${meme.fontSize}px ${meme.fontFamily}`;
      ctx.fillStyle = meme.fontColor;
      ctx.strokeStyle = meme.strokeColor;
      ctx.lineWidth = meme.strokeWidth;
      
      // Draw top text
      if (meme.topText) {
        ctx.fillText(meme.topText, canvas.width / 2, 40);
        ctx.strokeText(meme.topText, canvas.width / 2, 40);
      }
      
      // Draw bottom text
      if (meme.bottomText) {
        ctx.fillText(meme.bottomText, canvas.width / 2, canvas.height - 20);
        ctx.strokeText(meme.bottomText, canvas.width / 2, canvas.height - 20);
      }
    };
    
    img.onerror = () => {
      console.error("Failed to load template image:", meme.template);
      // Draw a placeholder or error message
      ctx.fillStyle = "#f0f0f0";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#666";
      ctx.textAlign = "center";
      ctx.font = "16px sans-serif";
      ctx.fillText("Could not load template", canvas.width / 2, canvas.height / 2);
    };
  }, [meme, width, height]);
  
  return (
    <canvas 
      ref={canvasRef} 
      width={width} 
      height={height}
      className="w-full rounded-md border border-gray-300 shadow-sm"
    />
  );
}
