import Phaser from 'phaser';

export default class PlayerInput {
    constructor(scene) {
        this.scene = scene;
        this.keys = {
            upKey: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
            downKey: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
            leftKey: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
            rightKey: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
            jumpKey: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
            fireKey: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),
            cycleWeaponsKey: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q),
        };

        // Map any key press to an invoked event we can hook into anywhere in the code via a phaser scene.
        this.keyToEventmapper = {
            'fireKey' : 'fireWeapon',
            'jumpKey' : 'playerJump',
            'cycleWeaponsKey' : 'cycleWeapon',
        };

        this.registerInputEvents();
    };

    registerInputEvents () {
        Object.entries(this.keys).forEach(entry => {
            const [key, value] = entry;
            this.registerEvent(value, key,'down');
        });
    }

    registerEvent(value, key, event) {
        value.on(event, () => {
            let mappedEvent = this.mapKeyToEvent(key);
            if (!mappedEvent) {
                return;
            }
            if (event) {
                this.scene.events.emit(mappedEvent);
            }
        });
    }

    mapKeyToEvent(key) {
        if (key in this.keyToEventmapper) {
            return this.keyToEventmapper[key];
        }
    }
}
