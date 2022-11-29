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

    scene.input.once('pointerdown', () => {
      gameOver.text.destroy();
      // TODO: go back to main menu here
    });
  }
}
