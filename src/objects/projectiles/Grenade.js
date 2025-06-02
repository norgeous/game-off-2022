import AbstractProjectile from './AbstractProjectile';
import { collisionCategories } from '../enums/Collisions';

const SPRITESHEETKEY = 'orb-green';

export default class Grenade extends AbstractProjectile {
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
          ignoreGravity: false,
          restitution: 0.7,
          chamfer: { radius: 10 },
        },
        enableLockRotationToMovementVector: false,
        exitSpeed: 10,
        destroyOnCollideMask: collisionCategories.enemy, // destroy when collide with enemies, but bounce on ground
        collisionDamage: 10,
        explosionDamage: 10,
        bulletSpread: 1,
      },
    );

    this.setDisplaySize(6, 6);
  }

  static preload(scene) {
    scene.load.image(SPRITESHEETKEY, 'sprites/orb-green.png');
  }
}
