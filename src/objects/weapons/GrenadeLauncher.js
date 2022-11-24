import AbstractWeapon from './AbstractWeapon2';
import Bomb from '../projectiles/Bomb';

export default class GrenadeLauncher extends AbstractWeapon {
  constructor(scene, { entity }) {
    super(
      scene,
      {
        BulletClass: Bomb,
        maxBullets: 1,
        frame: 24, // red gun
        entity,
      },
    );
  }
}
