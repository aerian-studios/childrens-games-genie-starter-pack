/* 
    A group containing the side walls that the bubbles bounce off
*/

import { Wall } from "./wall.js";

export class Edges extends Phaser.Group {
  constructor(game, theme, models) {
    super(game, 0, 0);
    this.game = game;
    this.theme = theme;
    this.models = models;

    this.enableBody = true;
    this.physicsBodyType = Phaser.Physics.P2JS;

    this.add(new Wall(game, ...this.getWallConfig("left")));
    this.add(new Wall(game, ...this.getWallConfig("right")));

    // scene.addToBackground(this);
  }

  getWallConfig = side => {
    return [
      this.theme.walls[side].position.x,
      0,
      "game." + side + "Wall",
      this.models.collisionModel.collisionGroups
    ];
  };
}
