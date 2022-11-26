import Phaser from 'phaser'
import Platformer from './scenes/Platformer'
import HelloWorldScene from './scenes/HelloWorldScene'
import Config from './objects/Config';
import Area1 from "./scenes/theForest/Area1.js";
import Area2 from "./scenes/theForest/Area2.js";
import Area3 from "./scenes/theForest/Area3.js";
import Area4 from "./scenes/theForest/Area4.js";

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
  },
  scene: [
    Area1,
    Area3,
    Area2,
    Area4,
    HelloWorldScene,
  ],
}

export default new Phaser.Game(config)
