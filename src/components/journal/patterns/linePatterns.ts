
import { PatternParams } from './types';

export const generateCrossHatch = ({ color1, color2, strokeWidth, scale, angle }: PatternParams): string => {
  const size = 100 * scale;
  const spacing = size / 8;
  const svg = `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="crosshatch" width="${size/2}" height="${size/2}" patternUnits="userSpaceOnUse" patternTransform="rotate(${angle})">
          <rect width="100%" height="100%" fill="${color1}"/>
          <path d="M 0 0 l ${size} ${size}" stroke="${color2}" stroke-width="${strokeWidth}" />
          <path d="M 0 ${spacing} l ${size} ${size}" stroke="${color2}" stroke-width="${strokeWidth}" />
          <path d="M ${size} 0 l -${size} ${size}" stroke="${color2}" stroke-width="${strokeWidth}" />
          <path d="M ${size} ${spacing} l -${size} ${size}" stroke="${color2}" stroke-width="${strokeWidth}" />
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
        <pattern id="lines" width="${spacing * 2}" height="${spacing * 2}" patternUnits="userSpaceOnUse" patternTransform="rotate(${angle})">
          <rect width="100%" height="100%" fill="${color1}"/>
          <line x1="0" y1="0" x2="0" y2="${size}" stroke="${color2}" stroke-width="${strokeWidth}"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#lines)"/>
    </svg>
  `;
  return `url("data:image/svg+xml;base64,${btoa(svg)}")`;
};

export const generateCircles = ({ color1, color2, strokeWidth, scale, angle }: PatternParams): string => {
  const size = 100 * scale;
  const radius = size / 8;
  const svg = `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="circles" width="${size/2}" height="${size/2}" patternUnits="userSpaceOnUse" patternTransform="rotate(${angle})">
          <rect width="100%" height="100%" fill="${color1}"/>
          <circle cx="${size/4}" cy="${size/4}" r="${radius}" fill="${color2}" stroke="${color2}" stroke-width="${strokeWidth}"/>
          <circle cx="${size/2}" cy="${size/2}" r="${radius}" fill="${color2}" stroke="${color2}" stroke-width="${strokeWidth}"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#circles)"/>
    </svg>
  `;
  return `url("data:image/svg+xml;base64,${btoa(svg)}")`;
};
