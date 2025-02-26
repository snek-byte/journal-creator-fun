
import { PatternParams } from './types';

export const generateCheckerboard = ({ color1, color2, scale, angle }: PatternParams): string => {
  const size = 100 * scale;
  const tileSize = size / 8;
  
  const svg = `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="checkerboard" width="${tileSize * 2}" height="${tileSize * 2}" patternUnits="userSpaceOnUse" patternTransform="rotate(${angle})">
          <rect width="${tileSize}" height="${tileSize}" fill="${color1}"/>
          <rect x="${tileSize}" width="${tileSize}" height="${tileSize}" fill="${color2}"/>
          <rect y="${tileSize}" width="${tileSize}" height="${tileSize}" fill="${color2}"/>
          <rect x="${tileSize}" y="${tileSize}" width="${tileSize}" height="${tileSize}" fill="${color1}"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#checkerboard)"/>
    </svg>
  `;
  return `url("data:image/svg+xml;base64,${btoa(svg)}")`;
};

export const generateHexagons = ({ color1, color2, strokeWidth, scale, angle }: PatternParams): string => {
  const size = 100 * scale;
  const hexRadius = size / 8;
  const hexHeight = hexRadius * Math.sqrt(3);
  const hexWidth = hexRadius * 2;
  
  const path = `
    M ${hexWidth/2} 0
    l ${hexWidth/2} ${hexHeight/2}
    l 0 ${hexHeight}
    l -${hexWidth/2} ${hexHeight/2}
    l -${hexWidth/2} -${hexHeight/2}
    l 0 -${hexHeight}
    Z
  `;
  
  const svg = `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="hexagons" width="${hexWidth*1.5}" height="${hexHeight*2}" patternUnits="userSpaceOnUse" patternTransform="rotate(${angle})">
          <rect width="100%" height="100%" fill="${color1}"/>
          <path d="${path}" fill="${color2}" stroke="none"/>
          <path d="${path}" transform="translate(${hexWidth*1.5}, ${hexHeight})" fill="${color2}" stroke="none"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#hexagons)"/>
    </svg>
  `;
  return `url("data:image/svg+xml;base64,${btoa(svg)}")`;
};

export const generateTriangles = ({ color1, color2, strokeWidth, scale, angle }: PatternParams): string => {
  const size = 100 * scale;
  const triangleSize = size / 8;
  const height = triangleSize * Math.sqrt(3);
  
  const path = `
    M 0 0
    L ${triangleSize} ${height}
    L ${triangleSize*2} 0
    Z
    M ${triangleSize*2} 0
    L ${triangleSize*3} ${height}
    L ${triangleSize*4} 0
    Z
    M ${triangleSize} ${height}
    L ${triangleSize*2} ${height*2}
    L ${triangleSize*3} ${height}
    Z
  `;
  
  const svg = `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="triangles" width="${triangleSize*4}" height="${height*2}" patternUnits="userSpaceOnUse" patternTransform="rotate(${angle})">
          <rect width="100%" height="100%" fill="${color1}"/>
          <path d="${path}" fill="${color2}" stroke="none"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#triangles)"/>
    </svg>
  `;
  return `url("data:image/svg+xml;base64,${btoa(svg)}")`;
};
