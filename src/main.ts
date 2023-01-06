import { assetsMap } from './assets';
import { Canvas } from './modules/canvas.module';
import { Player } from './modules/player.module';
import { Controls } from './modules/controls.module';
import { GameAssets } from './modules/game-assets.module';
import { MapSprite } from './modules/map.module';
import { LoadScreen } from './screens/load.screen';
import { Mob } from './modules/mob.module';
import { Collisions } from './modules/collisions.module';
import { collisionsMap } from './collisions-map';

document.addEventListener('DOMContentLoaded', async () => {
  const gameAssets = new GameAssets();
  const canvas = new Canvas();
  const loadScreen = new LoadScreen(
    () => {
      setTimeout(async () => {
        gameAssets.loadAssets(assetsMap);
      }, 1000);
    },
    () => {
      canvas.clearSprites();
      const {
        charLeft,
        charRight,
        charUp,
        charDown,
        char,
        mainMap,
        skull,
        mapForeground,
        mobScreenDamage,
      } = gameAssets.images;
      const collisions = new Collisions(
        { height: mainMap.height, width: mainMap.width },
        collisionsMap
      );
      const character = new Player({
        position: {
          x: mainMap.width / 2,
          y: mainMap.height / 2 - 50,
        },
        velocity: 0,
        image: char,
        frames: { max: 4 },
        sprites: { charLeft, charRight, charUp, charDown, char },
      });

      const winBug = new Mob(
        {
          position: {
            x: mainMap.width / 2,
            y: mainMap.height / 2 - 100,
          },
          velocity: 0,
          image: skull,
          frames: { max: 6 },
          sprites: { skull, mobScreenDamage },
        },
        collisions,
        character
      );
      const map = new MapSprite({
        position: { x: canvas.width / 2, y: canvas.height / 2 },
        image: mainMap,
      });
      const foreground = new MapSprite({
        position: { x: canvas.width / 2, y: canvas.height / 2 },
        image: mapForeground,
      });
      new Controls(character, canvas, collisions);

      canvas.addMap(map);
      canvas.addSprite(character);
      canvas.addSprite(winBug);
      canvas.addSprite(collisions);
      canvas.addSprite(foreground);
      canvas.centerCamera(map);
    },
    gameAssets
  );
  canvas.addSprite(loadScreen);

  const loop = () => {
    window.requestAnimationFrame(loop);
    canvas.render();
  };

  loop();
});
