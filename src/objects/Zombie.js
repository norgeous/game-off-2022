import Phaser from 'phaser'
import HealthBar from './HealthBar';

export default class Zombie extends Phaser.GameObjects.Container {
  constructor (scene, x, y) {
    super(scene, x, y);

    this.scene = scene;

    // zombie sprite
    this.sprite = this.scene.add.sprite(0, 0, 'zombie');
    this.scene.anims.create({
      key: 'zombie_idle',
      frameRate: 3,
      frames: this.sprite.anims.generateFrameNumbers('zombieSpriteSheet', { start: 10, end: 11 }),
      repeat: -1
    });
    this.scene.anims.create({
      key: 'zombie_walk',
      frameRate: 3,
      frames: this.sprite.anims.generateFrameNumbers('zombieSpriteSheet', { start: 0, end: 3 }),
      repeat: -1
    });
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
      const { depth } = data.collision;
      if (depth > 3) {
        this.health -= depth;
      }
    });
  }

  update() {
    if (!this.gameObject.body) return;

    const { angle, angularVelocity } = this.gameObject.body;
    const speed = Math.hypot(this.gameObject.body.velocity.x, this.gameObject.body.velocity.y);

    this.sprite.play(speed + angularVelocity < 0.1 ? 'zombie_idle' : 'zombie_walk', true);

    const { player } = this.scene;
    const closeToPlayer = Phaser.Math.Distance.BetweenPoints(this, player) < 200;
    const closeToStationary = speed <= 0.01;
    const twoPi = Math.PI * 2;

    // force upright (springy)
    if (closeToPlayer) {
      this.gameObject.rotation = this.gameObject.rotation % twoPi; // modulo spins
      const diff = 0 - angle;
      const newAv = (angularVelocity + (diff / 100));
      this.gameObject.setAngularVelocity(newAv);
    }

    // when close to player and not moving much, jump towards player
    if (closeToPlayer && closeToStationary) {
      const vectorTowardsPlayer = {
        x: player.x - this.x,
        y: player.y - this.y,
      };
      this.gameObject.setVelocity?.(vectorTowardsPlayer.x < 0 ? -2 : 2, -2);
    }

    // (re)draw health bar
    this.healthBar.draw(this.health);

    // kill if zero health
    if (this.health <= 0) {
      this.sprite.destroy();
      this.text.destroy();
      this.destroy();
      this.gameObject.destroy();
    }
  }
}
