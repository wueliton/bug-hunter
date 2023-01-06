import { SpriteModel } from '../model/sprite.model';
import { CameraPosition, Canvas } from './canvas.module';
import { Collisions } from './collisions.module';
import { Player, PlayerProps } from './player.module';

export class Controls {
  movement = { left: false, right: false, up: false, down: false };
  speed = 3;
  lastMovement: 'left' | 'right' | 'up' | 'down' | null = null;
  isMoving = false;
  stepsMap = {
    left: this.speed * -1,
    right: this.speed,
    up: this.speed * -1,
    down: this.speed,
  };

  constructor(
    private char: Player,
    private canvas: Canvas,
    private colision?: Collisions
  ) {
    this.keyBinding();
  }

  private getParsedKey(key: string, keysMap: { [k in string]: string }) {
    return key.includes('Arrow')
      ? key.toLowerCase().replace('arrow', '')
      : keysMap[key];
  }

  private verifyScreenLimit(
    axis: 'x' | 'y',
    target: Canvas | Player,
    measure: 'height' | 'width',
    map: SpriteModel | undefined
  ) {
    if (target.position[axis] < 0)
      target.position = { ...target.position, [axis]: 0 };
    if (target.position[axis] + target[measure] > (map?.[measure] ?? 0))
      target.position = {
        ...target.position,
        [axis]: (this.canvas.map?.[measure] ?? 0) - this.canvas[measure],
      };
  }

  private updateCamera(
    cameraPosition: CameraPosition,
    charPosition: Player,
    axis: 'x' | 'y',
    movementDirection: 'left' | 'right' | 'up' | 'down'
  ) {
    if (!movementDirection) return;
    const measure =
      movementDirection === 'left' || movementDirection === 'right'
        ? 'width'
        : 'height';
    const charPos =
      movementDirection === 'right' || movementDirection === 'down'
        ? charPosition.position[axis] + charPosition[measure]
        : charPosition.position[axis];

    this.canvas.position = {
      ...cameraPosition,
      [axis]:
        charPos - this.canvas[measure] * this.canvas.limit[movementDirection],
    };

    this.verifyScreenLimit(axis, this.canvas, measure, this.canvas.map);
  }

  private updateChar(
    position: PlayerProps['position'],
    axis: 'x' | 'y',
    lastMovement: 'left' | 'right' | 'up' | 'down'
  ) {
    this.char.image =
      this.char.sprites[
        `char${lastMovement[0].toUpperCase() + lastMovement.substring(1)}`
      ];

    if (
      this.colision?.verifyCollide(
        {
          position: {
            ...this.char.position,
            [axis]:
              this.char.position[axis] + this.stepsMap[this.lastMovement!],
          },
          height: this.char.height,
          width: this.char.width,
        },
        axis,
        this.stepsMap[this.lastMovement!]
      )
    )
      return;

    const step = position[axis] + this.stepsMap[lastMovement];
    const mapWidth = this.canvas.map?.width ?? 0;
    const mapHeight = this.canvas.map?.height ?? 0;

    if (axis === 'x' && step < this.char.width) {
      this.char.position = { ...position, x: this.char.width };
      return;
    }
    if (axis === 'x' && step > mapWidth) {
      this.char.position = { ...position, x: mapWidth };
      return;
    }
    if (axis === 'y' && step < 0) {
      this.char.position = { ...position, y: 0 };
      return;
    }
    if (axis === 'y' && step > mapHeight) {
      this.char.position = { ...position, y: mapHeight };
      return;
    }

    this.char.position = { ...position, [axis]: step };
  }

  private charMovement() {
    const axis =
      this.lastMovement === 'right' || this.lastMovement == 'left' ? 'x' : 'y';
    this.isMoving = true;

    const movementLoop = () => {
      if (!this.isMoving) return;
      window.requestAnimationFrame(movementLoop);
      const cameraPosition = this.canvas.position;

      this.updateChar(this.char.position, axis, this.lastMovement!);

      if (
        this.char.position.x < this.canvas.getEdge('left') &&
        this.lastMovement === 'left'
      ) {
        this.updateCamera(cameraPosition, this.char, 'x', 'left');
        return;
      }
      if (
        this.char.position.x + this.char.width > this.canvas.getEdge('right') &&
        this.lastMovement === 'right'
      ) {
        this.updateCamera(cameraPosition, this.char, 'x', 'right');
        return;
      }
      if (
        this.char.position.y < this.canvas.getEdge('up') &&
        this.lastMovement === 'up'
      ) {
        this.updateCamera(cameraPosition, this.char, 'y', 'up');
        return;
      }
      if (
        this.char.position.y + this.char.height > this.canvas.getEdge('down') &&
        this.lastMovement === 'down'
      ) {
        this.updateCamera(cameraPosition, this.char, 'y', 'down');
        return;
      }
    };

    movementLoop();
  }

  keyBinding() {
    const keysMap: { [k in string]: string } = {
      a: 'left',
      s: 'down',
      d: 'right',
      w: 'up',
    };

    document.addEventListener('keydown', (e) => {
      const parsedKey = this.getParsedKey(e.key, keysMap);

      if (!Object.keys(this.movement).includes(parsedKey)) return;
      this.movement = { ...this.movement, [parsedKey]: true };
      if (parsedKey === this.lastMovement) return;
      this.lastMovement = parsedKey as keyof typeof this.lastMovement;
      this.charMovement();
    });

    document.addEventListener('keyup', (e) => {
      const parsedKey = this.getParsedKey(e.key, keysMap);
      this.movement[parsedKey as keyof typeof this.movement] = false;
      this.char.image = this.char.sprites.char;
      this.lastMovement = null;
      this.isMoving = false;
    });
  }
}
