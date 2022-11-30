import AbstractProjectile from './AbstractProjectile';

const SPRITESHEETKEY1 = 'flame1';
const SPRITESHEETKEY2 = 'flame2';
const SPRITESHEETKEY3 = 'flame3';

const items = [
  SPRITESHEETKEY1,
  SPRITESHEETKEY2,
  SPRITESHEETKEY3,
];

export default class Flame extends AbstractProjectile {
  constructor(scene, x, y, { direction }) {
    super(
      scene,
      x, y,
      {
        direction,
        spriteSheetKey: items[Math.floor(Math.random()*items.length)],
        lifespan: 5_000,
        minDestroySpeed: 0.1,
        matterBodyConfig: {
          ignoreGravity: true,
          chamfer: { radius: 4 },
          restitution: 1,
          friction: 0,
          airFriction:0,
          shape: { type: 'circle', radius: 20 },
          mass: 10, // very heavy
        },
        enableLockRotationToMovementVector: true,
        exitSpeed: 3,
        collisionDamage: 50,
        isExplosive: false,
        destroyOnCollideMask: 0,
      },
    );
  }

  static preload(scene) {
    scene.load.image(SPRITESHEETKEY1, 'https://labs.phaser.io/assets/particles/fire1.png');
    scene.load.image(SPRITESHEETKEY2, 'https://labs.phaser.io/assets/particles/fire2.png');
    scene.load.image(SPRITESHEETKEY3, 'https://labs.phaser.io/assets/particles/fire3.png');
  }
}
