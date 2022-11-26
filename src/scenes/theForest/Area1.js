import Phaser from 'phaser';
import Map from '../../map/Map';
import AbstractScene from '../AbstractScene.js';
import Sound from "../../objects/enums/Sound.js";
import Config from "../../objects/Config.js";

export default class Area1 extends AbstractScene {
  constructor() {
    super('forest-area1')
    this.map = new Map(this, 'theForest', 'tileset_extruded.png', 'mapData.json', 8);
  }

  preload() {
    super.preload();
  }

  create() {
    super.create();
    if (Config.PLAY_MUSIC) {
      this.audio.playMusic(Sound.MusicKey);
    }
  }

  update(time, delta) {
    super.update(time, delta);
  }
}