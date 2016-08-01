import Dispatcher from '../dispatcher';
import { CLOSE_WINDOW, OPEN_LIST } from '../events';

export default {
  closeWindow: () => {
    Dispatcher.dispatch({
      actionType: CLOSE_WINDOW
    });
  },

  openList: () => {
    Dispatcher.dispatch({
      actionType: OPEN_LIST
    });
  }
};
