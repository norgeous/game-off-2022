import Phaser from 'phaser'
import Player from '../objects/characters/Player_old';
import Ball from '../objects/projectiles/Bomb';
import Zombie from '../objects/characters/enemy/Zombie';

export default class Platformer extends Phaser.Scene {
  constructor() {
    super('Platformer')
    this.playerController = null;
    this.cursors = null;
    this.text = null;
    this.cam = null;
    this.smoothedControls = null;
  }

  preload() {
    this.load.tilemapTiledJSON('map', 'https://labs.phaser.io/assets/tilemaps/maps/matter-platformer.json');
    this.load.image('kenney_redux_64x64', 'https://labs.phaser.io/assets/tilemaps/tiles/kenney_redux_64x64.png');
    this.load.spritesheet('player', 'https://labs.phaser.io/assets/sprites/dude-cropped.png', { frameWidth: 32, frameHeight: 42 });
    this.load.image('box', 'https://labs.phaser.io/assets/sprites/box-item-boxed.png');
    this.load.spritesheet('zombieSpriteSheet', 'sprites/zombieSpriteSheet.png', {
      frameWidth: 32,
      frameHeight: 32
    });
  }

  create() {
    var map = this.make.tilemap({ key: 'map' });
    var tileset = map.addTilesetImage('kenney_redux_64x64');
    var layer = map.createLayer(0, tileset, 0, 0);

    // Set up the layer to have matter bodies. Any colliding tiles will be given a Matter body.
    map.setCollisionByProperty({ collides: true });
    this.matter.world.convertTilemapLayer(layer);

    this.matter.world.setBounds(map.widthInPixels, map.heightInPixels);
    this.matter.world.createDebugGraphic();
    this.matter.world.drawDebug = false;

    this.matter.add.image(630, 750, 'box');
    this.matter.add.image(630, 650, 'box');
    this.matter.add.image(630, 550, 'box');

    this.player = new Player(this, 0, 0, 'player', 4);
    this.zombie = new Zombie(this, 500, 300);
    new Ball(this);

    this.cam = this.cameras.main;
    this.cam.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.smoothMoveCameraTowards(this.player);

    this.text = this.add.text(16, 16, '', {
      fontSize: '20px',
      padding: { x: 20, y: 10 },
      backgroundColor: '#ffffff77',
      color: '#00000077',
    });
    this.text.setScrollFactor(0);
    this.updateText();
  }

  update (time, delta) {
    this.player.update(time, delta);
    this.zombie.update();
    this.smoothMoveCameraTowards(this.player, 0.9);
    this.updateText();
  }

  updateText () {
    this.text.setText([
        'Arrow keys to move. Press "Up" to jump.',
        'You can wall jump!',
        'Click to toggle rendering Matter debug.',
        'Debug:',
        '\tBottom blocked: ' + this.player.playerController.blocked.bottom,
        '\tLeft blocked: ' + this.player.playerController.blocked.left,
        '\tRight blocked: ' + this.player.playerController.blocked.right
    ]);
  }

  smoothMoveCameraTowards (target, smoothFactor) {
    if (smoothFactor === undefined) { smoothFactor = 0; }
    this.cam.scrollX = smoothFactor * this.cam.scrollX + (1 - smoothFactor) * (target.x - this.cam.width * 0.5);
    this.cam.scrollY = smoothFactor * this.cam.scrollY + (1 - smoothFactor) * (target.y - this.cam.height * 0.5);
  }
}
