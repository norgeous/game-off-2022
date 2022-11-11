import AbstractWeapon from "./AbstractWeapon.js";
import Ball from "../Ball.js";

export default class MachineGun extends AbstractWeapon {
    constructor(player) {
        super(player)
    }

    fire() {
        if (this.firstShot) {
            new Ball(this.player.scene, this.player.x, this.player.y);
            this.firstShot = false;
        }
    }
    
    fireRelease() {
        this.firstShot = false;
    }
}
