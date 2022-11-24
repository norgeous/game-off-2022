import Sound from './enums/Sound';

export default class Audio  {
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

  preLoad() {
    this.scene.load.audio(Sound.BombBlast, '/sounds/musket-explosion.mp3');
    this.scene.load.audio(Sound.MachineGunFire, '/sounds/gun-burst.mp3');
    this.scene.load.audio(Sound.GunBurst, '/sounds/machine-gun.mp3');
    this.scene.load.audio(Sound.Pistol, '/sounds/pistol.wav');
  }

  create() {
    this.createMusic(Sound.MusicKey);
    this.createSfx(Sound.BombBlast);
    this.createSfx(Sound.MachineGunFire);
    this.createSfx(Sound.GunBurst);
    this.createSfx(Sound.Pistol);
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
  
  playSfxNow(key) {
    this.scene.sound.add(key).play();
  }
}
