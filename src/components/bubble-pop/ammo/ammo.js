export class Ammo extends Phaser.Group {
  constructor(game, theme, models) {
    super(game, 0, 0);

    this.game = game;
    this.theme = theme;
    this.ammoModel = models.ammoModel;
    this.collisionModel = models.collisionModel;

    this.addBody();
    this.addAmmo();
    this.styleAmmo();
  }

  addBody() {
    this.enableBody = true;
    this.physicsBodyType = Phaser.Physics.P2JS;
  }

  addAmmo() {
    let i = 0;
    const totalAmmo = this.ammoModel.getRemainingAmmo();
    const ammoToCreate = totalAmmo === "infinity" ? 100 : totalAmmo;
    while (this.length <= ammoToCreate) {
      const sprite = this.create(0, 0, "game.bubble_" + this.theme.ammo[i]);
      sprite.body.setCircle(10);
      sprite.body.setCollisionGroup(this.collisionModel.collisionGroups.ammo);
      sprite.body.collides(
        [
          this.collisionModel.collisionGroups.targets,
          this.collisionModel.collisionGroups.walls
        ],
        this.collision,
        this
      );
      i++;
      if (i >= this.theme.ammo.length) {
        i = 0;
      }
    }
  }

  styleAmmo() {
    this.setAll("width", 20);
    this.setAll("height", 20);
    this.setAll("checkWorldBounds", true);
    this.setAll("outOfBoundsKill", true);
  }

  collision(bullet, target) {
    if (target.bounce) return; // find better way

    bullet.setZeroVelocity();
    bullet.kinematic = true;
    bullet.setZeroRotation();
    bullet.removeCollisionGroup(this.collisionModel.collisionGroups.ammo);
    bullet.setCollisionGroup(this.collisionModel.collisionGroups.targets);
    bullet.collides(this.collisionModel.collisionGroups.ammo);
  }

  // will be used for when easy mode is enabled
  // checkIfNeedMoreAmmo = minAmount => {
  //   if(!easyMode) return;
  //   if (this.ammo.children.length < minAmount) {
  //     this.addAmmoToGroup();
  //   }
  // };
}
