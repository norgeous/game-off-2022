import Phaser from 'phaser'

import HelloWorldScene from './HelloWorldScene'

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
  scene: [HelloWorldScene],
}

export default new Phaser.Game(config)
