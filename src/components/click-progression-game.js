import { Screen } from "../../node_modules/genie/src/core/screen.js";

export class ClickProgressionGame extends Screen {
  constructor() {
    super();
  }

  create() {
    this.theme = this.context.config.theme.game;
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
      gameButton.loadTexture(`game.game_button_1_${this.clickCount}`);
    };

    const gameButton = this.game.add.button(
      100,
      100,
      "game.game_button_1_0",
      buttonClicked,
      this
    );

    this.scene.addToBackground(gameButton);
  }
}
