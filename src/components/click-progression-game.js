import { Screen } from "../../node_modules/genie/src/core/screen.js";
import { accessibilify } from "../../node_modules/genie/src/core/accessibility/accessibilify.js";
import { gmi } from "../../node_modules/genie/src/core/gmi/gmi.js";

export class ClickProgressionGame extends Screen {
  constructor() {
    super();
  }

  create() {
    const settings = gmi.getAllSettings();
    console.log({ gmi, settings });

    gmi.setGameData("foo", "bar");

    this.scene.addLayout(["exit", "pause"]);
    this.theme = this.context.config.theme.game;
    const choiceIndex = this.transientData["character-select"].index + 1;

    console.log(this.context.config.theme.game);
    const text = this.game.add.text(
      this.theme.text.position.x,
      this.theme.text.position.y,
      this.theme.text.content,
      this.theme.text.style
    );

    this.scene.addToBackground(text);
    this.clickCount = 0;

    const buttonClicked = () => {
      this.clickCount = this.clickCount < 9 ? this.clickCount + 1 : 9;
      gmi.achievements.set({
        key: "two_clicks",
        progress: this.clickCount
      });
      if (this.clickCount >= 9) {
        console.log(this.transientData);
        this.transientData.results = "YAYAYAYAYA!!!!";

        this.navigation.next();
        return;
      }

      const egg = `egg_${choiceIndex}_${this.clickCount}`;
      console.log({ egg });

      gameButton.setFrames(egg, egg);
    };

    const gameButton = this.game.add.button(
      this.theme.gameButton.position.x,
      this.theme.gameButton.position.y,
      `game.texture-atlas`,
      buttonClicked,
      this,
      `egg_${choiceIndex}_0`
    );

    const config = {
      id: "game-button",
      ariaLabel: "Click to progress"
    };

    accessibilify(gameButton, config);

    this.scene.addToBackground(gameButton);
  }
}
