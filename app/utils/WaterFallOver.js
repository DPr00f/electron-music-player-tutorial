import EventEmitter from 'events';

class WaterFallOver extends EventEmitter {
  constructor(list) {
    super();
    this.nextItemIndex = 0;
    this.list = list;
    this.totalElements = this.list.length;
    this.next = this.next.bind(this);
  }

  execute() {
    this.emit('process', { item: this.list[this.nextItemIndex], next: this.next });
  }

  next() {
    this.nextItemIndex++;
    if (this.nextItemIndex === this.totalElements) {
      this.emit('finish');
    } else {
      this.execute();
    }
  }
}

export default WaterFallOver;
