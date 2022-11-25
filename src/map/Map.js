import {collisionCategories, collisionMaskEverything} from '../objects/enums/Collisions';
import Sound from '../objects/enums/Sound';
import Config from '../objects/Config';
import Direction from "../objects/enums/Direction.js";
import * as phaser from "phaser";

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
    this.playMusicOnStart = true;
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

    this.spawners = {
      player: this.map.findObject('Spawner', obj => obj.name === 'player'),
      zombie: this.map.filterObjects('Spawner', obj => obj.name === 'zombie'),
    };

    let gameObject = this.map.createFromObjects('Spawner', {
      name: 'exit'
    });
    gameObject = this.Phaser.matter.add.gameObject(gameObject[0], {isStatic: true});
    gameObject.setCollisionCategory(collisionCategories.door);
    gameObject.setCollidesWith(collisionCategories.player);

    //this.Phaser.scene.add(this.spawners.exit[0]);

    // base physics object

    this.layers.background.setCollisionByProperty({ collides: true });
    this.layers.foreground.setCollisionByProperty({ collides: true });
    this.layers.ladders.setCollisionByProperty({ collides: true });

    this.Phaser.matter.world.convertTilemapLayer(this.layers.background);
    this.Phaser.matter.world.convertTilemapLayer(this.layers.foreground);
    this.Phaser.matter.world.convertTilemapLayer(this.layers.ladders);

    // now that matter has loaded the layers, set collision categories on tile bodies
    this.layers.ladders.forEachTile(tile => {
      if (tile.index === -1) return;
      tile.physics.matterBody.setCollisionCategory(collisionCategories.ladders);
    });
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

    this.height = this.layers.background.height;
    this.width = this.layers.background.width;

    if (Config.PLAY_MUSIC) {
      this.Phaser.sound.play(Sound.MusicKey);
    }
  }
}
