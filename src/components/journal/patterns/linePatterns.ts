
import { PatternParams } from './types';

export const generateCrossHatch = ({ color1, color2, strokeWidth, scale, angle }: PatternParams): string => {
  const size = 100 * scale;
  const spacing = size / 8;
  
  const svg = `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="crosshatch" width="${spacing}" height="${spacing}" patternUnits="userSpaceOnUse" patternTransform="rotate(${angle})">
          <rect width="100%" height="100%" fill="${color1}"/>
          <path d="M 0 0 L ${spacing} ${spacing}" stroke="${color2}" stroke-width="${strokeWidth}" />
          <path d="M ${spacing} 0 L 0 ${spacing}" stroke="${color2}" stroke-width="${strokeWidth}" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#crosshatch)"/>
    </svg>
  `;
  return `url("data:image/svg+xml;base64,${btoa(svg)}")`;
};

export const generateLines = ({ color1, color2, strokeWidth, scale, angle }: PatternParams): string => {
  const size = 100 * scale;
  const spacing = size / 8;
  
  const svg = `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="lines" width="${spacing}" height="${spacing}" patternUnits="userSpaceOnUse" patternTransform="rotate(${angle})">
          <rect width="100%" height="100%" fill="${color1}"/>
          <line x1="${spacing/2}" y1="0" x2="${spacing/2}" y2="${spacing}" stroke="${color2}" stroke-width="${strokeWidth}"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#lines)"/>
    </svg>
  `;
  return `url("data:image/svg+xml;base64,${btoa(svg)}")`;
};

export const generateCircles = ({ color1, color2, strokeWidth, scale, angle }: PatternParams): string => {
  const size = 100 * scale;
  const spacing = size / 6;
  const radius = spacing / 3;
  
  const svg = `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="circles" width="${spacing}" height="${spacing}" patternUnits="userSpaceOnUse" patternTransform="rotate(${angle})">
          <rect width="100%" height="100%" fill="${color1}"/>
          <circle cx="${spacing/2}" cy="${spacing/2}" r="${radius}" fill="${color2}" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#circles)"/>
    </svg>
  `;
  return `url("data:image/svg+xml;base64,${btoa(svg)}")`;
};
