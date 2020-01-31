# BBC Genie

The aim of this session is to give everyone an overview of what the BBC Genie framework is. We have already created one Genie component (Bubble Pop), and it's two production themes and are about to begin working on the Tower Defense component.

## What is Genie?

#### BBC definition

> Genie is a modular framework designed to simplify the construction of children's games. It uses Phaser 2 CE / Phaser 3, an HTML5 game engine.

> Genie provides a set of reusable components common to BBC games such as a load screen, select screen, pause, how to play, as well as an implementation of the standard BBC Games GEL UI. This means game developers can focus on creating the gameplay component, as much of the logic surrounding the game has been provided.

https://github.com/bbc/childrens-games-genie-starter-pack/blob/master/docs/getting-started.md

#### Key advantages:

- Compliance with GEL
- Product management (distributing bug fixes)
- All of the development budget (30 - 40k) can be spent on the game screen itself

## What is Phaser?

Phaser is a 2D HTML5 game engine built by Photon Storm, it can be used to create games for desktop and mobile. It renders games with the canvas renderer or WebGL, and can switch between the two automatically based on device performance.

Phaser 2 has now been handed over to the community and is still maintained as Phaser CE, it uses a custom build of pixi.js for rendering. Phaser 3 is still managed by Photon Storm but is free to use and boasts some impressive performance increases with it's bespoke rendering library.

**Performance benchmark demo:** https://themoonrat.github.io/webgl-benchmark/?library=Pixi&version=dev&scene=0&objectCount=10000

## Setup

1. `git clone git@github.com:aerian-studios/childrens-games-genie-starter-pack.git`
2. `cd childrens-games-genie-starter-pack`
3. `npm i`
4. `npm start`

## Genie Screens

The Genie screen class extends the Phaser "state" class.

These are the Genie screens:

- Loading
- Home (start screen)
- Select
- Results
- Pause
- How to play
- Game (where the magic happens)

In the process of creating a Genie component we only actually create the game screen, and configure the other screens.

**MOTD can you kick it game:** https://www.bbc.co.uk/cbbc/games/motd-can-you-kick-it-game

We setup routes in main.js, then we need not touch it for the rest of the development process.

###### src/main.js

```javascript=
const navigationConfig = goToScreen => {
  const goToHome = data => goToScreen("home", data);
  const goToCharacterSelect = data => goToScreen("character-select", data);
  const goTolevelSelect = data => goToScreen("level-select", data);
  const goToGame = data => goToScreen("game", data);
  const goToResults = data => goToScreen("results", data);

  return {
    loadscreen: {
      state: Loadscreen,
      routes: {
        next: goToHome
      }
    },
    home: {
      state: Home,
      routes: {
        next: goToCharacterSelect
      }
    },
    "character-select": {
      state: Select,
      routes: {
        next: goTolevelSelect,
        home: goToHome,
        restart: goToHome
      }
    },
    "level-select": {
      state: Select,
      routes: {
        next: goToGame,
        home: goToHome,
        restart: goToHome
      }
    },
    game: {
      state: ClickProgressionGame,
      routes: {
        next: goToResults,
        home: goToHome,
        restart: goToGame
      }
    },
    results: {
      state: Results,
      routes: {
        next: goToHome,
        game: goToGame,
        restart: goToGame,
        home: goToHome
      }
    }
  };
};
```

### Configuring a Genie screen (results)

One of the great features of Phaser is an asset preloader. Assets that are loaded in this way are placed into a cache and labelled with a key so that they can be quickly and easily accessed wherever needed.

Genie extends this functionality neatly by exposing a JSON API that allows assets to be preloaded for the core Genie screens and the custom gameplay screen alike.

Each screen has a json file that shares its name in themes/{theme name}. Here we can provide the URL of assets and assign them a key. We should aim to create components that can have themes which feel completely different just by updating the URL property in these files.

###### themes/default/config.json:

```json=
"results": {
    "music": "loadscreen.backgroundMusicTwo",
    "resultText": {
        "style": {
            "font": "bold 40px ReithSans",
            "align": "center",
            "fill": "#686868",
            "boundsAlignH": "center",
            "fontWeight": "bold"
        }
    }
}
```

###### themes/default/results.json:

```json=
{
  "results": [
    {
      "type": "image",
      "key": "title",
      "url": "results/title.png",
      "overwrite": false
    },
    {
      "type": "image",
      "key": "background",
      "url": "shared/background.png",
      "overwrite": false
    }
  ]
}
```

## Game screen theme controls / configuration

The game screen has access to and control over the properties that are configured in `config.json` and the asset keys that we look for from `game.json`.

The following objects are avaible to any class that extends the Genie screen class, so we have them in our game screen. These are used very frequently throughout a Genie component, and will likely be passed to most modules that we create.

|              | Creator | Description                                                                                                                                             |
| ------------ | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| this.game    | Phaser  | "The Game object is the heart of your game, providing quick access to common functions and handling the boot process."                                  |
| this.context | Genie   | The context object includes the config for the current theme, as well as any popup screens that are currently visible.                                  |
| this.scene   | Genie   | The scene module handles the positioning and layout of GUI elements. It has methods for adding to the foreground, background and for adding the GEL UI. |

#### Add some text to the screen

We can add a number of properties to the game section of our config file.

###### themes/default/config.json > game

```json=
"text": {
    "content": "Click to smash!",
    "style": {
        "font": "40px ReithSans",
        "fontWeight": "bold",
        "fill": "#FFFFFF"
    },
    "position": { "x": 160, "y": -200 }
},
```

...and then access them via `this.theme.config.theme`.

###### src/components/click-progression-game.js

```javascript
this.theme = this.context.config.theme[this.game.state.current];
const text = this.game.add.text(
  this.theme.text.position.x,
  this.theme.text.position.y,
  this.theme.text.content,
  this.theme.text.style
);

this.scene.addToBackground(text);
```

#### Add an image to the preloader

We can add an image to the preloader for the game screen in exactly the same way as any other screen (like the results screen we saw earlier.

###### themes/default/game.json

```json=
"game":
    {
        "type": "image",
        "key": "game_button",
        "url": "game/egg_1_0.png",
        "overwrite": false
    }
```

#### Use the image as a button

Now that we have preloaded an image into the cache, we can use it in the component. There are many entity types within Phaser that we can use display the image as (image, sprite), we will be creating a click progression game, so we need something that can be clicked, it makes sense to make this entity a button.

To do this we use Phaser's `game.add.button` method to create the button itself, and Genie's `scene.addToBackground` method to add it to the background layer of our scene.

###### src/components/click-progression-game.js

```javascript=
const gameButton = this.game.add.button(
  100, // x
  100, // y
  "game.game_button", // asset key
  () => console.log("clicked")), // callback
  this // context to call the callback with
  // Further params can instruct the button to show different frames for hover and click states
);

this.scene.addToBackground(gameButton);
```

_**Activity**: each time the button is clicked have a different image appear_
