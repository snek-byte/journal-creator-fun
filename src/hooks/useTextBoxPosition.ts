
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

  return { localPosition, containerDimensions };
}
