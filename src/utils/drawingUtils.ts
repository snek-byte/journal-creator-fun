
/**
 * Utility functions for drawing tools
 */

// Updates brush styles based on the selected tool
export const configureBrushStyles = (
  ctx: CanvasRenderingContext2D,
  tool: string, 
  color: string, 
  brushSize: number
) => {
  // Save the current context state
  ctx.save();
  
  // Set color (use white for eraser)
  ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : color;
  ctx.fillStyle = tool === 'eraser' ? '#ffffff' : color;
  
  // Different line widths based on tool
  if (tool === 'pen') {
    ctx.lineWidth = brushSize;
  } else if (tool === 'marker') {
    ctx.lineWidth = brushSize * 2; // Marker is thicker
  } else if (tool === 'highlighter') {
    ctx.lineWidth = brushSize * 3; // Highlighter is even thicker
  } else if (tool === 'eraser') {
    ctx.lineWidth = brushSize * 2.5; // Eraser is also thicker
  } else {
    ctx.lineWidth = brushSize;
  }
  
  // Special tool settings
  if (tool === 'eraser') {
    ctx.globalCompositeOperation = 'destination-out';
    ctx.globalAlpha = 1;
  } else {
    ctx.globalCompositeOperation = 'source-over';
    
    // Different opacity based on tool
    if (tool === 'highlighter') {
      ctx.globalAlpha = 0.3;
    } else if (tool === 'marker') {
      ctx.globalAlpha = 0.7; // Marker is semi-transparent
    } else if (tool === 'pen') {
      ctx.globalAlpha = 1; // Pen is fully opaque
    } else {
      ctx.globalAlpha = 1;
    }
  }
  
  return {
    tool, 
    color, 
    brushSize, 
    lineWidth: ctx.lineWidth,
    globalCompositeOperation: ctx.globalCompositeOperation,
    globalAlpha: ctx.globalAlpha
  };
};

// Converts mouse/touch event to canvas coordinates
export const getPointFromEvent = (
  e: React.MouseEvent | React.TouchEvent,
  canvas: HTMLCanvasElement
): { x: number; y: number } => {
  if (!canvas) return { x: 0, y: 0 };

  const rect = canvas.getBoundingClientRect();
  
  // Calculate scale ratios in case the canvas is stretched
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  
  let clientX, clientY;
  
  if ('touches' in e) {
    // Touch event
    if (e.touches.length === 0) {
      // Handle case where touches array is empty
      return { x: 0, y: 0 };
    }
    clientX = e.touches[0].clientX;
    clientY = e.touches[0].clientY;
  } else {
    // Mouse event
    clientX = e.clientX;
    clientY = e.clientY;
  }
  
  // Get coordinates relative to canvas and adjust for scaling
  return {
    x: (clientX - rect.left) * scaleX,
    y: (clientY - rect.top) * scaleY
  };
};

// Generate data URL from canvas
export const canvasToDataURL = (canvas: HTMLCanvasElement): string => {
  if (!canvas) return '';
  return canvas.toDataURL('image/png');
};
