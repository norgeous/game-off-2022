export default class Health
{
  static TEXTURE = 'healthPack';

  static onPickUp(entity) {
    entity.health += 100;
    if (entity.health > entity.maxHealth) entity.health = entity.maxHealth;
  }
}
