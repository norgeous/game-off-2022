export default class Joystick {
  constructor(scene) {
    this.joystick = scene.plugins.get('rexvirtualjoystickplugin').add(this, {
      x: 0,
      y: 0,
      radius: 10,
      base: scene.add.circle(0, 0, 40, 0x888888),
      thumb: scene.add.circle(0, 0, 20, 0xcccccc),
      // dir: '8dir',   // 'up&down'|0|'left&right'|1|'4dir'|2|'8dir'|3
      // forceMin: 100,
      // enable: true
    }).setScrollFactor(0);

    this.joystickCursorKeys = this.joystick.createCursorKeys();
  }

  static preload(scene) {
    const url = 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexvirtualjoystickplugin.min.js';
    scene.load.plugin('rexvirtualjoystickplugin', url, true);
  }
}
