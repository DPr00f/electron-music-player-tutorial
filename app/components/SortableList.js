import React, { Component } from 'react';
import store from '../store';
import styles from './SortableList.css';
import SortableListItem from './SortableListItem';
import {
  DRAGGING_FILES,
  NOT_DRAGGING_FILES
} from '../events';

class SortableList extends Component {
  constructor(props) {
    super();
    this.state = {
      draggingIndex: null,
      data: props.data,
      draggingFilesOver: false
    };
    this.onStateUpdate = this.onStateUpdate.bind(this);
    this.onDragFilesStart = this.onDragFilesStart.bind(this);
    this.onDragFilesStop = this.onDragFilesStop.bind(this);
  }

  componentDidMount() {
    store.on(DRAGGING_FILES, this.onDragFilesStart);
    store.on(NOT_DRAGGING_FILES, this.onDragFilesStop);
  }

  componentWillUnmount() {
    store.removeListener(DRAGGING_FILES, this.onDragFilesStart);
    store.removeListener(NOT_DRAGGING_FILES, this.onDragFilesStop);
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      data: newProps.data
    });
  }

  onStateUpdate(obj) {
    this.setState(obj);
    if (obj.data) {
      this.onComponentFinishedUpdating(obj.data);
    }
  }

  onComponentFinishedUpdating(data) {
    if (this.props.onListReorder) {
      this.props.onListReorder.call(null, data);
    }
  }

  onDragFilesStart() {
    this.setState({
      draggingFilesOver: true
    });
  }

  onDragFilesStop() {
    this.setState({
      draggingFilesOver: false
    });
  }

  render() {
    let className = styles.container;
    if (this.state.draggingFilesOver) {
      className += ` ${styles['has-filesOver']}`;
    }
    const listItems = this.state.data.map((item, i) => {
      return (
          <SortableListItem
              key={ i }
              isPlaying={ this.props.songPlaying && this.props.songPlaying.id === item.id }
              isPaused={ this.props.songPlaying && this.props.songPlaying.paused }
              selected={ this.props.selectedItems.indexOf(item.id) > -1 }
              updateState={ this.onStateUpdate }
              items={ this.state.data }
              draggingIndex={ this.state.draggingIndex }
              sortId={ i }
              outline="list"
              onPlayButtonClick={ this.props.onPlayButtonClick }
              onPauseButtonClick={ this.props.onPauseButtonClick }
              onClick={ this.props.toggleItem }
              className={ i % 2 === 0 ? 'is-even' : 'is-odd' }
              item={ item }/>
      );
    }, this);

    return (
          <div className={ className }>{ listItems }</div>
    );
  }
}

export default SortableList;
