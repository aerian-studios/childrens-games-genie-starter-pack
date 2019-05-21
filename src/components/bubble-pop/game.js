import { Screen } from "../../../node_modules/genie/src/core/screen.js";

import { CollisionModel } from "./collision/model.js";
import { AmmoModel } from "./ammo/model.js";

import { Ammo } from "./ammo/ammo.js";
import { Edges } from "./edges/edges.js";
// import { gmi } from "genie/src/core/gmi/gmi";

export class BubblePopGame extends Screen {
  constructor() {
    super();
  }

  create() {
    this.theme = this.context.config.theme[this.game.state.current];

    this.createComponents();

    this.game.input.onDown.add(() => {
      this.fireBubble();
    });
  }

  render() {}

  update() {
    const angleToPointer =
      this.game.physics.arcade.angleToPointer(
        this.aimLine.children[0],
        this.input.activePointer,
        true
      ) + 1.57;

    this.aimLine.rotation = angleToPointer;
  }

  createComponents() {
    this.addBackground();
    this.createPhysics();
    this.createModels();

    this.createCollisionGroups();

    this.createAmmo();
    this.createEdges();

    this.createTimer();
    this.addShooter();
    this.addTargets();
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

  createAmmo() {
    this.ammo = new Ammo(this.game, this.theme, this.models);
    this.allowFireTime = 0; // used to prevent multiple shots within 50ms of one another
  }

  addBackground = () => {
    const backgroundImage = this.game.add.image(0, 0, "game.background");
    return this.scene.addToBackground(backgroundImage);
  };

  createEdges = () => {
    this.walls = new Edges(this.game, this.theme, this.models, this.scene);
  };

  addShooter = () => {
    // empty sprite in location that theme depicts we should shoot from
    // contains the aimLine group of elements as a child
    this.shootFrom = this.game.add.sprite(
      this.theme.shootFrom.position.x,
      this.theme.shootFrom.position.y
    );
    this.scene.addToBackground(this.shootFrom);
    this.shootFrom.physicsBodyType = Phaser.Physics.ARCADE;
    this.shootFrom.addChild(this.createAimLine());
  };

  createAimLine = () => {
    this.aimLine = this.game.add.group();
    this.aimLine.physicsBodyType = Phaser.Physics.ARCADE;
    for (let i = 0; i < 20; i++) {
      const dot = this.createAimDot(-(i * 20));
      this.aimLine.add(dot);
    }
    return this.aimLine;
  };

  createAimDot = y => {
    const dot = this.game.add.graphics(0, 0);
    dot.lineStyle(0);
    dot.beginFill(0xffff0b, 0.5);
    dot.drawCircle(0, y, 10);
    dot.endFill();
    return dot;
  };

  createBullet = key => {
    const src = "game.bubble_" + key;
    const sprite = this.game.add.sprite(0, 0, src);
    sprite.bubbleKey = key;
    return sprite;
  };

  checkIfNeedMoreAmmo = minAmount => {
    if (this.ammo.children.length < minAmount) {
      this.addAmmoToGroup();
    }
  };

  killBubble = bubble => {
    bubble.kill();
  };

  fireBubble = () => {
    if (this.game.time.now > this.allowFireTime) {
      if (this.nextBubble) {
        this.currentBubble = this.nextBubble;
        this.nextBubble.body.rotation = this.aimLine.rotation;
        this.nextBubble.body.moveForward(600);
        this.allowFireTime = this.game.time.now + 200;
        this.timer.resume();
      }
    }
  };

  createTimer = () => {
    this.timer = this.game.time.create();
    this.timerEvent = this.timer.loop(150, this.addNextAmmoToScene, this);
    this.timer.start();
  };

  addNextAmmoToScene = () => {
    if (!this.ammo.length) {
      return;
    }
    this.timer.pause();
    this.nextBubble = this.ammo.getChildAt(0);
    if (this.nextBubble) {
      this.nextBubble.reset(this.shootFrom.x, this.shootFrom.y);
      this.scene.addToBackground(this.nextBubble);
    } else {
      console.log("!!! NO AMMO REMAINING !!!");
    }
  };

  addTargets = () => {
    this.targets = this.game.add.group();
    // this.game.physics.arcade.enable(this.targets);
    this.targets.enableBody = true;
    this.targets.physicsBodyType = Phaser.Physics.P2JS;

    const target1 = this.targets.create(0, -300, "game." + "game_button_1_0");
    const target2 = this.targets.create(50, -300, "game." + "game_button_2_0");
    // this.targets.add(target1);
    // this.targets.add(target2);

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
