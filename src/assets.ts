export const assetsMap = {
  personagem: './src/assets/images/char.png',
  charDown: './src/assets/images/charDown.png',
  charUp: './src/assets/images/charUp.png',
  charLeft: './src/assets/images/charLeft.png',
  charRight: './src/assets/images/charRight.png',
  mainMap: './src/assets/images/map.png',
  mapForeground: './src/assets/images/map_foreground.png',
  mobScreenDamage: './src/assets/images/bugScreenDamage.png',
  mob: './src/assets/images/bugScreen.png',
};

export type Assets = { [k in keyof typeof assetsMap]: HTMLImageElement };
