import Direction from '../enums/Direction';

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
  static MAP_ICON_SCALE = 2;
  static TEXTURE = 'gunSprites'
  constructor(scene, { frame = 0, maxBullets, BulletClass, entity, fireType, soundKeyName = undefined }) {
    this.scene = scene;
    this.entity = entity;
    this.fireType = fireType;
    this.soundKeyName = soundKeyName;
    this.bulletsFiredThisPull = 0;
    this.gunDirection = {
      x: 1,
      y: 0,
    };

    this.bulletGroup = this.scene.add.group({
      maxSize: maxBullets,
      classType: BulletClass,
      runChildUpdate: true,
    });

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

  static onPickUp(entity) {
    entity.weapons.add(this);
  }

  pullTrigger() {
    if (this.bulletsFiredThisPull >= maxBulletsPerPull[this.fireType]) return;

    // try to create bullet
    const bullet = this.bulletGroup.create(
      this.entity.x + this.gunSprite.x,
      this.entity.y + this.gunSprite.y,
      {
        direction: this.entity.gunDirection,
      },
    );
    
    if (!bullet) return;

    this.bulletsFiredThisPull++;

    // gun fire sound
    if (this.soundKeyName) this.scene.audio.playSfxNow(this.soundKeyName);
  }

  releaseTrigger() {
    this.bulletsFiredThisPull = 0;
  }

  update() {}
  
  destroy() {
    this.gunSprite.destroy();
  }
}
