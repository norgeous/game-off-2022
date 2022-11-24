import Sound from '../enums/Sound';

export const fireTypes = {
  SEMI: 'SEMI',
  BURST: 'BURST',
  AUTO: 'AUTO',
};

const maxBulletsPerPull = {
  SEMI: 1,
  BURST: 3,
  AUTO: Infinity,
};

const SPRITESHEETKEY = 'gunSprites';

export default class AbstractWeapon {
  constructor(scene, { frame = 0, maxBullets, BulletClass, entity, fireType, soundKeyName = undefined }) {
    this.scene = scene;
    this.entity = entity;
    this.fireType = fireType;
    this.soundKeyName = soundKeyName;

    this.bulletsFiredThisPull = 0;

    this.bulletGroup = this.scene.add.group({
      maxSize: maxBullets,
      classType: BulletClass,
      runChildUpdate: true,
    });

    // arm sprite
    this.armSprite = this.scene.add.sprite(
      6, -5, // offset to player center
      'hands',
      2,
    );
    entity.add(this.armSprite);
    entity.sendToBack(this.armSprite); // sets z-index

    // gun sprite
    this.gunSprite = this.scene.add.sprite(
      17, -9, // offset to player center
      SPRITESHEETKEY,
      frame,
    );
    // this.gunSprite.rotation = Math.PI / 2;
    entity.add(this.gunSprite); // add gun sprite into entity container
    entity.sendToBack(this.gunSprite); // sets z-index
  }

  static preload(scene) {
    scene.load.spritesheet(SPRITESHEETKEY, 'sprites/craftpix.net/guns.png', { frameWidth: 32, frameHeight: 32 });
  }

  fire() {
    const bullet = this.bulletGroup.create(
      this.entity.x + this.gunSprite.x,
      this.entity.y + this.gunSprite.y,
      {
        direction: this.entity.direction,
        lifespan: 1000, // TODO: bullet should know how long it lives, not have it passed in
        soundKeyName: Sound.MachineGunFire, // TODO: gun should make sound, not bullet
      },
    );

    // sound
    if (this.soundKeyName && bullet) this.scene.sound.add(this.soundKeyName).play();
  }

  pullTrigger() {
    if (this.bulletsFiredThisPull >= maxBulletsPerPull[this.fireType]) return;
    this.fire();
    this.bulletsFiredThisPull++;
  }

  releaseTrigger() {
    this.bulletsFiredThisPull = 0;
  }

  update() {}
  
  destroy() {
    this.armSprite.destroy();
    this.gunSprite.destroy();
  }
}
