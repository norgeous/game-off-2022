import Phaser from 'phaser'
import {collisionCategories} from "../enums/Collisions.js";

export default class MovingPlatform extends Phaser.Physics.Matter.Image
{
  constructor(scene, x, y, texture, options)
  {
    super(scene.matter.world, x, y, texture, 0, options)

    scene.add.existing(this)

    this.startY = y;
    this.startX = x;

    this.setFriction(1, 0, Infinity)
    this.obj.setCollisionCategory(collisionCategories.movingPlatforms);
    // this.obj.setCollidesWith(collisionCategories.player);
  }

  moveVertically(diff, time)
  {
    this.scene.tweens.addCounter({
      from: 0,
      to: diff,
      duration: time,
      ease: Phaser.Math.Easing.Sine.InOut,
      repeat: -1,
      yoyo: true,
      onUpdate: (tween, target) => {
        const y = this.startY + target.value
        const dy = y - this.y
        this.y = y
        this.setVelocityY(dy)
      }
    })
  }
}
