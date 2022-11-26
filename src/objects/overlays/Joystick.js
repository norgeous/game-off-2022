export default class Joystick {
  constructor(scene) {
    this.joystick = scene.plugins.get('rexvirtualjoystickplugin').add(this, {
      x: 0,
      y: 0,
      radius: 10,
      base: scene.add.circle(0, 0, 20, 0x888888),
      thumb: scene.add.circle(0, 0, 10, 0xcccccc),
      // dir: '8dir',   // 'up&down'|0|'left&right'|1|'4dir'|2|'8dir'|3
      // forceMin: 100,
      // enable: true
    })
      .setScrollFactor(0)
      .on('update', this.dumpJoyStickState, this);

    this.text = scene.add.text(5, 5, 'joystick debug', {
      font: '10px Arial',
      color: 'white',
    });
    this.text.setScrollFactor(0);

    this.joystickCursorKeys = this.joystick.createCursorKeys();

    this.dumpJoyStickState();
  }

  static preload(scene) {
    const url = 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexvirtualjoystickplugin.min.js';
    scene.load.plugin('rexvirtualjoystickplugin', url, true);
  }

  dumpJoyStickState() {
    var s = 'Key down: ';
    for (var name in this.joystickCursorKeys) {
        if (this.joystickCursorKeys[name].isDown) {
            s += `${name} `;
        }
    }
    // s += `\nForce: ${Math.floor(this.joystick.force * 100) / 100}\nAngle: ${Math.floor(this.joystick.angle * 100) / 100}`;
    // s += '\nTimestamp:\n';
    // for (var name in this.joystickCursorKeys) {
    //     var key = this.joystickCursorKeys[name];
    //     s += `${name}: duration=${key.duration / 1000}\n`;
    // }
    this.text.setText(s);
  }
}
