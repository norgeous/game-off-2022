import { collisionCategories } from './enums/Collisions';

// https://labs.phaser.io/assets/sprites/bullets/bullet1.png

class Bullet {
  constructor(scene, x, y, size = 5) {
    this.text = scene.add.text(
      x,
      y,
      '⭐',
      { font: `${size}px Arial`, align: 'center' },
    ).setOrigin(0.5);

    const gameObjectConfig = {
      shape: {
        type: 'circle',
        radius: (size / 2) + 1,
      },
      restitution: 1,
      mass: 1,
      bounce: 1.2,
      frictionAir: 0,
      ignoreGravity: true,
    };
    this.gameObject = scene.matter.add.gameObject(this.text, gameObjectConfig);
    this.gameObject.setVelocity(10, 0);
    this.gameObject.body.damage = 10;
    this.gameObject.setCollisionCategory(collisionCategories.enemyDamage)
  }

  destroy() {
    this.gameObject.destroy();
    delete this.gameObject;
  }
}

export default Bullet;
