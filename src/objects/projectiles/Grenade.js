import AbstractProjectile from './AbstractProjectile';
import { collisionCategories } from '../enums/Collisions';

const SPRITESHEETKEY = 'orb-green';

export default class Grenade extends AbstractProjectile {
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
          restitution: 0.7,
          chamfer: { radius: 10 },
        },
        enableLockRotationToMovementVector: false,
        exitSpeed: 10,
        destroyOnCollideMask: collisionCategories.enemy, // destroy when collide with enemies, but bounce on ground
      },
    );

    this.setDisplaySize(6, 6);
  }

  static preload(scene) {
    scene.load.image(SPRITESHEETKEY, 'https://labs.phaser.io/assets/sprites/orb-green.png');
  }
}
