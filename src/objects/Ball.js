import { collisionCategories, collisionMaskEverything } from './enums/Collisions';
import Direction from "./enums/Direction.js";

class Ball {
  constructor(scene, x, y, direction) {
    // create ball
    this.text = scene.add.text(
      0,
      0,
      '💣',
      { font: '50px Arial', align: 'center' },
    ).setOrigin(0.5);

    const gameObjectShape = {
      shape: { type: 'circle', radius: 26 },
      restitution: 1,
    };
    let velocityY = 0;
    let velocityX = (direction === Direction.Right) ? 10 : -10;

    this.gameObject = scene.matter.add.gameObject(this.text, gameObjectShape);
    this.gameObject
      .setMass(100)
      .setBounce(1)
      .setFrictionAir(0)
      .setDisplaySize(10, 10)
      .setIgnoreGravity(true)
      .setVelocity(velocityX, velocityY);
    this.gameObject.body.label = 'ball';
    this.gameObject.body.damage = 10;
    this.gameObject.x = x ?? 100;
    this.gameObject.y = y ?? 1250;
    this.gameObject.setCollisionCategory(collisionCategories.enemyDamage)
  }

  destroy() {
    this.gameObject.destroy();
    delete this.gameObject;
  }
}

export default Ball;
