export default class AbstractWeapon {
  constructor(scene, { BulletClass, maxBullets }) {
    this.scene = scene;

    if (this.constructor == AbstractWeapon) {
      throw new Error('Abstract classes can\'t be instantiated.');
    }

    this.bulletGroup = this.scene.add.group({
      maxSize: maxBullets,
      classType: BulletClass,
    });

    this.firstShot = true;
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
