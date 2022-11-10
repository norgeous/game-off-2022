import Phaser from 'phaser'
import MachineGun from "./weapons/MachineGun.js";

export default class Player extends Phaser.Physics.Matter.Sprite {
  constructor(scene, x, y, texture, frame) {
    super(scene.matter.world, x, y, texture, frame);
    scene.add.existing(this);
    this.scene = scene;

    this.health = 100;
    this.weapon = new MachineGun(this);
    this.cursors = this.scene.input.keyboard.createCursorKeys();

    this.upKey;
    this.downKey;
    this.leftKey;
    this.rightKey;
    this.jumpKey;

    this.upKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.downKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.leftKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.rightKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.jumpKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    // Smoothed horizontal controls helper. This gives us a value between -1 and 1 depending on how long
    // the player has been pressing left or right, respectively
    this.msSpeed = 0.0005;
    this.value = 0;
    this.smoothedControls = {
      moveLeft: (delta) => {
        if (this.value > 0) { this.smoothedControls.reset(); }
        this.value -= this.msSpeed * delta;
        if (this.value < -1) { this.value = -1; }
        this.playerController.time.rightDown += delta;
      },
      moveRight: (delta) => {
        if (this.value < 0) { this.smoothedControls.reset(); }
        this.value += this.msSpeed * delta;
        if (this.value > 1) { this.value = 1; }
      },
      reset: () => {
        this.value = 0;
      },
    };

    // The player is a collection of bodies and sensors
    this.playerController = {
      // matterSprite: this.scene.matter.add.sprite(0, 0, 'player', 4),
      blocked: {
        left: false,
        right: false,
        bottom: false
      },
      numTouching: {
        left: 0,
        right: 0,
        bottom: 0
      },
      sensors: {
        bottom: null,
        left: null,
        right: null
      },
      time: {
        leftDown: 0,
        rightDown: 0
      },
      lastJumpedAt: 0,
      speed: {
        run: 7,
        jump: 10
      }
    };

    var M = Phaser.Physics.Matter.Matter;
    var w = this.width;
    var h = this.height;

    // The player's body is going to be a compound body:
    //  - playerBody is the solid body that will physically interact with the world. It has a
    //    chamfer (rounded edges) to avoid the problem of ghost vertices: http://www.iforce2d.net/b2dtut/ghost-vertices
    //  - Left/right/bottom sensors that will not interact physically but will allow us to check if
    //    the player is standing on solid ground or pushed up against a solid object.

    // Move the sensor to player center
    var sx = w / 2;
    var sy = h / 2;

    // The player's body is going to be a compound body.
    var playerBody = M.Bodies.rectangle(sx, sy, w * 0.75, h, { chamfer: { radius: 10 } });
    this.playerController.sensors.bottom = M.Bodies.rectangle(sx, h, sx, 5, { isSensor: true });
    this.playerController.sensors.left = M.Bodies.rectangle(sx - w * 0.45, sy, 5, h * 0.25, { isSensor: true });
    this.playerController.sensors.right = M.Bodies.rectangle(sx + w * 0.45, sy, 5, h * 0.25, { isSensor: true });
    var compoundBody = M.Body.create({
      parts: [
          playerBody,
          this.playerController.sensors.bottom,
          this.playerController.sensors.left,
          this.playerController.sensors.right
      ],
      friction: 0.01,
      restitution: 0.05 // Prevent body from sticking against a wall
    });

    this
      .setExistingBody(compoundBody)
      .setFixedRotation() // Sets max inertia to prevent rotation
      .setPosition(x, y);

    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('player', { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'idle',
      frames: this.anims.generateFrameNumbers('player', { start: 4, end: 4 }),
      frameRate: 10,
      repeat: -1
    });

    // Use matter events to detect whether the player is touching a surface to the left, right or
    // bottom.

    // Before matter's update, reset the player's count of what surfaces it is touching.
    this.scene.matter.world.on('beforeupdate', () => {
      this.playerController.numTouching.left = 0;
      this.playerController.numTouching.right = 0;
      this.playerController.numTouching.bottom = 0;
    });

    // Loop over the active colliding pairs and count the surfaces the player is touching.
    this.scene.matter.world.on('collisionactive', (event) => {
      var playerBody = this.playerController.body;
      var left = this.playerController.sensors.left;
      var right = this.playerController.sensors.right;
      var bottom = this.playerController.sensors.bottom;

      for (var i = 0; i < event.pairs.length; i++) {
        var bodyA = event.pairs[i].bodyA;
        var bodyB = event.pairs[i].bodyB;

        if (bodyA === playerBody || bodyB === playerBody)
        {
          continue;
        }
        else if (bodyA === bottom || bodyB === bottom)
        {
          // Standing on any surface counts (e.g. jumping off of a non-static crate).
          this.playerController.numTouching.bottom += 1;
        }
        else if ((bodyA === left && bodyB.isStatic) || (bodyB === left && bodyA.isStatic))
        {
          // Only static objects count since we don't want to be blocked by an object that we
          // can push around.
          this.playerController.numTouching.left += 1;
        }
        else if ((bodyA === right && bodyB.isStatic) || (bodyB === right && bodyA.isStatic))
        {
          this.playerController.numTouching.right += 1;
        }
      }
    });

    // Update over, so now we can determine if any direction is blocked
    this.scene.matter.world.on('afterupdate', () => {
      this.playerController.blocked.right = this.playerController.numTouching.right > 0 ? true : false;
      this.playerController.blocked.left = this.playerController.numTouching.left > 0 ? true : false;
      this.playerController.blocked.bottom = this.playerController.numTouching.bottom > 0 ? true : false;
    });

    this.scene.input.on('pointerdown', () => {
      this.scene.matter.world.drawDebug = !this.scene.matter.world.drawDebug;
      this.scene.matter.world.debugGraphic.visible = this.scene.matter.world.drawDebug;
    }, this);

    this.scene.input.on('pointerdown', () => {
      this.weapon.fire();
    }, this);
  }

  update (time, delta) {
    var matterSprite = this;

    // Horizontal movement
    var oldVelocityX;
    var targetVelocityX;
    var newVelocityX;


    if (this.leftKey.isDown && !this.playerController.blocked.left)
    {
      this.smoothedControls.moveLeft(delta);
      matterSprite.anims.play('left', true);

      // Lerp the velocity towards the max run using the smoothed controls. This simulates a
      // player controlled acceleration.
      oldVelocityX = matterSprite.body.velocity.x;
      targetVelocityX = -this.playerController.speed.run;
      newVelocityX = Phaser.Math.Linear(oldVelocityX, targetVelocityX, -this.value);

      matterSprite.setVelocityX(newVelocityX);
    }
    else if (this.rightKey.isDown && !this.playerController.blocked.right) {
      this.smoothedControls.moveRight(delta);
      matterSprite.anims.play('right', true);

      // Lerp the velocity towards the max run using the smoothed controls. This simulates a
      // player controlled acceleration.
      oldVelocityX = matterSprite.body.velocity.x;
      targetVelocityX = this.playerController.speed.run;
      newVelocityX = Phaser.Math.Linear(oldVelocityX, targetVelocityX, this.value);

      matterSprite.setVelocityX(newVelocityX);
    } else {
      this.smoothedControls.reset();
      matterSprite.anims.play('idle', true);
    }

    // Jumping & wall jumping

    // Add a slight delay between jumps since the sensors will still collide for a few frames after
    // a jump is initiated
    var canJump = (time - this.playerController.lastJumpedAt) > 250;
    if (this.jumpKey.isDown && canJump) {
      if (this.playerController.blocked.bottom) {
        matterSprite.setVelocityY(-this.playerController.speed.jump);
        this.playerController.lastJumpedAt = time;
      } else if (this.playerController.blocked.left) {
        // Jump up and away from the wall
        matterSprite.setVelocityY(-this.playerController.speed.jump);
        matterSprite.setVelocityX(this.playerController.speed.run);
        this.playerController.lastJumpedAt = time;
      } else if (this.playerController.blocked.right) {
        // Jump up and away from the wall
        matterSprite.setVelocityY(-this.playerController.speed.jump);
        matterSprite.setVelocityX(-this.playerController.speed.run);
        this.playerController.lastJumpedAt = time;
      }
    }
  }
}
