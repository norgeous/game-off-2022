import Phaser from 'phaser';
import HealthBar from '../overlays/HealthBar';
import EntityAnimations from '../enums/EntityAnimations';
import { collisionCategories } from '../enums/Collisions';

const keepUprightStratergies = {
  NONE: 'NONE',
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
      spriteSheetKey = 'player',
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
      this.add(this.healthBar.bar);
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
      this.scene.anims.create({
        key: this.getKey(animationKey),
        frameRate: fps,
        frames: this.sprite.anims.generateFrameNumbers(spriteSheetKey, { start, end }),
        repeat,
      });
    });

    this.playAnimation(EntityAnimations.Idle);

    // container
    this.scene.add.existing(this);

    // physics object
    this.gameObject = this.scene.matter.add.gameObject(this, { ...physicsConfig });
    this.gameObject.setCollisionCategory(collisionCategories.enemy);
    
    // sensors
    const { Bodies, Body } = Phaser.Physics.Matter.Matter;
    const { width, height } = physicsConfig.shape;
    this.hitbox = Bodies.rectangle(0, 0, width, height, { ...physicsConfig });
    const circleA = Bodies.circle(-width/2, 0, 4, { isSensor: true, label: 'left' });
    const circleB = Bodies.circle(width/2, 0, 4, { isSensor: true, label: 'right' });
    const circleC = Bodies.circle(0, -height/2, 4, { isSensor: true, label: 'top' });
    const circleD = Bodies.circle(0, height/2, 4, { isSensor: true, label: 'bottom' });
    const compoundBody = Body.create({
      parts: [ this.hitbox, circleA, circleB, circleC, circleD ],
    });
    this.gameObject.setExistingBody(compoundBody);
    this.gameObject.setPosition(x, y);
  }

  getKey(key) {
    return `${this.name}_${key}`;
  }

  playAnimation(key, ignoreIfPlaying = true) {
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
    this.healthBar?.draw(this.health);

    // flip sprite to match direction of movement
    this.flipXSprite(this.gameObject.body.velocity.x < 0.1);


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
      if (this.gameObject.body.inertia !== Infinity) {
        // save the old inertia
        this.gameObject.body.inertia_old = this.gameObject.body.inertia;
        this.gameObject.body.inverseInertia_old = this.gameObject.body.inverseInertia;
        this.gameObject.setFixedRotation();
        this.gameObject.rotation = 0;
      }
    }

    // NONE
    if (this.keepUprightStratergy === keepUprightStratergies.NONE) {
      if (this.gameObject.body.inertia_old && this.gameObject.body.inverseInertia_old) {
        this.gameObject.body.inertia = this.gameObject.body.inertia_old;
        this.gameObject.body.inverseInertia = this.gameObject.body.inverseInertia_old;
        delete this.gameObject.body.inertia_old;
        delete this.gameObject.body.inverseInertia_old;
      }
    }

    // kill if zero health
    if (this.health <= 0) {
      // dead
      this.gameObject.setCollidesWith(~collisionCategories.enemyDamage);
      this.rotation = 0; // force Entity upright for death animation
      this.text.setText('X');
      this.playAnimation(EntityAnimations.Death).on('animationcomplete', () => {
        this.sprite.destroy();
        this.text.destroy();
        this.destroy();
        this.gameObject.destroy();
      });
    }
  }

}
