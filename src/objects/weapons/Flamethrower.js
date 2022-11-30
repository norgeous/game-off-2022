import AbstractWeapon, { fireTypes } from './AbstractWeapon';
import Bullet from '../projectiles/Bullet';
import Sound from '../enums/Sound';

export default class Flamethrower extends AbstractWeapon {
  static FRAME = 24;  // red gun
  constructor(scene, { entity }) {
    super(
      scene,
      {
        BulletClass: Bullet,
        maxBullets: 10,
        frame: Flamethrower.FRAME,
        entity,
        fireType: fireTypes.SEMI,
        soundKeyName: Sound.Flame,
      },
    );
  }

  static preload(scene) {
    AbstractWeapon.preload(scene);
    Bullet.preload(scene);
  }
}
