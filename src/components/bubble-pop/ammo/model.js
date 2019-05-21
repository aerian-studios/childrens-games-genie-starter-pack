import { Model } from "../utility/model.js";

export class AmmoModel extends Model {
  constructor(game, theme) {
    super(game);

    const easyModeEnabled = false; // hardcoded for now
    this.remainingAmmo = easyModeEnabled
      ? "infinity"
      : theme.amountOfAmmo || 100;
  }

  init() {
    super.init();
  }

  getRemainingAmmo = () => {
    return this.remainingAmmo;
  };
}
