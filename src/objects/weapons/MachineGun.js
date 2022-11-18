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
    const bullet = this.bulletGroup.get(this.scene.player.x, this.scene.player.y, this.scene.player.playerController.direction);
  }
    
  fireRelease() {
    this.firstShot = false;
  }
}
