import AbstractProjectile from './AbstractProjectile';

const SPRITESHEETKEY = 'bullet1';

export default class Bullet extends AbstractProjectile {
  constructor(scene, x, y, { direction }) {
    super(
      scene,
      x, y,
      {
        direction,
        spriteSheetKey: SPRITESHEETKEY,
        lifespan: 1_000,
        minDestroySpeed: 0.1,
        matterBodyConfig: {
          ignoreGravity: true,
          restitution: 1,
          chamfer: { radius: 4 },
          mass: .1, // heavy
        },
        enableLockRotationToMovementVector: true,
        exitSpeed: 10,
        isExplosive: false,
        collisionDamage: 20,
        bulletSpread: 1,
      },
    );
  }

  static preload(scene) {
    scene.load.image(SPRITESHEETKEY, 'sprites/bullet1.png');
  }
}
