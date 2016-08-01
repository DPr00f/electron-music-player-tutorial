import React, { Component } from 'react';
import BetterDrag from '../utils/BetterDrag';
import DropAreaActions from '../actions/dropArea';
import styles from './DropArea.css';
import readFiles from '../utils/readFiles';

export default class Home extends Component {
  constructor() {
    super();
    this.onDragOver = this.onDragOver.bind(this);
    this.onDragOut = this.onDragOut.bind(this);
    this.onDrop = this.onDrop.bind(this);
    this.state = {
      hover: false
    };
  }

  componentDidMount() {
    this.betterDrag = new BetterDrag(document);
    this.betterDrag.on('dragenter', this.onDragOver);
    this.betterDrag.on('dragleave', this.onDragOut);
    this.betterDrag.on('drop', this.onDrop);
  }

  componentWillUnmount() {
    this.betterDrag.removeListener('dragenter', this.onDragOver);
    this.betterDrag.removeListener('dragleave', this.onDragOut);
    this.betterDrag.removeListener('drop', this.onDrop);
    this.betterDrag.destroy();
  }

  onDragOver(e) {
    const files = e.dataTransfer.files;
    if (files.length) {
      DropAreaActions.draggingFiles();
      this.setState({
        hover: true
      });
    }
  }

  onDragOut() {
    DropAreaActions.stopDraggingFiles();
    this.setState({
      hover: false
    });
  }

  onDrop(e) {
    const obj = readFiles.separateDirectoriesFromFiles(e.dataTransfer.files);
    let files = obj.files;
    if (obj.directories.length) {
      readFiles.getAllFiles(obj.directories)
               .then(results => {
                 files = files.concat(results);
                 this.addFilesToList(files);
               });
    } else {
      this.addFilesToList(files);
    }
  }

  addFilesToList(files) {
    files = readFiles.filterFilesByType(files, 'audio');
    if (files.length) {
      DropAreaActions.addToList(files);
    }
  }

  render() {
    return (
      <div>
        { this.props.children }
        <div className={ `messageArea${this.state.hover ? ' messageArea--hover' : ''}` }>
          <div className={ styles.dashedContainer }>
            Release to add to the list
          </div>
        </div>
      </div>
    );
  }
}
