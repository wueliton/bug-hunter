import { SpriteModel } from '../model/sprite.model';
import { MobSounds, MobSprites, PlayerProps } from '../types/Sprites';
import { getDistance } from '../utils/distance';
import { Collisions } from './collisions.module';
import { Player } from './player.module';

export class Mob extends Player<MobSprites, MobSounds> implements SpriteModel {
  #movement: 'left' | 'right' | 'up' | 'down' = 'left';
  #movementCount = 0;
  maxMovement = 3;
  attackRange = 48 * 3;
  damage = 10;
  stirred = 0;

  constructor(
    props: PlayerProps<MobSprites, MobSounds>,
    private collisions: Collisions,
    private char: Player
  ) {
    super(props);
  }

  verifyAttack(distance: number) {
    if (distance <= this.attackRange) {
      this.image = this.sprites.stirred;

      if (this.stirred === 10) {
        console.log('atacado');
        this.stirred = 0;
      }

      this.stirred++;
    } else {
      this.image = this.sprites.initial;
      this.stirred = 0;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.drawImage(
      this.image,
      (this.frames.val || 0) * this.width,
      0,
      this.image.width / this.frames.max,
      this.image.height,
      this.position.x - this.image.width / this.frames.max,
      this.position.y - this.image.height / this.frames.max,
      this.image.width / this.frames.max,
      this.image.height
    );

    if (this.frames.max > 1 && this.frames.elapsed !== undefined)
      this.frames.elapsed++;

    if ((this.frames.elapsed ?? 0) % 10 === 0) {
      if (
        this.frames.val !== undefined &&
        this.frames.val < this.frames.max - 1
      )
        this.frames.val++;
      else this.frames.val = 0;

      const distance = getDistance(this.position, this.char.position);

      if (this.sounds?.steps) {
        if (this.frames.val === 4) {
          const soundDistance = (1 - distance / (48 * 20)) * 0.2;
          this.sounds.steps.volume = soundDistance > 0 ? soundDistance : 0;
          this.sounds?.steps?.play?.();
          this.sounds.steps.onended = () =>
            (this.sounds!.steps!.currentTime = 0);
        }
      }

      this.verifyAttack(distance);
      this.frames.elapsed = 0;
    }

    const movementMap = {
      left: -3,
      right: 3,
      up: -3,
      down: 3,
    };

    const axis =
      this.#movement == 'left' || this.#movement === 'right' ? 'x' : 'y';

    if (this.#movementCount === 100) {
      this.#movementCount = 0;
      const keys = Object.keys(movementMap);
      const randomKey = keys[
        (keys.length * Math.random()) << 0
      ] as keyof typeof movementMap;
      this.#movement = randomKey;
    }

    if (
      this.#movementCount % 2 === 0 &&
      !this.collisions.verifyCollide(
        {
          position: {
            ...this.position,
            [axis]: this.position[axis] + movementMap[this.#movement],
          },
          height: this.height,
          width: this.width,
        },
        axis,
        movementMap[this.#movement]
      )
    )
      this.position[axis] = this.position[axis] + movementMap[this.#movement];

    this.#movementCount++;
  }
}
