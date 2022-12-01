import AbstractProjectile from './AbstractProjectile';

const SPRITESHEETKEY = 'pellet';

export default class Pellet extends AbstractProjectile {
  constructor(scene, x, y, { direction }) {
    super(
      scene,
      x, y,
      {
        direction,
        spriteSheetKey: SPRITESHEETKEY,
        lifespan: 400,
        minDestroySpeed: 0.1,
        matterBodyConfig: {
          ignoreGravity: true,
          restitution: 1,
          chamfer: { radius: 4 },
          mass: .1, // heavy
        },
        enableLockRotationToMovementVector: false,
        exitSpeed: 10,
        isExplosive: false,
        collisionDamage: 15,
        bulletSpread: 4,
      },
    );

    this.setDisplaySize(3, 3);
  }

  static preload(scene) {
    scene.load.image(SPRITESHEETKEY, 'https://labs.phaser.io/assets/sprites/enemy-bullet.png');
  }
}
