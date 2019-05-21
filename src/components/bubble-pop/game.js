import { Screen } from "../../../node_modules/genie/src/core/screen.js";

import { AmmoModel } from "./ammo/model.js";
import { Ammo } from "./ammo/ammo.js";
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
    this.physics.arcade.collide(this.walls, this.ammo);
  }

  createComponents() {
    this.addBackground();
    this.createPhysics();
    this.createModels();
    this.createAmmo();
    this.createEdges();
    this.createTimer();
    this.addShooter();
    this.addTargets();
    this.createAmmo();
  }

  createPhysics() {
    this.game.physics.startSystem(Phaser.Physics.P2JS);
    this.game.physics.startSystem(Phaser.Physics.Arcade);

    //  Turn on impact events for the world, without this we get no collision callbacks
    this.game.physics.p2.setImpactEvents(true);
    this.game.physics.p2.restitution = 0.8;

    this.collisionGroups = {
      ammo: this.game.physics.p2.createCollisionGroup(),
      targets: this.game.physics.p2.createCollisionGroup(),
      walls: this.game.physics.p2.createCollisionGroup()
    };
  }

  createModels() {
    this.models = {
      ammoModel: new AmmoModel(this.game, this.theme)
    };
  }

  createAmmo() {
    this.ammo = new Ammo(
      this.game,
      this.theme,
      this.models,
      this.collisionGroups
    );

    this.allowFireTime = 0; // used to prevent multiple shots within 50ms of one another
  }

  addBackground = () => {
    const backgroundImage = this.game.add.image(0, 0, "game.background");
    return this.scene.addToBackground(backgroundImage);
  };

  createEdges = () => {
    this.walls = this.game.add.group();
    this.walls.enableBody = true;
    this.walls.physicsBodyType = Phaser.Physics.P2JS;
    const leftWall = this.walls.create(...this.wallConfig("left"));
    const rightWall = this.walls.create(...this.wallConfig("right"));

    leftWall.body.collides(this.collisionGroups.ammo);
    rightWall.body.collides(this.collisionGroups.ammo);
    leftWall.body.setCollisionGroup(this.collisionGroups.targets);
    rightWall.body.setCollisionGroup(this.collisionGroups.targets);

    this.walls.setAll("body.kinematic", true);
    leftWall.body.bounce = true;
    rightWall.body.bounce = true;

    this.scene.addToBackground(this.walls);
  };

  wallConfig = side => {
    return [this.theme.walls[side].position.x, 0, "game." + side + "Wall"];
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
    target1.body.setCollisionGroup(this.collisionGroups.targets);
    target2.body.setCollisionGroup(this.collisionGroups.targets);
    target1.body.collides(this.collisionGroups.ammo, this.collision);
    target2.body.collides(this.collisionGroups.ammo, this.collision);
    this.targets.setAll("body.kinematic", true);
    this.targets.setAll("scale.x", 0.1);
    this.targets.setAll("scale.y", 0.1);
    this.scene.addToBackground(this.targets);
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

  collision = (bullet, target) => {
    if (target.bounce) return;

    bullet.setZeroVelocity();
    bullet.kinematic = true;
    bullet.setZeroRotation();
    target.setZeroVelocity();

    target.setZeroRotation();
    bullet.removeCollisionGroup(this.collisionGroups.ammo);
    bullet.setCollisionGroup(this.collisionGroups.targets);
    bullet.collides(this.collisionGroups.ammo, this.collision);
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
}
