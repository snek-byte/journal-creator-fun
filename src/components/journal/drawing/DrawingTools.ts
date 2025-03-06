
export const drawStroke = (
  ctx: CanvasRenderingContext2D, 
  lastPoint: { x: number; y: number }, 
  currentPoint: { x: number; y: number }, 
  tool: string
) => {
  ctx.beginPath();
  ctx.moveTo(lastPoint.x, lastPoint.y);
  
  // For highlighted, use quadratic curves to smooth the line
  if (tool === 'highlighter') {
    const midPoint = {
      x: (lastPoint.x + currentPoint.x) / 2,
      y: (lastPoint.y + currentPoint.y) / 2
    };
    ctx.quadraticCurveTo(lastPoint.x, lastPoint.y, midPoint.x, midPoint.y);
  } else {
    ctx.lineTo(currentPoint.x, currentPoint.y);
  }
  
  ctx.stroke();
  ctx.closePath();
};

export const drawDot = (
  ctx: CanvasRenderingContext2D, 
  point: { x: number; y: number }, 
  brushSize: number,
  tool: string
) => {
  ctx.beginPath();
  
  const radius = tool === 'pen' ? brushSize / 2 : 
                tool === 'marker' ? brushSize : 
                tool === 'highlighter' ? brushSize * 1.5 : 
                brushSize;
                
  ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.closePath();
};

export const sprayPaint = (
  ctx: CanvasRenderingContext2D, 
  point: { x: number; y: number }, 
  brushSize: number,
  color: string
) => {
  // Save context state to restore later
  ctx.save();
  
  // Set fill color
  ctx.fillStyle = color;
  
  // Get the spray density based on the brush size
  const density = brushSize * 2;
  
  // Spray random dots
  for (let i = 0; i < density; i++) {
    // Calculate random position within circle
    const angle = Math.random() * Math.PI * 2;
    const radius = Math.random() * brushSize * 2;
    const x = point.x + radius * Math.cos(angle);
    const y = point.y + radius * Math.sin(angle);
    
    // Draw a small dot
    ctx.beginPath();
    ctx.arc(x, y, 0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
  }
  
  // Restore context
  ctx.restore();
};

export const floodFill = (
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  point: { x: number; y: number },
  color: string
) => {
  // Get image data
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  // Get clicked pixel color
  const targetX = Math.floor(point.x);
  const targetY = Math.floor(point.y);
  const targetIndex = (targetY * canvas.width + targetX) * 4;
  
  const targetR = data[targetIndex];
  const targetG = data[targetIndex + 1];
  const targetB = data[targetIndex + 2];
  const targetA = data[targetIndex + 3];
  
  // Parse the fill color
  const fillColorEl = document.createElement('div');
  fillColorEl.style.color = color;
  document.body.appendChild(fillColorEl);
  const fillStyle = window.getComputedStyle(fillColorEl).color;
  document.body.removeChild(fillColorEl);
  
  // Extract RGB from computed style (format: 'rgb(r, g, b)' or 'rgba(r, g, b, a)')
  const fillRgb = fillStyle.match(/\d+/g);
  if (!fillRgb) return;
  
  const fillR = parseInt(fillRgb[0]);
  const fillG = parseInt(fillRgb[1]);
  const fillB = parseInt(fillRgb[2]);
  const fillA = fillRgb.length > 3 ? parseInt(fillRgb[3]) * 255 : 255;
  
  // Don't fill if the target color is the same as the fill color
  if (
    targetR === fillR &&
    targetG === fillG &&
    targetB === fillB &&
    targetA === fillA
  ) {
    return;
  }
  
  // Define a tolerance threshold for color comparison
  const tolerance = 10;
  
  // Simple flood fill algorithm
  const pixelsToCheck = [{ x: targetX, y: targetY }];
  const visited = new Set();
  
  while (pixelsToCheck.length > 0) {
    const { x, y } = pixelsToCheck.pop()!;
    
    // Skip if out of bounds
    if (x < 0 || y < 0 || x >= canvas.width || y >= canvas.height) continue;
    
    // Skip if already visited
    const pixelKey = `${x},${y}`;
    if (visited.has(pixelKey)) continue;
    visited.add(pixelKey);
    
    // Get current pixel index
    const index = (y * canvas.width + x) * 4;
    
    // Check if this pixel matches the target color within tolerance
    if (
      Math.abs(data[index] - targetR) <= tolerance &&
      Math.abs(data[index + 1] - targetG) <= tolerance &&
      Math.abs(data[index + 2] - targetB) <= tolerance &&
      Math.abs(data[index + 3] - targetA) <= tolerance
    ) {
      // Fill the pixel
      data[index] = fillR;
      data[index + 1] = fillG;
      data[index + 2] = fillB;
      data[index + 3] = fillA;
      
      // Add neighboring pixels to check
      pixelsToCheck.push({ x: x + 1, y: y });
      pixelsToCheck.push({ x: x - 1, y: y });
      pixelsToCheck.push({ x: x, y: y + 1 });
      pixelsToCheck.push({ x: x, y: y - 1 });
    }
    
    // Safety check - don't process too many pixels at once to prevent browser hanging
    if (visited.size > 100000) break;
  }
  
  // Apply the filled image data back to the canvas
  ctx.putImageData(imageData, 0, 0);
};
