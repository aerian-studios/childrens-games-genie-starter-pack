import { Model } from "../utility/model.js";

export class CollisionModel extends Model {
  constructor(game) {
    super(game);

    this.game = game;

    this.collisionGroups = {};
  }

  createCollisionGroup(name) {
    this.collisionGroups[name] = this.game.physics.p2.createCollisionGroup();
  }

  createMultipleCollisionGroups(namesArr) {
    namesArr.forEach(name => {
      this.createCollisionGroup(name);
    });
  }

  addCollision(sprite, collidesWith, callback) {
    sprite.body.collides(collidesWith, callback);
  }
}
