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
