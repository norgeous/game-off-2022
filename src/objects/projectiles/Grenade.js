import AbstractProjectile from './AbstractProjectile';

const SPRITESHEETKEY = 'orb-green';

class Grenade extends AbstractProjectile {
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
          ignoreGravity: false,
          restitution: 0.5,
          chamfer: { radius: 10 },
        },
        enableLockRotationToMovementVector: false,
        exitSpeed: 10,
      },
    );

    this.setDisplaySize(10, 10);
  }

  static preload(scene) {
    scene.load.image(SPRITESHEETKEY, 'https://labs.phaser.io/assets/sprites/orb-green.png');
  }
}

export default Grenade;
