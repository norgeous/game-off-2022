import Phaser from 'phaser';
import Sound from '../enums/Sound';
import Events from "../enums/Events.js";
import Config from "../Config.js";

class Explosion {
  constructor (scene, x, y, { radius = 50, force = 50, damage = 20 }) {
    // draw a circle at size of explosion radius

    scene.anims.create({
      key: 'explosion',
      frameRate: 15,
      frames: scene.anims.generateFrameNumbers('explosion', { start: 1, end: 9 }),
      repeat: 0,
      hideOnComplete: true
    });

    // find close zombies and apply force to them
    scene.zombieGroup.getChildren().forEach(zombie => this.applyExplosionForce(scene, x, y, radius, force, damage, zombie));

    // apply to player too, for grenade jumps
    this.applyExplosionForce(scene, x, y, radius, force, damage, scene.player);
    this.playExplodeAnimation(scene, x, y);

    scene.audio.playSfxNow(Sound.BombBlast);

    // camera shake
    if (Config.SCREEN_SHAKE) {
      scene.cameras.main.shake(Config.SCREEN_SHAKE_DURATION, Config.SCREEN_SHAKE_INTENSITY);
    }
  }

  playExplodeAnimation(scene, x, y) {
    this.sprite = scene.add.sprite(x, y, 'bomb_explosion');
    this.sprite.play('explosion').on(Events.ON_ANIMATION_COMPLETE, () => {
      this.sprite.destroy()
    });
  }

  applyExplosionForce (scene, x, y, radius, force, damage, gameObject) {
    const distance = Phaser.Math.Distance.BetweenPoints({ x, y }, gameObject);
    const isInsideRadius = distance <= radius;

    if (isInsideRadius) {
      gameObject.takeDamage(damage);
      gameObject.isStunned = true;
      scene.time.delayedCall(1000, () => gameObject.isStunned = false);

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
