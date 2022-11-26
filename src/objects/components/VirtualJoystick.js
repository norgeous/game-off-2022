export default class VirtualJoystick {
  constructor(scene) {
    this.scene = scene;

    this.joyStick = this.scene.plugins.get('rexvirtualjoystickplugin').add(this, {
      x: 50,
      y: 250,
      radius: 20,
      base: this.scene.add.circle(0, 0, 20, 0x888888),
      thumb: this.scene.add.circle(0, 0, 10, 0xcccccc),
      // dir: '8dir',   // 'up&down'|0|'left&right'|1|'4dir'|2|'8dir'|3
      // forceMin: 100,
      // enable: true
    })
      .on('update', this.dumpJoyStickState, this);
    this.joyStick.setScrollFactor(0);

    this.text = this.scene.add.text(0, 0, 'DEBUGTEXT', {
      font: '10px Arial',
      color: 'white',
      // align: 'center',
      // fontWeight: 'bold',
    });
    this.text.setScrollFactor(0);

    this.dumpJoyStickState();
  }

  static preload(scene) {
    const url = 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexvirtualjoystickplugin.min.js';
    scene.load.plugin('rexvirtualjoystickplugin', url, true);
  }

  dumpJoyStickState() {
    var cursorKeys = this.joyStick.createCursorKeys();
    var s = 'Key down: ';
    for (var name in cursorKeys) {
        if (cursorKeys[name].isDown) {
            s += `${name} `;
        }
    }
    s += `Force: ${Math.floor(this.joyStick.force * 100) / 100}\nAngle: ${Math.floor(this.joyStick.angle * 100) / 100}`;
    s += '\nTimestamp:\n';
    for (var name in cursorKeys) {
        var key = cursorKeys[name];
        s += `${name}: duration=${key.duration / 1000}\n`;
    }
    this.text.setText(s);
  }
}
