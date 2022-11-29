// import Phaser from 'phaser';
import Map from '../map/Map';
import AbstractScene from './AbstractScene';
import Sound from '../objects/enums/Sound';
import Config from '../objects/Config';
import ScratchFont from '../objects/overlays/ScratchFont';

export default class MainMenu extends AbstractScene {
  constructor() {
    super('main-menu')
    // this.startText = 'Main menu';
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

    new ScratchFont(
      this,
      this.scale.width/2,
      this.scale.height/4,
      {
        text: 'Dead Man\nWalking',
      },
    );

    // load forest-area1 when clicking anywhere
    // this.input.once('pointerdown', () => this.scene.launch('forest-area1'));
  }

  update(time, delta) {
    super.update(time, delta);
  }
}
