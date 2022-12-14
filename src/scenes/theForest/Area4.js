// import Phaser from 'phaser';
import Map from '../../map/Map';
import AbstractScene from '../AbstractScene';

export default class Area4 extends AbstractScene {
  constructor() {
    super('forest-area4')
    this.startText = 'The Forest - Area 4';
    this.map = new Map(this, 'theForest', 'tileset_extruded.png', 'mapData4.json', 8);
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
