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
  }

  addAssets() {
    this.addBackground();
    this.addShooter();
    this.createAmmo();
    //addTargets
    //addForegroundCharacter
  }

  addBackground() {
    const backgroundImage = this.game.add.image(0, 0, "game.background");
    return this.scene.addToBackground(backgroundImage);
  }

  addShooter() {
    this.shooter = this.game.add.sprite(
      this.theme.shooter.position.x,
      this.theme.shooter.position.y,
      "game.shooter"
    );
    this.scene.addToBackground(this.shooter);
    this.shooter.physicsBodyType = Phaser.Physics.ARCADE;
    this.shooter.anchor.setTo(
      this.theme.shooter.anchor.x,
      this.theme.shooter.anchor.y
    );
    this.shooter.angle = 0;

    console.log(this.shooter);

    this.aimLine = this.game.add.group(
      this.theme.shooter.position.x,
      this.theme.shooter.position.y
    );
    this.aimLine.physicsBodyType = Phaser.Physics.ARCADE;
    for (let i = 0; i < 20; i++) {
      //? swap for image?
      const graphics = this.game.add.graphics(0, 0);
      graphics.lineStyle(0);
      graphics.beginFill(0xffff0b, 0.5);
      graphics.drawCircle(0, -(i * 20), 10);
      graphics.endFill();
      this.aimLine.add(graphics);
    }
    console.log(this.aimLine.world);

    this.shooter.addChild(this.aimLine);
    // this.aimLine.rotation = 1.57;
    // this.aimLine.anchor.setTo(0.5, 1.0);
  }

  createAmmo() {
    this.allowFireTime = 0; // used to prevent multiple shots within 50ms of one another

    this.ammo = this.game.add.group();
    this.ammo.enableBody = true;
    this.ammo.physicsBodyType = Phaser.Physics.ARCADE;

    // TO DO: read from array here and create the correct ammo types in correct order
    const bulletImage = "game." + "game_button_2_0";
    this.ammo.createMultiple(100, bulletImage);
    this.ammo.setAll("scale.x", 0.3);
    this.ammo.setAll("scale.y", 0.3);
  }

  fireBubble() {
    if (this.game.time.now > this.allowFireTime) {
      const bullet = this.ammo.getFirstExists(false);

      if (bullet) {
        bullet.reset(this.shooter.x, this.shooter.y);
        this.scene.addToBackground(bullet);
        bullet.lifespan = 2000;
        this.game.physics.arcade.velocityFromRotation(
          this.aimLine.rotation - 1.57,
          1000,
          bullet.body.velocity
        );
        this.allowFireTime = this.game.time.now + 50;
      }
    }
  }
}
