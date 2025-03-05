
import { useState, useEffect } from 'react';

interface Position {
  x: number;
  y: number;
}

export function useTextBoxPosition(
  position: { x: number; y: number },
  containerRef: React.RefObject<HTMLDivElement>,
) {
  const [localPosition, setLocalPosition] = useState<Position>({ x: 0, y: 0 });
  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });
  const [isDragging, setIsDragging] = useState(false);

  // Track container dimensions
  useEffect(() => {
    if (!containerRef.current) return;
    
    const updateDimensions = () => {
      if (containerRef.current) {
        const newDimensions = {
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight
        };
        setContainerDimensions(newDimensions);
      }
    };
    
    updateDimensions();
    
    const resizeObserver = new ResizeObserver(updateDimensions);
    resizeObserver.observe(containerRef.current);
    
    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
    };
  }, [containerRef]);
  
  // Convert percentage position to pixels
  useEffect(() => {
    if (containerDimensions.width && containerDimensions.height && position) {
      const pixelX = (position.x / 100) * containerDimensions.width;
      const pixelY = (position.y / 100) * containerDimensions.height;
      setLocalPosition({ x: pixelX, y: pixelY });
    }
  }, [position, containerDimensions]);

  // Handle drag start
  const handleDragStart = (callback: () => void) => {
    setIsDragging(true);
    callback();
  };

  // Handle drag stop and convert position to percentages
  const handleDragStop = (
    d: { x: number; y: number },
    onUpdate: (updates: { position: { x: number; y: number } }) => void
  ) => {
    // First update the local position for immediate UI feedback
    setLocalPosition({ x: d.x, y: d.y });
    
    // Get the container dimensions
    const containerWidth = containerDimensions.width || 1;
    const containerHeight = containerDimensions.height || 1;
    
    // Calculate percentage position based on container dimensions
    const xPercent = Math.max(0, Math.min(100, (d.x / containerWidth) * 100));
    const yPercent = Math.max(0, Math.min(100, (d.y / containerHeight) * 100));
    
    // Update the text box position through parent component
    onUpdate({ position: { x: xPercent, y: yPercent } });
    
    // End dragging state after a short delay
    setTimeout(() => {
      setIsDragging(false);
    }, 50);
  };

  return {
    localPosition,
    containerDimensions,
    isDragging,
    handleDragStart,
    handleDragStop
  };
}
