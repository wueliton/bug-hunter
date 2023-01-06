import { SpriteModel } from '../model/sprite.model';

export type CameraPosition = {
  x: number;
  y: number;
};

export class Canvas {
  #sprites: SpriteModel[] = [];
  canvas: HTMLCanvasElement;
  position: CameraPosition = { x: 0, y: 0 };
  ctx: CanvasRenderingContext2D;
  limit = { left: 0.2, right: 0.9, up: 0.1, down: 0.9 };
  map?: SpriteModel;
  get height() {
    return this.canvas.height;
  }
  get width() {
    return this.canvas.width;
  }

  constructor() {
    const canvas = document.createElement('canvas');
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d')!;
    this.resizeListener();
    this.initialize();
  }

  private initialize() {
    const { width, height } = document.body.getBoundingClientRect();
    this.canvas.width = width;
    this.canvas.height = height;
    document.body.appendChild(this.canvas);
  }

  addMap(worldMap: SpriteModel) {
    this.addSprite(worldMap);
    this.map = worldMap;
  }

  clearSprites() {
    this.#sprites = [];
  }

  addSprite(sprite: SpriteModel) {
    this.#sprites = [...this.#sprites, sprite];
  }

  removeSprite(deleteSprite: SpriteModel) {
    this.#sprites.filter(
      (sprite) => JSON.stringify(sprite) === JSON.stringify(deleteSprite)
    );
  }

  resizeListener() {
    window.addEventListener('resize', () => {
      this.initialize();
    });
  }

  getEdge = (edge: 'left' | 'right' | 'up' | 'down' | null) => {
    if (!edge) return 0;
    const axis = edge == 'left' || edge === 'right' ? 'x' : 'y';
    const sizeRef = edge == 'left' || edge === 'right' ? 'width' : 'height';
    return this.position[axis] + this.canvas[sizeRef] * this.limit[edge];
  };

  centerCamera(sprite: SpriteModel) {
    this.position = {
      x: (sprite.width - this.canvas.width) / 2,
      y: (sprite.height - this.canvas.height) / 2,
    };
  }

  render() {
    if (!this.ctx) return;

    const { x, y } = this.position;

    this.ctx.save();
    this.ctx.translate(-x, -y);
    this.ctx.fillStyle = '#222';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.#sprites.forEach((sprite) => sprite.draw(this.ctx, this.canvas));
    this.ctx.restore();
  }
}
