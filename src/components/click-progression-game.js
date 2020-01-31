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

    const gameButton = this.game.add.button(
      100,
      100,
      "game.game_button",
      () => console.log("clicked", this),
      this
    );

    this.scene.addToBackground(gameButton);
  }
}
