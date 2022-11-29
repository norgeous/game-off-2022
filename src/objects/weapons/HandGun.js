import AbstractWeapon, { fireTypes } from './AbstractWeapon';
import Bullet from '../projectiles/Bullet';
import Sound from '../enums/Sound';

export default class HandGun extends AbstractWeapon {
  static FRAME = 0;
  static TEXTURE = 'gunSprites'
  constructor(scene, { entity }) {
    super(
      scene,
      {
        BulletClass: Bullet,
        maxBullets: 1,
        frame: HandGun.FRAME, // tiny pistol
        entity,
        fireType: fireTypes.AUTO,
        soundKeyName: Sound.Pistol,
      },
    );
  }
}
