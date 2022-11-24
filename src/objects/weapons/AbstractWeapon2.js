import Phaser from 'phaser';
import Sound from '../enums/Sound';

const SPRITESHEETKEY = 'gunSprites';

export default class AbstractWeapon {
  constructor(scene, { frame = 0, maxBullets, BulletClass, entity }) {
    this.scene = scene;
    this.entity = entity;


    this.bulletGroup = this.scene.add.group({
      maxSize: maxBullets,
      classType: BulletClass,
      runChildUpdate: true,
    });

    scene.add.existing(this.bulletGroup);


    // this.setDepth(1); // make bullets below gun


    // text
    // this.text2 = this.scene.add.text(0, 0 - 60, 'AW', {
    //   font: '12px Arial',
    //   align: 'center',
    //   color: 'white',
    //   fontWeight: 'bold',
    // }).setOrigin(0.5);

    // scene.add.existing(this.text2);
    // entity.add(this.text2)

    // entity.add(this);
    // console.log(entity.getAll())


    this.sprite = this.scene.add.sprite(
      0,
      0,
      SPRITESHEETKEY,
      frame,
    );
    entity.add(this.sprite);
  }

  static preload(scene) {
    scene.load.spritesheet(SPRITESHEETKEY, 'sprites/craftpix.net/guns.png', { frameWidth: 32, frameHeight: 32 });
  }

  fire(directionData) {
    this.bulletGroup.get(
      this.entity.x,
      this.entity.y,
      {
        direction: this.scene.player.direction,
        lifespan: 1000, // TODO: bullet should know how long it lives, not have it passed in
        soundKeyName: Sound.MachineGunFire, // TODO: gun should make sound, not bullet
      },
    );
  }

  update() {}
  
  destroy() {
    this.sprite.destroy();
  }
}
