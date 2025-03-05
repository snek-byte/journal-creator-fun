
export interface Meme {
  id: string;
  template: string;
  topText: string;
  bottomText: string;
  fontSize: number;
  fontColor: string;
  fontFamily: string;
  strokeColor: string;
  strokeWidth: number;
}

export interface MemeTemplate {
  id: string;
  name: string;
  url: string;
  width: number;
  height: number;
}
