import AbstractWeapon, { fireTypes } from './AbstractWeapon';
import Bullet from '../projectiles/Bullet';
import Sound from '../enums/Sound';

export default class HandGun extends AbstractWeapon {
  constructor(scene, { entity }) {
    super(
      scene,
      {
        BulletClass: Bullet,
        maxBullets: 1,
        frame: 0, // tiny pistol
        entity,
        fireType: fireTypes.AUTO,
        soundKeyName: Sound.Pistol,
      },
    );
  }
}
