export class Targets extends Phaser.Group {
  constructor(game) {
    super(game, 0, 0);
  }
}

// addTargets = () => {
//     this.targets = this.game.add.group();
//     this.targets.enableBody = true;
//     this.targets.physicsBodyType = Phaser.Physics.P2JS;

//     const target1 = this.targets.create(0, -300, "game." + "game_button_1_0");
//     const target2 = this.targets.create(50, -300, "game." + "game_button_2_0");

//     target1.body.setCircle(10);
//     target2.body.setCircle(10);
//     target1.body.setCollisionGroup(
//       this.models.collisionModel.collisionGroups.targets
//     );
//     target2.body.setCollisionGroup(
//       this.models.collisionModel.collisionGroups.targets
//     );
//     target1.body.collides(this.models.collisionModel.collisionGroups.ammo);
//     target2.body.collides(this.models.collisionModel.collisionGroups.ammo);
//     this.targets.setAll("body.kinematic", true);
//     this.targets.setAll("scale.x", 0.1);
//     this.targets.setAll("scale.y", 0.1);
//     this.scene.addToBackground(this.targets);
//   };
