import AbstractWeapon from './AbstractWeapon';
import Bullet from '../projectiles/Bullet';

export default class MachineGun extends AbstractWeapon {
  constructor(scene) {
    super(
      scene,
      {
        BulletClass: Bullet,
        maxBullets: 10,
      },
    );
  }

  fire() {
    const b = this.bulletGroup.get(this.scene.player.x, this.scene.player.y);
    // b?.setVelocity(10,0);
  }

  fireRelease() {
    this.firstShot = false;
  }
}
