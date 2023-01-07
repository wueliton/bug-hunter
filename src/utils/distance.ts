import { MapPosition } from '../types/Sprites';

export const getDistance = (position1: MapPosition, position2: MapPosition) => {
  const y = position1.x - position2.x;
  const x = position1.y - position2.y;

  return Math.sqrt(x * x + y * y);
};
