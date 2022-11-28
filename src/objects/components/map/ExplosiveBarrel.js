import {collisionCategories, collisionMaskEverything} from '../../enums/Collisions';
import Explosion from '../../projectiles/Explosion.js';
import Config from '../../Config';

export default class ExplosiveBarrel
{
  constructor(scene, x, y)
  {
    let sprite = scene.add.sprite(
      x,
      y,
      Config.EXPLODING_BARRELS_TEXTURE
    );

    let object = scene.matter.add.gameObject(sprite, {isStatic: true});
    object.setCollidesWith(collisionMaskEverything);
    object.setOnCollide((data) => {
      if (data.bodyB.collisionFilter.category === collisionCategories.enemyDamage) {
        object.destroy();
        new Explosion(
          scene,
          x, y,
          {
            radius: Config.EXPLODING_BARRELS_RADIUS,
            force: Config.EXPLODING_BARRELS_FORCE,
            damage: Config.EXPLODING_BARRELS_DAMAGE,
          },
        );
      }
    })
  }
}
