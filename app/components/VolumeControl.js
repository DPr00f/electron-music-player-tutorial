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
