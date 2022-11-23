import EntityAnimations from '../../enums/EntityAnimations';
import { collisionCategories, collisionMaskEverything } from '../../enums/Collisions';
import Entity from '../Entity.js';
import PlayerInput from '../player/PlayerInput';

import MachineGun from '../../weapons/MachineGun';
import BombGlove from '../../weapons/BombGlove';
import HandGun from '../../weapons/HandGun';
import Direction from '../../enums/Direction';

const SPRITESHEETKEY = 'playerSprites';

export default class PlayerEntity extends Entity {
  constructor (scene, x, y) {
    super(
      scene,
      x, y - 100,
      {
        name: 'PlayerEntity', // this becomes this.name
        spriteSheetKey: SPRITESHEETKEY,
        animations: {
          [EntityAnimations.Idle]:   { start:  0, end: 3,  fps: 10 },
          [EntityAnimations.Death]:  { start: 36, end: 38, fps:  1, repeat: 0 },
          [EntityAnimations.Attack]: { start:  0, end: 5,  fps: 15 },
          [EntityAnimations.Hurt]:   { start: 12, end: 13, fps: 10 },
          [EntityAnimations.Walk]:   { start: 24, end: 29, fps: 10 },
        },
        physicsConfig: {
          frictionAir: 0.001,
          bounce: 0.1,
          shape: { type: 'rectangle', width: 14, height: 34 },
          chamfer: { radius: 4 },
        },
        enableKeepUpright: true,
        keepUprightStratergy: 'INSTANT',
        direction: 'RIGHT',
      },
    );

    this.hitbox.onCollideCallback = data => {
      // environmental / fall damage
      const { depth } = data.collision;
      if (depth > 5) this.takeDamage(depth);
    };

    this.playerInput = new PlayerInput(scene);
    this.keys = this.playerInput.keys;

    // weapons
    this.weaponInventory = {
      index: 0,
      weapons: [
        new BombGlove(this.scene, 500),
        new MachineGun(this.scene),
        new HandGun(this.scene),
      ],
    };
    this.weapon = this.weaponInventory.weapons[0];
    this.scene.events.on('cycleWeapon', () => this.cycleWeapons());
    this.keys.fireKey.on('up', () => this.weapon.fireRelease(), this);

    this.playerController = { direction: Direction.Right };
  }

  static preload(scene) {
    scene.load.spritesheet(SPRITESHEETKEY, 'sprites/craftpix.net/biker.png', { frameWidth: 48, frameHeight: 48 });
  }

  cycleWeapons() {
    this.weaponInventory.index++;

    if (this.weaponInventory.index > this.weaponInventory.weapons.length-1) {
      this.weaponInventory.index = 0;
    }
    this.weapon = this.weaponInventory.weapons[this.weaponInventory.index];
  }

  update() {
    super.update();

    if (!this.gameObject.body) return;

    if (this.keys.leftKey.isDown && !this.sensorData.left) this.gameObject.setVelocityX(-2.5);
    if (this.keys.rightKey.isDown && !this.sensorData.right) this.gameObject.setVelocityX(2.5);
    if (this.keys.jumpKey.isDown && this.sensorData.bottom) this.gameObject.setVelocityY(-10);

    if (this.keys.fireKey.isDown) this.weapon.fire();

    // ladder collisions
    if (this.body.velocity.y < -4 || this.keys.downKey.isDown) {
      this.gameObject.setCollidesWith(collisionMaskEverything &~ collisionCategories.ladders); // everything except ladders
    } else {
      this.gameObject.setCollidesWith(collisionMaskEverything);
    }
    
    const { angularVelocity } = this.gameObject.body;
    const speed = Math.hypot(this.gameObject.body.velocity.x, this.gameObject.body.velocity.y);
    const motion = speed + Math.abs(angularVelocity);
    const closeToStationary = motion <= 0.1;
    const isAlive = this.health > 0;

    if (isAlive) {
      // alive
      // when moving play walking animation, otherwise play idle
      this.playAnimation(closeToStationary ? EntityAnimations.Idle : EntityAnimations.Walk);
    } else {
      // dead
      this.gameObject.setCollidesWith(~collisionCategories.enemyDamage);
      this.rotation = 0; // force upright for death animation
      this.text.setText('X');
      this.playAnimation(EntityAnimations.Death).on('animationcomplete', () => {
        this.sprite.destroy();
        this.text.destroy();
        this.destroy();
        this.gameObject.destroy();
      });
    }
  }
}
