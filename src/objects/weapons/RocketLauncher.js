import AbstractWeapon, { fireTypes } from './AbstractWeapon';
import Rocket from '../projectiles/Rocket';

export default class RocketLauncher extends AbstractWeapon {
  constructor(scene, { entity }) {
    super(
      scene,
      {
        BulletClass: Rocket,
        maxBullets: 5,
        frame: 15, // white gun
        entity,
        fireType: fireTypes.SEMI,
      },
    );
  }

  static preload(scene) {
    Rocket.preload(scene);
  }
}
