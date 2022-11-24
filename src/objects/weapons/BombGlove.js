import AbstractWeapon from './AbstractWeapon';
import Bomb from '../projectiles/Bomb';

export default class BombGlove extends AbstractWeapon {
  constructor(scene, timerMs = 1000) {
    super(
      scene,
      {
        BulletClass: Bomb,
        maxBullets: 2,
      },
    );

    this.timer = timerMs;
  }

  fire(directionData) {
    if (this.firstShot) {
      this.bulletGroup.get(
        this.scene.player.x,
        this.scene.player.y,
        this.scene.player.direction,
        this.timer,
      );
    }
    super.fire();
  }
}
