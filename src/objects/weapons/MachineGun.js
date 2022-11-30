import AbstractWeapon, { fireTypes } from './AbstractWeapon';
import Bullet from '../projectiles/Bullet';
import Sound from '../enums/Sound';

export default class MachineGun extends AbstractWeapon {
  static FRAME = 18; // blue gun
  constructor(scene, { entity }) {
    super(
      scene,
      {
        BulletClass: Bullet,
        maxBullets: 10,
        frame: MachineGun.FRAME,
        entity,
        fireType: fireTypes.BURST,
        soundKeyName: Sound.GunBurst,
      },
    );
  }

  static preload(scene) {
    AbstractWeapon.preload(scene);
    Bullet.preload(scene);
  }
}
