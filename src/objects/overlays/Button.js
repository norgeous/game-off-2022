import Phaser from 'phaser';

export default class Button extends Phaser.GameObjects.Container {
  constructor(scene, { text, onClick = () => {}, onClickRelease = () => {}}) {
    super(scene, 0, 0);

    this.onClick = onClick;
    this.onClickRelease = onClickRelease;

    this.circle = scene.add.circle(0, 0, 10, 0xcccccc)
      .setScrollFactor(0)
      .setInteractive({ useHandCursor: true })
      .on('pointerover', () => this.enterButtonHoverState() )
      .on('pointerout', () => this.enterButtonRestState() )
      .on('pointerdown', () => {
        this.onClick();
        this.enterButtonActiveState();
      })
      .on('pointerup', () => {
        this.onClickRelease();
        this.enterButtonHoverState();
      });
    this.add(this.circle);

    this.text = scene.add.text(0, 0, text, {
      color: '#0f0',
      font: '12px Arial',
      align: 'center',
      fontWeight: 'bold',
    }).setOrigin(0.5);
    this.add(this.text);

    this.setDepth(1000).setScrollFactor(0);

    // container
    scene.add.existing(this);
  }

  enterButtonHoverState() {
    this.circle.setFillStyle(0x00FFFF);
    this.text.setStyle({ color: '#ff0'});
  }

  enterButtonRestState() {
    this.circle.setFillStyle(0xcccccc);
    this.text.setStyle({ color: '#0f0'});
  }

  enterButtonActiveState() {
    this.circle.setFillStyle(0xFF0000);
    this.text.setStyle({ color: '#f7f' });
  }
}
