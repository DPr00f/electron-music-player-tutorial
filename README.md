# Electron Music Player Tutorial

## Table of Contents

1. [Introduction](#intro)
1. [What we'll be creating](#showcase)
1. [What we'll need](#dependencies)
1. [Setting up our app](#appSetup)
    1. [Cleanup package.json](#appSetupCleanPackage)
    1. [Cleanup app](#appSetupCleanApp)
    1. [Cleanup index.js](#appSetupCleanIndex)

## Introduction<a name="intro"></a>

I'm here today to teach you how to build a electron music player, if you follow my steps you should get a cool
looking mp3 player based on [Lucas Bebber](https://twitter.com/lucasbebber) gooey example posted on [codrops](http://tympanus.net/Development/CreativeGooeyEffects/player.html).

I'll be providing some music created by my friend [Fábio Guedes](https://jp.linkedin.com/in/fábio-guedes-16a96ba5/en)

Check his work on [Spotify](https://open.spotify.com/user/dawnclover) and here's a complete [album](https://open.spotify.com/album/5QSA8n0IzZHsMgciol0g9m).

## What we'll be creating<a name="showcase"></a>

![Showcase](tutorial/images/Showcase.gif)

## What we'll need<a name="dependencies"></a>

1. [Electron React Boilerplate](https://github.com/chentsulin/electron-react-boilerplate)

## Setting up our app<a name="appSetup"></a>

Go ahead and download or clone [Electron React Boilerplate](https://github.com/chentsulin/electron-react-boilerplate)

### Cleanup package.json<a name="appSetupCleanPackage"></a>

Change the package name and all the related information to the product.

Now we'll remove unnecessary dependencies
```
// Found in devDependencies
"redux-logger": "^2.6.1",

// Found in dependencies
"react-redux": "^4.4.5",
"react-router": "^2.6.0",
"react-router-redux": "^4.0.5",
"redux": "^3.5.2",
"redux-thunk": "^2.1.0",
```

Here's how the [package.json should look](https://github.com/DPr00f/electron-music-player-tutorial/blob/ff23691b5ef579c5f6702a8c54f3dc40ddc65967/package.json)

### Cleanup app<a name="appSetupCleanApp"></a>

Locate the app folder and remove all files and folders, leaving only

- app.html
- app.icns
- app.global.css
- index.js

Here's what you should endup with

![Files and folders](tutorial/images/howLook.png)

### Cleanup index.js<a name="appSetupCleanIndex"></a>
Locate `app/index.js` and clean it up as follows

```
import React from 'react';
import { render } from 'react-dom';
import './app.global.css';

render(
  <div>
    <h1>Hello world</h1>
  </div>,
  document.getElementById('root')
);
```

Now we are ready to test the app and see if everything went fine

On your terminal run
`npm install`

When that's done execute
`npm run dev`
