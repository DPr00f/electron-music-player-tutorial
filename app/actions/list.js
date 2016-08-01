import Dispatcher from '../dispatcher';
import { CLOSE_LIST, REORDER_LIST, REMOVE_FROM_LIST } from '../events';

export default {
  closeList: () => {
    Dispatcher.dispatch({
      actionType: CLOSE_LIST
    });
  },

  reorderedList: (newList) => {
    Dispatcher.dispatch({
      actionType: REORDER_LIST,
      list: newList
    });
  },

  removeFromList: (ids) => {
    Dispatcher.dispatch({
      actionType: REMOVE_FROM_LIST,
      ids
    });
  }
};
