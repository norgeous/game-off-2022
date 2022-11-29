export default class Health
{
  static TEXTURE = 'healthPack';

  static onPickUp(entity) {
    entity.health += 100;
  }
}
