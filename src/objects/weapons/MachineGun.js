import AbstractWeapon from './AbstractWeapon';
import Bullet from '../projectiles/Bullet';
import Sound from '../enums/Sound';

const SPRITESHEETKEY = 'gunSprites';

export default class MachineGun extends AbstractWeapon {
  constructor(scene) {
    super(
      scene,
      {
        BulletClass: Bullet,
        maxBullets: 10,
      },
    );

    var test = scene.add.sprite(200, 200, SPRITESHEETKEY);
  }

  static preload(scene) {
    scene.load.spritesheet(SPRITESHEETKEY, 'sprites/craftpix.net/guns.png', { frameWidth: 32, frameHeight: 32 });
  }

  fire() {
    this.bulletGroup.get(
      this.scene.player.x,
      this.scene.player.y,
      {
        direction: this.scene.player.direction,
        lifespan: 1000,
        soundKeyName: Sound.MachineGunFire,
      },
    );
  }
}
