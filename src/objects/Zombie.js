import Phaser from 'phaser'
import HealthBar from './HealthBar';
import EntityAnimations from './enums/EntityAnimations';
import { collisionCategories, collisionMaskEverything } from './enums/Collisions';

export default class Zombie extends Phaser.GameObjects.Container {
  constructor (scene, x, y) {
    super(scene, x, y);

    this.scene = scene;

    // zombie sprite
    this.sprite = this.scene.add.sprite(0, 0, 'zombie');
    this.sprite.flipX = Math.random() > 0.5; // initial face left / right randomly
    this.createAnimations();
    this.sprite.play('zombie_idle', true);

    // health bar
    this.health = 100;
    this.healthBar = new HealthBar(scene, 0, 0 - 30, {
      width: 40,
      padding: 1,
      maxHealth: this.health,
    });

    // text
    this.text = this.scene.add.text(0, 0 - 40, 'Zombie', {
      font: '12px Arial',
      align: 'center',
      color: 'black',
      fontWeight: 'bold',
    }).setOrigin(0.5);

    // add sprite, text and health bar into container
    this.add([this.sprite, this.healthBar.bar, this.text]);

    // add this container to scene
    this.scene.add.existing(this);

    // add physics object to scene
    this.gameObject = scene.matter.add.gameObject(
      this,
      {
        shape: { type: 'rectangle', width: 14, height: 32 },
        isStatic: false,
        chamfer: { radius: 4 },
      },
    )
      .setFrictionAir(0.001)
      .setBounce(0.1)
      // .setMass(100);

    this.gameObject.setOnCollide(data => {

      if (data.bodyB.collisionFilter.category === collisionCategories.enemyDamage) {
        this.takeDamage(data.bodyB.damage);
      }

      if (data.bodyB.collisionFilter.category === collisionCategories.enemyDamage) {
        this.takeDamage(data.bodyB.damage);
      }

      // environmental / fall damage
      const { depth } = data.collision;
      if (depth > 5) this.takeDamage(depth);
    });

  }

  takeDamage(amount) {
    this.health -= amount;
    if (this.health<0) this.health = 0;
  }

  createAnimations() {
    this.scene.anims.create({
      key: EntityAnimations.Idle,
      frames: this.sprite.anims.generateFrameNumbers('zombieSpriteSheet', { start: 10, end: 11 }),
      frameRate: 3,
      repeat: -1
    });
    this.scene.anims.create({
      key: EntityAnimations.Walking,
      frames: this.sprite.anims.generateFrameNumbers('zombieSpriteSheet', { start: 0, end: 3 }),
      frameRate: 5,
      repeat: -1
    });
    this.scene.anims.create({
      key: EntityAnimations.Attack,
      frames: this.sprite.anims.generateFrameNumbers('zombieSpriteSheet', { start: 4, end: 7 }),
      frameRate: 15,
      repeat: -1,
    });
    this.scene.anims.create({
      key: EntityAnimations.Death,
      frames: this.sprite.anims.generateFrameNumbers('zombieSpriteSheet', { start: 12, end: 15 }),
      frameRate: 2,
      repeat: 0,
    });
  }

  update() {
    if (!this.gameObject.body) return;

    const { angle, angularVelocity } = this.gameObject.body;
    const speed = Math.hypot(this.gameObject.body.velocity.x, this.gameObject.body.velocity.y);
    const motion = speed + Math.abs(angularVelocity);
    const closeToStationary = motion <= 0.1;
    const { player } = this.scene;
    const closeToPlayer = Phaser.Math.Distance.BetweenPoints(this, player) < 200;
    const veryCloseToPlayer = Phaser.Math.Distance.BetweenPoints(this, player) < 30;
    const twoPi = Math.PI * 2;
    const isAlive = this.health > 0;

    
    // animations
    if (isAlive) {
      // alive
      if (veryCloseToPlayer) {
        // attack
        this.sprite.play(EntityAnimations.Attack, true);
      } else {
        // when moving play walking animation, otherwise play idle
        this.sprite.play(closeToStationary ? EntityAnimations.Idle : EntityAnimations.Walking, true);
      }
    } else {
      // dead
      this.sprite.play(EntityAnimations.Death, true);
    }

    // force upright (springy)
    if (isAlive && closeToPlayer) {
      this.gameObject.rotation = this.gameObject.rotation % twoPi; // modulo spins
      const diff = 0 - angle;
      const newAv = (angularVelocity + (diff / 100));
      this.gameObject.setAngularVelocity(newAv);
    }

    // when close to player and not moving much, jump towards player
    if (isAlive && closeToPlayer && closeToStationary) {
      const vectorTowardsPlayer = {
        x: player.x - this.x,
        y: player.y - this.y,
      };
      this.gameObject.setVelocity?.(
        vectorTowardsPlayer.x < 0 ? -2 : 2,
        -2,
      );
    }

    // flip zombie sprite when player is close to and left of zombie
    if (isAlive && closeToPlayer) {
      this.sprite.flipX = player.x < this.x;
    }

    // (re)draw health bar
    this.healthBar.draw(this.health);

    // kill if zero health
    if (this.health <= 0) {
      this.text.setText('X');
      this.scene.time.delayedCall(2000, () => {
        this.sprite.destroy();
        this.text.destroy();
        this.destroy();
        this.gameObject.destroy();
      });
    }
  }
}
