import AbstractWeapon, { fireTypes } from './AbstractWeapon';
import Bullet from '../projectiles/Bullet';

export default class MachineGun extends AbstractWeapon {
  constructor(scene, { entity }) {
    super(
      scene,
      {
        BulletClass: Bullet,
        maxBullets: 10,
        frame: 18, // blue gun
        entity,
        fireType: fireTypes.BURST,
      },
    );
  }

  static preload(scene) {
    AbstractWeapon.preload(scene);
    Bullet.preload(scene);
  }
}
