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
      },
    );
  }

  static preload(scene) {
    scene.load.image(SPRITESHEETKEY, 'https://labs.phaser.io/assets/sprites/orb-green.png');
  }
}

export default Grenade;
