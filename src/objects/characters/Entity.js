import Phaser from 'phaser';
import HealthBar from '../overlays/HealthBar';
import EntityAnimations from '../enums/EntityAnimations';
import { collisionCategories } from '../enums/Collisions';

const keepUprightStratergies = {
  NONE: 'NONE',
  INSTANT: 'INSTANT',
  SPRINGY: 'SPRINGY',
};

const directions = {
  LEFT: 'LEFT',
  RIGHT: 'RIGHT',
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
      direction = undefined,
    },
  ) {
    super(scene, x, y);

    this.scene = scene;

    this.name = name;
    this.health = health;

    this.enableHealthBar = enableHealthBar;
    this.enableKeepUpright = enableKeepUpright;
    this.keepUprightStratergy = keepUprightStratergy;
    if (direction) this.direction = direction;
    else this.direction = Math.random() > .5 ? directions.LEFT : directions.RIGHT;

    this.sensorData = {
      left: false,
      right: false,
      top: false,
      bottom: false,
    };

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

    // base physics object
    this.gameObject = this.scene.matter.add.gameObject(this, { ...physicsConfig });
    
    // sensors
    const { Bodies, Body } = Phaser.Physics.Matter.Matter;
    const { width, height } = physicsConfig.shape;
    this.hitbox = Bodies.rectangle(0, 0, width, height, { ...physicsConfig, label: 'Entity' });
    const left = Bodies.circle(-width/2, 0, 4, { isSensor: true, label: 'left' });
    const right = Bodies.circle(width/2, 0, 4, { isSensor: true, label: 'right' });
    const top = Bodies.circle(0, -height/2, 4, { isSensor: true, label: 'top' });
    const bottom = Bodies.circle(0, height/2, 4, { isSensor: true, label: 'bottom' });
    const compoundBody = Body.create({
      parts: [ this.hitbox, left, right, top, bottom ],
    });

    left.onCollideActiveCallback = () => this.sensorData.left = true;
    left.onCollideEndCallback = () => this.sensorData.left = false;
    right.onCollideActiveCallback = () => this.sensorData.right = true;
    right.onCollideEndCallback = () => this.sensorData.right = false;
    top.onCollideActiveCallback = () => this.sensorData.top = true;
    top.onCollideEndCallback = () => this.sensorData.top = false;
    bottom.onCollideActiveCallback = () => this.sensorData.bottom = true;
    bottom.onCollideEndCallback = () => this.sensorData.bottom = false;

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
    this.flipXSprite(this.direction === directions.LEFT);

    // debug sensors
    this.text.setText(
      [
        this.sensorData.left ? 'L' : '-',
        this.sensorData.right ? 'R' : '-',
        this.sensorData.top ? 'T' : '-',
        this.sensorData.bottom ? 'B' : '-',
      ].join('')
    );

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
