import Phaser from 'phaser'
import Platformer from './scenes/Platformer'
import HelloWorldScene from './scenes/HelloWorldScene'
import LevelWithSpawnPoints from './scenes/LevelWithSpawnPoints'

const config = {
  type: Phaser.AUTO,
  parent: 'app',
  width: 928,
  height: 640,
  physics: {
    default: 'matter',
    matter: {
      gravity: { y: 1 },
      debug: true,
    },
  },
  scene: [
    LevelWithSpawnPoints,
    HelloWorldScene,
    Platformer,
  ],
}

export default new Phaser.Game(config)
