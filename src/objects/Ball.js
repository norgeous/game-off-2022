class Ball {
  constructor(scene, x, y) {
    // create ball
    this.text = scene.add.text(
      0,
      0,
      '💣',
      { font: '50px Arial', align: 'center' },
    ).setOrigin(0.5);

    const gameObjectShape = {
      shape: { type: 'circle', radius: 26 },
      restitution: 1,
    };
    this.gameObject = scene.matter.add.gameObject(this.text, gameObjectShape);
    this.gameObject
      .setMass(100)
      .setBounce(1)
      .setFrictionAir(0)
      .setDisplaySize(10, 10)
      .setVelocity(10, -5);
    this.gameObject.body.label = 'ball';

    this.gameObject.x = x ?? 100;
    this.gameObject.y = y ?? 1250;
  }

  destroy() {
    this.gameObject.destroy();
    delete this.gameObject;
  }
}

export default Ball;
