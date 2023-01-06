export type RectangularCollisionProps = {
  width: number;
  height: number;
  position: { x: number; y: number };
};

export interface Collide {
  verifyCollide(
    char: RectangularCollisionProps,
    axis: 'x' | 'y',
    steps: number
  ): boolean;
}
