import EventEmitter from 'events';

class BetterDrag extends EventEmitter {
  constructor(el) {
    super();
    this.el = el;
    this.dragCollection = [];
    this.onDragEnter = this.onDragEnter.bind(this);
    this.preventDefault = this.preventDefault.bind(this);
    this.onDragLeave = this.onDragLeave.bind(this);
    this.onDrop = this.onDrop.bind(this);
    this.addListeners();
  }

  addListeners() {
    this.el.addEventListener('dragover', this.preventDefault, false);
    this.el.addEventListener('dragenter', this.onDragEnter, false);
    this.el.addEventListener('dragleave', this.onDragLeave, false);
    this.el.addEventListener('drop', this.onDrop, false);
  }

  removeListeners() {
    this.el.removeEventListener('dragover', this.preventDefault);
    this.el.removeEventListener('dragenter', this.onDragEnter);
    this.el.removeEventListener('dragleave', this.onDragLeave);
    this.el.removeEventListener('drop', this.onDrop);
  }

  destroy() {
    this.removeListeners();
  }

  preventDefault(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  onDragEnter(e) {
    this.preventDefault(e);
    if (this.dragCollection.length === 0) {
      this.emit('dragenter', e);
    }
    this.dragCollection.push(e.target);
  }

  onDragLeave(e) {
    this.preventDefault(e);
    setTimeout(() => {
      const currentElementIndex = this.dragCollection.indexOf(e.target);
      if (currentElementIndex > -1) {
        this.dragCollection.splice(currentElementIndex, 1);
      }

      if (this.dragCollection.length === 0) {
        this.emit('dragleave', e);
      }
    }, 1);
  }

  onDrop(e) {
    this.preventDefault(e);
    this.dragCollection = [];
    this.emit('dragleave', e);
    this.emit('drop', e);
  }
}

export default BetterDrag;
