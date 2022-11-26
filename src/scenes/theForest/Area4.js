import Phaser from 'phaser';
import Map from '../../map/Map';
import Audio from '../../objects/Audio';
import AbstractScene from "../AbstractScene.js";

export default class Area4 extends AbstractScene {
  constructor() {
    super('forest-area4')
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
