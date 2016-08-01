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
1. [Styling the window](#stylingWindow)
1. [Let's fix more styles](#fixTitleStyles)
1. [Creating actions and a store](#creatingActionsAndAStore)
    1. [Event dispatcher](#eventDispatcher)
    1. [App store](#appStore)
    1. [App events](#appEvents)
    1. [App actions](#appActions)
    1. [Making it work](#appMakingItWork)

## Introduction<a name="intro"></a>

I'm here today to teach you how to build a electron music player, if you follow my steps you should get a cool
looking mp3 player based on [Lucas Bebber](https://twitter.com/lucasbebber) gooey example posted on [codrops](http://tympanus.net/Development/CreativeGooeyEffects/player.html).

I'll be providing some music created by my friend [Fábio Guedes](https://jp.linkedin.com/in/fábio-guedes-16a96ba5/en)

Check his work on [Spotify](https://open.spotify.com/user/dawnclover) and here's a complete [album](https://open.spotify.com/album/5QSA8n0IzZHsMgciol0g9m).

All the provided icons used in this app were taken from [flat icon](http://www.flaticon.com/) and they were all made by [Madebyoliver](http://www.flaticon.com/authors/madebyoliver)

Please check the [dependencies list](#dependencies) to check where they came from.

*PS: We won't care about windows for this tutorial. We'll be focused in getting it to work on OSX, but it should be the same for windows.*


## What we'll be creating<a name="showcase"></a>

![Showcase](tutorial/images/Showcase.gif)

## What we'll need<a name="dependencies"></a>

1. [Electron React Boilerplate](https://github.com/chentsulin/electron-react-boilerplate)
1. [Essential Set](http://www.flaticon.com/packs/essential-set-2)
1. [Essential Compilation](http://www.flaticon.com/packs/essential-compilation)
1. [Essential Collection](http://www.flaticon.com/packs/essential-collection)

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

*There were some other changes made in `main.development.js` please check the [diff file](https://github.com/DPr00f/electron-music-player-tutorial/commit/5dc63c001229e265d6fdcfcf263992ff3f31162c#diff-6e4ea414b6f64bc7192a16c10fe2e496L1) to see them. They relate to changes in the menu and tray*

## Styling the window<a name="stylingWindow"></a>
![Starting window](tutorial/images/windowStart.png)

Your window should look as the image above, obviously, since we have no title bar we can no longer drag it.
Let's start styling it and add a dragging area to it.

To avoid errors down the line we'll need to install a webpack image loader
`npm i image-webpack-loader -D`

And on `webpack.config.base.js` we'll add
```
{
    test: /\.(jpe?g|png|gif|svg)$/i,
    loaders: [
    'file?hash=sha512&digest=hex&name=[hash].[ext]',
    'image-webpack?bypassOnDebug&optimizationLevel=10&interlaced=false'
    ]
}
```

This way all our css will load the images correctly

Let's create our first component `app/components/Home.js`

```
import React, { Component } from 'react';
import styles from './Home.css';

export default class Home extends Component {
    constructor() {
        super();
        this.onCloseClick = this.onCloseClick.bind(this);
        this.onMenuClick = this.onMenuClick.bind(this);
    }

    onMenuClick() {
        alert('MENU');
    }

    onCloseClick() {
        alert('CLOSE');
    }

    render() {
        let className = styles.homeContainer;
        return (
            <div className={ className }>
                <div className={ styles.playerTitle }>
                    <div className={ styles.closeButton } onClick={this.onCloseClick}></div>
                    <div className={ styles.menuButton } onClick={this.onMenuClick}></div>
                </div>
            </div>
        );
    }
}
```

Please note that we don't have a `Home.css` yet, let's create one at `app/components/Home.css`

```
.homeContainer {
  -webkit-filter: blur(0);
  filter: blur(0);
  -webkit-transition: all 0.3s;
  -moz-transition: all 0.3s;
  transition: all 0.3s;
}

.fileListOpened {
  -webkit-filter: blur(3px);
  filter: blur(3px);
}

.filesOver {
  -webkit-filter: blur(10px);
  filter: blur(10px);
}

.playerTitle {
  height: 105px;
  background: #3a3a3a;
  -webkit-user-select: none;
  -webkit-app-region: drag;
}

.menuButton {
  position: absolute;
  left: 10px;
  top: 10px;
  background: url("../assets/img/menu.svg");
  background-size: 100%;
  cursor: pointer;
  width: 32px;
  height: 32px;
  -webkit-app-region: no-drag;
}

.closeButton {
  position: absolute;
  right: 10px;
  top: 10px;
  background: url("../assets/img/close.svg");
  background-size: 100%;
  cursor: pointer;
  width: 32px;
  height: 32px;
  -webkit-app-region: no-drag;
}
```

We now need to update the `index.js`

```
import React from 'react';
import { render } from 'react-dom';
import Home from './components/Home';
import './app.global.css';

render(
  <Home />,
  document.getElementById('root')
);
```

At this point if we re-run the app we should see something like

![Example window](tutorial/images/windowMenuClose.png)

The app is draggable now from the gray area. And when the buttons are clicked an alert should pop with `CLOSE` or `MENU` written on it.

*If you encountered any errors please double check that the path to images is correct and that the [webpack.config.base.js](webpack.config.base.js) contains the right loaders*

## Let's fix more styles<a name="fixTitleStyles"></a>

For starters let's remove the border around the gray area

On `app/app.global.css` let's replace all it's contents with

```
body {
  position: relative;
  color: white;
  height: 100vh;
  background-color: #222222;
  padding: 0;
  margin: 0;
  font-family: sans-serif;
}
```

## Creating actions and a store<a name="creatingActionsAndAStore"></a>

Time to get those buttons to work.

### Event dispatcher<a name="eventDispatcher"></a>

Create a new file `app/dispatcher/index.js`

```
import { Dispatcher } from 'flux';

class ApplicationDispatcher extends Dispatcher {
}

export default new ApplicationDispatcher();
```

That's all we need but we need to install flux, so from the command line type in `npm i flux -D`

`npm i flux -D` translates to `npm install flux --save-dev`

### App store<a name="appStore"></a>

Let's generate the store, create a new file `app/store/index.js`

```
import Dispatcher from '../dispatcher';
import { remote } from 'electron';
import EventEmitter from 'events';

class Store extends EventEmitter {
  closeCurrentWindow() {
    remote.getCurrentWindow().close();
  }

  openListMenu() {
      alert('Open List menu');
  }
}

const store = new Store();

Dispatcher.register((action) => {
  switch (action.actionType) {
    default:
      break;
  }
});

export default store;
```

You can tell that we are handling the close button already but it won't work just yet.

We need events and an action to trigger those events

### App events<a name="appEvents"></a>

Create a new file `app/events/index.js`

```
export const CLOSE_WINDOW = 'CLOSE_WINDOW';
export const OPEN_LIST = 'OPEN_LIST';
export const CLOSE_LIST = 'CLOSE_LIST';
```

### App actions<a name="appActions"></a>

One more file... `app/actions/home.js`

```
import Dispatcher from '../Dispatcher';
import { CLOSE_WINDOW, OPEN_LIST } from '../events';

export default {
  closeWindow: () => {
    Dispatcher.dispatch({
      actionType: CLOSE_WINDOW
    });
  },

  openList: () => {
    Dispatcher.dispatch({
      actionType: OPEN_LIST
    });
  }
};
```

### Making it work<a name="appMakingItWork"></a>

All these changes and it still doesn't work right?

Let's fix that then

Open `app/components/Home.js` and let's start

Import the home actions and call it in the close button

```
import HomeActions from '../actions/home';

...

    onMenuClick() {
        HomeActions.openList();
    }

    onCloseClick() {
        HomeActions.closeWindow();
    }

...
```

Now let's open `app/store/index`

Where we register the Dispatcher events let's make sure it looks like the following

```
Dispatcher.register((action) => {
  switch (action.actionType) {
    case CLOSE_WINDOW:
      store.closeCurrentWindow();
      break;

    case OPEN_LIST:
      store.openListMenu();
      break;

    default:
      break;
  }
});
```

Also we need to make sure that we're importing those events

```
import { CLOSE_WINDOW, OPEN_LIST } from '../events';
```

Nothing will happen if we run the app now because the store is not being imported anywhere,
so let's open `app/index.js` and import the store.

```
import React from 'react';
import { render } from 'react-dom';
import Home from './components/Home';
import './app.global.css';
import './store';

render(
  <Home />,
  document.getElementById('root')
);

```

If everything went fine you should be able to click the close button and the window will close.
Also if you click on the list button you'll see a new alert saying "Open List menu"
