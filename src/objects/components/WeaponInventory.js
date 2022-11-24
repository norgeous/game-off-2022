import MachineGun from '../../objects/weapons/MachineGun';
import BombGlove from '../../objects/weapons/BombGlove';
import HandGun from '../../objects/weapons/HandGun';

export default class WeaponInventory {
  inventory = [
    MachineGun,
    // HandGun,
    // BombGlove,
  ];
  index = 0;

  constructor(scene, entity) {
    this.scene = scene;
    this.entity = entity;
    this.createCurrentWeapon(); // instanciate first weapon 
  }

  static preload(scene) {
    MachineGun.preload(scene);
    // HandGun.preload(scene);
    // BombGlove.preload(scene);
  }

  createCurrentWeapon () {
    this.currentWeapon?.destroy();
    this.currentWeapon = new this.inventory[this.index](this.scene, { entity: this.entity });
  }

  next() {
    this.index = (this.index + 1) % this.inventory.length;
    this.createCurrentWeapon();
  }
  
  // prev() {
  //   this.index = this.index - 1 > 0 ? this.index -1 : this.inventory.length - 1;
  // }

  fireCurrent(directionData) {
    this.currentWeapon.fire(directionData);
  }

  add(WeaponClass) {
    this.inventory.push(WeaponClass);
    this.index = this.inventory.length - 1; // select the new weapon
    this.createCurrentWeapon();
  }

  // remove(index) {

  // }
}
