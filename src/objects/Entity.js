import Phaser from 'phaser'
import HealthBar from './HealthBar';

export default class Entity extends Phaser.GameObjects.Container {
    constructor (scene, x, y, children) {
        super(scene, x, y, children);

        this.scene = scene;
        this.sprite = null;
        this.spriteObject = {
            defaultFrameRate: 3,
            spriteSheet: ''
        };

        this.health = 100;
        this.healthBar = null;

        this.followPlayer = true;
        this.healthCheck = true;
    }

    loadPhysics(physicsConfig) {
        this.gameObject = this.scene.matter.add.gameObject(this, physicsConfig.options)
            .setFrictionAir(physicsConfig.frictionAir)
            .setBounce(physicsConfig.bounce)
            .setMass(physicsConfig.mass);
    }

    loadSprite() {
        this.sprite = this.scene.add.sprite(0, 0, this.name);
    }

    getKey(key) {
        return this.name + '_' + key;
    }

    addToContainer(array) {
        this.add(array);
        this.scene.add.existing(this);
    }

    createAnimation(key, startFrame, endFrame, frameRate = 3,  repeat = -1) {
        this.scene.anims.create({
            key: this.getKey(key),
            frameRate: frameRate,
            frames: this.sprite.anims.generateFrameNumbers(this.spriteObject.spriteSheet, { start: startFrame, end: endFrame }),
            repeat: repeat
        });
    }

    playAnimation(key, repeat = true) {
        this.sprite.play(this.getKey(key), repeat);
    }

    takeDamage(amount) {
        this.health -= amount;
    }

    update() {
        if (this.healthBar) {
            // (re)draw health bar
            this.healthBar.draw(this.health);
        }

        if (this.healthCheck && this.health <= 0) {
            // kill if zero health
            this.sprite.destroy();
            this.text.destroy();
            this.destroy();
            this.gameObject.destroy();
        }

        if (this.followPlayer) {

        }
    }
}
