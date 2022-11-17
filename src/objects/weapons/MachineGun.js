import AbstractWeapon from './AbstractWeapon';
import Bullet from '../Bullet';

export default class MachineGun extends AbstractWeapon {
  constructor(player) {
    super(player)
  }

  fire() {
    const bullet = new Bullet(this.player.scene, this.player.x, this.player.y);
  }

  fireRelease() {
    this.firstShot = false;
  }
}
