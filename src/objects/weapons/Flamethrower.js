import AbstractWeapon, { fireTypes } from './AbstractWeapon';
import Flame from '../projectiles/Flame';
import Sound from '../enums/Sound';

export default class Flamethrower extends AbstractWeapon {
  static FRAME = 24;  // red gun
  constructor(scene, { entity }) {
    super(
      scene,
      {
        BulletClass: Flame,
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
    Flame.preload(scene);
  }
}
