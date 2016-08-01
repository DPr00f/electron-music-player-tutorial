import React, { Component } from 'react';
import styles from './SortableListItem.css';
import { Sortable } from 'react-sortable';

class ListItem extends Component {
  constructor() {
    super();
    this.onPlayButtonClickProxy = this.onPlayButtonClickProxy.bind(this);
    this.onPauseButtonClickProxy = this.onPauseButtonClickProxy.bind(this);
    this.onClickProxy = this.onClickProxy.bind(this);
  }

  onPlayButtonClickProxy(e) {
    e.preventDefault();
    e.stopPropagation();
    const position = parseInt(e.target.parentNode.dataset.id, 10);
    if (this.props.onPlayButtonClick) {
      this.props.onPlayButtonClick.call(null, this.props.items[position]);
    }
  }

  onPauseButtonClickProxy(e) {
    e.preventDefault();
    e.stopPropagation();
    const position = parseInt(e.target.parentNode.dataset.id, 10);
    if (this.props.onPauseButtonClick) {
      this.props.onPauseButtonClick.call(null, this.props.items[position]);
    }
  }

  onClickProxy(e) {
    const position = parseInt(e.target.parentNode.dataset.id, 10);
    if (this.props.onClick) {
      this.props.onClick.call(null, this.props.items[position]);
    }
  }

  render() {
    let className = `${styles.item} ListItem__${this.props.className}`;
    if (this.props.selected) {
      className += ` ${styles['is-selected']}`;
    }
    if (this.props.isPlaying) {
      className += ` ${styles['is-playing']}`;
    }
    return <div
              data-id= { this.props['data-id'] }
              draggable={ this.props.draggable }
              onDragStart={ this.props.onDragStart }
              onDragEnd={ this.props.onDragEnd }
              onDragOver={ this.props.onDragOver }
              onTouchStart={ this.props.onTouchStart }
              onTouchMove={ this.props.onTouchMove }
              onTouchEnd={ this.props.onTouchEnd }
              onClick={ this.onClickProxy }
              className={ className }
          >
            <span className={ styles.itemNumber }></span>
            <span className={ styles.itemName }>{ this.props.item.displayName }</span>
            { !this.props.isPlaying || this.props.isPaused ?
                      <i className={ styles.playButton } onClick={ this.onPlayButtonClickProxy }></i> :
                      <i className={ styles.pauseButton } onClick={ this.onPauseButtonClickProxy }></i>
            }
          </div>;
  }
}

export default Sortable(ListItem);
