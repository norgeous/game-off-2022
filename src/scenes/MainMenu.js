import Phaser from 'phaser';
import ScratchFont from '../objects/overlays/ScratchFont';
import Config from "../objects/Config.js";
import Sound from "../objects/enums/Sound.js";
import Audio from "../objects/Audio.js";

export default class MainMenu extends Phaser.Scene {
  constructor() {
    super('main-menu')
    this.audio = new Audio(this);
  }

  preload() {
    this.audio.preLoad();
    this.load.audio(Sound.MusicKey, 'sounds/music.mp3');
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

    this.add.text(this.scale.width/2, this.scale.height * 0.7, 'Click to Start', { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' }).setOrigin(0.5);

    this.audio.create();
    if (Config.PLAY_MUSIC) {
      this.audio.playMusic(Sound.MusicKey);
    }

    // load forest-area1 when clicking anywhere
    this.input.once('pointerdown', () => this.scene.start('forest-area1'));
  }

  update(time, delta) {
    super.update(time, delta);
  }
}
