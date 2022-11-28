// import Phaser from 'phaser';
import Map from '../map/Map';
import AbstractScene from './AbstractScene';
import Sound from '../objects/enums/Sound';
import Config from '../objects/Config';

export default class MainMenu extends AbstractScene {
  constructor() {
    super('main-menu')
    this.startText = 'Main menu';
    this.map = new Map(this, 'theForest', 'tileset_extruded.png', 'mapData.json', 8);
  }

  preload() {
    super.preload();
    this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');
  }

  create() {
    super.create();

    if (Config.PLAY_MUSIC) {
      this.audio.playMusic(Sound.MusicKey);
    }

    WebFont.load({
      google: {
        families: [ 'Freckle Face', 'Finger Paint', 'Nosifer' ]
      },
      active: () => {
        var t = this.add.text(
          this.scale.width/2,
          this.scale.height/2,
          'Game\nOver',
          { fontFamily: 'Nosifer', fontSize: 50, color: '#660000', align: 'center' },
        );
        t.setScrollFactor(0);
        t.setDepth(1001);
        t.setOrigin(0.5);
        t.setShadow(2, 2, '#000000', 2, false, true);

        // this.input.once('pointerdown', function () {
        //     t.setFontSize(64);
        // });
      }
    });
  }

  update(time, delta) {
    super.update(time, delta);
  }
}


// function create () {
//   this.add.image(400, 300, 'bg');

//   var add = this.add;
//   var input = this.input;

// }
