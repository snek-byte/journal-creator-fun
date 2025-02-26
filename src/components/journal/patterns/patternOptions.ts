
import { PatternOption } from './types';
import { generateWaves, generateZigZag, generateDots } from './basicPatterns';
import { generateCheckerboard, generateHexagons, generateTriangles } from './geometricPatterns';
import { generateCrossHatch, generateLines, generateCircles } from './linePatterns';

export const patterns: PatternOption[] = [
  { id: 'waves', label: 'Waves', generator: generateWaves },
  { id: 'zigzag', label: 'Zigzag', generator: generateZigZag },
  { id: 'dots', label: 'Dots', generator: generateDots },
  { id: 'checkerboard', label: 'Checkerboard', generator: generateCheckerboard },
  { id: 'hexagons', label: 'Hexagons', generator: generateHexagons },
  { id: 'crosshatch', label: 'Cross Hatch', generator: generateCrossHatch },
  { id: 'triangles', label: 'Triangles', generator: generateTriangles },
  { id: 'circles', label: 'Circles', generator: generateCircles },
  { id: 'lines', label: 'Lines', generator: generateLines },
];
