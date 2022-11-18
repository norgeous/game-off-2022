import Phaser from 'phaser';
// import { collisionCategories } from '../enums/Collisions';

class Bullet extends Phaser.Physics.Matter.Sprite {
  constructor(scene, x, y) {
    super(scene.matter.world, x, y, 'bullet1');

    scene.add.existing(this);

    // const size = 5;



    // const gameObjectConfig = {
    //   shape: {
    //     type: 'circle',
    //     radius: (size / 2) + 1,
    //   },
    //   restitution: 1,
    //   bounce: 1,
    //   frictionAir: 0,
    //   ignoreGravity: true,
    //   // mass: 1,
    // };
    // this.gameObject = scene.matter.add.gameObject(this.text, gameObjectConfig);
    // this.gameObject.setVelocity(10, 0);
    // this.gameObject.body.damage = 10;
    // this.gameObject.setCollisionCategory(collisionCategories.enemyDamage)
  }

  update() {
    // if bullet moving to slowly, destroy it
  }

  destroy() {
    // this.gameObject.destroy();
    // delete this.gameObject;
  }
}

export default Bullet;
