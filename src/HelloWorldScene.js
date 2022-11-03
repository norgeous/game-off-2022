import Phaser from 'phaser'

export default class HelloWorldScene extends Phaser.Scene {
	constructor() {
		super('hello-world')
	}

	preload() {
		this.load.image('tileSheet', 'map/Tileset.png')
		this.load.tilemapTiledJSON('tilemap', 'map/tiledMap.json')
	}

	create() {
		this.createWorld();
	}

	createWorld() {
		const map = this.make.tilemap({ key: 'tilemap' })
		const tileset = map.addTilesetImage('tiles', 'tileSheet')

		map.createLayer('Tile Layer 3', tileset)
		map.createLayer('Tile Layer 1', tileset)
		map.createLayer('Tile Layer 2', tileset)
	}
}
