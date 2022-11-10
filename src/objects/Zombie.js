import Phaser from 'phaser'

export default class Zombie extends Phaser.Physics.Matter.Sprite {
  constructor(scene, x, y) {
    super(scene.matter.world, x, y, 'player');
    scene.add.existing(this);
    this.scene = scene;

    this.scene.anims.create({
      key: 'zombie_idle',
      frameRate: 3,
      frames: this.anims.generateFrameNumbers('zombieSpriteSheet', { start: 10, end: 11 }),
      repeat: -1
    });
    this.scene.anims.create({
      key: 'zombie_walk',
      frameRate: 3,
      frames: this.anims.generateFrameNumbers('zombieSpriteSheet', { start: 0, end: 3 }),
      repeat: -1
    });

    this.setBounce(0.1);

    this.health = 200;

    this.setOnCollide(data => {
      this.health -= data.collision.depth;
    });
  }

  update() {
    const speed = Math.hypot(this.body.velocity.x, this.body.velocity.y);
    this.play(speed < 0.7 ? 'zombie_idle' : 'zombie_walk', true);

    if (this.health <= 0) this.destroy();
  }
}
