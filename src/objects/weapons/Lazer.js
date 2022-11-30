import AbstractWeapon, { fireTypes } from './AbstractWeapon';
import LazerBeam from '../projectiles/LazerBeam';
import Sound from '../enums/Sound';

export default class Lazer extends AbstractWeapon {
  static FRAME = 27; // gun with blue circle on its side
  constructor(scene, { entity }) {
    super(
      scene,
      {
        BulletClass: LazerBeam,
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
    LazerBeam.preload(scene);
  }
}
