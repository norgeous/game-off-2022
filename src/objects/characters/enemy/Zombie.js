import Phaser from 'phaser';
import EntityAnimations from '../../enums/EntityAnimations';
import { collisionCategories } from '../../enums/Collisions';
import Entity from '../Entity.js';
import Direction from '../../enums/Direction';

const SPRITESHEETKEY = 'zombieSpriteSheet';

export default class Zombie extends Entity {
  constructor (scene, x, y) {
    super(
      scene,
      x, y,
      {
        name: 'ZombieEntity', // this becomes this.name
        spriteSheetKey: SPRITESHEETKEY,
        animations: {
          [EntityAnimations.Idle]:   { start: 18, end: 21, fps:  5 },
          [EntityAnimations.Death]:  { start:  6, end: 11, fps: 10, repeat: 0 },
          [EntityAnimations.Attack]: { start:  0, end:  5, fps: 15 },
          [EntityAnimations.Hurt]:   { start: 12, end: 13, fps: 10 },
          [EntityAnimations.Walk]:   { start: 24, end: 29, fps: 10 },
        },
        physicsConfig: {
          frictionAir: 0.001,
          bounce: 0.1,
          shape: { type: 'rectangle', width: 14, height: 34 },
          chamfer: { radius: 4 },
        },
        enableKeepUpright: true,
        keepUprightStratergy: 'SPRINGY',
      },
    );

    this.gameObject.setCollisionCategory(collisionCategories.enemy);

    this.aggravated = false;
    
    this.flipXSprite(Math.random() > 0.5); // initial face left / right randomly

    this.hitbox.onCollideCallback = data => {
      // if (data.bodyA.collisionFilter.category === collisionCategories.enemyDamage) {
      //   this.takeDamage(data.bodyA.damage);
      //   this.aggravated = true;
      // }
      
      // if (data.bodyB.collisionFilter.category === collisionCategories.enemyDamage) {
      //   this.takeDamage(data.bodyB.damage);
      //   this.aggravated = true;
      // }

      // environmental / fall damage
      // const { depth } = data.collision;
      // if (depth > 5) this.takeDamage(depth);
    };

    // circle of hearing debug
    this.circleOfHearing = scene.add.circle(x, y, 200);
    this.circleOfHearing.setStrokeStyle(1, 0x00FF00);
  }

  static preload(scene) {
    scene.load.spritesheet(SPRITESHEETKEY, 'sprites/craftpix.net/zombie.png', { frameWidth: 48, frameHeight: 48 });
  }

  takeDamage(amount) {
    super.takeDamage(amount);
    this.aggravated = true;
  }

  update() {
    super.update();
    
    if (!this.gameObject.body) return;

    const { player } = this.scene;

    if (!player.active) return;

    const { angularVelocity } = this.gameObject.body;
    const speed = Math.hypot(this.gameObject.body.velocity.x, this.gameObject.body.velocity.y);
    const motion = speed + Math.abs(angularVelocity);
    const closeToStationary = motion <= 0.1;
    const hearingRange = this.aggravated ? 500 : 200;
    const closeToPlayer = Phaser.Math.Distance.BetweenPoints(this, player) < hearingRange;
    const veryCloseToPlayer = Phaser.Math.Distance.BetweenPoints(this, player) < 30;
    const isAlive = this.health > 0;

    // hearing
    this.aggravated = closeToPlayer;
    if (this.scene.matter.world.drawDebug) this.circleOfHearing.setStrokeStyle(1, 0x00FF00);
    else this.circleOfHearing.setStrokeStyle();
  
    this.circleOfHearing.x = this.x;
    this.circleOfHearing.y = this.y;
    this.circleOfHearing.radius = hearingRange;

    if (this.aggravated && player.x > this.x) this.direction = Direction.Right;
    if (this.aggravated && player.x < this.x) this.direction = Direction.Left;

    // animations
    if (isAlive) {
      // alive
      if (veryCloseToPlayer) {
        // attack
        this.playAnimation(EntityAnimations.Attack);
      } else {
        // when moving play walking animation, otherwise play idle
        this.playAnimation(closeToStationary ? EntityAnimations.Idle : EntityAnimations.Walk);
      }
    }

    // when close to player and not moving much, jump towards player
    if (isAlive && !this.isStunned && closeToPlayer && closeToStationary) {
      const vectorTowardsPlayer = {
        x: player.x - this.x,
        y: player.y - this.y,
      };
      this.gameObject.setVelocity?.(
        vectorTowardsPlayer.x < 0 ? -2 : 2,
        -2,
      );
    }
  }

  destroy() {
    this.circleOfHearing.destroy();
    super.destroy();
  }
}
