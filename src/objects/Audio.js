import Sound from './enums/Sound';

export default class Audio  {

  constructor(scene) {
    this.scene = scene;
    this.music = {};
    this.sfx = {};

    this.config = {
      music: {
        volume: 0.6,
      },
      sfx: {
        volume: 0.4,
      },
    }
  }

  preLoad() {
    this.scene.load.audio(Sound.BombBlast, 'sounds/musket-explosion.mp3');
    this.scene.load.audio(Sound.MachineGunFire, 'sounds/gun-burst.mp3'); // not used? gun-burst.mp3 is quite a long sound...
    this.scene.load.audio(Sound.GunBurst, 'sounds/machine-gun.mp3');
    this.scene.load.audio(Sound.Lazer, 'sounds/lazer.wav'); // was pistol.wav
    this.scene.load.audio(Sound.Pistol, 'sounds/single-gunshot.mp3');
    this.scene.load.audio(Sound.Shotgun, 'sounds/shotgun-with-reload.mp3');
    this.scene.load.audio(Sound.Flame, 'sounds/fire-wind.mp3');
    this.scene.load.audio(Sound.PlayerDeath, 'sounds/man-scream.mp3');
    this.scene.load.audio(Sound.RocketLaunch, 'sounds/lazer_wall_off.mp3');
    this.scene.load.audio(Sound.GrenadeLaunch, 'sounds/pusher.wav');
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
      this.music[key].loop = true;
      this.music[key].play();
    }
  }

  playSfx(key) {
    if (!this.sfx[key].isPlaying) {
      this.sfx[key].play();
    }
  }

  playSfxNow(key, config = {}) {
    this.scene.sound.add(
      key,
      {
        ...this.config.sfx,
        ...config,
      },
    ).play();
  }
}
