import { SpriteModel } from '../model/sprite.model';
import { MobSprites, PlayerProps } from '../types/Sprites';
import { Collisions } from './collisions.module';
import { Player } from './player.module';

export class Mob extends Player<MobSprites> implements SpriteModel {
  #movement: 'left' | 'right' | 'up' | 'down' = 'left';
  #movementCount = 0;
  maxMovement = 3;
  attackRange = 140;
  damage = 10;
  stirred = 0;

  constructor(
    props: PlayerProps<MobSprites>,
    private collisions: Collisions,
    private char: Player
  ) {
    super(props);
  }

  verifyAttack() {
    if (
      this.position.x <= this.char.position.x + this.attackRange &&
      this.position.x >= this.char.position.x - this.attackRange &&
      this.position.y <= this.char.position.y + this.attackRange &&
      this.position.y >= this.char.position.y - this.attackRange
    ) {
      this.image = this.sprites.stirred;

      if (this.stirred === 100) {
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

    this.verifyAttack();
    this.#movementCount++;
  }
}
