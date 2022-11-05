import Phaser from 'phaser'
import Ball from '../objects/Ball'
import Map from "../map/Map";
import Player from "../objects/Player.js";

export default class HelloWorldScene extends Phaser.Scene {
	constructor() {
		super('hello-world')
		this.map = new Map(this,'testLevel', 'tileset.png', 'mapData.json');
		this.player = null;
	}

	preload() {
		this.map.preload();
		this.load.spritesheet('zombieSpriteSheet', 'sprites/zombieSpriteSheet.png', {
			frameWidth: 32,
			frameHeight: 32
		});
		this.load.spritesheet('player', 'https://labs.phaser.io/assets/sprites/dude-cropped.png', { frameWidth: 32, frameHeight: 42 });
	}

	create() {
		this.map.create();
		this.matter.world.setBounds(0,0,this.map.width,this.map.height,30);

		setInterval(() => {
			const b = new Ball(this);
			setTimeout(() => b.destroy(), 3000);
		}, 500);

		this.createPlayer();

		this.createAnimations();
	}

	createPlayer() {
		this.player = new Player(this, 0, 0, 'player', 4);
		this.cam = this.cameras.main;
		console.log(this.map.width);
		console.log(this.map.height);
		this.cam.setBounds(0, 0, this.map.width, this.map.height);
		this.smoothMoveCameraTowards(this.player);

	//	this.player = this.matter.add.sprite(50, 300, 'player');
//		this.player.setBounce(0.1); // our player will bounce from items
	}

	smoothMoveCameraTowards (target, smoothFactor) {
		if (smoothFactor === undefined) { smoothFactor = 0; }
		this.cam.scrollX = smoothFactor * this.cam.scrollX + (1 - smoothFactor) * (target.x - this.cam.width * 0.5);
		this.cam.scrollY = smoothFactor * this.cam.scrollY + (1 - smoothFactor) * (target.y - this.cam.height * 0.5);
	}

	createAnimations() {
		this.anims.create({
			key: "zombieAnim",
			frameRate: 3,
			frames: this.anims.generateFrameNumbers("zombieSpriteSheet", {start: 0, end:8}),
			repeat: -1
		});
	}

	update(time, delta) {
		this.player.update(time, delta);
		this.smoothMoveCameraTowards(this.player, 0.9);
	}
}
