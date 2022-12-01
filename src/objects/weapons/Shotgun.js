import AbstractWeapon, { fireTypes } from './AbstractWeapon';
import Pellet from '../projectiles/Pellet';
import Sound from '../enums/Sound';

export default class Shotgun extends AbstractWeapon {
  static FRAME = 21; // shotgun
  constructor(scene, { entity }) {
    super(
      scene,
      {
        BulletClass: Pellet,
        maxBullets: 5,
        bulletsPerFire: 5,
        frame: Shotgun.FRAME,
        entity,
        fireType: fireTypes.SEMI,
        soundKeyName: Sound.Shotgun,
      },
    );
  }

  static preload(scene) {
    AbstractWeapon.preload(scene);
    Pellet.preload(scene);
  }
}
