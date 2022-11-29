import Phaser from 'phaser';
// import Map from '../map/Map';
import PlayerEntity from '../objects/characters/friendly/PlayerEntity';
import Zombie from '../objects/characters/enemy/Zombie';
import Sound from '../objects/enums/Sound';
import Audio from '../objects/Audio';
import Config from '../objects/Config';
import ScratchFont from '../objects/overlays/ScratchFont';
import BloodFont from '../objects/overlays/BloodFont';

const MAX_ZOMBIES = 10;

export default class AbstractScene extends Phaser.Scene {
  constructor(sceneName) {
    super(sceneName)
    this.map = null;
    this.player = null;
    this.audio = new Audio(this);
    this.spawner = null;
    this.startText = 'Abstract Scene';
  }

  init (data) {
    this.loadedPlayer = data.player ?? null;
  }

  preload() {
    ScratchFont.preload(this);
    BloodFont.preload(this);
    this.map?.preload();
    Zombie.preload(this);
    PlayerEntity.preload(this);
    this.load.image('bullet1', 'https://labs.phaser.io/assets/sprites/bullets/bullet1.png');
    this.load.image('floatingPlatform', 'sprites/floatingPlatform.png');
    this.load.spritesheet('explosion', 'sprites/explosion.png', { frameWidth: 256, frameHeight: 256 });
    this.load.audio(Sound.MusicKey, `${this.map.getMapPath()}/${Sound.MapMusicFileName}`);
    this.load.audio(Sound.PLAYER_NO_WEAPON_SOUND, 'sounds/toy-horn.mp3');
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
    if (this.loadedPlayer) this.player.setPlayer(this.loadedPlayer);
    this.player.playerScoreGUI();

    // camera
    this.cameras.main.setBounds(0, 0, this.map.width, this.map.height);
    this.smoothMoveCameraTowards(this.player, 0); // snap to player
    this.displayMapName();
  }

  smoothMoveCameraTowards (target, smoothFactor = 0) {
    if (!target.body) return;
    const cam = this.cameras.main;
    cam.scrollX = smoothFactor * cam.scrollX + (1 - smoothFactor) * (target.x - cam.width * 0.5);
    cam.scrollY = smoothFactor * cam.scrollY + (1 - smoothFactor) * (target.y - cam.height * 0.6);
  }

  displayMapName() {
    const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
    const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;
    this.text = this.add.text(screenCenterX, screenCenterY, this.startText, {
      fixedWidth: this.cameras.main.width,
      fontSize: '20px',
      padding: { x: 20, y: 10 },
      backgroundColor: '#ffffff88',
      color: '#00000099',
      align: 'center',
    }).setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(Config.UI_DEPTH);
    this.text.alpha = 0.1;
    this.tweens.addCounter({
      from: 1,
      to: 0,
      duration: Config.DISPLAY_MAP_NAME_TIME_MS,
      ease: Phaser.Math.Easing.Sine.InOut,
      repeat: 0,
      onUpdate: (tween, target) => {
        this.text.alpha = target.value;
      },
      onComplete: () => {
        this.text.destroy();
      }
    })
  }

  update(time, delta) {
    this.player.update();
    this.smoothMoveCameraTowards(this.player, 0.95);
  }
}
