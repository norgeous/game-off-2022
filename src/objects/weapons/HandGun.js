import AbstractWeapon, { fireTypes } from './AbstractWeapon';
import Bullet from '../projectiles/Bullet';
import Sound from '../enums/Sound';

export default class HandGun extends AbstractWeapon {
  static FRAME = 3; // second largest pistol
  static TEXTURE = 'gunSprites'
  constructor(scene, { entity }) {
    super(
      scene,
      {
        BulletClass: Bullet,
        maxBullets: 1,
        frame: HandGun.FRAME,
        entity,
        fireType: fireTypes.AUTO,
        soundKeyName: Sound.Pistol,
      },
    );
  }
}
