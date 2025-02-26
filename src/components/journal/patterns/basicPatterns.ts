
import { PatternParams } from './types';

export const generateWaves = ({ color1, color2, strokeWidth, scale, angle }: PatternParams): string => {
  const size = 100 * scale;
  const path = `
    M 0 ${size / 2} 
    C ${size / 4} ${size / 2 - 20} ${size * 3 / 4} ${size / 2 + 20} ${size} ${size / 2}
    M -${size} ${size / 2} 
    C -${size * 3 / 4} ${size / 2 - 20} -${size / 4} ${size / 2 + 20} 0 ${size / 2}
    M ${size} ${size / 2} 
    C ${size * 5 / 4} ${size / 2 - 20} ${size * 7 / 4} ${size / 2 + 20} ${size * 2} ${size / 2}
  `;

  const svg = `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="waves" width="${size}" height="${size}" patternUnits="userSpaceOnUse" patternTransform="rotate(${angle})">
          <rect width="100%" height="100%" fill="${color1}"/>
          <path d="${path}" stroke="${color2}" fill="none" stroke-width="${strokeWidth}" stroke-linecap="round"/>
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
    M 0 ${size / 2} 
    L ${size / 4} ${size / 4} 
    L ${size / 2} ${size / 2} 
    L ${size * 3 / 4} ${size / 4} 
    L ${size} ${size / 2}
    M -${size} ${size / 2} 
    L -${size * 3 / 4} ${size / 4} 
    L -${size / 2} ${size / 2} 
    L -${size / 4} ${size / 4} 
    L 0 ${size / 2}
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
  const svg = `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="dots" width="${size/2}" height="${size/2}" patternUnits="userSpaceOnUse" patternTransform="rotate(${angle})">
          <rect width="100%" height="100%" fill="${color1}"/>
          <circle cx="${size/4}" cy="${size/4}" r="${radius}" fill="${color2}"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#dots)"/>
    </svg>
  `;

  return `url("data:image/svg+xml;base64,${btoa(svg)}")`;
};
