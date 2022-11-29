import Config from '../Config';

export default class BloodFont {
  constructor(
    scene,
    x, y,
    {
      text,
      origin = undefined,
      ...options
    },
  ) {
    window.WebFont.load({
      google: {
        families: [ 'Nosifer' ]
      },
      active: () => {
        this.text = scene.add.text(
          x,
          y,
          text,
          {
            fontFamily: 'Nosifer',
            fontSize: 64,
            lineSpacing: -30,
            color: '#880000',
            ...options,
          },
        ).setShadow(2, 2, '#000000', 2, false, true)
          .setScrollFactor(0)
          .setDepth(Config.UI_DEPTH);

        if (origin) this.text.setOrigin(origin);
      }
    });
  }

  static preload(scene) {
    scene.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');
  }
}