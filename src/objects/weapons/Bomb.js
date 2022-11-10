import AbstractWeapon from "./AbstractWeapon.js";
import Ball from "../Ball.js";

export default class Bomb extends AbstractWeapon {
    constructor(player, timerMs = 0) {
        super(player)
        this.timer = timerMs;
    }

    fire() {
        if (this.firstShot) {
            const b = new Ball(this.player.scene, this.player.x, this.player.y);

            if (this.timer > 0) {
                setTimeout(() => b.destroy(), this.timer);
            }
        }
        super.fire();
    }
}
