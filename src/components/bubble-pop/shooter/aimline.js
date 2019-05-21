export class AimLine extends Phaser.Group {
  constructor(game) {
    super(game);
    this.game = game;
    this.physicsBodyType = Phaser.Physics.ARCADE;
    for (let i = 0; i < 20; i++) {
      const dot = this.createAimDot(-(i * 20));
      this.add(dot);
    }
  }

  createAimDot = y => {
    const dot = this.game.add.graphics(0, 0);
    dot.lineStyle(0);
    dot.beginFill(0xffff0b, 0.5);
    dot.drawCircle(0, y, 10);
    dot.endFill();
    return dot;
  };
}
