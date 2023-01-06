export type ImageList<T = string> = {
  [k in string]: T;
};

export class GameAssets {
  #progress: number = 0;
  #itensLoaded = 0;
  images: ImageList<HTMLImageElement> = {};
  set progress(percent) {
    this.#progress = percent;
  }
  get progress() {
    return this.#progress;
  }

  private updateProgress(imageListLength: number) {
    this.progress = (100 / imageListLength) * this.#itensLoaded;
  }

  async loadAssets(imageList: ImageList, onLoad?: () => void) {
    Object.entries(imageList).forEach(([key, src]) => {
      new Promise<HTMLImageElement>((resolve, reject) => {
        const image = new Image();
        image.addEventListener('load', () => resolve(image));
        image.addEventListener('error', (err) => reject(err));
        image.src = src;
      }).then((image) => {
        this.#itensLoaded++;
        this.images[key] = image;
        this.updateProgress(Object.keys(imageList).length);

        if (this.progress === 100) onLoad?.();
        return image;
      });
    });
  }
}
