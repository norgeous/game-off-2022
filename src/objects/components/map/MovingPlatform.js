import Phaser from 'phaser'
import {collisionCategories} from '../../enums/Collisions';

export default class MovingPlatform extends Phaser.Physics.Matter.Sprite
{
  constructor(scene, x, y, texture, options, moveDiff, time)
  {
    super(scene.matter.world, x, y, texture, 0, options)

    this.moveDiff = moveDiff;
    this.time = time;
    this.startY = y;
    this.startX = x;
    this.isMoving = false;
    scene.add.existing(this)

    this.setCollisionCategory(collisionCategories.movingPlatforms);
    this.setCollidesWith(collisionCategories.player);

    this.setOnCollide((data) => {
      if (data.bodyA.collisionFilter.mask === collisionCategories.player || data.bodyB.collisionFilter.mask === collisionCategories.player) {
        if (this.isMoving === false) {
          this.moveVertically(this.moveDiff, this.time);
          this.isMoving = true;
        }
      }
    })
  }

  moveVertically(diff, time)
  {
    this.scene.tweens.addCounter({
      from: 0,
      to: diff,
      duration: time,
      ease: Phaser.Math.Easing.Sine.InOut,
      repeat: 0,
      yoyo: true,
      onUpdate: (tween, target) => {
        const y = this.startY + target.value
        const dy = y - this.y
        this.y = y
        this.setVelocityY(dy)
      },
      onComplete: () => {
        this.isMoving = false;
      }
    })
  }
}
