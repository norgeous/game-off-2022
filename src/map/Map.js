import Phaser from 'phaser'

export default class Map {

    root = 'map';
    tilesSheet;
    tileMap;
    layers = {};
    height;
    width;
    map;
    tileset;

    constructor(Phaser, mapFolderName = '', tileSheetName = '', mapDataName = '') {
        this.Phaser = Phaser;
        this.fileNames = {
            map: mapFolderName ?? 'test',
            tileSheet: tileSheetName ?? 'tileset.png',
            mapData: mapDataName ?? 'mapData.json'
        };
        this.tileSetName = 'tiles' // TileSet name set in the Tiled program.
    }

    getMapPath() {
        return this.root + '/' + this.fileNames.map;
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

    // Must be called inside a scene's preLoad()
    loadMapData(key = 'tilemap') {
        this.tileMap = this.Phaser.load.tilemapTiledJSON(key, this.getMapDataPath());
    }

    loadLayers() {
        this.layers.backgroundColour = this.map.createLayer('BackgroundColour', this.tileset)
        this.layers.forground = this.map.createLayer('Forground', this.tileset)
        this.layers.background = this.map.createLayer('Background', this.tileset)

        this.layers.background.setCollisionByProperty({ collides: true });
        this.layers.forground.setCollisionByProperty({ collides: true });

        this.Phaser.matter.world.convertTilemapLayer(this.layers.background);
        this.Phaser.matter.world.convertTilemapLayer( this.layers.forground);
    }

    // Must be called inside a scene's preLoad()
    preload() {
        this.loadTileSheet();
        this.loadMapData();
    }

    create() {
        this.map = this.Phaser.make.tilemap({ key:  'tilemap'})
        this.tileset = this.map.addTilesetImage(this.tileSetName, 'tileSheet', 32, 32, 1, 2)

        this.loadLayers();

        this.height = this.layers.background.height;
        this.width = this.layers.background.width;
    }
}
