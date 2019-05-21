export class Ammo extends Phaser.Group {
  constructor(game, theme, models, collisionGroups) {
    super(game, 0, 0);

    this.game = game;
    this.theme = theme;
    this.collisionGroups = collisionGroups;
    this.ammoModel = models.ammoModel;

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
      sprite.body.setCollisionGroup(this.collisionGroups.ammo);
      sprite.body.collides([
        this.collisionGroups.targets,
        this.collisionGroups.walls
      ]);
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

  collision() {
    console.log("Collisoon");
  }
}
