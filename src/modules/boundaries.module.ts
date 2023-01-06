import { SpriteModel } from '../model/sprite.model';

export type BoundaryProps = {
  position: { x: number; y: number };
  width?: number;
  height?: number;
};

export class Boundary implements SpriteModel {
  width = 48;
  height = 48;
  position: BoundaryProps['position'];

  constructor({ position, width, height }: BoundaryProps) {
    this.width = width ?? 48;
    this.height = height ?? 48;
    this.position = position;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = 'rgba(255,0,0,0)';
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}
