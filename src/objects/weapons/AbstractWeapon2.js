import Phaser from 'phaser';
import Sound from '../enums/Sound';

const SPRITESHEETKEY = 'gunSprites';

export default class AbstractWeapon extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, { frame = 0, maxBullets, BulletClass, entity }) {
    super(
      scene,
      x,
      y,
      SPRITESHEETKEY,
      frame,
    );

    this.scene = scene;

    this.bulletGroup = this.scene.add.group({
      maxSize: maxBullets,
      classType: BulletClass,
      runChildUpdate: true,
    });

    scene.add.existing(this);


    this.setDepth(1);

    // entity.add(this);
    // console.log({ entity })
  }

  static preload(scene) {
    scene.load.spritesheet(SPRITESHEETKEY, 'sprites/craftpix.net/guns.png', { frameWidth: 32, frameHeight: 32 });
  }

  fire(directionData) {
    console.log('fire', this.x, this.y);
    this.bulletGroup.get(
      this.x,
      this.y,
      {
        direction: this.scene.player.direction,
        lifespan: 1000, // TODO: bullet should know how long it lives, not have it passed in
        soundKeyName: Sound.MachineGunFire, // TODO: gun should make sound, not bullet
      },
    );
  }

  update() {}

}
