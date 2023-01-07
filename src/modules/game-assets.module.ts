export class GameAssets<GameAssetsList = unknown> {
  #progress: number = 0;
  #itensLoaded = 0;
  #images: { [k in string]: HTMLImageElement } = {};
  set progress(percent) {
    this.#progress = percent;
  }
  get progress() {
    return this.#progress;
  }
  get images() {
    return this.#images as GameAssetsList;
  }

  constructor(private onLoad?: () => void) {}

  private updateProgress(imageListLength: number) {
    this.progress = (100 / imageListLength) * this.#itensLoaded;
    if (this.progress === 100) this.onLoad?.();
  }

  async loadAssets(imageList: { [k in string]: string }) {
    const objectEntries = Object.entries(imageList);
    objectEntries.forEach(([key, src]) => {
      const image = new Image();
      image.addEventListener('load', () => {
        this.#itensLoaded++;
        this.#images[key] = image;
        this.updateProgress(objectEntries.length);
      });
      image.src = src;
    });
  }
}
