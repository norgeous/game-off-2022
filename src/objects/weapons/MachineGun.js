import AbstractWeapon from './AbstractWeapon2';
import Bullet from '../projectiles/Bullet';

export default class MachineGun extends AbstractWeapon {
  constructor(scene, { entity }) {
    super(
      scene,
      {
        BulletClass: Bullet,
        maxBullets: 10,
        // frame: 15, // blue gun
        // frame: 18, // blue gun
        frame: 24, // red gun
        entity,
      },
    );
  }
}
