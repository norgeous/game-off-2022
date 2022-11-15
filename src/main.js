import Phaser from 'phaser'
import Platformer from './scenes/Platformer'
import HelloWorldScene from './scenes/HelloWorldScene'

const config = {
  type: Phaser.AUTO,
  parent: 'app',
  width: window.innerWidth / 4,
  height: window.innerHeight / 4,
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
