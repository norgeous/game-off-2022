import AbstractWeapon, { fireTypes } from './AbstractWeapon';
import Bullet from '../projectiles/Bullet';

export default class HandGun extends AbstractWeapon {
  constructor(scene, { entity }) {
    super(
      scene,
      {
        BulletClass: Bullet,
        maxBullets: 1,
        frame: 15, // white gun
        entity,
        fireType: fireTypes.AUTO,
      },
    );
  }
}
