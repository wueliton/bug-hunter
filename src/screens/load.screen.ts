import { SpriteModel } from '../model/sprite.model';
import { GameAssets } from '../modules/game-assets.module';

export class LoadScreen implements SpriteModel {
  width = 0;
  height = 0;
  loadBarImages?: { empty: HTMLImageElement; full: HTMLImageElement };
  position = { x: 0, y: 0 };
  completed = false;

  private loadAssets(onLoad: () => void) {
    const assets = new GameAssets<typeof this.loadBarImages>(() => {
      this.loadBarImages = assets.images as typeof this.loadBarImages;

      onLoad();
    });
    assets.loadAssets({
      empty: './src/assets/images/loadbar-empty.png',
      full: './src/assets/images/loadbar-full.png',
    });
  }

  constructor(
    onLoad: () => void,
    private onEnd: () => void,
    private gameAssets: GameAssets
  ) {
    this.loadAssets(onLoad);
  }

  draw(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
    if (this.completed) return;
    if (!this.loadBarImages?.empty || !this.loadBarImages?.full) return;
    this.position = { x: canvas.width / 2, y: canvas.height / 2 };
    const { empty, full } = this.loadBarImages;
    const { x, y } = this.position;

    ctx.fillStyle = '#222';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(empty, x - empty.width / 2, y - empty.height / 2);

    ctx.drawImage(
      full,
      0,
      0,
      (empty.width / 100) * this.gameAssets.progress,
      empty.height,
      x - empty.width / 2,
      y - empty.height / 2,
      (empty.width / 100) * this.gameAssets.progress,
      empty.height
    );

    if (this.gameAssets.progress === 100) {
      this.completed = true;
      setTimeout(this.onEnd, 500);
    }
  }
}
