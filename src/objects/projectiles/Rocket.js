import AbstractProjectile from './AbstractProjectile';

const SPRITESHEETKEY = 'rocket';

export default class Rocket extends AbstractProjectile {
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
          chamfer: { radius: 4 },
        },
        enableLockRotationToMovementVector: true,
        exitSpeed: 12,
        collisionDamage: 50,
        explosionDamage: 50,
        bulletSpread: 2,
      },
    );
  }

  static preload(scene) {
    scene.load.image(SPRITESHEETKEY, 'https://labs.phaser.io/assets/sprites/bullets/bullet10.png');
  }
}
