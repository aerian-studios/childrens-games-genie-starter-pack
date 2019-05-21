import { Screen } from "../../../node_modules/genie/src/core/screen.js";

import { CollisionModel } from "./collision/model.js";
import { AmmoModel } from "./ammo/model.js";

import { Edges } from "./edges/edges.js";
import { Shooter } from "./shooter/shooter.js";
// import { gmi } from "genie/src/core/gmi/gmi";

export class BubblePopGame extends Screen {
  constructor() {
    super();
  }

  create() {
    this.theme = this.context.config.theme[this.game.state.current];

    this.createComponents();
    this.createInputs();
  }

  render() {}

  update() {
    this.shooter.aimAtPointer(this.input.activePointer);
  }

  createComponents() {
    this.addBackground();
    this.createPhysics();
    this.createModels();

    this.createCollisionGroups();

    this.createEdges();
    this.createShooter();

    this.addTargets();
  }

  createInputs() {
    this.game.input.onDown.add(() => {
      this.shooter.fireNextBubble();
    });
  }

  createPhysics() {
    this.game.physics.startSystem(Phaser.Physics.P2JS);
    this.game.physics.startSystem(Phaser.Physics.Arcade);

    this.game.physics.p2.setImpactEvents(true);
    this.game.physics.p2.restitution = 0.8; // todo: research
  }

  createModels() {
    this.models = {
      ammoModel: new AmmoModel(this.game, this.theme),
      collisionModel: new CollisionModel(this.game)
    };
  }

  createCollisionGroups() {
    this.models.collisionModel.createMultipleCollisionGroups([
      "ammo",
      "targets",
      "walls"
    ]);
  }

  addBackground = () => {
    const backgroundImage = this.game.add.image(0, 0, "game.background");
    this.scene.addToBackground(backgroundImage);
  };

  createEdges = () => {
    this.walls = new Edges(this.game, this.theme, this.models);
    this.scene.addToBackground(this.walls);
  };

  createShooter() {
    this.shooter = new Shooter(this.game, this.theme, this.models, this.scene);
    this.scene.addToBackground(this.shooter);
  }

  addTargets = () => {
    this.targets = this.game.add.group();
    this.targets.enableBody = true;
    this.targets.physicsBodyType = Phaser.Physics.P2JS;

    const target1 = this.targets.create(0, -300, "game." + "game_button_1_0");
    const target2 = this.targets.create(50, -300, "game." + "game_button_2_0");

    target1.body.setCircle(10);
    target2.body.setCircle(10);
    target1.body.setCollisionGroup(
      this.models.collisionModel.collisionGroups.targets
    );
    target2.body.setCollisionGroup(
      this.models.collisionModel.collisionGroups.targets
    );
    target1.body.collides(this.models.collisionModel.collisionGroups.ammo);
    target2.body.collides(this.models.collisionModel.collisionGroups.ammo);
    this.targets.setAll("body.kinematic", true);
    this.targets.setAll("scale.x", 0.1);
    this.targets.setAll("scale.y", 0.1);
    this.scene.addToBackground(this.targets);
  };
}

// createBullet = key => {
//   const src = "game.bubble_" + key;
//   const sprite = this.game.add.sprite(0, 0, src);
//   sprite.bubbleKey = key;
//   return sprite;
// };
