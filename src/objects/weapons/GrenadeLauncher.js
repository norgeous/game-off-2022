import AbstractWeapon, { fireTypes } from './AbstractWeapon2';
import Bomb from '../projectiles/Bomb';

export default class GrenadeLauncher extends AbstractWeapon {
  constructor(scene, { entity }) {
    super(
      scene,
      {
        BulletClass: Bomb,
        maxBullets: 3,
        frame: 24, // red gun
        entity,
        fireType: fireTypes.SEMI,
      },
    );
  }
}
