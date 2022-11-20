import Phaser from 'phaser';

class Explosion {
  constructor (scene, x, y, { radius = 50, force = 50 }) {
    // draw a circle at size of explosion radius
    const circle = scene.add.circle(x, y, radius);
    circle.setStrokeStyle(1, 0xFF0000);
    scene.time.delayedCall(500, () => circle.destroy());

    scene.anims.create({
      key: 'explosion',
      frameRate: 15,
      frames: scene.anims.generateFrameNumbers('explosion', { start: 1, end: 9 }),
      repeat: 0,
      hideOnComplete: true
    });

    // find close zombies and apply force to them
    scene.zombieGroup.getChildren().forEach(zombie => this.applyExplosionForce(x, y, radius, force, zombie));

    // apply to player too, for grenade jumps
    this.applyExplosionForce(x, y, radius, force, scene.player);
    this.playExplodeAnimation(x, y, scene);
  }

  playExplodeAnimation(x, y, scene) {
    this.sprite = scene.add.sprite(x, y, 'bomb_explosion');
    this.sprite.play('explosion').on('animationcomplete', () => {
      this.sprite.destroy()
    });
  }

  applyExplosionForce (x, y, radius, force, gameObject) {
    const distance = Phaser.Math.Distance.BetweenPoints({ x, y }, gameObject);
    const isInsideRadius = distance <= radius;

    if (isInsideRadius) {
      const blastVector = {
        x: (gameObject.x - x),
        y: (gameObject.y - y),
      };

      const angleOfVelocity = Math.atan2(blastVector.y, blastVector.x);

      const forceVector ={
        x: Math.cos(angleOfVelocity),
        y: Math.sin(angleOfVelocity),
      };

      gameObject.setVelocity(
        forceVector.x * force,
        (forceVector.y * force) - 5,
      );
    }
  }
}

export default Explosion;