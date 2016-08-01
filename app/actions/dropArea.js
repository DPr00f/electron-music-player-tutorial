import Dispatcher from '../dispatcher';
import { DRAGGING_FILES, NOT_DRAGGING_FILES, DROP_FILES } from '../events';

export default {
  draggingFiles: () => {
    Dispatcher.dispatch({
      actionType: DRAGGING_FILES
    });
  },

  stopDraggingFiles: () => {
    Dispatcher.dispatch({
      actionType: NOT_DRAGGING_FILES
    });
  },

  addToList: (files) => {
    Dispatcher.dispatch({
      actionType: DROP_FILES,
      files
    });
  }
};
