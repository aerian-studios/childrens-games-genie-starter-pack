import { Screen } from "../../node_modules/genie/src/core/screen.js";
import { gmi } from "../../node_modules/genie/src/core/gmi/gmi.js";

export class BubblePopGame extends Screen {
  constructor() {
    super();
  }

  create() {
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.theme = this.context.config.theme[this.game.state.current];

    this.addAssets();

    this.game.input.onDown.add(() => {
      this.fireBubble();
    });
  }

  render() {}

  update() {
    this.aimLine.rotation =
      this.game.physics.arcade.angleToPointer(
        this.aimLine.children[0],
        this.input.activePointer,
        true
      ) + 1.57;
    
    this.physics.arcade.collide(this.targets, this.ammo, this.collision, null, this);
  }

  addAssets() {
    this.addBackground();
    this.addShooter();
    this.addTargets();
    this.createAmmo();

    //addForegroundCharacter
  }

  addBackground = () => {
    const backgroundImage = this.game.add.image(0, 0, "game.background");
    return this.scene.addToBackground(backgroundImage);
  };

  addTargets = () => {
    this.targets = this.game.add.group();
    this.game.physics.arcade.enable(this.targets);
    this.targets.enableBody = true;

    const target1 = this.game.add.sprite(-50, -300, "game." + "game_button_1_0");
    const target2 = this.game.add.sprite(50, -300, "game." + "game_button_2_0");
    this.targets.add(target1);
    this.targets.add(target2);
    this.targets.setAll("body.immovable", true);
    this.targets.setAll("scale.x", 0.1);
    this.targets.setAll("scale.y", 0.1); 
    this.scene.addToBackground(this.targets);
  }

  addShooter = () => {
    // empty sprite in location that theme depicts we should shoot from
    // contains the aimLine group of elements as a child
    this.shootFrom = this.game.add.sprite(
      this.theme.shootFrom.position.x,
      this.theme.shootFrom.position.y
    );
    this.scene.addToBackground(this.shootFrom);
    this.shootFrom.physicsBodyType = Phaser.Physics.ARCADE;
    this.shootFrom.anchor.setTo(
      this.theme.shootFrom.anchor.x,
      this.theme.shootFrom.anchor.y
    );
    this.shootFrom.addChild(this.createAimLine());
  };

  createAimLine = () => {
    this.aimLine = this.game.add.group(
      this.theme.shootFrom.position.x,
      this.theme.shootFrom.position.y
    );
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
    this.nextAmmoIndex = 0;

    this.ammo = this.game.add.group();
    this.ammo.enableBody = true;
    this.ammo.physicsBodyType = Phaser.Physics.ARCADE;
    // this.ammo.body.onCollide.add(collision, this);
    // TO DO: read from array here and create the correct ammo types in correct order
    const bulletImage = "game." + "game_button_2_0";
    this.ammo.createMultiple(100, bulletImage);
    this.ammo.setAll("scale.x", 0.1);
    this.ammo.setAll("scale.y", 0.1);
    this.ammo.callAll(
      "events.onOutOfBounds.add",
      "events.onOutOfBounds",
      this.killBubble
    );
    this.ammo.setAll("checkWorldBounds", true);

    this.addNextAmmoToScene();
  };

  killBubble = bubble => {
    bubble.kill();
  };

  collision = (target, bullet) => {
      bullet.body.velocity.y = 0;
      bullet.body.velocity.x = 0;
      this.ammo.remove(bullet);
      this.targets.add(bullet);
      bullet.body.immovable = true;
  };

  fireBubble = () => {
    if (this.game.time.now > this.allowFireTime) {
      if (this.currentBubble) {
        this.game.physics.arcade.velocityFromRotation(
          this.aimLine.rotation - 1.57,
          1000,
          this.currentBubble.body.velocity
        );
        this.allowFireTime = this.game.time.now + 200;

        setTimeout(this.addNextAmmoToScene, 150);
      }
    }
  };

  addNextAmmoToScene = () => {
    this.currentBubble = this.ammo.getChildAt(this.nextAmmoIndex);
    if (!this.currentBubble) {
      this.nextAmmoIndex = 0;
      this.addNextAmmoToScene();
    }
    this.currentBubble.reset(this.shootFrom.x, this.shootFrom.y);
    this.game.physics.arcade.enable(this.currentBubble);
    this.scene.addToBackground(this.currentBubble);
  };
}
