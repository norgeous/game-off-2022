import Phaser from 'phaser';
import Joystick from '../overlays/Joystick';
import Button from '../overlays/Button';

// callback based on screen pad and joystick and keyboard handler
export default class VirtualJoypad {
  constructor(
    scene,
    {
      onUpdateDirection,
      onPressJump,
      onPressFire,
      onReleaseFire,
      onPressSwitch,
    }) {
    this.scene = scene;
    this.onUpdateDirection = onUpdateDirection;

    // on screen joystick
    const joystick = new Joystick(scene);
    this.joystick = joystick.joystick; // the displayed stick
    this.joystickCursorKeys = joystick.joystickCursorKeys; // the cursor key data
    this.joystick.on('update', () => this.changeDirection(), this);

    // on screen buttons
    this.jumpButton = new Button(scene, { text: '🦘', onClick: onPressJump });
    this.fireButton = new Button(scene, { text: '🔥', onClick: onPressFire, onClickRelease: onReleaseFire });
    this.switchButton = new Button(scene, { text: '💱', onClick: onPressSwitch });

    // set on screen positions of joystick and buttons
    this.reposition();

    // both wasd and joystickCursorKeys share this format!
    this.wasd = {
      up: this.registerKeyboardEvents('W', () => this.changeDirection(), () => this.changeDirection()),
      left: this.registerKeyboardEvents('A', () => this.changeDirection(), () => this.changeDirection()),
      down: this.registerKeyboardEvents('S', () => this.changeDirection(), () => this.changeDirection()),
      right: this.registerKeyboardEvents('D', () => this.changeDirection(), () => this.changeDirection()),
    };

    // keyboard jump, fire and switch events
    this.registerKeyboardEvents('SPACE', onPressJump);
    this.registerKeyboardEvents('E', onPressFire, onReleaseFire);
    this.registerKeyboardEvents('Q', onPressSwitch);
  }

  static preload(scene) {
    Joystick.preload(scene);
  }

  registerKeyboardEvents(keyName, onPress, onRelease) {
    const key = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[keyName])
    if (onPress) key.on('down', () => onPress());
    if (onRelease) key.on('up', () => onRelease());
    return key;
  }

  changeDirection() {
    // something changed in joystickCursorKeys or wasd

    // starting with 0,0
    const direction = {
      x: 0,
      y: 0,
    };

    // add or minus 1 given the directional inputs
    if (this.wasd.left.isDown || this.joystickCursorKeys.left.isDown) direction.x--;
    if (this.wasd.right.isDown || this.joystickCursorKeys.right.isDown) direction.x++;
    if (this.wasd.up.isDown || this.joystickCursorKeys.up.isDown) direction.y--;
    if (this.wasd.down.isDown || this.joystickCursorKeys.down.isDown) direction.y++;

    // send the direction out to the wider world
    this.onUpdateDirection(direction);
  }

  reposition() {
    const { width, height } = this.scene.game.scale;
    this.joystick.x = 30;
    this.joystick.y = height - 30;

    this.switchButton.x = width - 30;
    this.switchButton.y = height - 60;

    this.jumpButton.x = width - 60;
    this.jumpButton.y = height - 30;

    this.fireButton.x = width - 30;
    this.fireButton.y = height - 30;
  }
}
