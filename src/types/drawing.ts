
export interface Point {
  x: number;
  y: number;
}

export interface DrawingLayerProps {
  className?: string;
  width?: number;
  height?: number;
  onDrawingChange?: (dataUrl: string) => void;
  tool?: string;
  color?: string;
  brushSize?: number;
  initialDrawing?: string;
  onClear?: () => void;
  // New properties
  drawing?: string;
  drawingTool?: string;
  drawingColor?: string;
  isDrawingMode?: boolean;
}
