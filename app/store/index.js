import Dispatcher from '../dispatcher';
import { remote } from 'electron';
import EventEmitter from 'events';
import WaterFallOver from '../utils/WaterFallOver';
import AudioController from '../utils/AudioController';
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

class Store extends EventEmitter {
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

  closeCurrentWindow() {
    remote.getCurrentWindow().close();
  }

  openListMenu() {
    this.emit(OPEN_LIST);
  }

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
    this.audioController.resume();
    this.emit(STARTED_PLAYING, this.playingSong);
  }

  pauseSong() {
    this.playingSong.paused = true;
    this.audioController.pause();
    this.emit(STARTED_PLAYING, this.playingSong);
  }

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

  isMuted() {
    return this.isMute;
  }

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
}

const store = new Store();

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

export default store;
