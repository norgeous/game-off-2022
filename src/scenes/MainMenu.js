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
      this.scale.height * 0.4,
      {
        text: 'Dead Man\nWalking',
      },
    );

    this.add.text(
      this.scale.width/2,
      this.scale.height * 0.7,
      `${!this.game.device.input.touch ? 'Click' : 'Tap'} to Start`,
      {
        fontSize: 20,
        fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
      },
    ).setOrigin(0.5);

    if(!this.game.device.input.touch) {
      this.add.text(
        this.scale.width/2,
        this.scale.height * 0.8,
        'Move: WASD | Cycle Weapon: Q | Fire Weapon: L',
        {
          fontSize: 12,
          fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
          color: '#333333',
        },
      ).setOrigin(0.5);
    }

    // load forest-area1 when clicking anywhere
    this.input.once('pointerdown', () => this.scene.start('forest-area1'));
  }

  update(time, delta) {
    super.update(time, delta);
  }
}
