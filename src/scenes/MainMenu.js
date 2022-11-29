import Phaser from 'phaser';
import ScratchFont from '../objects/overlays/ScratchFont';

export default class MainMenu extends Phaser.Scene {
  constructor() {
    super('main-menu')
  }

  preload() {
    this.load.bitmapFont('hyperdrive', 'https://labs.phaser.io/assets/fonts/bitmap/hyperdrive.png', 'https://labs.phaser.io/assets/fonts/bitmap/hyperdrive.xml');
  }

  create() {
    new ScratchFont(
      this,
      this.scale.width/2,
      this.scale.height/2,
      {
        text: 'Dead Man\nWalking',
      },
    );

    // load forest-area1 when clicking anywhere
    this.input.once('pointerdown', () => this.scene.start('forest-area1'));
  }

  update(time, delta) {
    super.update(time, delta);
  }
}
