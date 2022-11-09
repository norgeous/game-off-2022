import Phaser from 'phaser'
import Map from '../map/Map';
import Ball from '../objects/Ball';
import Player from '../objects/Player.js';
import Zombie from '../objects/Zombie.js';

export default class LevelWithSpawnPoints extends Phaser.Scene {
  constructor() {
    super('LevelWithSpawnPoints')
    this.map = new Map(this, 'levelWithSpawnPoints', 'tileset.png', 'mapData.json');
    this.player = null;
  }

  preload() {
    this.map.preload();
    this.load.spritesheet('zombieSpriteSheet', 'sprites/zombieSpriteSheet.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('player', 'https://labs.phaser.io/assets/sprites/dude-cropped.png', { frameWidth: 32, frameHeight: 42 });
  }

  create() {
    this.map.create();
    this.matter.world.setBounds(0,0,this.map.width,this.map.height,30);

		this.zombieGroup = this.add.group();
    this.map.spawners.zombie.forEach(zombie => {
      this.zombieGroup.add(new Zombie(this, zombie.x, zombie.y-16));
    });
    
    this.createPlayer();
  }

  createPlayer() {
    this.player = new Player(this, this.map.spawners.player.x, this.map.spawners.player.y-16, 'player', 4);
    this.cam = this.cameras.main;

    this.cam.setBounds(0, 0, this.map.width, this.map.height);
    this.smoothMoveCameraTowards(this.player);
  }

  smoothMoveCameraTowards (target, smoothFactor) {
    if (smoothFactor === undefined) { smoothFactor = 0; }
    this.cam.scrollX = smoothFactor * this.cam.scrollX + (1 - smoothFactor) * (target.x - this.cam.width * 0.5);
    this.cam.scrollY = smoothFactor * this.cam.scrollY + (1 - smoothFactor) * (target.y - this.cam.height * 0.5);
  }

  update(time, delta) {
    this.player.update(time, delta);
    this.zombieGroup.getChildren().forEach(zombie => zombie.update());
    this.smoothMoveCameraTowards(this.player, 0.9);
  }
}
