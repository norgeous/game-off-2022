import { collisionCategories } from './enums/Collisions';

// https://labs.phaser.io/assets/sprites/bullets/bullet1.png

class Bullet {
  constructor(scene, x, y) {
    this.text = scene.add.text(
      0,
      0,
      '⭐',
      { font: '50px Arial', align: 'center' },
    ).setOrigin(0.5);

    const gameObjectConfig = {
      shape: { type: 'circle', radius: 26 },
      restitution: 1,
      mass: 1,
      bounce: 1.2,
      frictionAir: 0,
      ignoreGravity: true,
    };
    this.gameObject = scene.matter.add.gameObject(this.text, gameObjectConfig);
    this.gameObject
      .setDisplaySize(5, 5)
      .setVelocity(10, 0);
    this.gameObject.body.damage = 10;
    this.gameObject.x = x;
    this.gameObject.y = y;
    this.gameObject.setCollisionCategory(collisionCategories.enemyDamage)
  }

  destroy() {
    this.gameObject.destroy();
    delete this.gameObject;
  }
}

export default Bullet;
