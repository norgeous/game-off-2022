import AbstractProjectile from './AbstractProjectile';

const SPRITESHEETKEY = 'rocket';

export default class Rocket extends AbstractProjectile {
  constructor(scene, x, y) {
    super(
      scene,
      x,
      y,
      {
        spriteSheetKey: SPRITESHEETKEY,
        lifespan: 1_000,
        minDestroySpeed: 0.1,
        matterBodyConfig: {
          ignoreGravity: true,
          restitution: 1,
          chamfer: { radius: 4 },
        },
        enableLockRotationToMovementVector: true,
        exitSpeed: 10,
      },
    );
  }

  static preload(scene) {
    scene.load.image(SPRITESHEETKEY, 'https://labs.phaser.io/assets/sprites/bullets/bullet10.png');
  }
}
