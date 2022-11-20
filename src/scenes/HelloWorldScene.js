import Phaser from 'phaser';
import Map from '../map/Map';
import PlayerEntity from '../objects/characters/enemies/PlayerEntity';
import Zombie from '../objects/characters/enemies/Zombie';
import Sound from '../objects/enums/Sound';
import Audio from '../objects/Audio';

const MAX_ZOMBIES = 10;

export default class HelloWorldScene extends Phaser.Scene {
  constructor() {
    super('hello-world')
    this.map = new Map(this, 'testLevel', 'tileset_extruded.png', 'mapData.json', 8);
    this.player = null;
    this.audio = new Audio(this);
  }

  preload() {
    this.map.preload();
    
    Zombie.preload(this);
    PlayerEntity.preload(this);
    // Bullet.preload(this);
    // Explosion.preload(this);
    this.load.image('bullet1', 'https://labs.phaser.io/assets/sprites/bullets/bullet1.png');
    this.load.spritesheet('explosion', 'sprites/explosion.png', { frameWidth: 256, frameHeight: 256 });
    this.load.audio(Sound.MusicKey, `${this.map.getMapPath()}/${Sound.MapMusicFileName}`);
    this.audio.preLoad();
  }

  create() {
    // resize game on window resize
    window.addEventListener('resize', () => {
      setTimeout(() => {
        this.scale.setGameSize(window.innerWidth / 3, window.innerHeight / 3);
      }, 100);
    });

    this.matter.world.drawDebug = true;
    this.matter.world.setBounds(0, 0, this.map.width, this.map.height, 30);

    this.map.create();
    this.audio.create();

    // zombie spawners
		this.zombieGroup = this.add.group({
      maxSize: MAX_ZOMBIES,
      classType: Zombie,
      runChildUpdate: true,
    });
    setInterval(() => {
      this.map.spawners.zombie.forEach(zombie => {
        this.zombieGroup.get(zombie.x + 16, zombie.y - 16); // get = create
      });
    }, 1000);
    
    // this.createPlayer();
    this.playerEntity = new PlayerEntity(this, this.map.spawners.player.x + 16, this.map.spawners.player.y - 16);


    this.cameras.main.setBounds(0, 0, this.map.width, this.map.height);
    this.smoothMoveCameraTowards(this.playerEntity, 0); // snap to player
  }

  smoothMoveCameraTowards (target, smoothFactor = 0) {
    const cam = this.cameras.main;
    cam.scrollX = smoothFactor * cam.scrollX + (1 - smoothFactor) * (target.x - cam.width * 0.5);
    cam.scrollY = smoothFactor * cam.scrollY + (1 - smoothFactor) * (target.y - cam.height * 0.5);
  }

  update() {
    // this.player.update(time, delta);
    this.playerEntity.update();
    this.smoothMoveCameraTowards(this.playerEntity, 0.9);
  }
}
