import AbstractWeapon, { fireTypes } from './AbstractWeapon';
import Bullet from '../projectiles/Bullet';
import Sound from '../enums/Sound';

export default class Shotgun extends AbstractWeapon {
  static FRAME = 21; // shotgun
  constructor(scene, { entity }) {
    super(
      scene,
      {
        BulletClass: Bullet,
        maxBullets: 10,
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
    Bullet.preload(scene);
  }
}
