export const playlist = {
  theme: './src/assets/sounds/going-different-ways.mp3',
  theme2: './src/assets/sounds/country_village.mp3',
  mobSteps: './src/assets/sounds/mob-steps.mp3',
};

export type Playlist = { [k in keyof typeof playlist]: HTMLAudioElement };
