import AbstractWeapon, { fireTypes } from './AbstractWeapon';
import Bullet from '../projectiles/Bullet';
import Sound from '../enums/Sound';

export default class Lazer extends AbstractWeapon {
  static FRAME = 27; // gun with blue circle on its side
  constructor(scene, { entity }) {
    super(
      scene,
      {
        BulletClass: Bullet,
        maxBullets: 10,
        frame: Lazer.FRAME,
        entity,
        fireType: fireTypes.SEMI,
        soundKeyName: Sound.Lazer,
      },
    );
  }

  static preload(scene) {
    AbstractWeapon.preload(scene);
    Bullet.preload(scene);
  }
}
