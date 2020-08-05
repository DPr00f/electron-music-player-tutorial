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
1. [Building the play list](#playList)
    1. [List Action](#listAction)
    1. [Music Action](#musicAction)
    1. [SortableList Component](#sortableListComponent)
    1. [SortableListItem Component](#sortableListItemComponent)
    1. [SortableList and SortableListItem styles](#sortableListStyles)
    1. [Adding Events to the Store](#listComponentStoreEvents)
    1. [List Component](#listComponent)
    1. [Back to the store](#backToTheStore)
    1. [Adding more to the store](#moreToTheStore)
1. [Creating the drop area](#dropArea)
    1. [Drop Area Actions](#dropAreaActions)
    1. [Drop Area Utils](#dropAreaUtils)
    1. [Drop Area Component](#dropAreaComponent)
    1. [Fixing Current Styles](#fixingCurrentStyles)
1. [Adding files to the list](#addingFilesToTheList)
1. [Playing a song](#playingASong)
1. [Adding more controls](#moreControls)
    1. [Music Controls](#musicControls)
    1. [Seeker Control](#seekerControl)
    1. [Volume Control](#volumeControl)
    1. [Volume Icon](#volumeIcon)
    1. [Animation frame on the store](#animationFrame)
    1. [Adding the Music Controls to the Home Component](#musicControlsHome)
1. [Finishing the store](#finishingStore)
1. [Fixing the styles for the seeker](#fixingSeeker)
1. [Adding Cover](#addingCover)
1. [Player Spectrum](#playerSpectrum)
1. [Adding the gooey effect](#gooey)
1. [Build](#build)


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
```json
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

```javascript
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
```javascript
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
```javascript
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

```javascript
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

```css
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

```javascript
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

```css
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

```javascript
import { Dispatcher } from 'flux';

class ApplicationDispatcher extends Dispatcher {
}

export default new ApplicationDispatcher();
```

That's all we need but we need to install flux, so from the command line type in `npm i flux -D`

`npm i flux -D` translates to `npm install flux --save-dev`

### App store<a name="appStore"></a>

Let's generate the store, create a new file `app/store/index.js`

```javascript
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

```javascript
export const CLOSE_WINDOW = 'CLOSE_WINDOW';
export const OPEN_LIST = 'OPEN_LIST';
export const CLOSE_LIST = 'CLOSE_LIST';
```

### App actions<a name="appActions"></a>

One more file... `app/actions/home.js`

```javascript
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

```javascript
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

```javascript
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

```javascript
import { CLOSE_WINDOW, OPEN_LIST } from '../events';
```

Nothing will happen if we run the app now because the store is not being imported anywhere,
so let's open `app/index.js` and import the store.

```javascript
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

If something went wrong you won't be seeing any content on the page, make sure you check any potential erros on the console.

## Building the play list<a name="playList></a>

Let's start by adding our new component to `app/index.js`

```javascript
import React from 'react';
import { render } from 'react-dom';
import Home from './components/Home';
import List from './components/List';
import './app.global.css';
import './store';

render(
  <div>
     <Home />
     <List />
  </div>,
  document.getElementById('root')
);
```

Let's add more events to `app/events/index.js`

```javascript
export const CLOSE_WINDOW = 'CLOSE_WINDOW';
export const OPEN_LIST = 'OPEN_LIST';
export const CLOSE_LIST = 'CLOSE_LIST';
export const REORDER_LIST = 'REORDER_LIST';
export const DRAGGING_FILES = 'DRAGGING_FILES';
export const NOT_DRAGGING_FILES = 'NOT_DRAGGING_FILES';
export const DROP_FILES = 'DROP_FILES';
export const REMOVE_FROM_LIST = 'REMOVE_FROM_LIST';
export const LIST_UPDATE = 'LIST_UPDATE';
export const STARTED_PLAYING = 'STARTED_PLAYING';
export const STOPPED_PLAYING = 'STOPPED_PLAYING';
export const RESTART_SONG = 'RESTART_SONG';
export const PLAY_SONG = 'PLAY_SONG';
export const PAUSE_SONG = 'PAUSE_SONG';
export const PLAY_NEXT_SONG = 'PLAY_NEXT_SONG';
export const PLAY_PREVIOUS_SONG = 'PLAY_PREVIOUS_SONG';
export const MUTE_SOUND = 'MUTE_SOUND';
export const UNMUTE_SOUND = 'UNMUTE_SOUND';
export const SET_VOLUME = 'SET_VOLUME';
export const SEEK_SONG = 'SEEK_SONG';
export const ANIMATION_FRAME = 'ANIMATION_FRAME'; // We'll use this at the very end of the tutorial (All the other events are self explanatory)
```

Those are all the events that we need to finish the app so we can close that file forever

Let's create a couple of more actions that will control the list and future events like play, pause, next song, previous song

### List Action<a name="listAction"></a>

Let's create `app/actions/list.js`

```javascript
import Dispatcher from '../dispatcher';
import { CLOSE_LIST, REORDER_LIST, REMOVE_FROM_LIST } from '../events';

export default {
  closeList: () => {
    Dispatcher.dispatch({
      actionType: CLOSE_LIST
    });
  },

  reorderedList: (newList) => {
    Dispatcher.dispatch({
      actionType: REORDER_LIST,
      list: newList
    });
  },

  removeFromList: (ids) => {
    Dispatcher.dispatch({
      actionType: REMOVE_FROM_LIST,
      ids
    });
  }
};
```

### Music Action<a name="musicAction"></a>

Let's create another file `app/actions/music.js`

```javascript
import Dispatcher from '../dispatcher';
import {
  PLAY_SONG,
  PAUSE_SONG,
  PLAY_NEXT_SONG,
  PLAY_PREVIOUS_SONG,
  SEEK_SONG,
  MUTE_SOUND,
  UNMUTE_SOUND,
  SET_VOLUME,
  RESTART_SONG
} from '../events';

export default {
  playSong: (song) => {
    Dispatcher.dispatch({
      actionType: PLAY_SONG,
      song
    });
  },

  pauseSong: (song) => {
    Dispatcher.dispatch({
      actionType: PAUSE_SONG,
      song
    });
  },

  mute: () => {
    Dispatcher.dispatch({
      actionType: MUTE_SOUND
    });
  },

  unmute: (savedVolume = 100) => {
    Dispatcher.dispatch({
      actionType: UNMUTE_SOUND,
      volume: savedVolume
    });
  },

  setVolume: (volume) => {
    Dispatcher.dispatch({
      actionType: SET_VOLUME,
      volume
    });
  },

  restartSong: () => {
    Dispatcher.dispatch({
      actionType: RESTART_SONG
    });
  },

  playPreviousSong: () => {
    Dispatcher.dispatch({
      actionType: PLAY_PREVIOUS_SONG
    });
  },

  playNextSong: () => {
    Dispatcher.dispatch({
      actionType: PLAY_NEXT_SONG
    });
  },

  seek: (value) => {
    Dispatcher.dispatch({
      actionType: SEEK_SONG,
      value
    });
  }
};
```

Now that we have our actions, let's start with creating a `SortableList` component

### SortableList Component<a name="sortableListComponent"></a>

let's create it `app/components/SortableList.js`

```javascript
import React, { Component } from 'react';
import store from '../store';
import styles from './SortableList.css';
import SortableListItem from './SortableListItem';
import {
  DRAGGING_FILES,
  NOT_DRAGGING_FILES
} from '../events';

class SortableList extends Component {
  constructor(props) {
    super();
    this.state = {
      draggingIndex: null,
      data: props.data,
      draggingFilesOver: false
    };
    this.onStateUpdate = this.onStateUpdate.bind(this);
    this.onDragFilesStart = this.onDragFilesStart.bind(this);
    this.onDragFilesStop = this.onDragFilesStop.bind(this);
  }

  componentDidMount() {
    store.on(DRAGGING_FILES, this.onDragFilesStart);
    store.on(NOT_DRAGGING_FILES, this.onDragFilesStop);
  }

  componentWillUnmount() {
    store.removeListener(DRAGGING_FILES, this.onDragFilesStart);
    store.removeListener(NOT_DRAGGING_FILES, this.onDragFilesStop);
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      data: newProps.data
    });
  }

  onStateUpdate(obj) {
    this.setState(obj);
    if (obj.data) {
      this.onComponentFinishedUpdating(obj.data);
    }
  }

  onComponentFinishedUpdating(data) {
    if (this.props.onListReorder) {
      this.props.onListReorder.call(null, data);
    }
  }

  onDragFilesStart() {
    this.setState({
      draggingFilesOver: true
    });
  }

  onDragFilesStop() {
    this.setState({
      draggingFilesOver: false
    });
  }

  render() {
    let className = styles.container;
    if (this.state.draggingFilesOver) {
      className += ` ${styles['has-filesOver']}`;
    }
    const listItems = this.state.data.map((item, i) => {
      return (
          <SortableListItem
              key={ i }
              updateState={ this.onStateUpdate }
              items={ this.state.data }
              draggingIndex={ this.state.draggingIndex }
              sortId={ i }
              outline="list"
            >{{ // We need to add it to the children so that react-sortable passes it down to our component
              className: i % 2 === 0 ? 'is-even' : 'is-odd',
              onPlayButtonClick: this.props.onPlayButtonClick,
              onPauseButtonClick: this.props.onPauseButtonClick,
              onClick: this.props.toggleItem,
              isPlaying: this.props.songPlaying && this.props.songPlaying.id === item.id,
              isPaused: this.props.songPlaying && this.props.songPlaying.paused,
              selected: this.props.selectedItems.indexOf(item.id) > -1,
              items: this.state.data,
              item
            }}</SortableListItem>
      );
    }, this);

    return (
          <div className={ className }>{ listItems }</div>
    );
  }
}

export default SortableList;
```

Take a minute to look at the code, we're missing a component called `SortableListItem`

### SortableListItem Component<a name="sortableListItemComponent"></a>

Let's add it `app/components/SortableListItem.js`

```javascript
import React, { Component } from 'react';
import styles from './SortableListItem.css';
import { Sortable } from 'react-sortable';

class ListItem extends Component {
  constructor(props) {
    super();
    this.onPlayButtonClickProxy = this.onPlayButtonClickProxy.bind(this);
    this.onPauseButtonClickProxy = this.onPauseButtonClickProxy.bind(this);
    this.onClickProxy = this.onClickProxy.bind(this);
  }

  onPlayButtonClickProxy(e) {
    e.preventDefault();
    e.stopPropagation();
    const position = parseInt(e.target.parentNode.dataset.id, 10);
    if (this.props.children.onPlayButtonClick) {
      this.props.children.onPlayButtonClick.call(null, this.props.children.items[position]);
    }
  }

  onPauseButtonClickProxy(e) {
    e.preventDefault();
    e.stopPropagation();
    const position = parseInt(e.target.parentNode.dataset.id, 10);
    if (this.props.children.onPauseButtonClick) {
      this.props.children.onPauseButtonClick.call(null, this.props.children.items[position]);
    }
  }

  onClickProxy(e) {
    const position = parseInt(e.target.parentNode.dataset.id, 10);
    if (this.props.children.onClick) {
      this.props.children.onClick.call(null, this.props.children.items[position]);
    }
  }

  render() {
    let className = `${styles.item} ListItem__${this.props.children.className}`;
    if (this.props.children.selected) {
      className += ` ${styles['is-selected']}`;
    }
    if (this.props.children.isPlaying) {
      className += ` ${styles['is-playing']}`;
    }
    return <div
              data-id= { this.props['data-id'] }
              draggable={ this.props.draggable }
              onDragStart={ this.props.onDragStart }
              onDragEnd={ this.props.onDragEnd }
              onDragOver={ this.props.onDragOver }
              onTouchStart={ this.props.onTouchStart }
              onTouchMove={ this.props.onTouchMove }
              onTouchEnd={ this.props.onTouchEnd }
              onClick={ this.onClickProxy }
              className={ className }
          >
            <span className={ styles.itemNumber }></span>
            <span className={ styles.itemName }>{ this.props.children.item.displayName }</span>
            { !this.props.children.isPlaying || this.props.children.isPaused ?
                      <i className={ styles.playButton } onClick={ this.onPlayButtonClickProxy }></i> :
                      <i className={ styles.pauseButton } onClick={ this.onPauseButtonClickProxy }></i>
            }
          </div>;
  }
}

export default Sortable(ListItem);
```

This component will take care of a single item on the list, but it requires another npm module called `react-sortable`.

For more info on the module please refer to the [github page](https://github.com/danielstocks/react-sortable)

Let's add it by executing `npm i react-sortable -S` from the command line

We've didn't add the styles for the components.

Let's add them now

### SortableList and SortableListItem styles<a name="sortableListStyles"></a>

`app/components/SortableListItem.css`

```css
.item {
  counter-increment: item-counter;
  position: relative;
  height: 60px;
  -webkit-user-select: none;
}

.item:hover .itemNumber {
  opacity: 0;
}

.item:hover .playButton {
  opacity: 1;
}

.item.is-playing .itemNumber{
  opacity: 0;
}

.item.is-playing .playButton{
  opacity: 1;
}

.playButton {
  opacity: 0;
  position: absolute;
  left: 10px;
  top: 15px;
  background: url("../assets/img/play.svg");
  background-size: 100%;
  cursor: pointer;
  width: 32px;
  height: 32px;
  -webkit-app-region: no-drag;
  -webkit-transition: all 0.3s;
  -moz-transition: all 0.3s;
  transition: all 0.3s;
}

.pauseButton {
  position: absolute;
  left: 10px;
  top: 15px;
  background: url("../assets/img/pause.svg");
  background-size: 100%;
  cursor: pointer;
  width: 32px;
  height: 32px;
  -webkit-app-region: no-drag;
}

.itemNumber {
  opacity: 1;
  font-size: 18px;
  position: absolute;
  display: block;
  left: 18px;
  top: 0;
  line-height: 60px;
  color: #9d9d9d;
  -webkit-transition: all 0.3s;
  -moz-transition: all 0.3s;
  transition: all 0.3s;
}

.itemNumber::before {
  content: counter(item-counter) ".";
}

.itemName {
  display: block;
  width: 80%;
  white-space: nowrap;
  text-overflow: ellipsis;
  line-height: 60px;
  text-indent: 50px;
  font-size: 16px;
  font-weight: normal;
  overflow: hidden;
}

.is-selected {
  background: rgba(255, 255, 255, 0.3) !important;
}
```

And another one for `app/components/SortableList.css`

```css
.container {
  position: absolute;
  top: 105px;
  bottom: 0;
  left: 0;
  right: 0;
  overflow: auto;
  counter-reset: item-counter;
  -webkit-filter: blur(0);
  filter: blur(0);
  -webkit-transition: all 0.3s;
  -moz-transition: all 0.3s;
  transition: all 0.3s;
}

.has-filesOver {
  -webkit-filter: blur(2px);
  filter: blur(2px);
}
```

The `SortableList` and `SortableListItem` are now done, but we're still missing the `List` component, but before jumping into that, let's register the events to the store.

### Adding Events to the Store<a name="listComponentStoreEvents"></a>

Let's open `app/store/index.js`

```javascript
// Replace the events that we had before with
import {
    CLOSE_WINDOW,
    OPEN_LIST,
    DRAGGING_FILES,
    NOT_DRAGGING_FILES
} from '../events';

...

// Let's register those events

Dispatcher.register((action) => {
  switch (action.actionType) {
    case DRAGGING_FILES:
      store.emit(DRAGGING_FILES);
      break;

    case NOT_DRAGGING_FILES:
      store.emit(NOT_DRAGGING_FILES);
      break;

    case CLOSE_WINDOW:
      store.closeCurrentWindow();
      break;

...
```

We're forcing the store to emit the same value, which means that other components will listen to those events and perform changes to their state.

If you take a look at the [showcase gif](#showcase) again, you'lll notice that when the files get dragged over the player, the background elements blur, and that's what these 2 events (`DRAGGING_FILES` and `NOT_DRAGGING_FILES`) will helps achieve.

One example of this is the `SortableList` Component.

### List Component<a name="listComponent"></a>

Create a file `app/components/List.js`

```javascript
import React, { Component } from 'react';
import store from '../store';
import ListActions from '../actions/list';
import MusicActions from '../actions/music';
import styles from './List.css';
import SortableList from './SortableList';
import {
  OPEN_LIST,
  CLOSE_LIST,
  LIST_UPDATE,
  STARTED_PLAYING,
  STOPPED_PLAYING
} from '../events';

const KEYCODE_ESC = 27;

export default class List extends Component {
  constructor() {
    super();
    this.onOpenList = this.onOpenList.bind(this);
    this.onCloseList = this.onCloseList.bind(this);
    this.onListUpdate = this.onListUpdate.bind(this);
    this.onBackButtonClicked = this.onBackButtonClicked.bind(this);
    this.onRubbishButtonClicked = this.onRubbishButtonClicked.bind(this);
    this.onPlayButtonClick = this.onPlayButtonClick.bind(this);
    this.onPauseButtonClick = this.onPauseButtonClick.bind(this);
    this.onListReorder = this.onListReorder.bind(this);
    this.onSongPlaying = this.onSongPlaying.bind(this);
    this.onSongStopped = this.onSongStopped.bind(this);
    this.toggleItem = this.toggleItem.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
    this.state = {
      opened: false,
      list: store.getList(),
      draggingIndex: null,
      draggingFilesOver: false,
      selectedItems: [],
      songPlaying: null
    };
  }

  componentDidMount() {
    store.on(OPEN_LIST, this.onOpenList);
    store.on(CLOSE_LIST, this.onCloseList);
    store.on(LIST_UPDATE, this.onListUpdate);
    store.on(STARTED_PLAYING, this.onSongPlaying);
    store.on(STOPPED_PLAYING, this.onSongStopped);
    document.addEventListener('keyup', this.onKeyUp);
  }

  componentWillUnmount() {
    store.removeListener(OPEN_LIST, this.onOpenList);
    store.removeListener(CLOSE_LIST, this.onCloseList);
    store.removeListener(LIST_UPDATE, this.onListUpdate);
    store.removeListener(STARTED_PLAYING, this.onSongPlaying);
    store.removeListener(STOPPED_PLAYING, this.onSongStopped);
    document.removeEventListener('keyup', this.onKeyUp);
  }

  onOpenList() {
    this.setState({
      opened: true
    });
  }

  onCloseList() {
    this.setState({
      opened: false
    });
  }

  onListUpdate() {
    this.setState({
      list: store.getList()
    });
  }

  onSongPlaying() {
    this.setState({
      songPlaying: store.getSongPlaying()
    });
  }

  onSongStopped() {
    this.setState({
      songPlaying: null
    });
  }

  onKeyUp(e) {
    if (this.state.opened && e.keyCode === KEYCODE_ESC) {
      ListActions.closeList();
    }
  }

  onBackButtonClicked() {
    ListActions.closeList();
  }

  onRubbishButtonClicked() {
    if (!this.state.selectedItems) {
      return;
    }
    ListActions.removeFromList(this.state.selectedItems);
    this.setState({
      selectedItems: []
    });
  }

  onPlayButtonClick(file) {
    MusicActions.playSong(file);
  }

  onPauseButtonClick() {
    MusicActions.pauseSong();
  }

  onListReorder(newList) {
    ListActions.reorderedList(newList);
  }

  toggleItem(file) {
    const selectedItems = this.state.selectedItems;
    const index = selectedItems.indexOf(file.id);
    if (index > -1) {
      selectedItems.splice(index, 1);
    } else {
      selectedItems.push(file.id);
    }
    this.setState({
      selectedItems
    });
  }

  render() {
    let className = 'menuList';
    let rubbishButtonClassName = styles.rubbishButton;
    if (this.state.opened) {
      className += ' is-opened';
    }
    if (this.state.selectedItems.length) {
      rubbishButtonClassName += ` ${styles['is-active']}`;
    }
    return (
      <div className={ className }>
        <div className={ styles.backButton } onClick={ this.onBackButtonClicked }></div>
        <div className={ rubbishButtonClassName } onClick={ this.onRubbishButtonClicked }></div>
        { this.renderList() }
      </div>
    );
  }

  renderList() {
    return (
      <SortableList
          onListReorder={ this.onListReorder }
          onPlayButtonClick={ this.onPlayButtonClick }
          onPauseButtonClick={ this.onPauseButtonClick }
          toggleItem={ this.toggleItem }
          selectedItems={ this.state.selectedItems }
          songPlaying={ this.state.songPlaying }
          data={ this.state.list }
      />
    );
  }
}
```

and style it with `app/components/List.css`

```css
.backButton {
  position: absolute;
  left: 10px;
  top: 10px;
  background: url("../assets/img/back.svg");
  background-size: 100%;
  cursor: pointer;
  width: 32px;
  height: 32px;
  -webkit-app-region: no-drag;
}

.rubbishButton {
  position: absolute;
  left: 52px;
  top: 10px;
  background: url("../assets/img/rubbish.svg");
  background-size: 100%;
  width: 32px;
  height: 32px;
  -webkit-app-region: no-drag;
  opacity: 0.2;
  -webkit-transition: all 0.3s;
  -moz-transition: all 0.3s;
  transition: all 0.3s;
}

.rubbishButton.is-active {
  opacity: 1;
  cursor: pointer;
}
```

At this point if we run the app an error will be thrown because store.getList() doesn't exist.

But let's fix that and see what we have so far

### Back to the store<a name="backToTheStore"></a>

If we change the store and add a `getList()` method the app will run

`app/store/index.js`

```javascript
...
class Store extends EventEmitter {
  constructor() {
    super();
    this.songsList = [];
  }

  closeCurrentWindow() {
    remote.getCurrentWindow().close();
  }

  openListMenu() {
    alert('Open List menu');
  }

  getList() {
    return this.songsList;
  }
}
...
```

This is what we'll see

![Back to the store](tutorial/images/backToTheStore.png)

Not very appealing I know, but we'll fix it soon enough

### Adding more to the store<a name="moreToTheStore"></a>

Let's keep on going and add more events to the store that will actually help us identifying the song that is playing and reorder the musics

We'll add all the events this time and all the needed methods to finish the player and we'll complete them as we go along

`app/store/index.js`

```javascript
// Events needed
import {
  CLOSE_WINDOW,
  REORDER_LIST,
  OPEN_LIST,
  CLOSE_LIST,
  DRAGGING_FILES,
  NOT_DRAGGING_FILES,
  DROP_FILES,
  REMOVE_FROM_LIST,
  LIST_UPDATE,
  STARTED_PLAYING,
  STOPPED_PLAYING,
  PLAY_SONG,
  PAUSE_SONG,
  PLAY_NEXT_SONG,
  PLAY_PREVIOUS_SONG,
  RESTART_SONG,
  SEEK_SONG,
  MUTE_SOUND,
  UNMUTE_SOUND,
  SET_VOLUME,
  ANIMATION_FRAME
} from '../events';

...

// All the incomplete methods contain a console log
class Store extends EventEmitter {
  constructor() {
    super();
    this.songsList = [];
    this.playingSong = null;
    this.volume = 100;
    this.isMute = false;
    this.onSongFinished = this.onSongFinished.bind(this);
  }

  closeCurrentWindow() {
    remote.getCurrentWindow().close();
  }

  openListMenu() {
    this.emit(OPEN_LIST);
  }

  addToList(files) {
    console.log('addToList: TODO');
  }

  removeFromList(ids) {
    this.songsList = this.songsList.filter((item) => (
      ids.indexOf(item.id) === -1
    ));
    this.emit(LIST_UPDATE);
  }

  getList() {
    return this.songsList;
  }

  replaceList(files) {
    this.songsList = files;
    this.emit(LIST_UPDATE);
  }

  getSongPlaying() {
    return this.playingSong;
  }

  getVolume() {
    return this.volume;
  }

  playSong(file) {
    console.log('playSong TODO');
  }

  onSongFinished() {
    this.playNextOnTheList();
  }

  playNextOnTheList() {
    let i;
    if (!this.songsList.length) {
      return;
    }
    if (!this.playingSong) {
      this.playSong(this.songsList[0]);
    } else {
      for (i = 0; i < this.songsList.length; i++) {
        if (this.songsList[i].id === this.playingSong.id) {
          if (i + 1 >= this.songsList.length) {
            this.stopSong(this.playingSong);
          } else {
            this.playSong(this.songsList[i + 1]);
          }
          break;
        }
      }
    }
  }

  playPreviousOnTheList() {
    let i, songToPlay;
    if (!this.songsList.length) {
      return;
    }
    if (!this.playingSong) {
      this.playSong(this.songsList[0]);
    } else {
      for (i = 0; i < this.songsList.length; i++) {
        if (this.songsList[i].id === this.playingSong.id) {
          songToPlay = this.songsList[i - 1];
          if (i - 1 < 0) {
            songToPlay = this.songsList[this.songsList.length - 1];
          }
          this.playSong(songToPlay);
          break;
        }
      }
    }
  }

  resumeSong() {
    this.playingSong.paused = false;
    console.log('resumeSong TODO');
    this.emit(STARTED_PLAYING, this.playingSong);
  }

  pauseSong() {
    this.playingSong.paused = true;
    console.log('pauseSong TODO');
    this.emit(STARTED_PLAYING, this.playingSong);
  }

  stopSong(file) {
    if (!file) {
      return;
    }
    this.emit(STOPPED_PLAYING, this.playingSong);
    this.playingSong = null;
    console.log('stopSong TODO');
  }

  restartSong() {
    console.log('restartSong TODO');
  }

  isMuted() {
    return this.isMute;
  }

  mute() {
    this.isMute = true;
    console.log('mute TODO');
    this.emit(MUTE_SOUND);
  }

  unmute(volume) {
    this.isMute = false;
    console.log('unmute TODO');
    this.emit(UNMUTE_SOUND);
  }

  setVolume(volume) {
    console.log('setVolume TODO');
    this.volume = volume;
    this.emit(SET_VOLUME, volume);
  }

  getPlaytime() {
    console.log('getPlaytime TODO');
  }

  getSongDuration() {
    console.log('getSongDuration TODO');
  }

  seek(value) {
    console.log('seek TODO');
  }

  getFrequency() {
    console.log('getFrequency TODO');
  }
}

...

// Register the events

Dispatcher.register((action) => {
  switch (action.actionType) {
    case DRAGGING_FILES:
      store.emit(DRAGGING_FILES);
      break;

    case NOT_DRAGGING_FILES:
      store.emit(NOT_DRAGGING_FILES);
      break;

    case CLOSE_WINDOW:
      store.closeCurrentWindow();
      break;

    case OPEN_LIST:
      store.openListMenu();
      break;

    case CLOSE_LIST:
      store.emit(CLOSE_LIST);
      break;

    case REORDER_LIST:
      store.replaceList(action.list);
      break;

    case DROP_FILES:
      store.addToList(action.files);
      break;

    case REMOVE_FROM_LIST:
      store.removeFromList(action.ids);
      break;

    case PLAY_SONG:
      store.playSong(action.song);
      break;

    case PAUSE_SONG:
      store.pauseSong();
      break;

    case PLAY_NEXT_SONG:
      store.playNextOnTheList();
      break;

    case PLAY_PREVIOUS_SONG:
      store.playPreviousOnTheList();
      break;

    case MUTE_SOUND:
      store.mute();
      break;

    case UNMUTE_SOUND:
      store.unmute(action.volume);
      break;

    case SET_VOLUME:
      store.setVolume(action.volume);
      break;

    case RESTART_SONG:
      store.restartSong();
      break;

    case SEEK_SONG:
      store.seek(action.value);
      break;

    default:
      break;
  }
});

...
```

This is it, the store is pretty much done, we'll just change the needed methods from this point onwards

## Creating the drop area<a name="dropArea"></a>

Let's create the `DropArea` Component that will populate the list

To create the component we'll need some actions and helpers.

Let's start with the actions

### Drop Area Actions<a name="dropAreaActions"></a>

`app/actions/dropArea.js`

```javascript
import Dispatcher from '../dispatcher';
import { DRAGGING_FILES, NOT_DRAGGING_FILES, DROP_FILES } from '../events';

export default {
  draggingFiles: () => {
    Dispatcher.dispatch({
      actionType: DRAGGING_FILES
    });
  },

  stopDraggingFiles: () => {
    Dispatcher.dispatch({
      actionType: NOT_DRAGGING_FILES
    });
  },

  addToList: (files) => {
    Dispatcher.dispatch({
      actionType: DROP_FILES,
      files
    });
  }
};
```

### Drop Area Utils<a name="dropAreaUtils"></a>

#### Better Drag

There seems to be a problem with the `dragenter`, `dragleave` events, this util will help us with that.

Create a file called `app/utils/BetterDrag.js`

```javascript
import EventEmitter from 'events';

class BetterDrag extends EventEmitter {
  constructor(el) {
    super();
    this.el = el;
    this.dragCollection = [];
    this.onDragEnter = this.onDragEnter.bind(this);
    this.preventDefault = this.preventDefault.bind(this);
    this.onDragLeave = this.onDragLeave.bind(this);
    this.onDrop = this.onDrop.bind(this);
    this.addListeners();
  }

  addListeners() {
    this.el.addEventListener('dragover', this.preventDefault, false);
    this.el.addEventListener('dragenter', this.onDragEnter, false);
    this.el.addEventListener('dragleave', this.onDragLeave, false);
    this.el.addEventListener('drop', this.onDrop, false);
  }

  removeListeners() {
    this.el.removeEventListener('dragover', this.preventDefault);
    this.el.removeEventListener('dragenter', this.onDragEnter);
    this.el.removeEventListener('dragleave', this.onDragLeave);
    this.el.removeEventListener('drop', this.onDrop);
  }

  destroy() {
    this.removeListeners();
  }

  preventDefault(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  onDragEnter(e) {
    this.preventDefault(e);
    if (this.dragCollection.length === 0) {
      this.emit('dragenter', e);
    }
    this.dragCollection.push(e.target);
  }

  onDragLeave(e) {
    this.preventDefault(e);
    setTimeout(() => {
      const currentElementIndex = this.dragCollection.indexOf(e.target);
      if (currentElementIndex > -1) {
        this.dragCollection.splice(currentElementIndex, 1);
      }

      if (this.dragCollection.length === 0) {
        this.emit('dragleave', e);
      }
    }, 1);
  }

  onDrop(e) {
    this.preventDefault(e);
    this.dragCollection = [];
    this.emit('dragleave', e);
    this.emit('drop', e);
  }
}

export default BetterDrag;
```

#### ReadFiles

Self explanatory, it will help us getting files info.

`app/utils/readFiles.js`

```javascript
import fs from 'fs';
import File from './File';
import WaterFallOver from './WaterFallOver';

class ReadFiles {
  separateDirectoriesFromFiles(inputFiles) {
    const directories = [];
    const files = [];
    let i = 0;
    let file;
    let stat;
    for (i = 0; i < inputFiles.length; i++) {
      file = inputFiles[i];
      stat = fs.statSync(file.path);
      if (stat && stat.isDirectory()) {
        directories.push(file.path);
      } else {
        files.push(new File(file.path));
      }
    }
    return { directories, files };
  }

  getAllAvailableFiles(file) {
    return new Promise(resolve => {
      fs.stat(file, (err, stat) => {
        if (stat && stat.isDirectory()) {
          this.getAllFiles(file).then((res) => {
            resolve(res);
          });
        } else {
          file = new File(file);
          resolve([file]);
        }
      });
    });
  }

  getAllFiles(dir) {
    return new Promise(resolve => {
      let results = [];
      let waterFall, file;
      const onProcessDirectory = (obj) => {
        this.getAllFiles(obj.item).then(res => {
          results = results.concat(res);
          obj.next();
        });
      };
      const onProcessFile = (obj) => {
        file = `${dir}/${obj.item}`;
        this.getAllAvailableFiles(file).then((res) => {
          results = results.concat(res);
          obj.next();
        });
      };
      const onFinishedProcessing = () => {
        waterFall.removeListener('process', onProcessDirectory);
        waterFall.removeListener('process', onProcessFile);
        waterFall = null;
        resolve(results);
      };
      if (Array.isArray(dir)) {
        waterFall = new WaterFallOver(dir);
        waterFall.on('process', onProcessDirectory);
        waterFall.once('finish', onFinishedProcessing);
        waterFall.execute();
      } else {
        fs.readdir(dir, (err, files) => {
          waterFall = new WaterFallOver(files);
          waterFall.on('process', onProcessFile);
          waterFall.once('finish', onFinishedProcessing);
          waterFall.execute();
        });
      }
    });
  }

  filterFilesByType(files, type) {
    return files.filter((file) => (
      file.type.indexOf(type) > -1
    ));
  }
}

export default new ReadFiles();
```

#### File

A helper that will contain information about the loaded files, such as the mime type, album cover.

We'll need 3 new npm modules to get this information.

- [mime](https://www.npmjs.com/package/mime)
- [jsmediatags](https://www.npmjs.com/package/jsmediatags)
- [album-art](https://www.npmjs.com/package/album-art)

Please refer to the links above if you need extra information about them

Let's install them executing command `npm i mime jsmediatags album-art -S`

Here's the file `app/utils/File.js`

```javascript
import p from 'path';
import mime from 'mime';
import jsmediatags from 'jsmediatags';
import albumArt from 'album-art';
import request from 'request';

class File {
  constructor(path) {
    this.path = path;
    this.name = p.basename(path);
    this.type = mime.lookup(path);
  }

  set id(value) {
    this._id = value;
  }

  get id() {
    return this._id;
  }

  set tag(value) {
    if (typeof value === 'string') {
      this.title = value;
      this.displayName = value;
    } else {
      this.artist = value.artist;
      this.title = value.title;
      this.picture = value.picture;
      this.album = value.album;
      this.displayName = `${value.artist} - ${value.title}`;
    }
  }

  get cover() {
    if (this._cover) {
      return this._cover;
    }
    if (!this._cover && this.picture) {
      const pic = this.picture;
      this._cover = `data:${pic.format};base64,${Buffer.from(pic.data).toString('base64')}`;
      return this._cover;
    }
    return false;
  }

  set cover(value) {
    this._cover = value;
  }

  readTags() {
    return new Promise(resolve => {
      new jsmediatags.Reader(this.path)
            .setTagsToRead(['title', 'artist', 'album', 'picture'])
            .read({
              onSuccess: (tag) => {
                this.tag = tag.tags;
                resolve();
              },
              onError: () => {
                this.tag = this.name;
                resolve();
              }
            });
    });
  }

  searchAlbumArt(...args) {
    return new Promise((resolve, reject) => {
      albumArt(...args, (err, url) => {
        if (!err && url) {
          resolve(url);
        } else {
          reject(err);
        }
      });
    });
  }

  findCover() {
    return new Promise((resolve, reject) => {
      this.searchAlbumArt(this.artist, this.album, 'large').then(url => {
        this.cover = url;
        this.convertCoverToBase64();
        resolve(url);
      }).catch(() => {
        this.searchAlbumArt(this.artist, null, 'large').then(url => {
          this.cover = url;
          this.convertCoverToBase64();
          resolve(url);
        }).catch(() => {
          reject();
        });
      });
    });
  }

  convertCoverToBase64() {
    request.get({
      uri: this.cover,
      encoding: null
    }, (err, response, body) => {
      if (!err && response.statusCode >= 200 && response.statusCode < 400) {
        const type = response.headers['content-type'];
        const base64Body = new Buffer(body).toString('base64');
        this.cover = `data:${type};base64,${base64Body}`;
      }
    });
  }
}

export default File;
```

#### WaterFallOver

This class will helps us to iterate sequentially through the file list.

Please refer to [Mostafa Samir blog post](http://mostafa-samir.github.io/async-iterative-patterns-pt1/) for a more comprehensive explanation.

```javascript
import EventEmitter from 'events';

class WaterFallOver extends EventEmitter {
  constructor(list) {
    super();
    this.nextItemIndex = 0;
    this.list = list;
    this.totalElements = this.list.length;
    this.next = this.next.bind(this);
  }

  execute() {
    this.emit('process', { item: this.list[this.nextItemIndex], next: this.next });
  }

  next() {
    this.nextItemIndex++;
    if (this.nextItemIndex === this.totalElements) {
      this.emit('finish');
    } else {
      this.execute();
    }
  }
}

export default WaterFallOver;
```

### Drop Area Component<a name="dropAreaComponent"></a>

Create the file `app/components/DropArea.js`

```javascript
import React, { Component } from 'react';
import BetterDrag from '../utils/BetterDrag';
import DropAreaActions from '../actions/dropArea';
import styles from './DropArea.css';
import readFiles from '../utils/readFiles';

export default class Home extends Component {
  constructor() {
    super();
    this.onDragOver = this.onDragOver.bind(this);
    this.onDragOut = this.onDragOut.bind(this);
    this.onDrop = this.onDrop.bind(this);
    this.state = {
      hover: false
    };
  }

  componentDidMount() {
    this.betterDrag = new BetterDrag(document);
    this.betterDrag.on('dragenter', this.onDragOver);
    this.betterDrag.on('dragleave', this.onDragOut);
    this.betterDrag.on('drop', this.onDrop);
  }

  componentWillUnmount() {
    this.betterDrag.removeListener('dragenter', this.onDragOver);
    this.betterDrag.removeListener('dragleave', this.onDragOut);
    this.betterDrag.removeListener('drop', this.onDrop);
    this.betterDrag.destroy();
  }

  onDragOver(e) {
    const files = e.dataTransfer.files;
    if (files.length) {
      DropAreaActions.draggingFiles();
      this.setState({
        hover: true
      });
    }
  }

  onDragOut() {
    DropAreaActions.stopDraggingFiles();
    this.setState({
      hover: false
    });
  }

  onDrop(e) {
    const obj = readFiles.separateDirectoriesFromFiles(e.dataTransfer.files);
    let files = obj.files;
    if (obj.directories.length) {
      readFiles.getAllFiles(obj.directories)
               .then(results => {
                 files = files.concat(results);
                 this.addFilesToList(files);
               });
    } else {
      this.addFilesToList(files);
    }
  }

  addFilesToList(files) {
    files = readFiles.filterFilesByType(files, 'audio');
    if (files.length) {
      DropAreaActions.addToList(files);
    }
  }

  render() {
    return (
      <div>
        { this.props.children }
        <div className={ `messageArea${this.state.hover ? ' messageArea--hover' : ''}` }>
          <div className={ styles.dashedContainer }>
            Release to add to the list
          </div>
        </div>
      </div>
    );
  }
}
```

And the component styles at `app/component/DropArea.css`

```css
.dashedContainer {
  position: absolute;
  left: 20px;
  right: 20px;
  padding: 20px;
  top: 50%;
  transform: translate3d(0, -50%, 0);
  text-align: center;
  margin: auto;
  border: 5px dashed #efefef;
}
```

If we now try to add the music folder to the window we should see a log in the console saying "addToList: TODO"

![Example of Add To List](tutorial/images/exampleOfAddToList.png)

### Fixing current styles<a name="fixingCurrentStyles"></a>

As you can see from the app everything seems messed up, let's fix it by adding more styles.

Let's add the following styles to `app/app.global.css`

```css
.messageArea {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  opacity: 0;
  pointer-events: none;
  -webkit-transition: all 0.3s;
  -moz-transition: all 0.3s;
  transition: all 0.3s;
  z-index: 10;
}

.messageArea--hover {
  opacity: 1;
  pointer-events: auto;
}

.menuList {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  z-index: 1;
  transform: translate3d(0, -100%, 0);
  -webkit-transition: all 0.3s;
  -moz-transition: all 0.3s;
  transition: all 0.3s;
  -webkit-app-region: no-drag;
}

.menuList.is-opened {
  transform: translate3d(0, 0, 0);
}

.ListItem__is-even {
  background: rgba(255, 255, 255, 0.1);
}

.ListItem__is-odd {
  background: rgba(255, 255, 255, 0.15);
}
```

![BetterStyling](tutorial/images/betterStyling.gif)

Much better. Let's now add those files to list

## Adding files to the list<a name="addingFilesToTheList"></a>

Let's open the store

`app/store/index.js`

```javascript
...
// Import the WaterFallOver as we'll need it
import WaterFallOver from '../utils/WaterFallOver';

...
  addToList(files) {
    let nextId = this.songsList.length;
    const waterFall = new WaterFallOver(files);
    const onProcessFile = (obj) => {
      obj.item.id = nextId++;
      obj.item.readTags().then(() => {
        this.songsList.push(obj.item);
        this.emit(LIST_UPDATE);
        obj.next();
      });
    };
    const onFinish = () => {
      waterFall.removeListener('process', onProcessFile);
    };
    waterFall.on('process', onProcessFile);
    waterFall.once('finish', onFinish);
    waterFall.execute();
  }
```

And there we go, now dropping the files on the player will populate the play list

Clicking on the play button doesn't actually do much. Let's change that.

## Playing a song<a name="playingASong"></a>

Let's create another utility that controls our mp3 file playback.

We won't use any library for this one, we'll trust the web audio api.

Let's create `app/utils/AudioController.js`

```javascript
import EventEmitter from 'events';
import fs from 'fs';

const MAX_VOLUME = 100;

class AudioController extends EventEmitter {
  constructor(volume) {
    super();
    const fraction = parseInt(volume, 10) / MAX_VOLUME;
    const AudioContext = global.AudioContext || global.webkitAudioContext;
    this.context = new AudioContext();
    this.volume = fraction * fraction;
    this.onSongFinished = this.onSongFinished.bind(this);
    this.offsetTime = 0;
    this.isPlaying = false;
    this.songStartingTime = undefined;
  }

  play(file) {
    return new Promise((resolve, reject) => {
      fs.readFile(file.path, (err, data) => {
        if (err) {
          reject(err);
          return;
        }
        this.context.decodeAudioData(this.toArrayBuffer(data), (buffer) => {
          this.playFromBuffer(buffer);
          resolve();
        });
      });
    });
  }

  playFromBuffer(buffer) {
    this.stop(false);
    this.buffer = buffer;
    this.initSource();
    this.offsetTime = 0;
    this.songDuration = this.buffer.duration;
    this.songStartingTime = this.context.currentTime;
    this.playbackTime = 0;
    this.startPlaying();
  }

  startPlaying() {
    this.isPlaying = true;
    this.source.start(0, this.playbackTime);
  }

  initSource() {
    this.source = this.context.createBufferSource();
    this.gainNode = this.context.createGain();
    this.analyser = this.context.createAnalyser();
    this.source.buffer = this.buffer;
    this.source.connect(this.gainNode);
    this.source.connect(this.analyser);
    this.gainNode.connect(this.context.destination);
    this.gainNode.gain.value = this.volume;
    this.source.onended = this.onSongFinished;
  }

  seek(playbackTime) {
    if (this.isPlaying) {
      this.stop(false);
      this.initSource();
      this.songStartingTime = this.context.currentTime - playbackTime;
      this.playbackTime = playbackTime;
      this.startPlaying();
    } else {
      this.songStartingTime = this.context.currentTime - playbackTime;
      this.playbackTime = playbackTime;
    }
  }

  restart() {
    this.seek(0);
  }

  getCurrentPlayingTime() {
    if (typeof this.songStartingTime !== 'undefined') {
      return this.context.currentTime - this.songStartingTime;
    }
  }

  getSongDuration() {
    return this.songDuration;
  }

  onSongFinished() {
    this.isPlaying = false;
    this.songDuration = undefined;
    this.songStartingTime = undefined;
    this.emit('songFinished');
  }

  stop(report = true) {
    if (this.source) {
      if (!report) {
        this.source.onended = undefined;
      }
      this.source.stop(0);
      this.gainNode = null;
    }
  }

  pause() {
    this.isPlaying = false;
    this.pausePlaybackTime = this.playbackTime;
    this.context.suspend();
  }

  resume() {
    this.isPlaying = true;
    this.context.resume();
    if (this.pausePlaybackTime !== this.playbackTime) {
      this.seek(this.playbackTime);
    }
  }

  mute() {
    if (this.gainNode) {
      this.savedGainValue = this.gainNode.gain.value;
      this.gainNode.gain.value = 0;
    }
  }

  unmute(volume) {
    if (this.gainNode) {
      this.gainNode.gain.value = volume || this.savedGainValue;
    }
  }

  setVolume(volume) {
    const fraction = parseInt(volume, 10) / MAX_VOLUME;
    this.volume = fraction * fraction; // Linear (x) doesn't sound as good
    if (this.gainNode) {
      this.gainNode.gain.value = this.volume;
    }
  }

  toArrayBuffer(buffer) {
    const ab = new ArrayBuffer(buffer.length);
    const view = new Uint8Array(ab);
    for (let i = 0; i < buffer.length; ++i) {
      view[i] = buffer[i];
    }
    return ab;
  }

  getFrequency(frequencyData) {
    if (!this.analyser) {
      return;
    }
    if (!frequencyData) {
      frequencyData = new Uint8Array(this.analyser.frequencyBinCount);
    }
    this.analyser.getByteFrequencyData(frequencyData);
    return frequencyData;
  }

  frequencyToIndex(frequency, sampleRate, frequencyBinCount) {
    const nyquist = sampleRate / 2;
    const index = Math.round(frequency / nyquist * frequencyBinCount);
    return this.clamp(index, 0, frequencyBinCount);
  }

  analyserAverage(frequencies, minHz, maxHz) {
    const div = 255;
    const sampleRate = this.analyser.context.sampleRate;
    const binCount = this.analyser.frequencyBinCount;
    let start = this.frequencyToIndex(minHz, sampleRate, binCount);
    const end = this.frequencyToIndex(maxHz, sampleRate, binCount);
    const count = end - start;
    let sum = 0;
    for (; start < end; start++) {
      sum += frequencies[start] / div;
    }
    return count === 0 ? 0 : (sum / count);
  }

  clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }
}

export default AudioController;
```

That's all we need to grab all the information we'll need for this player.

Let's open the store file and play that clicked song

`app/store/index.js`

```javascript
import AudioController from '../utils/AudioController';
...

  constructor() {
    super();
    this.songsList = [];
    this.playingSong = null;
    this.volume = 100;
    this.isMute = false;
    this.onSongFinished = this.onSongFinished.bind(this);
    this.audioController = new AudioController(this.volume);
    this.audioController.on('songFinished', this.onSongFinished);
  }

...

  playSong(file) {
    if (this.playingSong && this.playingSong.paused && (!file || this.playingSong.id === file.id)) {
      this.resumeSong();
    } else if (!file) {
      this.playNextOnTheList();
    } else {
      this.playingSong = file;
      this.audioController.play(file);
      this.emit(STARTED_PLAYING, file);
    }
  }

  resumeSong() {
    this.playingSong.paused = false;
    this.audioController.resume();
    this.emit(STARTED_PLAYING, this.playingSong);
  }

  pauseSong() {
    this.playingSong.paused = true;
    this.audioController.pause();
    this.emit(STARTED_PLAYING, this.playingSong);
  }
```

There we go, now our app plays the song when we press play on the play list

![Playing a song](tutorial/images/playingASong.png)

## Adding more controls<a name="moreControls"></a>

We'll need an extra npm module called [react-input-range](https://www.npmjs.com/package/react-input-range)

`npm i react-input-range -S` from the command line to install it

### Music Controls<a name="musicControls></a>

`app/components/MusicControls.js`

```javascript
import React, { Component } from 'react';
import store from '../store';
import VolumeControl from './VolumeControl';
import Seeker from './Seeker';
import styles from './MusicControls.css';
import MusicActions from '../actions/music';
import { STARTED_PLAYING, STOPPED_PLAYING } from '../events';

// Decide whether to change track or restart the current one
const TIME_BEFORE_CHANGING_TRACK = 1000;

class MusicControls extends Component {
  constructor() {
    super();
    this.state = {
      songPlaying: false
    };
    this.onSongPlaying = this.onSongPlaying.bind(this);
    this.onSongStopped = this.onSongStopped.bind(this);
    this.onPauseClicked = this.onPauseClicked.bind(this);
    this.onPlayClicked = this.onPlayClicked.bind(this);
    this.onPreviousClicked = this.onPreviousClicked.bind(this);
    this.onNextClicked = this.onNextClicked.bind(this);
    this.lastTimeClicked = 0;
  }

  componentDidMount() {
    store.on(STARTED_PLAYING, this.onSongPlaying);
    store.on(STOPPED_PLAYING, this.onSongStopped);
  }

  componentWillUnmount() {
    store.removeListener(STARTED_PLAYING, this.onSongPlaying);
    store.removeListener(STOPPED_PLAYING, this.onSongStopped);
  }

  onSongPlaying(song) {
    this.setState({
      songPlaying: !song.paused
    });
  }

  onSongStopped() {
    this.setState({
      songPlaying: false
    });
  }

  onPlayClicked() {
    MusicActions.playSong();
  }

  onPauseClicked() {
    MusicActions.pauseSong();
  }

  onPreviousClicked() {
    if (Date.now() - this.lastTimeClicked < TIME_BEFORE_CHANGING_TRACK) {
      MusicActions.playPreviousSong();
    } else {
      MusicActions.restartSong();
    }
    this.lastTimeClicked = Date.now();
  }

  onNextClicked() {
    MusicActions.playNextSong();
  }

  render() {
    return (
      <div className={ styles.container }>
        <div className={ styles.basicControls }>
          <div onClick={ this.onPreviousClicked } className={ styles.previousButton }></div>
          { this.state.songPlaying ?
              <div onClick={ this.onPauseClicked } className={ styles.pauseButton }></div> :
              <div onClick={ this.onPlayClicked } className={ styles.playButton }></div>
          }
          <div onClick={ this.onNextClicked } className={ styles.nextButton }></div>
        </div>
        <Seeker />
        <VolumeControl className={ styles.volumeControl } />
      </div>
    );
  }
}

export default MusicControls;
```

And the styles `app/components/MusicControls.css`

```css
.container {
  position: absolute;
  bottom: 10px;
  left: 0;
  right: 0;
  height: 30px;
}

.volumeControl {
  position: absolute;
  right: 54px;
  top: 0;
}

.basicControls {
  position: relative;
  float: left;
  left: 10px;
}

.previousButton,
.pauseButton,
.playButton,
.nextButton {
  position: relative;
  float: left;
  margin: 0 4px;
  background-size: 100%;
  cursor: pointer;
  width: 15px;
  height: 15px;
  top: 6px;
}

.playButton,
.pauseButton {
  width: 30px;
  height: 30px;
  top: 0;
}

.previousButton {
  background-image: url("../assets/img/previous.svg");
}

.nextButton {
  background-image: url("../assets/img/next.svg");
}

.playButton {
  background-image: url("../assets/img/play.svg");
}

.pauseButton {
  background-image: url("../assets/img/pause.svg");
}

.basicControls div:first-child {
  margin-left: 0;
}

.basicControls div:last-child {
  margin-right: 0;
}
```

### Seeker Control<a name="seekerControl"></a>

`app/components/Seeker.js`

```javascript
import React, { Component } from 'react';
import store from '../store';
import InputRange from 'react-input-range';
import MusicActions from '../actions/music';
import styles from './Seeker.css';
import { STARTED_PLAYING, STOPPED_PLAYING, ANIMATION_FRAME } from '../events';

class Seeker extends Component {
  constructor() {
    super();
    this.state = {
      playingTime: undefined,
      songTime: undefined
    };
    this.stopGrabbingPlaytime = true;
    this.setSongTime = this.setSongTime.bind(this);
    this.onScrubChange = this.onScrubChange.bind(this);
    this.onScrubMouseDown = this.onScrubMouseDown.bind(this);
    this.onScrubMouseUp = this.onScrubMouseUp.bind(this);
    this.onSongStartPlaying = this.onSongStartPlaying.bind(this);
    this.onSongStoppedPlaying = this.onSongStoppedPlaying.bind(this);
  }

  componentDidMount() {
    store.on(ANIMATION_FRAME, this.setSongTime);
    store.on(STARTED_PLAYING, this.onSongStartPlaying);
    store.on(STOPPED_PLAYING, this.onSongStoppedPlaying);
    global.store = store;
  }

  componentWillUnmount() {
    store.removeListener(ANIMATION_FRAME, this.setSongTime);
    store.removeListener(STARTED_PLAYING, this.onSongStartPlaying);
    store.removeListener(STOPPED_PLAYING, this.onSongStoppedPlaying);
  }

  onSongStartPlaying() {
    this.stopGrabbingPlaytime = false;
    this.setState({
      playingTime: store.getPlaytime(),
      songTime: store.getSongDuration()
    });
  }

  onSongStoppedPlaying() {
    this.stopGrabbingPlaytime = true;
    this.setState({
      playingTime: undefined,
      songTime: undefined
    });
  }

  onScrubChange(component, value) {
    this.seekSongTo = value / 1000;
    this.setState({
      playingTime: value / 1000
    });
  }

  setSongTime() {
    if (this.stopGrabbingPlaytime) {
      return;
    }
    this.setState({
      playingTime: store.getPlaytime(),
      songTime: store.getSongDuration()
    });
  }

  pad(value, size = 2) {
    let s = String(value);
    while (s.length < size) {
      s = `0${s}`;
    }
    return s;
  }

  transformTime(time) {
    if (Number.isNaN(time)) {
      return '- -:- -';
    }
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time - minutes * 60);
    return `${minutes}:${this.pad(seconds)}`;
  }

  validateValue(value) {
    if (Number.isNaN(value)) {
      return 0;
    }
    return Math.min(value, this.state.songTime * 1000);
  }

  onScrubMouseDown(e) {
    const className = e.target.className;
    if (className.indexOf('InputRange-') === -1) {
      return;
    }
    this.stopGrabbingPlaytime = true;
    document.addEventListener('mouseup', this.onScrubMouseUp);
  }

  onScrubMouseUp() {
    document.removeEventListener('mouseup', this.onScrubMouseUp);
    this.stopGrabbingPlaytime = false;
    MusicActions.seek(this.seekSongTo);
  }

  render() {
    const playTime = Math.floor(this.state.playingTime);
    const scrubTime = this.validateValue(playTime * 1000);
    const totalTime = Math.floor(this.state.songTime);
    return (
      <div className={ styles.container }>
        <div className={ styles.playingTime }>{ this.transformTime(playTime) }</div>
        <div className="timeRange" onMouseDown={ this.onScrubMouseDown }>
          <InputRange minValue={ 0 } maxValue={ Math.max(this.validateValue(totalTime * 1000), 1) } value={ scrubTime } onChange={ this.onScrubChange }/>
        </div>
        <div className={ styles.songTime }>{ this.transformTime(totalTime) }</div>
      </div>
    );
  }
}

export default Seeker;
```

and the styles `app/component/Seeker.css`

```css
.container {
  position: absolute;
  top: 0;
  left: 100px;
  right: 90px;
}

.playingTime {
  position: absolute;
  font-size: 10px;
  left: 0;
  top: 0;
  line-height: 30px;
  text-align: center;
  width: 25px;
}

.songTime {
  position: absolute;
  font-size: 10px;
  right: 0;
  top: 0;
  line-height: 30px;
  text-align: center;
  width: 25px;
}
```

### Volume Control<a name="volumeControl"></a>

`app/components/VolumeControl.js`

```javascript
import React, { Component } from 'react';
import store from '../store';
import styles from './VolumeControl.css';
import MusicActions from '../actions/music';
import VolumeIconSvg from './VolumeIconSvg';
import InputRange from 'react-input-range';
import { MUTE_SOUND, UNMUTE_SOUND } from '../events';

const MIN_VOLUME = 0;
const MAX_VOLUME = 100;

class VolumeControl extends Component {
  constructor() {
    super();
    this.state = {
      mute: store.isMuted(),
      volume: store.getVolume()
    };
    this.savedVolume = this.state.volume;
    this.toggleVolume = this.toggleVolume.bind(this);
    this.onSoundMuted = this.onSoundMuted.bind(this);
    this.onSoundUnmuted = this.onSoundUnmuted.bind(this);
    this.onVolumeRangeChange = this.onVolumeRangeChange.bind(this);
  }

  componentDidMount() {
    store.on(MUTE_SOUND, this.onSoundMuted);
    store.on(UNMUTE_SOUND, this.onSoundUnmuted);
  }

  componentWillUnmount() {
    store.removeListener(MUTE_SOUND, this.onSoundMuted);
    store.removeListener(UNMUTE_SOUND, this.onSoundUnmuted);
  }

  onSoundMuted() {
    this.savedVolume = this.state.volume;
    this.setState({
      mute: true,
      volume: 0
    });
  }

  onSoundUnmuted() {
    this.setState({
      mute: false,
      volume: this.savedVolume
    });
  }

  onVolumeRangeChange(component, value) {
    this.setState({
      volume: value
    });
    MusicActions.setVolume(value);
  }

  toggleVolume() {
    if (this.state.mute) {
      MusicActions.unmute(this.savedVolume);
    } else {
      MusicActions.mute();
    }
  }

  render() {
    return (
      <div className={ this.props.className }>
        <div className="volumeRange">
          <InputRange minValue={ MIN_VOLUME } maxValue={ MAX_VOLUME } value={ this.state.volume } onChange={ this.onVolumeRangeChange }/>
        </div>
        <div className={ styles.volumeButton } onClick={ this.toggleVolume }>
          <VolumeIconSvg volume={ this.state.volume / MAX_VOLUME } className={ styles.volumeIcon } fill="#FFFFFF"/>
        </div>
      </div>
    );
  }
}

export default VolumeControl;
```

and the styles `app/components/VolumeControl.css`

```css
.volumeIcon {
  width: 30px;
  height: 30px;
  cursor: pointer;
}

.volumeButton {
  cursor: pointer;
  width: 30px;
  height: 30px;
}
```

### Volume Icon<a name="volumeIcon"></a>

This component will just be an svg that will change the icon depending on the volume

`app/components/VolumeIconSvg.js`

```javascript
import React, { Component } from 'react';

class VolumeIconSvg extends Component {
  renderSoundOn() {
    return (
      <g>
        <path d={`M34.437,7.413c-0.979-0.561-2.143-0.553-3.115,0.019c-0.063,0.037-0.121,0.081-0.174,0.131L17.906,19.891
          C17.756,19.963,17.593,20,17.427,20H9.104C7.392,20,6,21.393,6,23.104v12.793C6,37.607,7.392,39,9.104,39h8.324
          c0.166,0,0.329,0.037,0.479,0.109l13.242,12.328c0.053,0.05,0.112,0.094,0.174,0.131c0.492,0.289,1.033,0.434,1.574,0.434
          c0.529,0,1.058-0.138,1.541-0.415C35.416,51.027,36,50.021,36,48.894V10.106C36,8.979,35.416,7.973,34.437,7.413z M34,48.894
          c0,0.577-0.389,0.862-0.556,0.958c-0.158,0.09-0.562,0.262-1.025,0.037l-13.244-12.33c-0.054-0.051-0.113-0.095-0.176-0.131
          C18.522,37.147,17.979,37,17.427,37H9.104C8.495,37,8,36.505,8,35.896V23.104C8,22.495,8.495,22,9.104,22h8.324
          c0.551,0,1.095-0.147,1.572-0.428c0.063-0.036,0.122-0.08,0.176-0.131l13.244-12.33c0.465-0.226,0.868-0.053,1.025,0.037
          C33.611,9.244,34,9.529,34,10.106V48.894z`} />
        { this.props.volume > 0 ? <path d={`M39.707,20.293c-0.391-0.391-1.023-0.391-1.414,0s-0.391,1.023,0,1.414c4.297,4.297,4.297,11.289,0,15.586
          c-0.391,0.391-0.391,1.023,0,1.414C38.488,38.902,38.744,39,39,39s0.512-0.098,0.707-0.293
          C44.784,33.63,44.784,25.37,39.707,20.293z`}/> : null }
        { this.props.volume >= 0.35 ? <path d={`M43.248,17.293c-0.391-0.391-1.023-0.391-1.414,0s-0.391,1.023,0,1.414c6.238,6.238,6.238,16.39,0,22.628
          c-0.391,0.391-0.391,1.023,0,1.414c0.195,0.195,0.451,0.293,0.707,0.293s0.512-0.098,0.707-0.293
          C50.266,35.73,50.266,24.312,43.248,17.293z`}/> : null }
        { this.props.volume >= 0.70 ? <path d={`M46.183,12.293c-0.391-0.391-1.023-0.391-1.414,0s-0.391,1.023,0,1.414c4.356,4.355,6.755,10.142,6.755,16.293
          s-2.399,11.938-6.755,16.293c-0.391,0.391-0.391,1.023,0,1.414C44.964,47.902,45.22,48,45.476,48s0.512-0.098,0.707-0.293
          c4.734-4.733,7.341-11.021,7.341-17.707S50.917,17.026,46.183,12.293z`}/> : null }
        <path d={`M30,0C13.458,0,0,13.458,0,30s13.458,30,30,30s30-13.458,30-30S46.542,0,30,0z M30,58C14.561,58,2,45.439,2,30
          S14.561,2,30,2s28,12.561,28,28S45.439,58,30,58z`}/>
      </g>
    );
  }

  renderMuted() {
    return (
      <path d={`M51.213,8.78C39.517-2.917,20.484-2.916,8.787,8.78C3.121,14.446,0,21.98,0,29.993S3.121,45.54,8.787,51.206
              c5.848,5.849,13.531,8.772,21.213,8.772s15.365-2.924,21.213-8.772C62.91,39.509,62.91,20.477,51.213,8.78z M10.201,10.194
              C15.66,4.736,22.83,2.007,30,2.007c6.858,0,13.713,2.504,19.074,7.498L42,16.579v-6.479c0-1.127-0.584-2.134-1.563-2.693
              c-0.978-0.561-2.143-0.553-3.115,0.019c-0.063,0.037-0.121,0.081-0.174,0.131L23.906,19.884c-0.149,0.072-0.313,0.109-0.479,0.109
              h-8.324c-1.711,0-3.104,1.393-3.104,3.104v12.793c0,1.711,1.392,3.104,3.104,3.104h4.482L9.511,49.068
              C4.664,43.869,2,37.137,2,29.993C2,22.514,4.913,15.483,10.201,10.194z M21.586,36.993h-6.482c-0.608,0-1.104-0.495-1.104-1.104
              V23.096c0-0.608,0.495-1.104,1.104-1.104h8.324c0.551,0,1.095-0.147,1.572-0.428c0.063-0.036,0.122-0.08,0.176-0.131l13.244-12.33
              c0.465-0.226,0.868-0.053,1.025,0.037C39.611,9.237,40,9.522,40,10.099v8.479L21.586,36.993z M40,21.407v27.479
              c0,0.577-0.389,0.862-0.556,0.958c-0.158,0.09-0.562,0.262-1.025,0.037l-13.244-12.33c-0.054-0.051-0.113-0.095-0.176-0.131
              c-0.224-0.132-0.466-0.229-0.713-0.3L40,21.407z M49.799,49.792c-10.68,10.679-27.908,10.904-38.873,0.689l11.488-11.488h1.013
              c0.166,0,0.329,0.037,0.479,0.109L37.148,51.43c0.053,0.05,0.112,0.094,0.174,0.131c0.492,0.289,1.033,0.434,1.574,0.434
              c0.529,0,1.058-0.138,1.541-0.415C41.416,51.02,42,50.013,42,48.887V19.407l8.488-8.488C60.704,21.884,60.479,39.112,49.799,49.792z
              `}/>
    );
  }

  render() {
    return (
      <svg fill={ this.props.fill } className={ this.props.className } viewBox="0 0 60 60" preserveAspectRatio="xMidYMid meet">
          { this.props.volume === 0 ? this.renderMuted() : this.renderSoundOn() }
      </svg>
    );
  }
}

export default VolumeIconSvg;
```

### Animation frame on the store<a name="animationFrame"></a>

What this will do is to trigger an event every single frame, so we can update the seeker and later on the spectrum

Open `app/store/index.js`

```javascript
...
  constructor() {
    super();
    this.songsList = [];
    this.playingSong = null;
    this.volume = 100;
    this.isMute = false;
    this.onSongFinished = this.onSongFinished.bind(this);
    this.reportAnimation = this.reportAnimation.bind(this);
    this.audioController = new AudioController(this.volume);
    this.audioController.on('songFinished', this.onSongFinished);
    this.reportAnimation();
  }

  reportAnimation() {
    this.emit(ANIMATION_FRAME);
    global.requestAnimationFrame(this.reportAnimation);
  }
...
```

### Adding the Music Controls to the Home Component<a name="musicControlsHome"></a>

Let's now add the controllers to our `app/components/Home.js`

```javascript
...
import MusicControls from './MusicControls';
...

  render() {
    let className = styles.homeContainer;
    return (
      <div className={ className }>
        <div className={ styles.playerTitle }>
          <div className={ styles.closeButton } onClick={this.onCloseClick}></div>
          <div className={ styles.menuButton } onClick={this.onMenuClick}></div>
        </div>
        <div className={styles.musicControls}>
          <MusicControls />
        </div>
      </div>
    );
  }
```

We need to add more stylings to `app/components/Home.css`

```css
...

.musicControls {
  position: absolute;
  top: 30%;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
}

.musicControls h2 {
  font-size: 5rem;
}

.musicControls a {
  font-size: 1.4rem;
}
```

[Music controls](tutorial/images/musicControls.png)

The result is probably not what we expected, but we'll fix it later

## Finishing the store<a name="finishingStore"></a>

Let's finish the store now so we focus ourselves in the styling of the app

Open `app/store/index.js`

```javascript
...
import {
  CLOSE_WINDOW,
  REORDER_LIST,
  OPEN_LIST,
  CLOSE_LIST,
  DRAGGING_FILES,
  NOT_DRAGGING_FILES,
  DROP_FILES,
  REMOVE_FROM_LIST,
  LIST_UPDATE,
  STARTED_PLAYING,
  STOPPED_PLAYING,
  PLAY_SONG,
  PAUSE_SONG,
  PLAY_NEXT_SONG,
  PLAY_PREVIOUS_SONG,
  RESTART_SONG,
  SEEK_SONG,
  MUTE_SOUND,
  UNMUTE_SOUND,
  SET_VOLUME,
  ANIMATION_FRAME
} from '../events';

const NUMBER_OF_SPECTRUM_BARS = 16;

...

  stopSong(file) {
    if (!file) {
      return;
    }
    this.emit(STOPPED_PLAYING, this.playingSong);
    this.playingSong = null;
    this.audioController.stop(false);
  }

  restartSong() {
    this.audioController.restart();
  }

  ...

  mute() {
    this.isMute = true;
    this.audioController.mute();
    this.emit(MUTE_SOUND);
  }

  unmute(volume) {
    this.isMute = false;
    this.audioController.unmute(volume);
    this.emit(UNMUTE_SOUND);
  }

  setVolume(volume) {
    this.audioController.setVolume(volume);
    this.volume = volume;
    this.emit(SET_VOLUME, volume);
  }

  getPlaytime() {
    return this.audioController.getCurrentPlayingTime();
  }

  getSongDuration() {
    return this.audioController.getSongDuration();
  }

  seek(value) {
    this.audioController.seek(value);
  }

  getFrequency() {
    // we want to reuse the array to avoid creating multiple ones
    const average = new Array(NUMBER_OF_SPECTRUM_BARS).fill(0);
    let i = 0;
    this.frequencies = this.frequencies || null;
    this.frequencies = this.audioController.getFrequency(this.frequencies);
    if (!this.frequencies) {
      return average;
    }
    const averageStep = this.frequencies.length / NUMBER_OF_SPECTRUM_BARS;
    for (i = 0; i < NUMBER_OF_SPECTRUM_BARS; i++) {
      average[i] = this.audioController.analyserAverage(this.frequencies, i * averageStep, (i + 1) * averageStep);
    }
    return average;
  }
```

There we go, we should now be all done with the store

## Fixing the styles for the seeker<a name="fixingSeeker"></a>

Open the `app/app.html` file and add the input range css

```html
...
    <link rel="stylesheet" href="../node_modules/font-awesome/css/font-awesome.min.css" />
    <link rel="stylesheet" href="../node_modules/react-input-range/dist/react-input-range.min.css" />
...
```

Add it as an external component to `webpack.config.electron.js`

```javascript
...
  externals: [
    'font-awesome',
    'react-input-range',
    'source-map-support'
  ]
...
```

Open `app/app.global.css` and add the following

```css
...
.volumeRange {
  position: absolute;
  left: 40px;
  width: 30px;
  height: 30px;
  top: 7px;
}

.timeRange {
  position: absolute;
  left: 35px;
  right: 35px;
  height: 30px;
  top: 7px;
}

.volumeRange .InputRange,
.timeRange .InputRange {
  cursor: default;
}

.timeRange .InputRange-label--min,
.timeRange .InputRange-label--max,
.timeRange .InputRange-label--value,
.volumeRange .InputRange-label--min,
.volumeRange .InputRange-label--max,
.volumeRange .InputRange-label--value {
  display: none;
}

.timeRange .InputRange-slider,
.volumeRange .InputRange-slider {
  top: 2px;
  width: 10px;
  height: 10px;
}

.timeRange .InputRange-sliderContainer,
.timeRange .InputRange-track,
.volumeRange .InputRange-sliderContainer,
.volumeRange .InputRange-track {
  -webkit-transition: none;
  -moz-transition: none;
  transition: none;
}
```

Here's the result

![Seeker Sample](tutorial/images/SeekerSample.png)

Looking good

## Adding Cover<a name="addingCover"></a>

Create a new component `app/components/SongCover.js`

```javascript
import React, { Component } from 'react';
import configureStore from '../store/configureStore';
import styles from './SongCover.css';
import { STARTED_PLAYING } from '../events';

const UNKNOWN_URL = './assets/img/unknown-cover.svg';

class SongCover extends Component {
  constructor() {
    super();
    this.onSongPlaying = this.onSongPlaying.bind(this);
    this.state = {
      url: UNKNOWN_URL
    };
  }

  componentDidMount() {
    configureStore.on(STARTED_PLAYING, this.onSongPlaying);
  }

  componentWillUnmount() {
    configureStore.removeListener(STARTED_PLAYING, this.onSongPlaying);
  }

  onSongPlaying(file) {
    if (file.cover) {
      this.setState({
        url: file.cover
      });
    } else {
      file.findCover().then((cover) => {
        this.setState({
          url: cover
        });
      }).catch(() => {
        this.setState({
          url: UNKNOWN_URL
        });
      });
    }
  }

  render() {
    const innerStyles = {
      backgroundImage: `url(${this.state.url})`
    };
    return (
      <div className={ styles.container } style={ innerStyles }></div>
    );
  }
}

export default SongCover;
```

And the styles `app/components/SongCover.css`

```css
.container {
  position: relative;
  width: 200px;
  height: 200px;
  overflow: hidden;
  border-radius: 50%;
  background-size: 100%;
  margin: auto;
}
```

Now let's add the component to `app/components/Home.js`

```javascript
...
import SongCover from './SongCover';
...
  render() {
    let className = styles.homeContainer;
    return (
      <div className={ className }>
        <div className={ styles.playerTitle }>
          <div className={ styles.closeButton } onClick={this.onCloseClick}></div>
          <div className={ styles.menuButton } onClick={this.onMenuClick}></div>
        </div>
        <div className={styles.musicControls}>
          <SongCover />
          <MusicControls />
        </div>
      </div>
    );
  }
```

![With Cover](tutorial/images/WithCover.png)


## Player Spectrum<a name="playerSpectrum"></a>

Let's create a new file `app/components/PlayerSpectrum.js`

```javascript
import React, { Component } from 'react';
import store from '../store';
import styles from './PlayerSpectrum.css';
import { ANIMATION_FRAME } from '../events';

class PlayerSpectrum extends Component {
  constructor() {
    super();
    this.state = {
      bars: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    };
    this.getSpectrum = this.getSpectrum.bind(this);
  }

  componentDidMount() {
    store.on(ANIMATION_FRAME, this.getSpectrum);
  }

  componentWillUnmount() {
    store.removeListener(ANIMATION_FRAME, this.getSpectrum);
  }

  getSpectrum() {
    this.setState({
      bars: store.getFrequency()
    });
  }

  render() {
    return (
      <div className={ styles.container }>
        {
          this.state.bars.map((item, index) => {
            return (
              <div key={ index } className={ styles.spectrumBar } style={{ left: `${6.25 * index}%`, height: `${Math.ceil(this.state.bars[index] * 100)}%` }}></div>
            );
          })
        }
      </div>
    );
  }
}

export default PlayerSpectrum;
```

With the styles `app/components/PlayerSpectrum.css`

```css
.container {
  position: absolute;
  width: 100%;
  height: 200px;
  bottom: 0;
  left: 0;
  -webkit-filter: url("#goo");
  filter: url("#goo");
}

.spectrumBar {
  position: absolute;
  width: 6.25%;
  bottom: 0;
  float: left;
  background: #ad2a2a;
}
```

And again let's add it to `app/components/Home.js`

```javascript
...
import PlayerSpectrum from './PlayerSpectrum';
...
  render() {
    let className = styles.homeContainer;
    return (
      <div className={ className }>
        <div className={ styles.playerTitle }>
          <div className={ styles.closeButton } onClick={this.onCloseClick}></div>
          <div className={ styles.menuButton } onClick={this.onMenuClick}></div>
        </div>
        <div className={styles.musicControls}>
          <PlayerSpectrum />
          <SongCover />
          <MusicControls />
        </div>
      </div>
    );
  }
```

![Spectrum](tutorial/images/Spectrum.png)


### Adding the gooey effect<a name="gooey"></a>

For better understanding of the effect please refer to the [codrops article](http://tympanus.net/codrops/2015/03/10/creative-gooey-effects/)

Open `app/app.html` and add the following to the top of the body

```html
...
<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="800" style="display: none; position: absolute; top: 0; left: 0;">
  <defs>
    <filter id="goo">
      <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
      <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -9" result="goo" />
    </filter>
  </defs>
</svg>
...
```

And we're done

![Gooey](tutorial/images/gooey.png)


## Blur on dragging files

Open `app/components/Home.js`

```javascript
import React, { Component } from 'react';
import store from '../store';
import styles from './Home.css';
import HomeActions from '../actions/home';
import MusicControls from './MusicControls';
import SongCover from './SongCover';
import PlayerSpectrum from './PlayerSpectrum';
import { DRAGGING_FILES, NOT_DRAGGING_FILES, OPEN_LIST, CLOSE_LIST } from '../events';
...

  constructor() {
    super();
    this.onCloseClick = this.onCloseClick.bind(this);
    this.onDragStart = this.onDragStart.bind(this);
    this.onDragStop = this.onDragStop.bind(this);
    this.onMenuOpened = this.onMenuOpened.bind(this);
    this.onMenuClosed = this.onMenuClosed.bind(this);
    this.state = {
      isDragging: false,
      isMenuOpened: false
    };
  }

  componentDidMount() {
    store.on(DRAGGING_FILES, this.onDragStart);
    store.on(NOT_DRAGGING_FILES, this.onDragStop);
    store.on(OPEN_LIST, this.onMenuOpened);
    store.on(CLOSE_LIST, this.onMenuClosed);
  }

  componentWillUnmount() {
    store.removeListener(DRAGGING_FILES, this.onDragStart);
    store.removeListener(NOT_DRAGGING_FILES, this.onDragStop);
    store.removeListener(OPEN_LIST, this.onMenuOpened);
    store.removeListener(CLOSE_LIST, this.onMenuClosed);
  }

  onMenuOpened() {
    this.setState({
      isMenuOpened: true
    });
  }

  onMenuClosed() {
    this.setState({
      isMenuOpened: false
    });
  }

  onDragStart() {
    this.setState({
      isDragging: true
    });
  }

  onDragStop() {
    this.setState({
      isDragging: false
    });
  }


  ...


  render() {
    let className = styles.homeContainer;
    if (this.state.isDragging) {
      className += ` ${styles.filesOver}`;
    }
    if (this.state.isMenuOpened) {
      className += ` ${styles.fileListOpened}`;
    }
    return (
      <div className={ className }>
        <div className={ styles.playerTitle }>
          <div className={ styles.closeButton } onClick={this.onCloseClick}></div>
          <div className={ styles.menuButton } onClick={this.onMenuClick}></div>
        </div>
        <div className={styles.musicControls}>
          <PlayerSpectrum />
          <SongCover />
          <MusicControls />
        </div>
      </div>
    );
  }
```

## Build<a name="build"></a>

We are done with this one now.

Let's build it using `npm run package`

When the command is complete open the generated file from the `release` folder and give it a go.

Hope you liked it.

Please use the issues tab for feedback or actual issues found during the tutorial.

Till next time.
