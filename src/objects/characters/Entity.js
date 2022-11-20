import Phaser from 'phaser';
import HealthBar from '../overlays/HealthBar';
import EntityAnimations from '../enums/EntityAnimations';
import { collisionCategories } from '../enums/Collisions';

const keepUprightStratergies = {
  INSTANT: 'INSTANT',
  SPRINGY: 'SPRINGY',
};

const craftpixOffset = {
  x: 10,
  y: -7,
};

export default class Entity extends Phaser.GameObjects.Container {
  constructor (
      scene,
      x, y,
      {
        name = 'entity',
        health = 100,
        enableHealthBar = true,
        spriteSheet = 'sprites/craftpix.net/biker.png',
        animations = {},
        physicsConfig = {},
        enableKeepUpright = false,
        keepUprightStratergy = keepUprightStratergies.SPRINGY,
      },
    ) {
    
    super(scene, x, y);

    this.scene = scene;

    this.name = name;
    this.health = health;

    this.enableHealthBar = enableHealthBar;
    this.enableKeepUpright = enableKeepUpright;
    this.keepUprightStratergy = keepUprightStratergy;

    // health bar
    if (enableHealthBar) {
      this.healthBar = new HealthBar(scene, 0, 0 - 30, {
        width: 40,
        padding: 1,
        maxHealth: this.health,
      });
      this.add([this.healthBar.bar]);
    }
    
    // text
    this.text = this.scene.add.text(0, 0 - 40, this.name, {
      font: '12px Arial',
      align: 'center',
      color: 'white',
      fontWeight: 'bold',
    }).setOrigin(0.5);
    this.add(this.text);

    // sprite
    this.sprite = this.scene.add.sprite(
      craftpixOffset.x,
      craftpixOffset.y,
      this.name,
    );
    this.add(this.sprite);

    // animations
    Object.entries(animations).forEach(([animationKey, { start, end, fps, repeat = -1 }]) => {
      console.log('inside forEach', {start, end, spriteSheet})
      this.scene.anims.create({
        key: this.getKey(animationKey),
        frameRate: fps,
        frames: this.sprite.anims.generateFrameNumbers(spriteSheet, { start, end }),
        repeat,
      });
    });
    console.log({animations})

    // physics object
    this.gameObject = this.scene.matter.add.gameObject(this, physicsConfig);
    this.gameObject.setCollisionCategory(collisionCategories.enemy);
    this.add(this.gameObject);

    // container
    this.scene.add.existing(this);

    // this.playAnimation(EntityAnimations.Idle);
  }

  getKey(key) {
    return `${this.name}_${key}`;
  }

  playAnimation(key, ignoreIfPlaying = true) {
    console.log(this.sprite.anims.animationManager.anims.entries[this.getKey(key)])
    return this.sprite.play(this.getKey(key), ignoreIfPlaying);
  }

  flipXSprite(shouldFlip) {
    this.sprite.flipX = shouldFlip;
    if (shouldFlip) {
      this.sprite.x = -craftpixOffset.x;
    } else {
      this.sprite.x = craftpixOffset.x;
    }
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
    if (this.health <= 0) {
      this.sprite.destroy();
      this.text.destroy();
      this.destroy();
      this.gameObject.destroy();
    }
  }
}
