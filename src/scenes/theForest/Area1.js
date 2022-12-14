// import Phaser from 'phaser';
import Map from '../../map/Map';
import AbstractScene from '../AbstractScene';
import Sound from '../../objects/enums/Sound';
import Config from '../../objects/Config';

export default class Area1 extends AbstractScene {
  constructor() {
    super('forest-area1')
    this.startText = 'The Forest - Area 1';
    this.map = new Map(this, 'theForest', 'tileset_extruded.png', 'mapData.json', 8);
  }

  preload() {
    super.preload();
  }

  create() {
    super.create();
  }

  update(time, delta) {
    super.update(time, delta);
  }
}
