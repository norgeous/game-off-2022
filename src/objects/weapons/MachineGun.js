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
    this.bulletGroup.get(
      this.scene.player.x,
      this.scene.player.y,
      {
        direction: this.scene.player.playerController.direction,
        lifespan: 1000,
        soundKeyName: 'soundKeyNameMachineGun',
      },
    );
  }
}
