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
  }

  create() {
    super.create();
    if (Config.PLAY_MUSIC) {
      this.audio.playMusic(Sound.MusicKey);
    }
  }

  update(time, delta) {
    super.update(time, delta);
  }
}

// function preload () {
//   this.load.image('bg', 'assets/skies/gradient28.png');
//   this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');
// }

// function create () {
//   this.add.image(400, 300, 'bg');

//   var add = this.add;
//   var input = this.input;

//   WebFont.load({
//       google: {
//           families: [ 'Freckle Face', 'Finger Paint', 'Nosifer' ]
//       },
//       active: function ()
//       {
//           add.text(16, 0, 'The face of the\nmoon was in\nshadow.', { fontFamily: 'Freckle Face', fontSize: 80, color: '#ffffff' }).setShadow(2, 2, "#333333", 2, false, true);
//           add.text(250, 450, 'Waves flung themselves\nat the blue evening.', { fontFamily: 'Finger Paint', fontSize: 40, color: '#5656ee' });

//           var t = add.text(330, 200, 'R.I.P', { fontFamily: 'Nosifer', fontSize: 150, color: '#ff3434' });

//           input.once('pointerdown', function () {
//               t.setFontSize(64);
//           });
//       }
//   });
// }
