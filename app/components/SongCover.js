import React, { Component } from 'react';
import store from '../store';
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
    store.on(STARTED_PLAYING, this.onSongPlaying);
  }

  componentWillUnmount() {
    store.removeListener(STARTED_PLAYING, this.onSongPlaying);
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
