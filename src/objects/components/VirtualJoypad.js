import Joystick from '../overlays/Joystick';
import Button from '../overlays/Button';

export default class VirtualJoypad {
  constructor(scene) {
    this.scene = scene;

    this.joystick = new Joystick(scene);
    this.switchButton = new Button(scene, { text: 'S' });
    this.jumpButton = new Button(scene, { text: 'J' });
    this.fireButton = new Button(scene, { text: 'F' });

    this.text = scene.add.text(0, 0, 'DEBUGTEXT', {
      font: '10px Arial',
      color: 'white',
    });
    this.text.setScrollFactor(0);

    this.reposition();
  }

  static preload(scene) {
    Joystick.preload(scene);
  }

  reposition() {
    const { width, height } = this.scene.game.scale;
    this.joystick.joystick.x = 30;
    this.joystick.joystick.y = height - 30;

    this.switchButton.x = width - 90;
    this.switchButton.y = height - 30;

    this.jumpButton.x = width - 60;
    this.jumpButton.y = height - 30;

    this.fireButton.x = width - 30;
    this.fireButton.y = height - 30;
  }
}
