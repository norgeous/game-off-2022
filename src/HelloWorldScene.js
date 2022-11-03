import Phaser from 'phaser'
import Ball from './objects/Ball'

export default class HelloWorldScene extends Phaser.Scene {
	constructor() {
		super('hello-world')
	}

	preload() {
		this.load.image('tileSheet', 'map/Tileset.png')
		this.load.tilemapTiledJSON('tilemap', 'map/tiledMap.json')
	}

	create() {
    this.matter.world.setBounds(0,0,400,400,30);
		this.createWorld();
		new Ball(this);
		new Ball(this);
	}

	createWorld() {
		const map = this.make.tilemap({ key: 'tilemap' })
		const tileset = map.addTilesetImage('tiles', 'tileSheet')

		map.createLayer('Tile Layer 3', tileset)
		map.createLayer('Tile Layer 1', tileset)
		map.createLayer('Tile Layer 2', tileset)
	}
}
