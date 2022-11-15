import Phaser from 'phaser'
import Map from '../map/Map';
import Player from '../objects/player/Player';
import Zombie from '../objects/Zombie';

export default class HelloWorldScene extends Phaser.Scene {
  constructor() {
    super('hello-world')
    this.map = new Map(this,'testLevel', 'tileset_extruded.png', 'mapData.json');
    this.player = null;
  }

  preload() {
    this.map.preload();
    this.load.spritesheet('zombieSpriteSheet', 'sprites/zombieSpriteSheet.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('player', 'https://labs.phaser.io/assets/sprites/dude-cropped.png', { frameWidth: 32, frameHeight: 42 });
  }

  create() {
    // resize game on window resize
    window.addEventListener('resize', () => {
      setTimeout(() => {
        this.scale.setGameSize(window.innerWidth / 4, window.innerHeight / 4);
      }, 100);
    });

    this.map.create();
    this.matter.world.setBounds(0, 0, this.map.width, this.map.height, 30);

    this.zombieGroup = this.add.group();
    this.map.spawners.zombie.forEach(zombie => {
      this.zombieGroup.add(new Zombie(this, zombie.x+16, zombie.y-16));
    });

    setInterval(() => {
      this.map.spawners.zombie.forEach(zombie => {
        this.zombieGroup.add(new Zombie(this, zombie.x+16, zombie.y-16));
      });
    }, 600);
    
    this.createPlayer();
  }

  createPlayer() {
    this.player = new Player(this, this.map.spawners.player.x+16, this.map.spawners.player.y-16, 'player', 4);
    console.log(this.player)
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
