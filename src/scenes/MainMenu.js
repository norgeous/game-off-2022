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
    this.load.bitmapFont('hyperdrive', 'fonts/bitmap/hyperdrive.png', 'fonts/bitmap/hyperdrive.xml');
  }

  create() {
    this.logo = new ScratchFont(
      this,
      this.scale.width/2,
      this.scale.height * 0.4,
      {
        text: 'Dead Man\nWalking',
      },
    );
    this.tweens.addCounter({
      from: 255,
      to: 0,
      duration: 5000,
      onUpdate: (tween) => {
          const value = Math.floor(tween.getValue());
          this.logo.text.setTint(Phaser.Display.Color.GetColor(value, 255-value, value));
      }
    });


    this.add.text(
      this.scale.width/2,
      this.scale.height * 0.7,
      `${this.game.device.input.touch ? 'Tap' : 'Press any key'} to Start`,
      {
        fontSize: 20,
        fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
      },
    ).setOrigin(0.5);

    if(!this.game.device.input.touch) {
      this.add.text(
        this.scale.width/2,
        this.scale.height * 0.8,
        'Move: WASD | Jump: Space\nCycle Weapon: Q | Fire Weapon: L',
        {
          fontSize: 12,
          align: 'center',
          fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
          color: '#333333',
        },
      ).setOrigin(0.5);
    }

    this.audio.create();
    if (Config.PLAY_MUSIC) {
      this.audio.playMusic(Sound.MusicKey);
    }

    // load forest-area1 when clicking anywhere
    this.input.once('pointerdown', () => this.scene.start('forest-area1'));
    this.input.keyboard.on('keydown', () => this.scene.start('forest-area1'));
  }

  update(time, delta) {
    super.update(time, delta);
  }
}
