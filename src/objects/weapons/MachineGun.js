import AbstractWeapon, { fireTypes } from './AbstractWeapon2';
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
}
