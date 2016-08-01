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
