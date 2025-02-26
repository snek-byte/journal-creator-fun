
import { PatternParams } from './types';

export const generateWaves = ({ color1, color2, strokeWidth, scale, angle }: PatternParams): string => {
  const size = 100 * scale;
  const path = `
    M 0 ${size / 2} 
    C ${size / 4} ${size / 4} ${size * 3 / 4} ${size * 3 / 4} ${size} ${size / 2}
  `;

  const svg = `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="waves" width="${size}" height="${size}" patternUnits="userSpaceOnUse" patternTransform="rotate(${angle})">
          <rect width="100%" height="100%" fill="${color1}"/>
          <path d="${path}" stroke="${color2}" fill="none" stroke-width="${strokeWidth}" stroke-linecap="round"/>
          <path d="${path}" transform="translate(0, ${size/2})" stroke="${color2}" fill="none" stroke-width="${strokeWidth}" stroke-linecap="round"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#waves)"/>
    </svg>
  `;

  return `url("data:image/svg+xml;base64,${btoa(svg)}")`;
};

export const generateZigZag = ({ color1, color2, strokeWidth, scale, angle }: PatternParams): string => {
  const size = 100 * scale;
  const path = `
    M 0 0 
    L ${size/4} ${size/2} 
    L ${size/2} 0
    M ${size/2} 0
    L ${size*3/4} ${size/2}
    L ${size} 0
    M 0 ${size}
    L ${size/4} ${size/2}
    L ${size/2} ${size}
    M ${size/2} ${size}
    L ${size*3/4} ${size/2}
    L ${size} ${size}
  `;

  const svg = `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="zigzag" width="${size}" height="${size}" patternUnits="userSpaceOnUse" patternTransform="rotate(${angle})">
          <rect width="100%" height="100%" fill="${color1}"/>
          <path d="${path}" stroke="${color2}" fill="none" stroke-width="${strokeWidth}" stroke-linecap="round"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#zigzag)"/>
    </svg>
  `;

  return `url("data:image/svg+xml;base64,${btoa(svg)}")`;
};

export const generateDots = ({ color1, color2, strokeWidth, scale, angle }: PatternParams): string => {
  const size = 100 * scale;
  const radius = strokeWidth * 2;
  const spacing = size / 4;
  
  const svg = `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="dots" width="${spacing}" height="${spacing}" patternUnits="userSpaceOnUse" patternTransform="rotate(${angle})">
          <rect width="100%" height="100%" fill="${color1}"/>
          <circle cx="${spacing/2}" cy="${spacing/2}" r="${radius}" fill="${color2}"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#dots)"/>
    </svg>
  `;

  return `url("data:image/svg+xml;base64,${btoa(svg)}")`;
};
