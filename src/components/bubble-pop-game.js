import { Screen } from "../../node_modules/genie/src/core/screen.js";
import { gmi } from "../../node_modules/genie/src/core/gmi/gmi.js";

export class BubblePopGame extends Screen {
  constructor() {
    super();
  }

  create() {
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.theme = this.context.config.theme[this.game.state.current];
    console.log(this);

    this.addAssets();

    this.game.input.onDown.add(() => {
      this.fireBubble();
    });
  }

  render() {}

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
    const bottomY = this.game.height / 2;
    const shooterImage = this.game.add.sprite(
      this.theme.shooter.position.x,
      this.theme.shooter.position.y,
      "game.shooter"
    );
    this.scene.addToBackground(shooterImage);
    shooterImage.anchor.setTo(
      this.theme.shooter.anchor.x,
      this.theme.shooter.anchor.y
    ); // ?move into config??
  }

  createAmmo() {
    this.allowFireTime = 0; // used to prevent multiple shots within 50ms of one another

    this.ammo = this.game.add.group();
    this.ammo.enableBody = true;
    this.ammo.physicsBodyType = Phaser.Physics.ARCADE;

    // TO DO: read from array here and create the correct ammo types in correct order
    const bulletImage = "game." + "game_button_2_0";
    this.ammo.createMultiple(10, bulletImage);
    this.ammo.setAll("scale.x", 0.3);
    this.ammo.setAll("scale.y", 0.3);
  }

  fireBubble() {
    if (this.game.time.now > this.allowFireTime) {
      const bullet = this.ammo.getFirstExists(false);

      if (bullet) {
        bullet.reset(0, 0);
        this.scene.addToBackground(bullet);
        bullet.lifespan = 2000;
        this.game.physics.arcade.velocityFromRotation(
          0,
          500,
          bullet.body.velocity
        );
        this.allowFireTime = this.game.time.now + 50;
      }
    }
  }
}
