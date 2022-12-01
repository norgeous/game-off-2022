import BloodFont from './BloodFont';

export default class GameComplete {
  constructor(scene) {
    const gameComplete = new BloodFont(
      scene,
      scene.scale.width/2,
      scene.scale.height/2,
      {
        text: 'You win\nthe game!',
        origin: 0.5,
        align: 'center',
        backgroundColor: '#00000066',
        padding: 20,
      },
    );

    // scene.input.keyboard.on('keydown', () => {
    //   gameComplete.text.destroy();
    //   scene.scene.start('main-menu');
    //   window.location.reload();
    // });

    setTimeout(() => {
      scene.input.once('pointerdown', () => {
        gameComplete.text.destroy();
        // scene.scene.start('main-menu');
        window.location.reload();
      });
    }, 5_000);
  }
}
