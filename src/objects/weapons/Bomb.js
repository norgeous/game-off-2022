import AbstractWeapon from "./AbstractWeapon.js";
import Ball from "../Ball.js";

export default class Bomb extends AbstractWeapon {
    constructor(player) {
        super(player)
    }

    fire() {
        new Ball(this.player.scene, this.player.x, this.player.y);
    }
}
