/*
    The shooter is an empty sprite at the configured location for the bubbles to fire from.arcade
    The aim line (line of circles) is a child of the shooter.
*/

import { AimLine } from "./aimline.js";
import { Ammo } from "../ammo/ammo.js";

export class Shooter extends Phaser.Sprite {
  constructor(game, theme, models, scene) {
    super(game, theme.shooter.position.x, theme.shooter.position.y);

    this.game = game;
    this.theme = theme;
    this.models = models;
    this.scene = scene;

    this.physicsBodyType = Phaser.Physics.ARCADE;
    this.aimLine = this.addChild(new AimLine(game));
    this.allowFireTime = 0;

    this.createAmmo();
    this.createTimer();
  }

  aimAtPointer(activePointer) {
    const angleToPointer =
      this.game.physics.arcade.angleToPointer(this, activePointer, true) + 1.57;
    this.rotation = angleToPointer;
  }

  createAmmo() {
    this.ammo = new Ammo(this.game, this.theme, this.models);
  }

  createTimer() {
    this.nextAmmoTimer = this.game.time.create();
    this.nextAmmoTimer.loop(150, this.addNextAmmoToScene, this);
    this.nextAmmoTimer.start();
  }

  addNextAmmoToScene() {
    this.nextAmmoTimer.pause();
    if (!this.ammo.length) {
      return;
    }
    this.nextBubble = this.ammo.getChildAt(0);
    if (this.nextBubble) {
      this.nextBubble.reset(this.x, this.y);
      this.scene.addToBackground(this.nextBubble);
    } else {
      console.log("!!! NO AMMO REMAINING !!!");
    }
  }

  fireNextBubble() {
    if (this.nextBubble && this.game.time.now > this.allowFireTime) {
      this.nextBubble.body.rotation = this.rotation;
      // speed could be set on a level by level basis
      // will need adapting for powerballs if they are quicker etc
      this.nextBubble.body.moveForward(this.theme.shooter.fireSpeed);
      this.allowFireTime = this.game.time.now + 200;
      this.nextAmmoTimer.resume();
    }
  }
}
