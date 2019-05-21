/*
    An individial wall at the side that the bubbles bounce off.
*/

export class Wall extends Phaser.Sprite {
  constructor(game, x, y, src, collisionGroups) {
    super(game, x, y, src);

    game.physics.enable(this, Phaser.Physics.P2JS);
    this.body.collides(collisionGroups.ammo);
    this.body.setCollisionGroup(collisionGroups.walls);
    this.body.kinematic = true;
    this.body.bounce = true;
  }
}
