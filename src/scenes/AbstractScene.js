import Phaser from 'phaser';
import Map from '../map/Map';
import PlayerEntity from '../objects/characters/friendly/PlayerEntity';
import Zombie from '../objects/characters/enemy/Zombie';
import Sound from '../objects/enums/Sound';
import Audio from '../objects/Audio';
import Config from '../objects/Config.js';

const MAX_ZOMBIES = 10;

export default class AbstractScene extends Phaser.Scene {
  constructor(sceneName) {
    super(sceneName)
    this.map = null;
    this.player = null;
    this.audio = new Audio(this);
    this.spawner = null;
  }

  preload() {
    this.map?.preload();
    Zombie.preload(this);
    PlayerEntity.preload(this);
    this.load.image('bullet1', 'https://labs.phaser.io/assets/sprites/bullets/bullet1.png');
    this.load.image('floatingPlatform', 'sprites/floatingPlatform.png');
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

    // matter debug
    this.matter.world.drawDebug = Config.DRAW_DEBUG;
    this.input.keyboard.on('keydown-ALT', () => {
      this.matter.world.drawDebug = !this.matter.world.drawDebug;
      this.matter.world.debugGraphic.visible = this.matter.world.drawDebug;
    }, this);

    // world bounds
    this.matter.world.setBounds(0, 0, this.map.width, this.map.height, 30);

    // load Tiled map
    this.map.create();

    // load audio
    this.audio.create();

    // zombie spawners
    this.zombieGroup = this.add.group({
      maxSize: MAX_ZOMBIES,
      classType: Zombie,
      runChildUpdate: true,
    });
    if (Config.SPAWN_ENEMIES) {
      // is this optimal now we're on mobile? every spawn point will be checking if in range of player.
      // better solution would be for the player to check if in range of spawn points.
      this.spawner = setInterval(() => {
        this.map.spawners.zombie.forEach(zombie => {
          const isInPlayerRange = Phaser.Math.Distance.BetweenPoints(zombie, this.player) <= Config.SPAWN_RANGE;
          if (isInPlayerRange) {
            this.zombieGroup.get(zombie.x + 16, zombie.y - 16); // get = create
          }
        });
      }, Config.ZOMBIE_SPAWN_TIME);
    }

    // new player
    this.player = new PlayerEntity(this, this.map.spawners.player.x + 16, this.map.spawners.player.y - 16);

    // camera
    this.cameras.main.setBounds(0, 0, this.map.width, this.map.height);
    this.smoothMoveCameraTowards(this.player, 0); // snap to player
  }

  smoothMoveCameraTowards (target, smoothFactor = 0) {
    if (!target.body) return;
    const cam = this.cameras.main;
    cam.scrollX = smoothFactor * cam.scrollX + (1 - smoothFactor) * (target.x - cam.width * 0.5);
    cam.scrollY = smoothFactor * cam.scrollY + (1 - smoothFactor) * (target.y - cam.height * 0.5);
  }

  update(time, delta) {
    this.player.update();
    this.smoothMoveCameraTowards(this.player, 0.9);
  }
}
