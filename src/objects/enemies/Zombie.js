import Phaser from 'phaser';
import HealthBar from './HealthBar';
import EntityAnimations from '../enums/EntityAnimations';
import { collisionCategories } from '../enums/Collisions';
import Entity from './Entity.js';

export default class Zombie extends Entity {
  constructor (scene, x, y) {
    super(scene, x, y);

    this.scene = scene;
    this.name = 'zombie';
    this.spriteObject.spriteSheet = 'zombieSpriteSheet';

    this.loadSprite();
    this.createAnimations();

    // zombie sprite
    this.sprite.flipX = Math.random() > 0.5; // initial face left / right randomly

    this.playAnimation(EntityAnimations.Idle);

    // health bar
    this.health = 100;
    this.healthBar = new HealthBar(scene, 0, 0 - 30, {
      width: 40,
      padding: 1,
      maxHealth: this.health,
    });

    // text
    this.text = this.scene.add.text(0, 0 - 40, 'Zombie', {
      font: '12px Arial',
      align: 'center',
      color: 'white',
      fontWeight: 'bold',
    }).setOrigin(0.5);


    this.addToContainer([this.sprite, this.healthBar.bar, this.text]);

    this.loadPhysics({
      frictionAir: 0.001,
      bounce: 0.1,
      shape: { type: 'rectangle', width: 14, height: 32 },
      isStatic: false,
      chamfer: { radius: 4 },
    });

    this.gameObject.setOnCollide(data => {

      if (data.bodyB.collisionFilter.category === collisionCategories.enemyDamage) {
        this.takeDamage(data.bodyB.damage);
      }

      if (data.bodyB.collisionFilter.category === collisionCategories.enemyDamage) {
        this.takeDamage(data.bodyB.damage);
      }

      // environmental / fall damage
      const { depth } = data.collision;
      if (depth > 5) this.takeDamage(depth);
    });
  }

  static preload(scene) {
    scene.load.spritesheet('zombieSpriteSheet', 'sprites/craftpix.net/zombie/zombie.png', { frameWidth: 48, frameHeight: 48 });
  }

  takeDamage(amount) {
    this.health -= amount;
    if (this.health<0) this.health = 0;
  }

  createAnimations() {
    this.createAnimation(EntityAnimations.Attack, 0, 5, 15);
    this.createAnimation(EntityAnimations.Death, 6, 11, 2, 0);
    this.createAnimation(EntityAnimations.Hurt, 12, 13, 10);
    this.createAnimation(EntityAnimations.Idle, 18, 21, 3);
    this.createAnimation(EntityAnimations.Walking, 24, 29, 5);
  }

  update() {
    if (!this.gameObject.body) return;

    const { angle, angularVelocity } = this.gameObject.body;
    const speed = Math.hypot(this.gameObject.body.velocity.x, this.gameObject.body.velocity.y);
    const motion = speed + Math.abs(angularVelocity);
    const closeToStationary = motion <= 0.1;
    const { player } = this.scene;
    const closeToPlayer = Phaser.Math.Distance.BetweenPoints(this, player) < 200;
    const veryCloseToPlayer = Phaser.Math.Distance.BetweenPoints(this, player) < 30;
    const twoPi = Math.PI * 2;
    const isAlive = this.health > 0;


    // animations
    if (isAlive) {
      // alive
      if (veryCloseToPlayer) {
        // attack
        this.playAnimation(EntityAnimations.Attack);
      } else {
        // when moving play walking animation, otherwise play idle
        this.playAnimation(closeToStationary ? EntityAnimations.Idle : EntityAnimations.Walking);
      }
    } else {
      // dead
      this.gameObject.rotation = 0; // force upright for death animation
      this.text.setText('X');
      this.playAnimation(EntityAnimations.Death).on('animationcomplete', () => {
        this.sprite.destroy();
        this.text.destroy();
        this.destroy();
        this.gameObject.destroy();
      });
    }

    // force upright (springy)
    if (isAlive && closeToPlayer) {
      this.gameObject.rotation = this.gameObject.rotation % twoPi; // modulo spins
      const diff = 0 - angle;
      const newAv = (angularVelocity + (diff / 100));
      this.gameObject.setAngularVelocity(newAv);
    }

    // when close to player and not moving much, jump towards player
    if (isAlive && closeToPlayer && closeToStationary) {
      const vectorTowardsPlayer = {
        x: player.x - this.x,
        y: player.y - this.y,
      };
      this.gameObject.setVelocity?.(
        vectorTowardsPlayer.x < 0 ? -2 : 2,
        -2,
      );
    }

    // flip zombie sprite when player is close to and left of zombie
    if (isAlive && closeToPlayer) {
      this.sprite.flipX = player.x < this.x;
    }

    // (re)draw health bar
    this.healthBar.draw(this.health);
  }
}
