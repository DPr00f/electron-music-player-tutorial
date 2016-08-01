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
