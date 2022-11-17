import Phaser from 'phaser';

export default class AbstractWeapon {
  constructor(player) {
    this.player = player;
    if (this.constructor == AbstractWeapon) {
      throw new Error('Abstract classes can\'t be instantiated.');
    }
    this.firstShot = true;

    // this.zombieGroup = this.add.group({
    //   maxSize: MAX_ZOMBIES,
    //   runChildUpdate: true,
    //   classType: Zombie,
    // });
  }

  fire() {
    if (this.firstShot) {
      this.firstShot = false;
    }
  }

  fireRelease() {
    this.firstShot = true;
  }
  preLoad() {}
  update() {}
}
