export type MapPosition = { x: number; y: number };

export interface PlayerProps<
  Sprites = { [k in string]: HTMLImageElement },
  Sounds = { [k in string]: HTMLAudioElement }
> {
  position: MapPosition;
  velocity: number;
  image: HTMLImageElement;
  frames: { max: number; val?: number; elapsed?: number };
  sprites: Sprites;
  sounds?: Sounds;
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

export type PlayerSounds = {
  [k in 'steps']?: HTMLAudioElement;
};

export type MobSounds = {
  [k in 'steps']?: HTMLAudioElement;
};
