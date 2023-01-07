import { Assets, assetsMap } from './assets';
import { Canvas } from './modules/canvas.module';
import { Player } from './modules/player.module';
import { Controls } from './modules/controls.module';
import { GameAssets } from './modules/game-assets.module';
import { MapSprite } from './modules/map.module';
import { LoadScreen } from './screens/load.screen';
import { Mob } from './modules/mob.module';
import { Collisions } from './modules/collisions.module';
import { collisionsMap } from './collisions-map';
import { GameSounds } from './modules/game-sounds.module';
import { playlist, Playlist } from './playlist';

document.addEventListener('DOMContentLoaded', async () => {
  const gameAssets = new GameAssets<Assets>();
  const gameSounds = new GameSounds<Playlist>(playlist);
  const canvas = new Canvas();
  const loadScreen = new LoadScreen(
    () => {
      setTimeout(async () => {
        gameAssets.loadAssets(assetsMap);
      }, 1000);
    },
    () => {
      gameSounds.playlist.theme2.volume = 0.05;
      gameSounds.playlist.theme2.loop = true;
      gameSounds.playlist.theme2.play();
      canvas.clearSprites();
      const {
        charLeft,
        charRight,
        charUp,
        charDown,
        personagem,
        mainMap,
        mob,
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
        image: personagem,
        frames: { max: 4 },
        sprites: {
          initial: personagem,
          left: charLeft,
          right: charRight,
          up: charUp,
          down: charDown,
          attack: personagem,
          damage: personagem,
        },
        sounds: {},
      });

      const bugMob = new Mob(
        {
          position: {
            x: mainMap.width / 2,
            y: mainMap.height / 2 - 100,
          },
          velocity: 0,
          image: mob,
          frames: { max: 6 },
          sprites: {
            initial: mob,
            stirred: mobScreenDamage,
            attack: mob,
            damage: mob,
            killed: mob,
          },
          sounds: {
            steps: gameSounds.playlist.mobSteps,
            stirred: gameSounds.playlist.stirred,
            killed: gameSounds.playlist.error,
          },
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
      canvas.addSprite(bugMob);
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
