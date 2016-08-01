import Dispatcher from '../dispatcher';
import { remote } from 'electron';
import EventEmitter from 'events';
import { CLOSE_WINDOW, OPEN_LIST } from '../events';

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

export default store;
