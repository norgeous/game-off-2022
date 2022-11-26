import Phaser from 'phaser';
import Map from '../../map/Map';
import AbstractScene from '../AbstractScene.js';

export default class Area2 extends AbstractScene {
  constructor() {
    super('forest-area2')
    this.map = new Map(this, 'theForest', 'tileset_extruded.png', 'mapData2.json', 8);
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
