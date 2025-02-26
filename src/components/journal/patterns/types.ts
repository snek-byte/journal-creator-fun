
export interface PatternParams {
  color1: string;
  color2: string;
  strokeWidth: number;
  scale: number;
  angle: number;
}

export interface PatternOption {
  id: string;
  label: string;
  generator: (params: PatternParams) => string;
}
