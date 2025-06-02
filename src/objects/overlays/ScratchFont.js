import Config from '../Config';

export default class ScratchFont {
  constructor(
    scene,
    x, y,
    {
      text,
      fontSize = 64,
    },
  ) {
    this.text = scene.add.bitmapText(
      x, y,
      'hyperdrive',
      text,
      fontSize,
      1, // centered
    ).setTint(0x33FF33)
      .setScrollFactor(0)
      .setDepth(Config.UI_DEPTH)
      .setOrigin(0.5);
  }

  static preload(scene) {
    scene.load.bitmapFont('hyperdrive', 'fonts/bitmap/hyperdrive.png', 'fonts/bitmap/hyperdrive.xml');
  }
}
