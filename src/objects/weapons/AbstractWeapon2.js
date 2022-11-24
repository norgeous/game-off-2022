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

    this.sprite = this.scene.add.sprite(
      15, -1, // offset to player center
      SPRITESHEETKEY,
      frame,
    );
    entity.add(this.sprite); // add gun sprite into entity container
  }

  static preload(scene) {
    scene.load.spritesheet(SPRITESHEETKEY, 'sprites/craftpix.net/guns.png', { frameWidth: 32, frameHeight: 32 });
  }

  fire() {
    this.bulletGroup.get(
      this.entity.x,
      this.entity.y,
      {
        direction: this.entity.direction,
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
