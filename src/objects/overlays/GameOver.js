import BloodFont from './BloodFont';

export default class GameOver {
  constructor(scene) {
    const gameOver = new BloodFont(
      scene,
      scene.scale.width/2,
      scene.scale.height/2,
      {
        text: 'game\nover!',
        origin: 0.5,
        align: 'center',
        backgroundColor: '#00000066',
        padding: 20,
      },
    );

    setTimeout(() => {
      scene.input.once('pointerdown', () => {
        gameOver.text.destroy();
        // scene.scene.start('main-menu');
        window.location.reload();
      });
    }, 5_000);
  }
}
