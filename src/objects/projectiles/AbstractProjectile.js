import Phaser from 'phaser';
import { collisionCategories, collisionMaskEverything } from '../enums/Collisions';
import Direction from '../enums/Direction';
import Explosion from './Explosion';

export default class AbstractProjectile extends Phaser.Physics.Matter.Sprite {
  constructor(
    scene,
    x, y,
    {
      direction = { x: 0, y: 0 },
      spriteSheetKey,
      matterBodyConfig = {},
      exitSpeed = 10,
      bulletSpread = (2 * Math.PI) / 20,
      lifespan = 1000,
      minDestroySpeed = 4,
      isExplosive = true,
      explosionRadius = 120,
      explosionForce = 10,
      explosionDamage = 0,
      collisionDamage = 0,
      destroyOnCollideMask = collisionMaskEverything,
      enableLockRotationToMovementVector = true,
    }
  ) {
    super(
      scene.matter.world,
      x, y,
      spriteSheetKey,
      0,
      {
        chamfer: { radius: 4 },
        restitution: 0.99,
        frictionAir: 0,
        ignoreGravity: true,
        ...matterBodyConfig,
      },
    );
    this.scene = scene;
    this.minDestroySpeed = minDestroySpeed;
    this.enableLockRotationToMovementVector = enableLockRotationToMovementVector;
    this.isExplosive = isExplosive;
    this.explosionRadius = explosionRadius;
    this.explosionForce = explosionForce;
    this.explosionDamage = explosionDamage;

    // apply exit speed and angle to velocity
    // console.log(exitSpeed, direction, bulletSpread);
    // const deg45multiplier = 0.7071;
    this.setVelocity(direction.x * exitSpeed, direction.y * exitSpeed);
 
    this.setCollisionCategory(collisionCategories.enemyDamage);
 
    // collide with everything except other bullets, ladders and player
    this.setCollidesWith(collisionMaskEverything &~ collisionCategories.enemyDamage &~ collisionCategories.ladders &~ collisionCategories.player);

    // when projectile collides with anything
    this.setOnCollide(data => {
      const bodies = [data.bodyA, data.bodyB];
      const target = bodies.find(body => body.collisionFilter.category !== collisionCategories.enemyDamage);

      // trigger the takeDamage function on target (if it exists)
      target.gameObject?.takeDamage?.(collisionDamage, this);

      if ((target.gameObject?.body.collisionFilter.category & destroyOnCollideMask) > 0) this.complete();
    });

    // self destroy after lifespan
    if (lifespan) {
      this.scene.time.delayedCall(lifespan, () => this.complete());
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
    if (speed <= this.minDestroySpeed) this.complete();
  }

  update() {
    if (this.enableLockRotationToMovementVector) this.lockRotationToMovementVector();
    this.destroyIfTooSlow();
  }

  complete() {
    if (this.active && this.isExplosive) {
      new Explosion(
        this.scene,
        this.x, this.y,
        {
          radius: this.explosionRadius,
          force: this.explosionForce,
          damage: this.explosionDamage,
        },
      );
    }
    this.destroy();
  }
}
