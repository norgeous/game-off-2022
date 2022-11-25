import AbstractProjectile from './AbstractProjectile';

const SPRITESHEETKEY = 'bullet1';

export default class Bullet extends AbstractProjectile {
  constructor(scene, x, y) {
    super(
      scene,
      x, y,
      {
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
      },
    );
  }

  static preload(scene) {
    scene.load.image(SPRITESHEETKEY, 'https://labs.phaser.io/assets/sprites/bullets/bullet1.png');
  }
}
