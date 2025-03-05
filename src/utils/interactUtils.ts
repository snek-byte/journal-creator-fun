
/**
 * Initializes draggable functionality for a DOM element using interact.js
 */
export const initializeDraggable = (
  element: HTMLElement,
  containerRef: React.RefObject<HTMLElement>,
  options: {
    onDragStart?: (event: any) => void;
    onDragMove?: (event: any, position: { x: number; y: number }) => void;
    onDragEnd?: (event: any, percentPosition: { x: number; y: number }) => void;
    onResize?: (event: any, size: { width: number; height: number }) => void;
    onResizeEnd?: (event: any, size: { width: number; height: number }) => void;
    enableResize?: boolean;
    restrictToParent?: boolean;
  }
) => {
  if (!window.interact || !element) {
    console.error('interact.js is not loaded or element is null');
    return null;
  }

  console.log('Initializing draggable for element', element.getAttribute('data-id'));

  // Clean up any previous instance
  try {
    window.interact(element).unset();
  } catch (e) {
    console.log("No previous interact instance to clean up");
  }

  const interactable = window.interact(element);

  // Configure draggable
  interactable.draggable({
    inertia: false,
    autoScroll: true,
    modifiers: options.restrictToParent ? [
      window.interact.modifiers.restrict({
        restriction: 'parent',
        endOnly: true
      })
    ] : [],
    listeners: {
      start: (event) => {
        if (options.onDragStart) {
          options.onDragStart(event);
        }
      },
      move: (event) => {
        const target = event.target;
        
        // Parse existing position or default to 0
        const x = parseFloat(target.getAttribute('data-x') || '0');
        const y = parseFloat(target.getAttribute('data-y') || '0');
        
        // Calculate new position
        const newX = x + event.dx;
        const newY = y + event.dy;
        
        // Update element position
        target.style.transform = `translate(${newX}px, ${newY}px) rotate(${target.getAttribute('data-rotation') || 0}deg)`;
        
        // Store position as data attributes
        target.setAttribute('data-x', newX.toString());
        target.setAttribute('data-y', newY.toString());
        
        if (options.onDragMove) {
          options.onDragMove(event, { x: newX, y: newY });
        }
      },
      end: (event) => {
        const target = event.target;
        const x = parseFloat(target.getAttribute('data-x') || '0');
        const y = parseFloat(target.getAttribute('data-y') || '0');
        
        if (containerRef.current && options.onDragEnd) {
          const containerWidth = containerRef.current.offsetWidth;
          const containerHeight = containerRef.current.offsetHeight;
          
          // Convert to percentage
          const xPercent = (x / containerWidth) * 100;
          const yPercent = (y / containerHeight) * 100;
          
          options.onDragEnd(event, { x: xPercent, y: yPercent });
        }
      }
    }
  });

  // Add resizable if enabled
  if (options.enableResize) {
    interactable.resizable({
      edges: { left: true, right: true, bottom: true, top: true },
      inertia: false,
      listeners: {
        move: (event) => {
          const target = event.target;
          let x = parseFloat(target.getAttribute('data-x') || '0');
          let y = parseFloat(target.getAttribute('data-y') || '0');
          
          // Update width and height
          const newWidth = event.rect.width;
          const newHeight = event.rect.height;
          
          target.style.width = `${newWidth}px`;
          target.style.height = `${newHeight}px`;
          
          // Update position if resizing from top or left
          x += event.deltaRect.left;
          y += event.deltaRect.top;
          
          target.style.transform = `translate(${x}px, ${y}px) rotate(${target.getAttribute('data-rotation') || 0}deg)`;
          
          target.setAttribute('data-x', x.toString());
          target.setAttribute('data-y', y.toString());
          
          if (options.onResize) {
            options.onResize(event, { width: newWidth, height: newHeight });
          }
        },
        end: (event) => {
          if (options.onResizeEnd) {
            const target = event.target;
            const width = parseFloat(target.style.width);
            const height = parseFloat(target.style.height);
            
            options.onResizeEnd(event, { width, height });
          }
        }
      }
    });
  }

  return interactable;
};
