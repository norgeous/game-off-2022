import Phaser from 'phaser';
import { collisionCategories } from '../enums/Collisions';
import Direction from '../enums/Direction';
import Explosion from './Explosion';

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
      restitution: .5,
    };

    let velocityX = (direction === Direction.Right) ? 10 : -10;
    let velocityY = -3;

    this.scene.anims.create({
      key: 'explosion',
      frameRate: 15,
      frames: this.scene.anims.generateFrameNumbers('explosion', { start: 1, end: 9 }),
      repeat: 0,
      hideOnComplete: true
    });

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
      new Explosion(scene, this.gameObject.x, this.gameObject.y, { radius: 200, force: 10 });
      this.onDestroy();
    });
  }

  onDestroy() {
    this.sprite = this.scene.add.sprite(this.gameObject.x, this.gameObject.y, this.name);
    let d = this.scene.matter.add.gameObject(this.sprite, {});
    this.sprite.play('explosion').on('animationcomplete', ()=> {
      this.sprite.destroy()
    });
    this.destroy();
  }
}

export default Bomb;
