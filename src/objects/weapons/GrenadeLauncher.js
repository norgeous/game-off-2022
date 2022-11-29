import AbstractWeapon, { fireTypes } from './AbstractWeapon';
import Grenade from '../projectiles/Grenade';
import Sound from '../enums/Sound';

export default class GrenadeLauncher extends AbstractWeapon {
  static FRAME = 24;
  static TEXTURE = 'gunSprites'
  constructor(scene, { entity }) {
    super(
      scene,
      {
        BulletClass: Grenade,
        maxBullets: 2,
        frame: GrenadeLauncher.FRAME, // red gun
        entity,
        fireType: fireTypes.SEMI,
        soundKeyName: Sound.GrenadeLaunch,
      },
    );
  }

  static preload(scene) {
    Grenade.preload(scene);
  }
}
