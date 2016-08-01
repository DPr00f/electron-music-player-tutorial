# Electron Music Player Tutorial

## Table of Contents

1. [Introduction](#intro)
1. [What we'll be creating](#showcase)
1. [What we'll need](#dependencies)
1. [Setting up our app](#appSetup)
    1. [Cleanup package.json](#appSetupCleanPackage)
    1. [Cleanup app](#appSetupCleanApp)
    1. [Cleanup index.js](#appSetupCleanIndex)
1. [Appropriate window](#appropriateWindow)

## Introduction<a name="intro"></a>

I'm here today to teach you how to build a electron music player, if you follow my steps you should get a cool
looking mp3 player based on [Lucas Bebber](https://twitter.com/lucasbebber) gooey example posted on [codrops](http://tympanus.net/Development/CreativeGooeyEffects/player.html).

I'll be providing some music created by my friend [Fábio Guedes](https://jp.linkedin.com/in/fábio-guedes-16a96ba5/en)

Check his work on [Spotify](https://open.spotify.com/user/dawnclover) and here's a complete [album](https://open.spotify.com/album/5QSA8n0IzZHsMgciol0g9m).

*PS: We won't care about windows for this tutorial. We'll be focused in getting it to work on OSX, but it should be the same for windows.*

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
[Link to app/index.js](https://github.com/DPr00f/electron-music-player-tutorial/blob/ff23691b5ef579c5f6702a8c54f3dc40ddc65967/app/index.js)

Now we are ready to test the app and see if everything went fine

On your terminal run
`npm install`

When that's done execute
`npm run dev`

If everything goes well you should see this
![npm run dev](tutorial/images/rundev.png)

*Ignore the error in the console, everything works fines*


## Appropriate window<a name="appropriateWindow"></a>

[If you remember](#showcase), the window that we used for the project seems customized

Let's do it now

Open `main.development.js`
Locate `app.on('ready', async () => {`

In that block of code you can see a `mainWindow` variable
Replace it with
```
mainWindow = new BrowserWindow({
    show: false,
    width: 318,
    height: 500,
    frame: false,
    resizable: process.env.NODE_ENV === 'development'
});
```

Save the file and if you don't see any changes rerun `npm run dev` from the command line

Since the window is too small we don't want to open the dev tools by default, but we still want to access it if in development.

Locate the line that says `mainWindow.openDevTools();` and remove it.

From now on if we want to access the dev tools we just need to right click on the page and select inspect element.

*There were some other changes made in `main.development.js` please check the diff file to see them. They relate to changes in the menu and tray*
