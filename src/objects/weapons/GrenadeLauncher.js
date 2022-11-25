import AbstractWeapon, { fireTypes } from './AbstractWeapon';
import Grenade from '../projectiles/Grenade';

export default class GrenadeLauncher extends AbstractWeapon {
  constructor(scene, { entity }) {
    super(
      scene,
      {
        BulletClass: Grenade,
        maxBullets: 2,
        frame: 24, // red gun
        entity,
        fireType: fireTypes.SEMI,
      },
    );
  }
}
