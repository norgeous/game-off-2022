import AbstractWeapon from './AbstractWeapon';
import Bullet from '../projectiles/Bullet';

export default class MachineGun extends AbstractWeapon {
  constructor(scene) {
    super(
      scene,
      {
        BulletClass: Bullet,
        maxBullets: 100,
      },
    );
  }

  fire() {
    this.bulletGroup.get(this.scene.player.x, this.scene.player.y);
  }

  fireRelease() {
    this.firstShot = false;
  }
}
