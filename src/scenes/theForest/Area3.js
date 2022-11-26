import Phaser from 'phaser';
import Map from '../../map/Map';
import AbstractScene from '../AbstractScene';

export default class Area3 extends AbstractScene {
  constructor() {
    super('forest-area3')
    this.map = new Map(this, 'theForest', 'tileset_extruded.png', 'mapData3.json', 8);
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
