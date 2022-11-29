import Config from '../Config';

export default class GameOver {
  constructor(scene) {
    window.WebFont.load({
      google: {
        families: [ 'Nosifer' ]
      },
      active: () => {
        scene.add.text(
          scene.scale.width/2,
          scene.scale.height/2,
          // 'game\nover!',
          '187,200',
          {
            fontFamily: 'Nosifer',
            // fontSize: 64,
            fontSize: 24,
            lineSpacing: -30,
            color: '#880000',
            align: 'center',
            backgroundColor: '#00000066',
            padding: 20,
          },
        )
          .setOrigin(0.5)
          .setShadow(2, 2, '#000000', 2, false, true)
          .setScrollFactor(0)
          .setDepth(Config.UI_DEPTH);

        scene.input.once('pointerdown', () => {
          // t.destroy();
          // TODO: go back to main menu here
        });
      }
    });
  }

  static preload(scene) {
    scene.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');
  }
}