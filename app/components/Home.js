import React, { Component } from 'react';
import store from '../store';
import styles from './Home.css';
import HomeActions from '../actions/home';
import MusicControls from './MusicControls';
import SongCover from './SongCover';
import PlayerSpectrum from './PlayerSpectrum';
import { DRAGGING_FILES, NOT_DRAGGING_FILES, OPEN_LIST, CLOSE_LIST } from '../events';

export default class Home extends Component {
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

  onMenuClick() {
    HomeActions.openList();
  }

  onCloseClick() {
    HomeActions.closeWindow();
  }

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
}
