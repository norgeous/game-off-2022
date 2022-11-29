// import Phaser from 'phaser';
import Map from '../map/Map';
import AbstractScene from './AbstractScene';
import Sound from '../objects/enums/Sound';
import Config from '../objects/Config';
import GameOver from '../objects/overlays/GameOver';

export default class MainMenu extends AbstractScene {
  constructor() {
    super('main-menu')
    this.startText = 'Main menu';
    this.map = new Map(this, 'theForest', 'tileset_extruded.png', 'mapData.json', 8);
  }

  preload() {
    super.preload();
    this.load.bitmapFont('hyperdrive', 'https://labs.phaser.io/assets/fonts/bitmap/hyperdrive.png', 'https://labs.phaser.io/assets/fonts/bitmap/hyperdrive.xml');
  }

  create() {
    super.create();

    if (Config.PLAY_MUSIC) {
      this.audio.playMusic(Sound.MusicKey);
    }

    this.add.bitmapText(
      this.scale.width/2,
      this.scale.height/2,
      'hyperdrive',
      'Dead man\nwalking',
      90,
      1, // centered
    ).setScrollFactor(0).setDepth(1001).setOrigin(0.5);

    new GameOver(this);

  }

  update(time, delta) {
    super.update(time, delta);
  }
}
