import Phaser from 'phaser'
import Map from '../map/Map';
import Player from '../objects/player/Player';
import Zombie from '../objects/Zombie';
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
    this.load.spritesheet('player', 'https://labs.phaser.io/assets/sprites/dude-cropped.png', { frameWidth: 32, frameHeight: 42 });
    this.load.spritesheet('zombieSpriteSheet', 'sprites/zombieSpriteSheet.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('mummy', 'https://labs.phaser.io/assets/sprites/metalslug_mummy37x45.png', { frameWidth: 37, frameHeight: 45 });
    this.load.image('bullet1', 'https://labs.phaser.io/assets/sprites/bullets/bullet1.png');
    this.load.spritesheet('explosion', 'sprites/explosion.png', { frameWidth: 256, frameHeight: 256 });
    this.load.audio(Sound.MusicKey, `${this.map.getMapPath()}/${Sound.MapMusicFileName}`);
    this.load.audio(Sound.BombBlast, '/sounds/musket-explosion.mp3');
    this.load.audio(Sound.MachineGunFire, '/sounds/gun-burst.mp3');
    this.load.audio(Sound.GunBurst, '/sounds/machine-gun.mp3');
    this.load.audio(Sound.Pistol, '/sounds/pistol.wav');
  }

  create() {
    // resize game on window resize
    window.addEventListener('resize', () => {
      setTimeout(() => {
        this.scale.setGameSize(window.innerWidth / 3, window.innerHeight / 3);
      }, 100);
    });

    this.matter.world.drawDebug = false;

    this.map.create();
    this.audio.createMusic(Sound.MusicKey);
    //this.audio.playMusic(Sound.MusicKey);
    this.audio.createSfx(Sound.BombBlast);
    this.audio.createSfx(Sound.MachineGunFire);
    this.audio.createSfx(Sound.GunBurst);
    this.audio.createSfx(Sound.Pistol);
    //this.audio.playSfx('bomb_blast');
    this.matter.world.setBounds(0, 0, this.map.width, this.map.height, 30);

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
    
    this.createPlayer();
  }

  createPlayer() {
    this.player = new Player(this, this.map.spawners.player.x+16, this.map.spawners.player.y-16, 'player', 4);
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
    this.smoothMoveCameraTowards(this.player, 0.9);
  }
}
