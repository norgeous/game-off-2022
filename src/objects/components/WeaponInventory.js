import MachineGun from '../../objects/weapons/MachineGun';
import GrenadeLauncher from '../weapons/GrenadeLauncher';
import RocketLauncher from '../weapons/RocketLauncher';
import HandGun from '../../objects/weapons/HandGun';

export default class WeaponInventory {
  inventory = [
    HandGun,
    MachineGun,
    GrenadeLauncher,
    RocketLauncher,
  ];
  index = 0;

  constructor(scene, entity) {
    this.scene = scene;
    this.entity = entity;
    this.createCurrentWeapon(); // instanciate first weapon 
  }

  static preload(scene) {
    HandGun.preload(scene);
    MachineGun.preload(scene);
    GrenadeLauncher.preload(scene);
    RocketLauncher.preload(scene);
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

  fireCurrent() {
    this.currentWeapon.pullTrigger();
  }

  add(WeaponClass) {
    this.inventory.push(WeaponClass);
    this.index = this.inventory.length - 1; // select the new weapon
    this.createCurrentWeapon();
  }

  // remove(index) {

  // }
}
