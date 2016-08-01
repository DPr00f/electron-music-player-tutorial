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
