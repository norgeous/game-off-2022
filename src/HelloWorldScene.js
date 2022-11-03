import Phaser from 'phaser'

export default class HelloWorldScene extends Phaser.Scene {
	constructor() {
		super('hello-world')
	}

	preload() {
		this.load.image('tileSheet', 'map/Tileset.png')
		this.load.image('tileSheet', 'map/Tileset.png')
		this.load.tilemapTiledJSON('tilemap', 'map/tiledMap.json')

		this.load.spritesheet('zombieSpriteSheet', 'sprites/zombieSpriteSheet.png', {
			frameWidth: 32,
			frameHeight: 32
		});
	}

	create() {
		this.createWorld();

		this.createPlayer();

		this.createAnimations();
	}

	createWorld() {
		const map = this.make.tilemap({ key: 'tilemap' })
		const tileset = map.addTilesetImage('tiles', 'tileSheet')

		const layer3 = map.createLayer('Tile Layer 3', tileset)
		const layer1 = map.createLayer('Tile Layer 1', tileset)
		const layer2 = map.createLayer('Tile Layer 2', tileset)
	}

	createPlayer() {
		this.player = this.physics.add.sprite(50, 300, 'player');
		this.player.setBounce(0.1); // our player will bounce from items
		this.player.setCollideWorldBounds(true); // don't go out of the map
	}

	createAnimations() {
		this.anims.create({
			key: "zombieAnim",
			frameRate: 3,
			frames: this.anims.generateFrameNumbers("zombieSpriteSheet", {start: 0, end:8}),
			repeat: -1
		});
	}

	update() {
		this.player.play('zombieAnim', true);
	}
}
