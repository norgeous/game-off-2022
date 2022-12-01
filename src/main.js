import Phaser from 'phaser'
import Config from './objects/Config';
import MainMenu from './scenes/MainMenu';
import Area1 from './scenes/theForest/Area1';
import Area2 from './scenes/theForest/Area2';
import Area3 from './scenes/theForest/Area3';
import Area4 from './scenes/theForest/Area4';
import Area51 from './scenes/theForest/Area51';

const config = {
  type: Phaser.AUTO,
  parent: 'app',
  width: window.innerWidth / 3,
  height: window.innerHeight / 3,
  pixelArt: true,
  physics: {
    default: 'matter',
    matter: {
      gravity: Config.GRAVITY,
      debug: true,
    },
    fps: {
      target: 30,
    },
  },
  input: {
    activePointers: 3, // enable multi touch
  },
  scene: [
    MainMenu,
    Area1,
    Area2,
    Area3,
    Area4,
    Area51,
  ],
}

export default new Phaser.Game(config)
