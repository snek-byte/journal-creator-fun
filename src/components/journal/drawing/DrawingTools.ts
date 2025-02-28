
import { Point } from "@/types/drawing";

// Standard Pen/Marker drawing function
export const drawStroke = (
  ctx: CanvasRenderingContext2D,
  lastPoint: Point,
  currentPoint: Point,
  tool: string
) => {
  // Begin a new path for this stroke
  ctx.beginPath();
  
  if (tool === 'marker') {
    // Marker uses quadratic curves for smoother effect
    const midPoint = {
      x: (lastPoint.x + currentPoint.x) / 2,
      y: (lastPoint.y + currentPoint.y) / 2
    };
    
    ctx.moveTo(lastPoint.x, lastPoint.y);
    ctx.quadraticCurveTo(lastPoint.x, lastPoint.y, midPoint.x, midPoint.y);
    ctx.stroke();
    
    // Start a new path for the next segment
    ctx.beginPath();
    ctx.moveTo(midPoint.x, midPoint.y);
  } else {
    // Standard drawing for pen and other tools
    ctx.moveTo(lastPoint.x, lastPoint.y);
    ctx.lineTo(currentPoint.x, currentPoint.y);
    ctx.stroke();
  }
  
  // Close the current path
  ctx.closePath();
};

// Draw a dot at the specified point
export const drawDot = (
  ctx: CanvasRenderingContext2D,
  point: Point,
  brushSize: number,
  tool: string
) => {
  ctx.beginPath();
  
  if (tool === 'marker') {
    // Marker makes a slightly larger, more rounded dot
    ctx.arc(point.x, point.y, brushSize, 0, Math.PI * 2);
  } else {
    ctx.arc(point.x, point.y, brushSize / 2, 0, Math.PI * 2);
  }
  
  ctx.fill();
  ctx.closePath();
};

// Spray paint effect
export const sprayPaint = (
  ctx: CanvasRenderingContext2D,
  point: Point,
  brushSize: number,
  color: string
) => {
  const density = brushSize * 5; // How many particles to spray
  const radius = brushSize * 2;  // Spray radius
  
  ctx.fillStyle = color;
  
  // Draw random dots inside the radius
  for (let i = 0; i < density; i++) {
    const offsetX = (Math.random() - 0.5) * radius * 2;
    const offsetY = (Math.random() - 0.5) * radius * 2;
    
    // Only draw inside the circle
    if (offsetX * offsetX + offsetY * offsetY <= radius * radius) {
      ctx.beginPath();
      ctx.arc(point.x + offsetX, point.y + offsetY, 0.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.closePath();
    }
  }
};

// Flood fill algorithm
export const floodFill = (
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  point: Point,
  color: string
) => {
  // Remember original composite operation and restore at the end
  const originalComposite = ctx.globalCompositeOperation;
  
  // Always use source-over for flood fill
  ctx.globalCompositeOperation = 'source-over';
  
  // Get image data from the canvas
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  // Get the color of the clicked pixel
  const targetX = Math.floor(point.x);
  const targetY = Math.floor(point.y);
  const targetIndex = (targetY * canvas.width + targetX) * 4;
  
  // Extract target RGBA
  const targetR = data[targetIndex];
  const targetG = data[targetIndex + 1];
  const targetB = data[targetIndex + 2];
  const targetA = data[targetIndex + 3];
  
  // Parse the fill color
  const fillColorMatch = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
  if (!fillColorMatch) {
    // Restore original composite operation
    ctx.globalCompositeOperation = originalComposite;
    return;
  }
  
  const fillR = parseInt(fillColorMatch[1], 16);
  const fillG = parseInt(fillColorMatch[2], 16);
  const fillB = parseInt(fillColorMatch[3], 16);
  const fillA = 255;
  
  // Check if target color is the same as fill color
  if (
    targetR === fillR &&
    targetG === fillG &&
    targetB === fillB &&
    targetA === fillA
  ) {
    // Restore original composite operation
    ctx.globalCompositeOperation = originalComposite;
    return; // No need to fill with the same color
  }
  
  // Queue for flood fill algorithm (x, y coordinates)
  const queue: [number, number][] = [[targetX, targetY]];
  const visited = new Set<string>(); // Track visited pixels
  
  // Process the queue
  while (queue.length > 0) {
    const [x, y] = queue.shift()!;
    const pixelKey = `${x},${y}`;
    
    // Skip if out of bounds or already visited
    if (
      x < 0 || x >= canvas.width ||
      y < 0 || y >= canvas.height ||
      visited.has(pixelKey)
    ) {
      continue;
    }
    
    // Get current pixel index
    const index = (y * canvas.width + x) * 4;
    
    // Check if the color matches the target color
    if (
      Math.abs(data[index] - targetR) <= 10 &&
      Math.abs(data[index + 1] - targetG) <= 10 &&
      Math.abs(data[index + 2] - targetB) <= 10 &&
      Math.abs(data[index + 3] - targetA) <= 10
    ) {
      // Set the color to the fill color
      data[index] = fillR;
      data[index + 1] = fillG;
      data[index + 2] = fillB;
      data[index + 3] = fillA;
      
      // Mark pixel as visited
      visited.add(pixelKey);
      
      // Add adjacent pixels to the queue
      queue.push([x + 1, y]);
      queue.push([x - 1, y]);
      queue.push([x, y + 1]);
      queue.push([x, y - 1]);
    }
  }
  
  // Update the canvas with the filled area
  ctx.putImageData(imageData, 0, 0);
  
  // Restore original composite operation
  ctx.globalCompositeOperation = originalComposite;
};
