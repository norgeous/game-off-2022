import Phaser from 'phaser'

export default class Player extends Phaser.Physics.Matter.Sprite {
  constructor(scene, x, y) {
    super(scene.matter.world, x, y, 'player');
    scene.add.existing(this);
    this.scene = scene;

    this.scene.anims.create({
      key: 'zombieAnim',
      frameRate: 3,
      frames: this.anims.generateFrameNumbers('zombieSpriteSheet', { start: 0, end:8 }),
      repeat: -1
    });

    this.setBounce(0.1); // our player will bounce from items
  }

  update() {
    this.play('zombieAnim', true);
  }
}
