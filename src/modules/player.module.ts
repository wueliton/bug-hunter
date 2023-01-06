import { SpriteModel } from '../model/sprite.model';

export interface PlayerProps {
  position: { x: number; y: number };
  velocity: number;
  image: HTMLImageElement;
  frames: { max: number; val?: number; elapsed?: number };
  sprites: { [k in string]: HTMLImageElement };
}

export class Player implements SpriteModel {
  position: { x: number; y: number };
  velocity: number;
  image: HTMLImageElement;
  frames: PlayerProps['frames'];
  moving = false;
  sprites: { [k in string]: HTMLImageElement };
  height: number;
  width: number;

  constructor({
    position,
    velocity,
    image,
    frames = { max: 1 },
    sprites,
  }: PlayerProps) {
    this.position = position;
    this.velocity = velocity;
    this.image = image;
    this.frames = { ...frames, val: 0, elapsed: 0 };
    this.sprites = sprites;
    this.height = image.height;
    this.width = image.width / this.frames.max;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.drawImage(
      this.image,
      (this.frames.val || 0) * this.width,
      0,
      this.image.width / this.frames.max,
      this.image.height,
      this.position.x - this.image.width / this.frames.max,
      this.position.y - this.image.height / this.frames.max,
      this.image.width / this.frames.max,
      this.image.height
    );

    if (this.frames.max > 1 && this.frames.elapsed !== undefined)
      this.frames.elapsed++;

    if ((this.frames.elapsed ?? 0) % 10 === 0) {
      if (
        this.frames.val !== undefined &&
        this.frames.val < this.frames.max - 1
      )
        this.frames.val++;
      else this.frames.val = 0;
    }
  }
}
