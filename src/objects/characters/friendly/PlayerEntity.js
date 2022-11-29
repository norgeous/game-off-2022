import Entity from '../Entity';
import EntityAnimations from '../../enums/EntityAnimations';
import { collisionCategories, collisionMaskEverything } from '../../enums/Collisions';
import WeaponInventory from '../../components/WeaponInventory';
import Config from '../../Config';
import Events from '../../enums/Events';
import VirtualJoypad from '../../components/VirtualJoypad';
import BloodFont from "../../overlays/BloodFont.js";
import GameOver from '../../overlays/GameOver';

const SPRITESHEETKEY = 'playerSprites';

const directionTocraftpixArmFrame = d => ({
  // down
  '0:1': {
    arm: 0,
    gunX: 11,
    gunY: 6,
    gunR: Math.PI/2,
  },

  // down right
  '1:1': {
    arm: 1,
    gunX: 16,
    gunY: 0,
    gunR: Math.PI/4,
  },

  // right
  '1:0': {
    arm: 2,
    gunX: 17,
    gunY: -9,
    gunR: 0,
  },
  '0:0': {
    arm: 2,
    gunX: 17,
    gunY: -9,
    gunR: 0,
  },

  // up right
  '1:-1': {
    arm: 3,
    gunX: 11,
    gunY: -15,
    gunR: -Math.PI/4,
  },

  // up
  '0:-1': {
    arm: 4,
    gunX: 4,
    gunY: -16,
    gunR: -Math.PI/2,
  },
})[`${Math.abs(d.x)}:${d.y}`];

export default class PlayerEntity extends Entity {
  constructor (scene, x, y) {
    super(
      scene,
      x, y,
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
        facing: 1,
        health: 100,
      },
    );

    this.score = 0;
    this.totalDamage = {};
    this.totalKills = {};
    this.oneShot = true;
    this.totalKills['total'] = 0;
    this.scoreGUI = null;

    this.setDepth(Config.PLAYER_DEPTH);
    this.gameObject.setCollisionCategory(collisionCategories.player);

    this.hitbox.onCollideCallback = data => {
      if (data.bodyA.collisionFilter.category === collisionCategories.door || data.bodyB.collisionFilter.category === collisionCategories.door) {
        if (this.scene.cameras.main.fadeEffect.isRunning) return;
        const nextMap = data.bodyA.gameObject.body.loadLevel;
        this.scene.cameras.main.fadeOut(Config.SCENE_TRANSITION_TIME_MS).on(Events.ON_FADEOUT_COMPLETE, () => {
          clearInterval(this.scene.spawner); // stop scene spawner interval. issues when loading next map.
          this.scene.scene.remove();
          this.scene.scene.launch(nextMap, {player: this});
        });
      }
      if (data.bodyA.collisionFilter.category === collisionCategories.toxicDamage || data.bodyB.collisionFilter.category === collisionCategories.toxicDamage) {
        this.takeDamage(Config.TOXIC_DAMAGE);
      }
    };

    // arm sprite
    this.armSprite = this.scene.add.sprite(
      6, -5, // offset to player center
      'hands',
      2,
    );
    this.add(this.armSprite);
    this.sendToBack(this.armSprite); // sets z-index

    this.weapons = new WeaponInventory(scene, this);

    this.scene.events.on(Events.ON_DAMAGE_ENTITY, (data) => {
      if (data.entity.name !== 'PlayerEntity') {
        (!this.totalDamage[data.entity.name]) ? this.totalDamage[data.entity.name] = data.amount : this.totalDamage[data.entity.name] += data.amount;
      }
    });
    this.scene.events.on(Events.ON_KILL_ENTITY, (data) => {
      if (data.entity.name !== 'PlayerEntity') {
        (!this.totalKills[data.entity.name]) ? this.totalKills[data.entity.name] = 1 : this.totalKills[data.entity.name] += 1;
        this.totalKills['total']++;
        this.score += data.entity.pointsForKill ?? 0;
        this.updateScore({
          score: this.score,
          kills: this.totalKills['total']
          }
        );
      }
    });

    // this does keyboard and on screen dpad and buttons
    this.joypadDirection = { x: 0, y: 0 };
    this.firing = false;
    this.joypad = new VirtualJoypad(
      scene,
      {
        onUpdateDirection: newJoypadDirection => {
          this.joypadDirection = newJoypadDirection;
          if (newJoypadDirection.x) this.facing = newJoypadDirection.x;
        },
        onPressJump: () => {
          if (this.sensorData.bottom.size) this.gameObject.setVelocityY(-10);
        },
        onPressFire: () => this.firing = true,
        onReleaseFire: () => this.firing = false,
        onPressSwitch: () => this.weapons.next(),
      },
    );
  }

  setPlayer(player) {
    this.health = player.health;
    this.score = player.score;
    this.totalDamage = player.totalDamage;
    this.totalKills = player.totalKills;
    this.weapons.inventory = player.weapons.inventory;
    this.weapons.index = player.weapons.index;
    this.weapons.createCurrentWeapon();
  }

  static preload(scene) {
    scene.load.spritesheet(SPRITESHEETKEY, 'sprites/craftpix.net/biker.png', { frameWidth: 48, frameHeight: 48 });
    scene.load.spritesheet('hands', 'sprites/craftpix.net/biker_hands.png', { frameWidth: 32, frameHeight: 32 });
    VirtualJoypad.preload(scene);
    WeaponInventory.preload(scene);
  }

  calculateVelocityX () {
    if (Math.abs(this.gameObject.body.velocity.x) > 2.5) return;
    const { joypadDirection, sensorData } = this;
    let vx = 0;

    // player left / right movement
    if (joypadDirection.x) vx = joypadDirection.x * 2.5;

    // move away from anything in left / right sensor (prevent wall sticking)
    if (sensorData.left.size && vx < 0) vx = 0.1;
    if (sensorData.right.size && vx > 0) vx = -0.1;

    // set the velocity
    this.gameObject.setVelocityX(vx);
  }

  calculateGunDirection() {
    const { joypadDirection, sensorData, facing } = this;

    // intially set the gunDirection as joypad direction
    this.gunDirection = { ...joypadDirection };

    // if on floor, prevent pointing downwards
    if (this.gunDirection.y === 1 && sensorData.bottom.size) this.gunDirection.y = 0;

    // if no button pressed, substitue in facing direction
    if (this.gunDirection.x === 0 && this.gunDirection.y === 0) this.gunDirection.x = facing;

    // reposition arm sprite
    const { arm, gunX, gunY, gunR } = directionTocraftpixArmFrame(this.gunDirection);
    this.armSprite.setFrame(arm);

    // reposition gun sprite
    if (this.weapons.currentWeapon) {
      this.weapons.currentWeapon.gunSprite.x = gunX;
      this.weapons.currentWeapon.gunSprite.y = gunY;
      this.weapons.currentWeapon.gunSprite.rotation = gunR;
    }
  }

  flipXArmSprite(shouldFlip) {
    // super.flipXSprite(shouldFlip);

    this.armSprite.flipX = shouldFlip;
    if (this.weapons.currentWeapon) {
      this.weapons.currentWeapon.gunSprite.flipX = shouldFlip;
    }

    const { gunX, gunR } = directionTocraftpixArmFrame(this.gunDirection);

    if (shouldFlip) {
      this.armSprite.x = -6;
      if (this.weapons.currentWeapon) {
        this.weapons.currentWeapon.gunSprite.x = -gunX;
        this.weapons.currentWeapon.gunSprite.rotation = -gunR;
      }
    } else {
      this.armSprite.x = 6;
      if (this.weapons.currentWeapon) {
        this.weapons.currentWeapon.gunSprite.x = gunX;
        this.weapons.currentWeapon.gunSprite.rotation = gunR;
      }
    }
  }

  takeDamage(amount) {
    super.takeDamage(amount);
    this.scene.cameras.main.fadeIn(
      Config.HURT_FADE_IN_TIME_MS,
      Config.HURT_FADE_IN_COLOUR.r,
      Config.HURT_FADE_IN_COLOUR.b,
      Config.HURT_FADE_IN_COLOUR.g
    );
  }

  update() {
    super.update();

    if (!this.gameObject.body) return;
    // fire
    if (this.firing) {
        if(this.weapons.isEmpty() && this.oneShot) {
          this.scene.audio.playSfxNow('noWeaponSound');
          this.oneShot = false;
        }
        this.weapons.currentWeapon?.pullTrigger();
    }
    else {
      this.weapons.currentWeapon?.releaseTrigger();
      this.oneShot = true;
    }

    this.calculateVelocityX();
    this.calculateGunDirection();

    // flip arm sprite to match facing
    this.flipXArmSprite(this.facing === -1);

    // ladder collisions
    if (this.body.velocity.y < -4 || this.joypadDirection.y > 0) {
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

  updateScore(data) {
    const score = data.score ?? 0;
    const kills = data.kills ?? 0;
    this.scoreGUI.text.setText([`Score: ${score}`, `Kills: ${kills}`]);
  }

  playerScoreGUI() {
    const score = this.score ?? 999;
    const kills = this.totalKills['total'] ?? 999;

    this.scoreGUI = new BloodFont(
      this.scene,
      this.scene.cameras.main.worldView.x,
      this.scene.cameras.main.worldView.y,
      {
        padding: 10,
        fixedWidth: this.scene.cameras.main.width,
        fontSize: 18,
        lineSpacing:-10,
        text: [`Score: ${score}`, `Kills: ${kills}`],
        backgroundColor: '#00000066',
      },
    );
  }

  destroy() {
    if (this.scene) new GameOver(this.scene);
    super.destroy();
  }
}
