export interface PlayerProps<Sprites = { [k in string]: HTMLImageElement }> {
  position: { x: number; y: number };
  velocity: number;
  image: HTMLImageElement;
  frames: { max: number; val?: number; elapsed?: number };
  sprites: Sprites;
}

export type PlayerSprites = {
  [k in
    | 'initial'
    | 'attack'
    | 'damage'
    | 'up'
    | 'down'
    | 'left'
    | 'right']: HTMLImageElement;
};

export type MobSprites = {
  [k in
    | 'initial'
    | 'stirred'
    | 'attack'
    | 'damage'
    | 'killed']: HTMLImageElement;
};
