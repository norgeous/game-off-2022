// import Phaser from 'phaser';
import Map from '../../map/Map';
import AbstractScene from '../AbstractScene';

export default class TestScene extends AbstractScene {
  constructor() {
    super('forest-area51')
    this.startText = 'The Forest - Area 51';
    this.map = new Map(this, 'theForest', 'tileset_extruded.png', 'mapData5.json', 8);
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
