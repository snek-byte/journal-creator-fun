
import { PatternParams } from './types';

export const generateCheckerboard = ({ color1, color2, scale, angle }: PatternParams): string => {
  const size = 100 * scale;
  const svg = `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="checkerboard" width="${size/2}" height="${size/2}" patternUnits="userSpaceOnUse" patternTransform="rotate(${angle})">
          <rect width="${size/4}" height="${size/4}" fill="${color1}"/>
          <rect x="${size/4}" width="${size/4}" height="${size/4}" fill="${color2}"/>
          <rect y="${size/4}" width="${size/4}" height="${size/4}" fill="${color2}"/>
          <rect x="${size/4}" y="${size/4}" width="${size/4}" height="${size/4}" fill="${color1}"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#checkerboard)"/>
    </svg>
  `;
  return `url("data:image/svg+xml;base64,${btoa(svg)}")`;
};

export const generateHexagons = ({ color1, color2, strokeWidth, scale, angle }: PatternParams): string => {
  const size = 100 * scale;
  const hexSize = size / 4;
  const path = `
    M ${hexSize} 0 
    l ${hexSize} ${hexSize * 0.866} 
    l 0 ${hexSize * 1.732} 
    l -${hexSize} ${hexSize * 0.866} 
    l -${hexSize} -${hexSize * 0.866} 
    l 0 -${hexSize * 1.732} 
    Z
  `;
  
  const svg = `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="hexagons" width="${size/2}" height="${size/2}" patternUnits="userSpaceOnUse" patternTransform="rotate(${angle})">
          <rect width="100%" height="100%" fill="${color1}"/>
          <path d="${path}" fill="${color2}" stroke="${color2}" stroke-width="${strokeWidth}"/>
          <path d="${path}" transform="translate(${size/2}, ${size/2})" fill="${color2}" stroke="${color2}" stroke-width="${strokeWidth}"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#hexagons)"/>
    </svg>
  `;
  return `url("data:image/svg+xml;base64,${btoa(svg)}")`;
};

export const generateTriangles = ({ color1, color2, strokeWidth, scale, angle }: PatternParams): string => {
  const size = 100 * scale;
  const triangleSize = size / 4;
  const path = `
    M 0 0 
    L ${triangleSize} ${triangleSize * 1.732} 
    L ${triangleSize * 2} 0 
    Z
  `;
  
  const svg = `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="triangles" width="${size/2}" height="${size/2}" patternUnits="userSpaceOnUse" patternTransform="rotate(${angle})">
          <rect width="100%" height="100%" fill="${color1}"/>
          <path d="${path}" fill="${color2}" stroke="${color2}" stroke-width="${strokeWidth}"/>
          <path d="${path}" transform="translate(${size/2}, ${size/2})" fill="${color2}" stroke="${color2}" stroke-width="${strokeWidth}"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#triangles)"/>
    </svg>
  `;
  return `url("data:image/svg+xml;base64,${btoa(svg)}")`;
};
