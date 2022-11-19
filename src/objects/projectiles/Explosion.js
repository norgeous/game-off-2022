import Phaser from 'phaser';

class Explosion {
  constructor (scene, x, y, { radius, force }) {
    // draw a circle at size of explosion radius
    const circle = scene.add.circle(x, y, radius);
    circle.setStrokeStyle(1, 0xFF0000);
    scene.time.delayedCall(500, () => circle.destroy());

    // find close zombies and apply force to them
    scene.zombieGroup.getChildren().forEach(zombie => {
      const distance = Phaser.Math.Distance.BetweenPoints({ x, y }, zombie);
      const isInsideRadius = distance <= radius;

      if (isInsideRadius) {
        const blastVector = {
          x: (zombie.x - x),
          y: (zombie.y - y),
        };

        const angleOfVelocity = Math.atan2(blastVector.y, blastVector.x);

        const forceVector ={
          x: Math.cos(angleOfVelocity),
          y: Math.sin(angleOfVelocity),
        };

        // console.log({ blastVector, forceVector });

        zombie.setVelocity(forceVector.x*force, (forceVector.y*force) - 5);
      }
    });
  }
}

export default Explosion;