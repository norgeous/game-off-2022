
export default class AbstractWeapon {
    constructor(player) {
        this.player = player;
        if (this.constructor == AbstractWeapon) {
            throw new Error("Abstract classes can't be instantiated.");
        }
    }

    fire() {
        throw new Error("Method 'fire()' must be implemented on weapon class " + this.constructor);
    }

    preLoad() {}
    update() {}
}
