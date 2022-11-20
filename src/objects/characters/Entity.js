import Phaser from 'phaser';
import { collisionCategories } from '../enums/Collisions';

const keepUprightStratergies = {
  INSTANT: 'INSTANT',
  SPRINGY: 'SPRINGY',
};

export default class Entity extends Phaser.GameObjects.Container {
  constructor (scene, x, y) {
    super(scene, x, y);

    this.scene = scene;
    this.sprite = null;
    this.spriteObject = {
      offset: {
        x: 0,
        y: 0,
      },
      defaultFrameRate: 3,
      spriteSheet: '',
    };

    this.health = 100;
    this.healthBar = null;

    this.followPlayer = true;
    this.healthCheck = true;
    this.enableKeepUpright = false;
    this.keepUprightStratergy = keepUprightStratergies.SPRINGY;
  }

  loadPhysics(physicsConfig) {
    this.gameObject = this.scene.matter.add.gameObject(this, physicsConfig);
    this.gameObject.setCollisionCategory(collisionCategories.enemy);
  }

  loadSprite() {
    this.sprite = this.scene.add.sprite(
      this.spriteObject.offset.x,
      this.spriteObject.offset.y,
      this.name,
    );
  }

  flipXSprite(shouldFlip) {
    this.sprite.flipX = shouldFlip;
    if (shouldFlip) {
      this.sprite.x = -this.spriteObject.offset.x;
    } else {
      this.sprite.x = this.spriteObject.offset.x;
    }
  }

  getKey(key) {
    return `${this.name}_${key}`;
  }

  addToContainer(array) {
    this.add(array);
    this.scene.add.existing(this);
  }

  createAnimation(key, startFrame, endFrame, frameRate = 3,  repeat = -1) {
    this.scene.anims.create({
      key: this.getKey(key),
      frameRate: frameRate,
      frames: this.sprite.anims.generateFrameNumbers(this.spriteObject.spriteSheet, { start: startFrame, end: endFrame }),
      repeat: repeat,
    });
  }

  playAnimation(key, repeat = true) {
    return this.sprite.play(this.getKey(key), repeat);
  }

  takeDamage(amount) {
    this.health -= amount;
    if (this.health < 0) this.health = 0;
  }

  update() {
    if (!this.gameObject.body) return;

    // (re)draw health bar
    if (this.healthBar) {
      this.healthBar.draw(this.health);
    }

    // if (this.followPlayer) {
    // }

    // flip sprite to match direction of movement
    this.flipXSprite(this.gameObject.body.velocity.x < 0.1);
    
    // Keep Upright
    if (this.enableKeepUpright) {

      // SPRINGY
      if (this.keepUprightStratergy === keepUprightStratergies.SPRINGY) {
        const twoPi = Math.PI * 2;
        const { angle, angularVelocity } = this.gameObject.body;
        this.gameObject.rotation = this.gameObject.rotation % twoPi; // modulo spins
        const diff = 0 - angle;
        const newAv = angularVelocity + (diff / 100);
        this.gameObject.setAngularVelocity(newAv);
      }

      // INSTANT
      if (this.keepUprightStratergy === keepUprightStratergies.INSTANT) {
        this.gameObject.rotation = 0;
      }

    }

    // kill if zero health
    if (this.healthCheck && this.health <= 0) {
      this.sprite.destroy();
      this.text.destroy();
      this.destroy();
      this.gameObject.destroy();
    }
  }
}
