import Phaser from 'phaser';
import { collisionCategories, collisionMaskEverything } from '../enums/Collisions';
import Direction from '../enums/Direction';
import Sound from '../enums/Sound';

class Bullet extends Phaser.Physics.Matter.Sprite {
  constructor(scene, x, y, direction, lifespan, soundKeyName) {
    super(
      scene.matter.world,
      x,
      y,
      'bullet1',
      0,
      {
        chamfer: { radius: 4 },
        restitution: 0.99,
        frictionAir: 0,
        ignoreGravity: true,
        mass: .01,
      },
    );

    console.log(soundKeyName);

    const velocityX = (direction === Direction.Right) ? 10 : -10;
    const velocityY = 0;

    this.body.damage = 10;
    this.setCollisionCategory(collisionCategories.enemyDamage);

    // collide with everything except other bullets, ladders and player
    this.setCollidesWith(collisionMaskEverything &~ collisionCategories.enemyDamage &~ collisionCategories.ladders &~ collisionCategories.player);

    this.setVelocity(velocityX, velocityY);

    scene.audio.playSfx(Sound.Pistol);
    // self destroy after lifespan
    this.scene.time.delayedCall(lifespan, () => this.destroy());
  }

  update() {
    // force bullet rotation to match movement direction
    const angleOfVelocity = Math.atan2(this.body.velocity.y, this.body.velocity.x);
    this.rotation = angleOfVelocity;

    // if bullet moving too slowly, destroy it
    const speed = Math.hypot(this.body.velocity.x, this.body.velocity.y);
    if (speed < 4) this.destroy();
  }
}

export default Bullet;
