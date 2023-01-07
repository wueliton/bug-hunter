import { Collide, RectangularCollisionProps } from '../model/collide.model';
import { SpriteModel } from '../model/sprite.model';
import { getDistance } from '../utils/distance';
import { Boundary } from './boundaries.module';

export type CollisionsProps = {
  width: number;
  height: number;
};

export class Collisions implements SpriteModel, Collide {
  width: number;
  height: number;
  boundaries: Boundary[] = [];

  constructor(
    { height, width }: CollisionsProps,
    private collisionsMap: number[]
  ) {
    this.height = height;
    this.width = width;
    this.mapCollisions();
  }

  private rectangularCollision({
    rectangle1,
    rectangle2,
  }: {
    rectangle1: RectangularCollisionProps;
    rectangle2: RectangularCollisionProps;
  }) {
    return (
      rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
      rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
      rectangle1.position.y <= rectangle2.position.y + rectangle2.height - 30 &&
      rectangle1.position.y + rectangle1.height >= rectangle2.position.y
    );
  }

  mapCollisions() {
    const collisions = [];
    for (let i = 0; i < this.collisionsMap.length; i += 70) {
      collisions.push(this.collisionsMap.slice(i, 70 + i));
    }

    collisions.forEach((row, index) => {
      row.forEach((symbol, key) => {
        if (symbol === 183)
          this.boundaries.push(
            new Boundary({
              position: {
                x: key * 48,
                y: index * 48,
              },
            })
          );
      });
    });
  }

  draw(ctx: CanvasRenderingContext2D) {
    this.boundaries.forEach((boundary) => {
      boundary.draw(ctx);
    });
  }

  verifyCollide(
    char: RectangularCollisionProps,
    axis: 'x' | 'y',
    steps: number
  ) {
    return this.boundaries.some((boundary) =>
      this.rectangularCollision({
        rectangle1: {
          ...char,
          height: char.height - 20,
          position: {
            x: char.position.x - char.width,
            y: char.position.y,
          },
        },
        rectangle2: {
          ...boundary,
          [axis]: boundary.position[axis] + steps - 100,
        },
      })
    );
  }
}
