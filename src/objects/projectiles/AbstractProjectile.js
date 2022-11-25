import Phaser from 'phaser';
import { collisionCategories, collisionMaskEverything } from '../enums/Collisions';
import Explosion from './Explosion';

export default class AbstractProjectile extends Phaser.Physics.Matter.Sprite {
  constructor(
    scene,
    x, y,
    {
      spriteSheetKey,
      matterBodyConfig,
      exitSpeed = 10,
      exitAngle = 0,
      bulletSpread = (2 * Math.PI) / 20,
      damage = 10,
      lifespan = 1000,
      minDestroySpeed = 4,
      isExplosive = true,
      explosionRadius = 120,
      explosionForce = 10,
      enableExplodeOnContactEnemy = true,
      enableLockRotationToMovementVector = true,
    }
  ) {
    super(
      scene.matter.world,
      x,
      y,
      spriteSheetKey,
      0,
      {
        chamfer: { radius: 4 },
        restitution: 0.99,
        frictionAir: 0,
        ignoreGravity: true,
        mass: .01,
        ...matterBodyConfig,
      },
    );

    this.scene = scene;
    this.damage = damage;
    this.body.damage = damage;
    this.minDestroySpeed = minDestroySpeed;
    this.enableLockRotationToMovementVector = enableLockRotationToMovementVector;
    this.isExplosive = isExplosive;
    this.explosionRadius = explosionRadius;
    this.explosionForce = explosionForce;

    // apply exit speed and angle to velocity
    console.log(exitSpeed, exitAngle, bulletSpread);
    // this.setVelocity(velocityX, velocityY);
 
    // collide with everything except other bullets, ladders and player
    this.setCollisionCategory(collisionCategories.enemyDamage);
    this.setCollidesWith(collisionMaskEverything &~ collisionCategories.enemyDamage &~ collisionCategories.ladders &~ collisionCategories.player);
    this.setOnCollide(() => {
      console.log('projectile collided with something!', enableExplodeOnContactEnemy);
    });

    // self destroy after lifespan
    if (lifespan) {
      this.scene.time.delayedCall(lifespan, () => this.destroy());
    }
  }

  lockRotationToMovementVector() {
    // force bullet rotation to match movement direction
    const angleOfVelocity = Math.atan2(this.body.velocity.y, this.body.velocity.x);
    this.rotation = angleOfVelocity;
  }

  destroyIfTooSlow() {
    // if bullet moving too slowly, destroy it
    const speed = Math.hypot(this.body.velocity.x, this.body.velocity.y);
    if (speed < 4) this.destroy();
  }

  update() {
    if (this.enableLockRotationToMovementVector) this.lockRotationToMovementVector();
    this.destroyIfTooSlow();
  }

  destroy() {
    if (this.isExplosive) {
      new Explosion(
        this.scene,
        this.x, this.y,
        {
          radius: this.explosionRadius,
          force: this.explosionForce,
        },
      );
    }
    super.destroy();
  }
}