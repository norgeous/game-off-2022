import AbstractWeapon from "./AbstractWeapon.js";
import Ball from "../Ball.js";

export default class MachineGun extends AbstractWeapon {
    constructor(player) {
        super(player)
    }

    fire() {
        const bullet = new Ball(this.player.scene, this.player.x, this.player.y);
    }
    
    fireRelease() {
        this.firstShot = false;
    }
}
