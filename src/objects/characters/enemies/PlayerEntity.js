import Phaser from 'phaser';
import EntityAnimations from '../../enums/EntityAnimations';
import { collisionCategories } from '../../enums/Collisions';
import Entity from '../Entity.js';

const SPRITESHEET = 'sprites/craftpix.net/biker.png';

export default class PlayerEntity extends Entity {
  constructor (scene, x, y) {
    super(
      scene,
      x + 100, y + 100,
      {
        name: 'PlayerEntity', // this becomes this.name
        spriteSheetKey: 'player',
        animations: {
          [EntityAnimations.Idle]:   { start:  0, end: 3,  fps: 10 },
          [EntityAnimations.Attack]: { start:  0, end: 5,  fps: 15 },
          [EntityAnimations.Death]:  { start:  6, end: 11, fps: 10, repeat: 0 },
          [EntityAnimations.Hurt]:   { start: 12, end: 13, fps: 10 },
          [EntityAnimations.Walk]:   { start: 24, end: 29, fps: 10 },
        },
        physicsConfig: {
          frictionAir: 0.001,
          bounce: 0.1,
          shape: { type: 'rectangle', width: 14, height: 32 },
          chamfer: { radius: 4 },
        },
        enableKeepUpright: true,
        keepUprightStratergy: 'INSTANT',
      },
    );

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
    scene.load.spritesheet('player', SPRITESHEET, { frameWidth: 48, frameHeight: 48 });
  }

  update() {
    super.update();

    // return;

    if (!this.gameObject.body) return;

    const { angularVelocity } = this.gameObject.body;
    const speed = Math.hypot(this.gameObject.body.velocity.x, this.gameObject.body.velocity.y);
    const motion = speed + Math.abs(angularVelocity);
    const closeToStationary = motion <= 0.1;
    const { player } = this.scene;
    const veryCloseToPlayer = Phaser.Math.Distance.BetweenPoints(this, player) < 30;
    const isAlive = this.health > 0;

    // animations
    if (isAlive) {
      // alive
      if (veryCloseToPlayer) {
        // attack
        // this.playAnimation(EntityAnimations.Attack);
      } else {
        // when moving play walking animation, otherwise play idle
        this.playAnimation(closeToStationary ? EntityAnimations.Idle : EntityAnimations.Walk);
      }
    } else {
      // dead
      this.gameObject.setCollidesWith(~collisionCategories.enemyDamage);
      this.rotation = 0; // force upright for death animation
      this.text.setText('X');
      this.playAnimation(EntityAnimations.Death).on('animationcomplete', () => {
        this.sprite.destroy();
        this.text.destroy();
        this.destroy();
        this.gameObject.destroy();
      });
    }

    // // when close to player and not moving much, jump towards player
    // if (isAlive && closeToPlayer && closeToStationary) {
    //   const vectorTowardsPlayer = {
    //     x: player.x - this.x,
    //     y: player.y - this.y,
    //   };
    //   this.gameObject.setVelocity?.(
    //     vectorTowardsPlayer.x < 0 ? -2 : 2,
    //     -2,
    //   );
    // }
  }
}
