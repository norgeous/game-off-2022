import AbstractWeapon from './AbstractWeapon';
import Ball from '../projectiles/Ball';

export default class BombGlove extends AbstractWeapon {
  constructor(scene, timerMs = 0) {
    super(
      scene,
      {
        BulletClass: Ball,
        maxBullets: 1,
      },
    );

    this.timer = timerMs;
  }

  fire() {
    if (this.firstShot) {
      const b = new Ball(this.scene, this.scene.player.x, this.scene.player.y, this.scene.player.playerController.direction);

      if (this.timer > 0) {
        setTimeout(() => b.destroy(), this.timer);
      }
    }
    super.fire();
  }
}
