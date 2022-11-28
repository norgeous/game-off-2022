import {collisionCategories, collisionMaskEverything} from '../objects/enums/Collisions';
import Sound from '../objects/enums/Sound';
import MovingPlatform from "../objects/components/map/MovingPlatform.js";
import Config from "../objects/Config.js";

export default class Map {
  root = 'map';
  tilesSheet;
  tileMap;
  layers = {};
  height;
  width;
  map;
  tileset;

  constructor(Phaser, mapFolderName = '', tileSheetName = '', mapDataName = '', backgroundCount = 1) {
    this.Phaser = Phaser;
    this.fileNames = {
      map: mapFolderName ?? 'test',
      tileSheet: tileSheetName ?? 'tileset.png',
      mapData: mapDataName ?? 'mapData.json',
      background: 'backgrounds',
      musicFile: Sound.MapMusicFileName
    };
    this.mapKey = `${mapFolderName}-${mapDataName}`;
    this.tileSetName = 'tiles' // TileSet name set in the Tiled program.
    this.parallax = {
      backgroundCount: backgroundCount,
    }
  }

  // Must be called inside a scene's preLoad()
  preload() {
    this.loadTileSheet();
    this.loadBackgroundImages();
    this.loadMapData();
  }

  getMapPath() {
    return this.root + '/' + this.fileNames.map;
  }

  getMusicPath() {
    return `${this.root}/${this.fileNames.musicFile}`;
  }

  getBackgroundPath() {
    return `${this.root}/${this.fileNames.map}/${this.fileNames.background}`;
  }

  getTileSheetPath() {
    return this.getMapPath() + '/' + this.fileNames.tileSheet;
  }

  getMapDataPath() {
    return this.getMapPath() + '/' + this.fileNames.mapData;
  }

  // Must be called inside a scene's preLoad()
  loadTileSheet(key = 'tileSheet') {
    this.tilesSheet = this.Phaser.load.image(key, this.getTileSheetPath());
  }

  loadBackgroundImages() {
    for (let x=1; x <= this.parallax.backgroundCount; x++) {
      this.Phaser.load.image(`background${x}`, `${this.getBackgroundPath()}/${x}.png`);
    }
  }
  // Must be called inside a scene's preLoad()
  loadMapData() {
    this.tileMap = this.Phaser.load.tilemapTiledJSON(this.mapKey, this.getMapDataPath());
  }

  loadLayers() {
    this.layers.backgroundColour = this.map.createLayer('BackgroundColour', this.tileset)
    this.layers.background = this.map.createLayer('Background', this.tileset)
    this.layers.foreground = this.map.createLayer('Forground', this.tileset)
    this.layers.ladders = this.map.createLayer('Ladders', this.tileset)
    this.layers.toxicDamage = this.map.createLayer('ToxicDamage', this.tileset)

    this.spawners = {
      player: this.map.findObject('Spawner', obj => obj.name === 'player'),
      zombie: this.map.filterObjects('Spawner', obj => obj.name === 'zombie'),
      exit: this.map.filterObjects('Spawner', obj => obj.name === 'exit'),
    };

    this.layers.background.setCollisionByProperty({ collides: true });
    this.layers.foreground.setCollisionByProperty({ collides: true });
    this.layers.ladders.setCollisionByProperty({ collides: true });
    this.layers.toxicDamage.setCollisionByProperty({ collides: true });

    this.layers.toxicDamage.setDepth(Config.IN_FRONT_OF_PLAYER);

    this.Phaser.matter.world.convertTilemapLayer(this.layers.background);
    this.Phaser.matter.world.convertTilemapLayer(this.layers.foreground);
    this.Phaser.matter.world.convertTilemapLayer(this.layers.ladders);
    this.Phaser.matter.world.convertTilemapLayer(this.layers.toxicDamage);

    this.setCollisionCateegoryOnLayer(this.layers.ladders, collisionCategories.ladders);
    this.setCollisionCateegoryOnLayer(this.layers.toxicDamage, collisionCategories.toxicDamage);
  }

  setCollisionCateegoryOnLayer(layer, collisionCategory) {
    layer.forEachTile(tile => {
      if (tile.physics.matterBody === undefined) return;
      tile.physics.matterBody.setCollisionCategory(collisionCategory);
    });
  }
  loadDoors() {
    this.door = this.Phaser.add.sprite(
      this.spawners.exit[0].x,
      this.spawners.exit[0].y,
    );
    let emitter = this.Phaser.add.particles('explosion');
    emitter.createEmitter({
      x: this.spawners.exit[0].x, y: this.spawners.exit[0].y,
      lifespan: {min: 100, max: 1000},
      angle: { start: 0, end: 360, steps: 360 },
      speed: 80,
      quantity: 8,
      scale: { start: 0.4, end: 0 },
      blendMode: 'ADD',
    });
    emitter.setDepth(Config.PARTICLE_EFFECT_DEPTH);

    this.door = this.Phaser.matter.add.gameObject(this.door, {isStatic: true});
    this.door.setScale(2);
    this.door.body.loadLevel = this.spawners.exit[0].properties[0].value;
    this.door.setCollisionCategory(collisionCategories.door);
    this.door.setCollidesWith(collisionCategories.player);

  }

  loadMovingPlatforms() {
    this.movingPlatforms = {
      start: this.map.filterObjects('MovingPlatform', obj => obj.name === 'Start'),
      end: this.map.filterObjects('MovingPlatform', obj => obj.name === 'End'),
    };

    if (this.movingPlatforms.start) {
      this.movingPlatforms.start.forEach((element, index, array) => {
        const start = element;
        const end = this.movingPlatforms.end[index];
        let duration = Config.FLOATING_PLATFORM_DEFAULT_TIME;
        if (start.properties) {
          // requires duration to always be first in phaser. object/array manipulation would be better to grab all objects with key name == 'duration'
          duration = start.properties[0].value;
        }
        let imageKey;
        if (start.properties) {
          imageKey = start.properties[1].value ? '' : Config.FLOATING_PLATFORM_DEFAULT_IMAGE_KEY;
        }
        if (start && end) {
          let dif = -(start.y - end.y);
          this.platform = new MovingPlatform(this.Phaser, start.x, start.y, imageKey, {
            isStatic: true
          }, -(start.y - end.y), duration)
        }
      })
    }
  }

  loadBackgrounds() {
    const width = this.Phaser.scale.width
    const height = this.Phaser.scale.height
    for (let x=1; x <= this.parallax.backgroundCount; x++) {
      let scrollFactorX = 0.01 + (x/20);
      let scrollFactorY = 0.01 + (x/50);
      this.Phaser.add.image(width, height, `background${x}`)
        .setOrigin(0,0)
        .setScrollFactor(scrollFactorX, scrollFactorY)
        .setPosition(0,0)
        .setSize(width, height)
    }
  }

  create() {
    this.map = this.Phaser.make.tilemap({ key:  this.mapKey })
    this.tileset = this.map.addTilesetImage(this.tileSetName, 'tileSheet', 32, 32, 1, 2)
    this.loadBackgrounds();
    this.loadLayers();
    this.loadDoors();
    this.loadMovingPlatforms();

    this.height = this.layers.background.height;
    this.width = this.layers.background.width;
  }
}
