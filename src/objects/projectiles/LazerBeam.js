import AbstractProjectile from './AbstractProjectile';

const SPRITESHEETKEY = 'lazerbeam';

export default class LazerBeam extends AbstractProjectile {
  constructor(scene, x, y, { direction }) {
    super(
      scene,
      x, y,
      {
        direction,
        spriteSheetKey: SPRITESHEETKEY,
        lifespan: 10_000,
        minDestroySpeed: 10,
        matterBodyConfig: {
          ignoreGravity: true,
          chamfer: { radius: 4 },
          restitution: 1,
          friction: 0,
          airFriction:0,
        },
        enableLockRotationToMovementVector: true,
        exitSpeed: 12,
        collisionDamage: 50,
        isExplosive: false,
        destroyOnCollideMask: 0,
      },
    );
  }

  static preload(scene) {
    scene.load.image(SPRITESHEETKEY, 'sprites/bullet11.png');
  }
}
