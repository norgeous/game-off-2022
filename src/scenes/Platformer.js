import Phaser from 'phaser'

export default class Platformer extends Phaser.Scene {
  constructor() {
    super('my-platformer')
    this.playerController = null;
    this.cursors = null;
    this.text = null;
    this.cam = null;
    this.smoothedControls = null;
  }

  preload() {
    this.load.tilemapTiledJSON('map', 'https://labs.phaser.io/assets/tilemaps/maps/matter-platformer.json');
    this.load.image('kenney_redux_64x64', 'https://labs.phaser.io/assets/tilemaps/tiles/kenney_redux_64x64.png');
    this.load.spritesheet('player', 'https://labs.phaser.io/assets/sprites/dude-cropped.png', { frameWidth: 32, frameHeight: 42 });
    this.load.image('box', 'https://labs.phaser.io/assets/sprites/box-item-boxed.png');
  }

  create() {
    var map = this.make.tilemap({ key: 'map' });
    var tileset = map.addTilesetImage('kenney_redux_64x64');
    var layer = map.createLayer(0, tileset, 0, 0);

    // Set up the layer to have matter bodies. Any colliding tiles will be given a Matter body.
    map.setCollisionByProperty({ collides: true });
    this.matter.world.convertTilemapLayer(layer);

    this.matter.world.setBounds(map.widthInPixels, map.heightInPixels);
    this.matter.world.createDebugGraphic();
    this.matter.world.drawDebug = false;

    this.cursors = this.input.keyboard.createCursorKeys();

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
      matterSprite: this.matter.add.sprite(0, 0, 'player', 4),
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
    var w = this.playerController.matterSprite.width;
    var h = this.playerController.matterSprite.height;

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

    this.playerController.matterSprite
      .setExistingBody(compoundBody)
      .setFixedRotation() // Sets max inertia to prevent rotation
      .setPosition(630, 1000);

    this.matter.add.image(630, 750, 'box');
    this.matter.add.image(630, 650, 'box');
    this.matter.add.image(630, 550, 'box');

    this.cam = this.cameras.main;
    this.cam.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.smoothMoveCameraTowards(this.playerController.matterSprite);

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
    this.matter.world.on('beforeupdate', () => {
      this.playerController.numTouching.left = 0;
      this.playerController.numTouching.right = 0;
      this.playerController.numTouching.bottom = 0;
    });

    // Loop over the active colliding pairs and count the surfaces the player is touching.
    this.matter.world.on('collisionactive', (event) => {
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
    this.matter.world.on('afterupdate', () => {
      this.playerController.blocked.right = this.playerController.numTouching.right > 0 ? true : false;
      this.playerController.blocked.left = this.playerController.numTouching.left > 0 ? true : false;
      this.playerController.blocked.bottom = this.playerController.numTouching.bottom > 0 ? true : false;
    });

    this.input.on('pointerdown', () => {
      this.matter.world.drawDebug = !this.matter.world.drawDebug;
      this.matter.world.debugGraphic.visible = this.matter.world.drawDebug;
    }, this);

    this.text = this.add.text(16, 16, '', {
      fontSize: '20px',
      padding: { x: 20, y: 10 },
      backgroundColor: '#ffffff',
      color: '#000000',
    });
    this.text.setScrollFactor(0);
    this.updateText();
  }

  update (time, delta) {
    var matterSprite = this.playerController.matterSprite;

    // Horizontal movement

    var oldVelocityX;
    var targetVelocityX;
    var newVelocityX;

    if (this.cursors.left.isDown && !this.playerController.blocked.left)
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
    else if (this.cursors.right.isDown && !this.playerController.blocked.right) {
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
    if (this.cursors.up.isDown && canJump) {
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

    this.smoothMoveCameraTowards(matterSprite, 0.9);
    this.updateText();
  }

  updateText () {
    this.text.setText([
        'Arrow keys to move. Press "Up" to jump.',
        'You can wall jump!',
        'Click to toggle rendering Matter debug.'
        // 'Debug:',
        // '\tBottom blocked: ' + playerController.blocked.bottom,
        // '\tLeft blocked: ' + playerController.blocked.left,
        // '\tRight blocked: ' + playerController.blocked.right
    ]);
  }

  smoothMoveCameraTowards (target, smoothFactor) {
    if (smoothFactor === undefined) { smoothFactor = 0; }
    this.cam.scrollX = smoothFactor * this.cam.scrollX + (1 - smoothFactor) * (target.x - this.cam.width * 0.5);
    this.cam.scrollY = smoothFactor * this.cam.scrollY + (1 - smoothFactor) * (target.y - this.cam.height * 0.5);
  }
}
