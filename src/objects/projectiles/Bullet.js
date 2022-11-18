import Phaser from 'phaser';
import { collisionCategories } from '../enums/Collisions';
import Direction from '../enums/Direction';

class Bullet extends Phaser.Physics.Matter.Sprite {
  constructor(scene, x, y, direction) {
    super(
      scene.matter.world,
      x,
      y,
      'bullet1',
      0,
      {
        chamfer: { radius: 4 },
        restitution: 0.5,
        frictionAir: 0,
        ignoreGravity: true,
        mass: .0100,
      },
    );

    const velocityX = (direction === Direction.Right) ? 10 : -10;
    const velocityY = 0;

    this.body.damage = 10;
    this.setCollisionCategory(collisionCategories.enemyDamage)
    this.setVelocity(velocityX, velocityY);

    // self destroy after lifespan
    this.scene.time.delayedCall(1000, () => this.destroy());
  }

  update() {
    // if bullet moving to slowly, destroy it
    const speed = Math.hypot(this.body.velocity.x, this.body.velocity.y);
    if (speed < 4) this.destroy();
  }
}

export default Bullet;