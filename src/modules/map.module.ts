import { SpriteModel } from '../model/sprite.model';

export interface MapProps {
  position: { x: number; y: number };
  image: HTMLImageElement;
}

export class MapSprite implements SpriteModel {
  position: { x: number; y: number };
  image: HTMLImageElement;
  height: number;
  width: number;

  constructor({ position, image }: MapProps) {
    this.image = image;
    this.position = position;
    this.height = image.height;
    this.width = image.width;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.drawImage(this.image, 0, 0, this.width, this.height);
  }
}
