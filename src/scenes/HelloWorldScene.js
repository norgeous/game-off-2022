import Phaser from 'phaser'
import Ball from '../objects/Ball'
import Map from "../map/Map";

export default class HelloWorldScene extends Phaser.Scene {
	constructor() {
		super('hello-world')
		this.map = new Map(this,'testLevel', 'tileset.png', 'mapData.json');
	}

	preload() {
		this.map.preload();
		this.load.spritesheet('zombieSpriteSheet', 'sprites/zombieSpriteSheet.png', {
			frameWidth: 32,
			frameHeight: 32
		});
	}

	create() {
		this.map.create();
		this.matter.world.setBounds(0,0,this.map.width,this.map.height,30);
		setInterval(() => {
			const b = new Ball(this);
			this.createPlayer();
			setTimeout(() => b.destroy(), 3000);
		}, 500);

		this.createPlayer();

		this.createAnimations();
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
