import AbstractWeapon from './AbstractWeapon';
import Bomb from '../projectiles/Bomb';

export default class BombGlove extends AbstractWeapon {
  constructor(scene, timerMs = 1000) {
    super(
      scene,
      {
        BulletClass: Bomb,
        maxBullets: 1,
      },
    );

    this.timer = timerMs;
  }

  fire() {
    if (this.firstShot) {
      this.bulletGroup.get(
        this.scene.player.x,
        this.scene.player.y,
        this.scene.player.playerController.direction,
        this.timer,
      );
    }
    super.fire();
  }
}
