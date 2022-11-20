export default class Audio {
  static instance = this;
  constructor(scene) {

    this.scene = scene;
    this.music = {};
    this.sfx = {};

    this.config = {
      music: {
        volume: 0.05
      },
      sfx: {
        volume: 1
      }
    }
  }

  createMusic(key, config = null) {
    this.music[key] = this.scene.sound.add(key, config ?? this.config.music);
  }

  createSfx(key, config = null) {
    this.sfx[key] = this.scene.sound.add(key, config ?? this.config.sfx);
  }

  playMusic(key) {
    if (!this.music[key].isPlaying) {
      this.music[key].play();
    }
  }

  playSfx(key) {
    if (!this.sfx[key].isPlaying) {
      this.sfx[key].play();
    }
  }

  loadSound() {

  }
}
