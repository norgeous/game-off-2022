import Ball from "../Ball.js";

export default class AbstractWeapon {
    constructor(player) {
        this.player = player;
        if (this.constructor == AbstractWeapon) {
            throw new Error("Abstract classes can't be instantiated.");
        }
        this.firstShot = true;
    }

    fire() {
        if (this.firstShot) {
            this.firstShot = false;
        }
    }

    fireRelease() {
        this.firstShot = true;
    }
    preLoad() {}
    update() {}
}