import AbstractWeapon from './AbstractWeapon2';
import Bullet from '../projectiles/Bullet';

export default class MachineGun extends AbstractWeapon {
  constructor(scene, x, y, { entity }) {
    super(
      scene,
      {
        BulletClass: Bullet,
        maxBullets: 10,
        frame: 24,
        entity,
      },
    );
  }
}
