import AbstractWeapon from './AbstractWeapon2';
import Bullet from '../projectiles/Bullet';
// import Sound from '../enums/Sound';

// const SPRITESHEETKEY = 'gunSprites';

export default class MachineGun extends AbstractWeapon {
  constructor(scene, x, y, { entity }) {
    super(
      scene,
      {
        BulletClass: Bullet,
        maxBullets: 10,
        frame: 24,
        entity,
      },
    );

    console.log('createdMAchineGun');

    // const test = scene.add.sprite(scene.player.x, scene.player.y, SPRITESHEETKEY);

    // this.scene.add.existing(this);
  }

  // static preload(scene) {
  //   scene.load.spritesheet(SPRITESHEETKEY, 'sprites/craftpix.net/guns.png', { frameWidth: 32, frameHeight: 32 });
  // }

  // fire(directionData) {
  //   this.bulletGroup.get(
  //     this.scene.player.x,
  //     this.scene.player.y,
  //     {
  //       direction: this.scene.player.direction,
  //       lifespan: 1000,
  //       soundKeyName: Sound.MachineGunFire,
  //     },
  //   );
  // }
}
