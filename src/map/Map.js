import {collisionCategories, collisionMaskEverything} from '../objects/enums/Collisions';
import Sound from '../objects/enums/Sound';
import MovingPlatform from '../objects/components/map/MovingPlatform';

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

    this.spawners = {
      player: this.map.findObject('Spawner', obj => obj.name === 'player'),
      zombie: this.map.filterObjects('Spawner', obj => obj.name === 'zombie'),
    };
    this.door = this.map.createFromObjects('Spawner', {
      name: 'exit'
    });
    this.door = this.Phaser.matter.add.gameObject(this.door[0], {isStatic: true});
    this.door.setCollisionCategory(collisionCategories.door);
    this.door.setCollidesWith(collisionCategories.player);


    // moving platforms
    this.movingPlatforms = {
      start: this.map.findObject('MovingPlatform', obj => obj.name === 'Start'),
      end: this.map.findObject('MovingPlatform', obj => obj.name === 'End'),
    };
    if (this.movingPlatforms.start) {
      let dif = -(this.movingPlatforms.start.y - this.movingPlatforms.end.y);
      this.platform = new MovingPlatform(this.Phaser, this.movingPlatforms.start.x, this.movingPlatforms.start.y, 'floatingPlatform', {
        isStatic: true
      })
      this.platform.moveVertically(dif, 8000);
    }


  //  this.obj = this.map.createFromObjects('MovingPlatform', {  name: 'Start'});
    //this.obj = this.Phaser.matter.add.gameObject(this.obj[0], {isStatic: true});
  //  this.obj.setCollisionCategory(collisionCategories.movingPlatforms);
   // this.obj.setCollidesWith(collisionCategories.player);
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
  }
}
