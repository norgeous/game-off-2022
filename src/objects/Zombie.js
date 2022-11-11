import Phaser from 'phaser'
import HealthBar from './HealthBar';

// export default class Zombie extends Phaser.Physics.Matter.Sprite {
//   constructor(scene, x, y) {
//     super(scene.matter.world, x, y, 'zombie');
//     // scene.add.existing(this);


//   }

//   update() {
//     const speed = Math.hypot(this.gameObject.body.velocity.x, this.gameObject.body.velocity.y);
//     this.sprite.play(speed < 0.7 ? 'zombie_idle' : 'zombie_walk', true);

//     this.healthBar.draw(this.health);
//     if (this.health <= 0) this.gameObject.destroy();
//   }
// }

export default class Zombie extends Phaser.GameObjects.Container {
  constructor (scene, x, y) {
    super(scene, x, y);

    this.scene = scene;

    // zombie sprite
    this.sprite = this.scene.add.sprite(x, y, 'zombie');
    this.scene.anims.create({
      key: 'zombie_idle',
      frameRate: 3,
      frames: this.sprite.anims.generateFrameNumbers('zombieSpriteSheet', { start: 10, end: 11 }),
      repeat: -1
    });
    this.scene.anims.create({
      key: 'zombie_walk',
      frameRate: 3,
      frames: this.sprite.anims.generateFrameNumbers('zombieSpriteSheet', { start: 0, end: 3 }),
      repeat: -1
    });
    this.sprite.play('zombie_idle', true);

    console.log(this);


    // health bar
    this.health = 200;
    this.healthBar = new HealthBar(scene, x, y - 30, {
      width: 40,
      padding: 1,
      maxHealth: this.health,
    });
    this.healthBar.draw(this.health/2);

    // text
    this.text = this.scene.add.text(x, y - 40, 'Zombie', {
      font: '12px Arial',
      align: 'center',
      color: 'black',
      fontWeight: 'bold',
    }).setOrigin(0.5);

    // add sprite and health bar to container
    // this.add([this.sprite, this.healthBar.bar, this.text]);
    // this.add([this.text]);

    // add physics object to scene
    this.scene.matter.add.gameObject(
      this,
      {
        shape: { type: 'rectangle', width: 20, height: 40 },
        isStatic: false,
        chamfer: { radius: 3 },
      },
    )
      .setFrictionAir(0.001)
      .setBounce(0.1)
      .setMass(100)
      .setOnCollide(data => {
        this.health -= data.collision.depth;
      });    
  }
}