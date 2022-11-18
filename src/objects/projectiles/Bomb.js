import Phaser from 'phaser';
import { collisionCategories } from '../enums/Collisions';
import Direction from '../enums/Direction';

class Bomb extends Phaser.GameObjects.Text {
  constructor(scene, x, y, direction) {
    super(
      scene,
      x,
      y,
      '💣',
      { font: '50px Arial', align: 'center' },
    );

    this.setOrigin(0.5);

    const gameObjectShape = {
      shape: { type: 'circle', radius: 26 },
      restitution: 1,
    };

    let velocityX = (direction === Direction.Right) ? 10 : -10;
    let velocityY = 0;

    this.gameObject = scene.matter.add.gameObject(this, gameObjectShape);
    this.gameObject
      .setMass(100)
      .setBounce(1)
      .setFrictionAir(0)
      .setDisplaySize(10, 10)
      // .setIgnoreGravity(true)
      .setVelocity(velocityX, velocityY);
    this.gameObject.body.damage = 10;
    this.gameObject.x = x ?? 100;
    this.gameObject.y = y ?? 1250;
    this.gameObject.setCollisionCategory(collisionCategories.enemyDamage);

    // self destroy after lifespan
    this.scene.time.delayedCall(1000, () => this.destroy());
  }
}

export default Bomb;
