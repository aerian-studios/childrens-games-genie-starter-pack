# BBC Genie - 2

## Moving between screens

There are a couple more objects available to us when we extend Genie's screen class, that are very useful for navigation through the game.
| | Creator | Description |
| ------------ | ------ | ----------- |
| this.transientData | Genie | This is how we pass data between screens, other screens will look for certain properties in this, and the game screen can access data from other screens. We mutate this object. |
| this.navigation | Genie | The navigation object contains functions for sending the user on from the game screen. These are created using the config we set in `main.js`. The most useful is `this.navigation.next()` |

#### Progressing to the results screen

```javascript=
this.transientData.results = "Finito";
this.navigation.next();
```

_**Activity**: have the results screen appear when the button is clicked n times, n should be set in the config, show how many times the button was clicked._

#### Using data from a select screen

As mentioned `transientData` can also be used to access data from other screens. Select screens allow users to make a selection, we can access their decision in transientData.

First we have to give them some options to choose from in config.json.

###### themes/default/config.json > character-select

```json=
"choices": [
    {
        "asset": "carousel_1",
        "accessibilityText": "Character 1",
        "title": "Egbert"
    },
    {
        "asset": "carousel_2",
        "accessibilityText": "Character 2",
        "title": "Dark Egbert"
    }
],

```

Then we can look for their decision in `transientData`. Note that as well as the full object, the index of their option is also present.

###### src/components/click-progression-game.js

```javascript=
console.log(this.transientData["character-select"]);
```

_**Activity**: allow the user to select a "character"._

## Accessibility

An incredibly helpful feature of Genie is its "accessibilify" module. Canvas makes many things easier, but since it is just one element in the DOM it makes an accessible experience much more difficult to achieve. When we accessibilify an element it places a DOM element over the top of the canvas at the correct position, allowing keyboard users to access it.

#### Make our button accessible

###### src/components/click-progression-game.js

```javascript=
import { accessibilify } from "../../node_modules/genie/src/core/accessibility/accessibilify.js";

const config = {
  id: "click-to-progress-button",
  ariaLabel: "Click to progress"
};

accessibilify(gameButton, config);
```

Now you can tab to the button. When the screen is resized the proxy button updates its scale and position.

## GEL UI (Global Experience Language)

All BBC products must be GEL compliant. For Genie much of the work here is done for us. There are a number of common interface buttons for example, "home", "exit", "back", "settings".

###### src/components/click-progression-game.js

```javascript=
this.scene.addLayout(["pause"]);
```

Try adding other button names to that array.

These buttons are placed according to predefined GEL positions, so component developers typically only need specify which buttons are present, not where they are placed (it is possible to override locations, but it's not often necessary).

On resize they update their scale to ensure that their hit area is never too small.

## GMI (Global Messaging Interface)

The GMI allows persistance of data between sessions and even across different BBC games. Here the users settings are stored as well as custom data specific to the current game.

#### Persisting data

Within the GMI game specific data is stored in a `gameData` object. We can retrieve it with `getAllSettings`.

###### src/components/click-progression-game.js

```javascript=
import { gmi } from "../../node_modules/genie/src/core/gmi/gmi.js";

console.log(gmi.getAllSettings());
gmi.setGameData("foo", "bar");
```

#### Adding an achievement

Genie has built in achievement functionality, achievement assets have global styles (so always appear the same accross games and themes). There are even plans to implement a cross game score (liek xbox gamerscore).

At the component level we can define as many achievements as we like, first we must enable them.

###### theme/default/config.json > game

```json=
    "achievements": true,
```

Then we can declare each of achievement in the achivements config.

###### themes/default/achievements/config.json

```json=
{
  "key": "four_clicks",
  "name": "Four clicks",
  "description": "You've clicked four times.",
  "points": 100,
  "position": "bottom",
  "maxProgress": 4
}
```

Now all we need do is call `gmi.achievements.set` at the relevant time to update the users progress towards the achievement.

###### src/components/click-progression-game.js

```javascript=
// In gameButton callback
gameButton.data.clicks++;
gmi.achievements.set({ key: "four_clicks", progress: gameButton.data.clicks });
```

When the game is hosted on BBC servers an element will appear as ssoon as the achievement is achieved.

## Packaging Assets

When working on Bubble Pop we found that the performance benefits of texture atlases were immense.
A texture atlas is a png which contains multiple visual assets and a json file containing the size and location, of each of these so that they may be referenced with a key.

This allows the same experience to be created with far fewer cached textures.

#### Creating a texture atlas:

- Go to: https://www.leshylabs.com/apps/sstool/
- Drag in image (make sure they are named correctly as the file names will be the keys that are used to access them)
- Choose JSON-TP-Hash
- Download the png and the json

###### themes/default/game.json

```json=
{
  "key": "texture_atlas",
  "url": "null",
  "textureURL": "game/spritesheet.png",
  "atlasURL": "game/sprites.json",
  "type": "atlas",
  "overwrite": false
},
```

###### src/components/click-progression-game.js

```javascript=
const img = this.game.add.image(0, 0, "game.texture_atlas", "egg_1_0");

this.scene.addToBackground(img);
```

## Signal Bus

One final Genie module that I wanted to mention is the signal bus, this wraps Phaser's signal functionality. Signals use "pub sub" pattern, where a module can publish an event to a channel, and other modules can subscribe to channel, this triggers a callback when an event is published.

###### src/components/click-progression-game.js

```javascript=
import * as signal from "../../node_modules/genie/src/core/signal-bus.js";

this.signal = signal.bus.subscribe({
  channel: "scaler",
  name: "sizeChange",
  callback: data => {
    console.log(data);
  }
});
```

Then resize your screen.

## Links

- Genie Starter pack repo - https://github.com/bbc/childrens-games-genie-starter-pack
- Phaser 2 CE docs - https://photonstorm.github.io/phaser-ce/
- Phaser 3 docs - https://photonstorm.github.io/phaser3-docs/index.html
- Phaser 3 examples - http://phaser.io/examples
- Enable 3d example https://enable3d.io/examples.html -- Medieval Storybook is cool!
- Game mechanic explorer (uses phaser 2) - https://gamemechanicexplorer.com/
- Phaser 2 /3 benchmark demo - https://themoonrat.github.io/webgl-benchmark/?library=Pixi&version=dev&scene=0&objectCount=10000
