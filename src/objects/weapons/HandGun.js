import AbstractWeapon from './AbstractWeapon';
import Bullet from '../projectiles/Bullet';
import Sound from "../enums/Sound.js";

export default class HandGun extends AbstractWeapon {
  constructor(scene) {
    super(
      scene,
      {
        BulletClass: Bullet,
        maxBullets: 1,
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
        soundKeyName: Sound.Pistol,
      },
    );
  }
}
