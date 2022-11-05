import Phaser from 'phaser'
import Ball from '../objects/Ball'

export default class HelloWorldScene extends Phaser.Scene {
	constructor() {
		super('hello-world')
	}

	preload() {
		this.load.image('tileSheet', 'map/Tileset.png')
		this.load.tilemapTiledJSON('tilemap', 'map/tiledMap.json')

		this.load.spritesheet('zombieSpriteSheet', 'sprites/zombieSpriteSheet.png', {
			frameWidth: 32,
			frameHeight: 32
		});
	}

	create() {
    this.matter.world.setBounds(0,0,928,640,30);

		this.createWorld();

		setInterval(() => {
			const b = new Ball(this);
			this.createPlayer();
			setTimeout(() => b.destroy(), 3000);
		}, 500);

		this.createPlayer();

		this.createAnimations();
	}

	createWorld() {
		const map = this.make.tilemap({ key: 'tilemap' })
		const tileset = map.addTilesetImage('tiles', 'tileSheet')

		const layer3 = map.createLayer('Tile Layer 3', tileset)
		const layer1 = map.createLayer('Tile Layer 1', tileset)
		const layer2 = map.createLayer('Tile Layer 2', tileset)

		layer1.setCollisionByProperty({ collides: true });
		layer2.setCollisionByProperty({ collides: true });
		// layer3.setCollisionByProperty({ collides: true });

		this.matter.world.convertTilemapLayer(layer1);
		this.matter.world.convertTilemapLayer(layer2);
		// this.matter.world.convertTilemapLayer(layer3);
	}

	createPlayer() {
		this.player = this.matter.add.sprite(50, 300, 'player');
		this.player.setBounce(0.1); // our player will bounce from items
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
