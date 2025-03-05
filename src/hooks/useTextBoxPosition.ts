
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

  // These functions are kept for backwards compatibility
  // but we've simplified the drag handling in the component
  const handleDragStart = (callback: () => void) => {
    setIsDragging(true);
    callback();
  };

  const handleDragStop = (
    d: { x: number; y: number },
    onUpdate: (updates: { position: { x: number; y: number } }) => void
  ) => {
    setLocalPosition({ x: d.x, y: d.y });
    
    const containerWidth = containerDimensions.width || 1;
    const containerHeight = containerDimensions.height || 1;
    
    const xPercent = Math.max(0, Math.min(100, (d.x / containerWidth) * 100));
    const yPercent = Math.max(0, Math.min(100, (d.y / containerHeight) * 100));
    
    onUpdate({ position: { x: xPercent, y: yPercent } });
    
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
