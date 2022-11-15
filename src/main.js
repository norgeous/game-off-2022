import Phaser from 'phaser'
import Platformer from './scenes/Platformer'
import HelloWorldScene from './scenes/HelloWorldScene'

const config = {
  type: Phaser.AUTO,
  parent: 'app',
  width: window.innerWidth / 2,
  height: window.innerHeight / 2,
  pixelArt: true,
  physics: {
    default: 'matter',
    matter: {
      gravity: { y: 1 },
      debug: true,
    },
  },
  scene: [
    HelloWorldScene,
    Platformer,
  ],
}

export default new Phaser.Game(config)
