import AbstractWeapon, { fireTypes } from './AbstractWeapon';
import Rocket from '../projectiles/Rocket';
import Sound from '../enums/Sound';

export default class RocketLauncher extends AbstractWeapon {
  static FRAME = 15; // white gun
  constructor(scene, { entity }) {
    super(
      scene,
      {
        BulletClass: Rocket,
        maxBullets: 2,
        frame: RocketLauncher.FRAME,
        entity,
        fireType: fireTypes.SEMI,
        soundKeyName: Sound.RocketLaunch,
      },
    );
  }

  static preload(scene) {
    Rocket.preload(scene);
  }
}
