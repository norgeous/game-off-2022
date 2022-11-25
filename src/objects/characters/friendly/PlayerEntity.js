import EntityAnimations from '../../enums/EntityAnimations';
import { collisionCategories, collisionMaskEverything } from '../../enums/Collisions';
import Entity from '../Entity.js';
import PlayerInput from '../../components/PlayerInput';
import WeaponInventory from '../../components/WeaponInventory';
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
        direction: Direction.Right,
      },
    );

    this.gameObject.setCollisionCategory(collisionCategories.player);

    this.playerInput = new PlayerInput(scene);
    this.keys = this.playerInput.keys;
    this.playerController = { direction: Direction.Right };
    
    this.weapons = new WeaponInventory(scene, this);
    this.scene.events.on('cycleWeapon', () => this.weapons.next());
  }

  static preload(scene) {
    scene.load.spritesheet(SPRITESHEETKEY, 'sprites/craftpix.net/biker.png', { frameWidth: 48, frameHeight: 48 });
    scene.load.spritesheet('hands', 'sprites/craftpix.net/biker_hands.png', { frameWidth: 32, frameHeight: 32 });
    WeaponInventory.preload(scene);
  }

  update() {
    super.update();

    if (!this.gameObject.body) return;

    if (this.keys.leftKey.isDown) this.direction = Direction.Left;
    if (this.keys.rightKey.isDown) this.direction = Direction.Right;

    if (this.keys.leftKey.isDown && !this.sensorData.left) this.gameObject.setVelocityX(-2);
    if (this.keys.rightKey.isDown && !this.sensorData.right) this.gameObject.setVelocityX(2);
    if (this.keys.jumpKey.isDown && this.sensorData.bottom) this.gameObject.setVelocityY(-9);

    if (this.keys.fireKey.isDown) this.weapons.currentWeapon.pullTrigger();
    if (!this.keys.fireKey.isDown) this.weapons.currentWeapon.releaseTrigger();

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
