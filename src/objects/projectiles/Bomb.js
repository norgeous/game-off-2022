import Phaser from 'phaser';
import { collisionCategories } from '../enums/Collisions';
import Explosion from './Explosion';
import Direction from '../enums/Direction';

class Bomb extends Phaser.GameObjects.Text {
  constructor(scene, x, y, { direction, lifespan, soundKeyName }) {
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
      restitution: .5,
    };

    const velocityX = (direction === Direction.Right) ? 10 : -10;
    const velocityY = -3;

    this.gameObject = scene.matter.add.gameObject(this, gameObjectShape);
    this.gameObject
      .setMass(1)
      .setBounce(0.5)
      .setFrictionAir(0)
      .setDisplaySize(10, 10)
      // .setIgnoreGravity(true)
      .setVelocity(velocityX, velocityY);
    this.gameObject.body.damage = 10;
    this.gameObject.x = x ?? 100;
    this.gameObject.y = y ?? 1250;
    this.gameObject.setCollisionCategory(collisionCategories.enemyDamage);

    // self destroy after lifespan
    this.scene.time.delayedCall(1000, () => {
      new Explosion(scene, this.gameObject.x, this.gameObject.y, { radius: 120, force: 10 });
      this.destroy();
    });
  }
}

export default Bomb;
