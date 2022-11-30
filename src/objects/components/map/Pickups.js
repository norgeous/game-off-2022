import Phaser from "phaser";
import { collisionCategories, collisionMaskEverything } from "../../enums/Collisions.js";
import HandGun from "../../weapons/HandGun.js";
import Health from "../../Health.js";
import GrenadeLauncher from "../../weapons/GrenadeLauncher.js";
import MachineGun from "../../weapons/MachineGun.js";
import RocketLauncher from "../../weapons/RocketLauncher.js";
import Shotgun from '../../weapons/Shotgun';
import Lazer from '../../weapons/Lazer';

export default class Pickups {

  static PICKUP_LAYER = 'Pickups'

  constructor(map) {

    let classMapping = {
      handGun: HandGun,
      grenadeLauncher: GrenadeLauncher,
      machineGun: MachineGun,
      rocketLauncher: RocketLauncher,
      health: Health,
      shotgun: Shotgun,
      lazer: Lazer,
    }
    let pickups = map.getObjectFromLayer(Pickups.PICKUP_LAYER, 'item');

    if (pickups) {
      pickups.forEach((element, index, array) => {

        let itemClass = classMapping[element.properties?.itemType] ?? null;
        if (!itemClass) return;

        let item = map.Phaser.add.sprite(
          element.x,
          element.y,
          itemClass.TEXTURE ?? '',
          itemClass.FRAME ?? 0
        );
        item.setScale(itemClass.MAP_ICON_SCALE ?? 1);
        let itemObject = map.Phaser.matter.add.gameObject(item, {isStatic: true});

        let tween = map.Phaser.tweens.add({
          targets: itemObject,
          y: {from: itemObject.y ?? 0, to: itemObject.y + 10 ?? 0},
          ease: Phaser.Math.Easing.Quadratic.InOut,
          yoyo: true,
          repeat: -1,
          duraton: 1000,
          // just to create a interesting offset for the example
          delay: Phaser.Math.Between(0, 6) * 200
        });
        itemObject.setCollidesWith(collisionCategories.player);
        itemObject.setOnCollide((data) => {
          if (data.bodyB.parent?.collisionFilter.category === collisionCategories.player) {
            itemClass.onPickUp(data.bodyB.parent.gameObject);
            tween.stop();
            itemObject.destroy();
          }
        })

      });
    }
  }
}
