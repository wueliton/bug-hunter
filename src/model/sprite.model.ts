export interface SpriteModel {
  width: number;
  height: number;
  draw: (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => void;
}
