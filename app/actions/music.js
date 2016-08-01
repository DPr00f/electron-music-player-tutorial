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
