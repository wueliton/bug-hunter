export const playlist = {
  theme: './src/assets/sounds/going-different-ways.mp3',
  theme2: './src/assets/sounds/country_village.mp3',
  mobSteps: './src/assets/sounds/mob-steps.mp3',
  stirred: './src/assets/sounds/machine-error-by-prettysleepy-art.mp3',
  error: './src/assets/sounds/windows-error.wav',
};

export type Playlist = { [k in keyof typeof playlist]: HTMLAudioElement };
