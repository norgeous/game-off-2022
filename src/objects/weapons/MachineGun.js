import AbstractWeapon, { fireTypes } from './AbstractWeapon';
import Bullet from '../projectiles/Bullet';
import Sound from '../enums/Sound';

export default class MachineGun extends AbstractWeapon {
  static FRAME = 18;
  constructor(scene, { entity }) {
    super(
      scene,
      {
        BulletClass: Bullet,
        maxBullets: 10,
        frame: MachineGun.FRAME, // blue gun
        entity,
        fireType: fireTypes.BURST,
        soundKeyName: Sound.GunBurst,
        // soundKeyName: Sound.MachineGunFire,
        // soundKeyName: Sound.Pistol,
      },
    );
  }

  static preload(scene) {
    AbstractWeapon.preload(scene);
    Bullet.preload(scene);
  }
}
