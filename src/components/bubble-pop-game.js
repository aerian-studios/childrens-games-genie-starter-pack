import { Screen } from "../../node_modules/genie/src/core/screen.js";
import { gmi } from "../../node_modules/genie/src/core/gmi/gmi.js";

export class BubblePopGame extends Screen {
  constructor() {
    super();
  }

  create() {
    this.game.physics.startSystem(Phaser.Physics.P2JS);
    this.game.physics.startSystem(Phaser.Physics.Arcade);

    //  Turn on impact events for the world, without this we get no collision callbacks
    this.game.physics.p2.setImpactEvents(true);

    this.game.physics.p2.restitution = 0.8;

    //  Create our collision groups. One for the player, one for the pandas
    this.ammoCollisionGroup = this.game.physics.p2.createCollisionGroup();
    this.targetCollisionGroup = this.game.physics.p2.createCollisionGroup();

    this.theme = this.context.config.theme[this.game.state.current];
    this.addComponents();

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
    // this.physics.arcade.collide(
    //   this.targets,
    //   this.currentBubble,
    //   this.collision,
    //   null,
    //   this
    // );
    this.physics.arcade.collide(this.walls, this.ammo);
  }

  addComponents() {
    this.addBackground();
    this.createEdges();
    this.addShooter();
    this.addTargets();
    this.createAmmo();
  }

  addBackground = () => {
    const backgroundImage = this.game.add.image(0, 0, "game.background");
    return this.scene.addToBackground(backgroundImage);
  };

  createEdges = () => {
    this.walls = this.game.add.group();
    this.walls.lines = {};
    this.walls.add(this.addWall("left"));
    this.walls.add(this.addWall("right"));

    this.scene.addToBackground(this.walls);
  };

  addWall = side => {
    const wall = this.game.add.sprite(
      this.theme.walls[side].position.x,
      -this.game.height / 2,
      "game." + side + "Wall"
    );
    this.game.physics.arcade.enable(wall);
    wall.enableBody = true;
    wall.body.immovable = true;
    wall.body.bounce = 1;
    return wall;
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
    target1.body.setCollisionGroup(this.targetCollisionGroup);
    target2.body.setCollisionGroup(this.targetCollisionGroup);
    target1.body.collides(this.ammoCollisionGroup);
    target2.body.collides(this.ammoCollisionGroup);

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

  createAmmo = () => {
    this.allowFireTime = 0; // used to prevent multiple shots within 50ms of one another

    this.ammo = this.game.add.group();
    this.ammo.enableBody = true;
    this.ammo.physicsBodyType = Phaser.Physics.P2JS;
    // this.game.physics.arcade.enable(this.ammo);

    this.addAmmoToGroup();

    // const bulletImage = "game." + "game_button_2_0";
    // this.ammo.createMultiple(100, bulletImage);
    // this.ammo.setAll("scale.x", 0.1);
    // this.ammo.setAll("scale.y", 0.1);
    // const bulletImage = "game." + "game_button_2_0";
    // this.ammo.createMultiple(100, bulletImage);

    this.ammo.setAll("scale.x", 0.02);
    this.ammo.setAll("scale.y", 0.02);
    this.ammo.setAll("checkWorldBounds", true);
    this.ammo.setAll("outOfBoundsKill", true);
    // this.ammo.callAll(
    //   "events.onOutOfBounds.add",
    //   "events.onOutOfBounds",
    //   this.killBubble
    // );

    // this.ammo.callAll("body.bounce.set", "body.bounce", 1);
    // this.ammo.setAll("checkWorldBounds", true);

    this.addNextAmmoToScene();
  };

  addAmmoToGroup = () => {
    let i = 0;
    let j = 0;
    while (this.ammo.length <= (this.theme.amountOfAmmo || 100)) {
      const sprite = this.ammo.create(
        j * 100,
        j * 100,
        "game.bubble_" + this.theme.ammo[i]
      );
      sprite.body.setCircle(5);
      sprite.body.setCollisionGroup(this.ammoCollisionGroup);
      sprite.body.collides([this.targetCollisionGroup], this.collision);
      // this.game.physics.enable(sprite);
      // this.ammo.add(sprite);
      i++;
      if (i >= this.theme.ammo.length) {
        i = 0;
      }

      j++;
    }
  };

  createBullet = key => {
    console.log("createBullet", key);
    const src = "game.bubble_" + key;
    const sprite = this.game.add.sprite(0, 0, src);
    sprite.bubbleKey = key;
    return sprite;
  };

  checkIfNeedMoreAmmo = minAmount => {
    console.log("check ammo");

    if (this.ammo.children.length < minAmount) {
      this.addAmmoToGroup();
    }
  };

  killBubble = bubble => {
    bubble.kill();
  };

  collision = (bullet, target) => {
    console.log("SMASHHH");

    bullet.setZeroVelocity();
    bullet.kinematic = true;
    bullet.setZeroRotation();
    target.setZeroVelocity();

    target.setZeroRotation();
    bullet.removeCollisionGroup(this.ammoCollisionGroup);
    bullet.setCollisionGroup(this.targetCollisionGroup);
    bullet.collides(this.ammoCollisionGroup, this.collision);
    console.log(bullet);
    // this.targets.add(bullet);

    // console.log("Ammo", this.ammo.length, "targets", this.targets.length);
    // bullet.body.velocity.y = 0;
    // bullet.body.velocity.x = 0;
    // // bullet.enableBody = false;
    // bullet.body.immovable = true;
    // this.killBubble(bullet);
    // this.checkIfNeedMoreAmmo(5);
  };

  fireBubble = () => {
    if (this.game.time.now > this.allowFireTime) {
      if (this.nextBubble) {
        this.currentBubble = this.nextBubble;
        // this.game.physics.arcade.velocityFromRotation(
        //   this.aimLine.rotation - 1.57,
        //   1000,
        //   this.currentBubble.body.velocity
        // );
        this.nextBubble.body.rotation = this.aimLine.rotation;
        this.nextBubble.body.moveForward(400);
        this.allowFireTime = this.game.time.now + 200;

        setTimeout(this.addNextAmmoToScene, 150); // swap for phaser timer
      }
    }
  };

  addNextAmmoToScene = () => {
    if (!this.ammo.length) {
      return;
    }
    this.nextBubble = this.ammo.getChildAt(0);
    if (this.nextBubble) {
      this.nextBubble.reset(this.shootFrom.x, this.shootFrom.y);
      this.scene.addToBackground(this.nextBubble);
    } else {
      console.log("!!! NO AMMO REMAINING !!!");
    }
  };
}
