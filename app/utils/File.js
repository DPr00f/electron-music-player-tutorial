import p from 'path';
import mime from 'mime';
import jsmediatags from 'jsmediatags';
import albumArt from 'album-art';
import request from 'request';

class File {
  constructor(path) {
    this.path = path;
    this.name = p.basename(path);
    this.type = mime.lookup(path);
  }

  set id(value) {
    this._id = value;
  }

  get id() {
    return this._id;
  }

  set tag(value) {
    if (typeof value === 'string') {
      this.title = value;
      this.displayName = value;
    } else {
      this.artist = value.artist;
      this.title = value.title;
      this.picture = value.picture;
      this.album = value.album;
      this.displayName = `${value.artist} - ${value.title}`;
    }
  }

  get cover() {
    if (this._cover) {
      return this._cover;
    }
    if (!this._cover && this.picture) {
      const pic = this.picture;
      this._cover = `data:${pic.format};base64,${Buffer.from(pic.data).toString('base64')}`;
      return this._cover;
    }
    return false;
  }

  set cover(value) {
    this._cover = value;
  }

  readTags() {
    return new Promise(resolve => {
      new jsmediatags.Reader(this.path)
            .setTagsToRead(['title', 'artist', 'album', 'picture'])
            .read({
              onSuccess: (tag) => {
                this.tag = tag.tags;
                resolve();
              },
              onError: () => {
                this.tag = this.name;
                resolve();
              }
            });
    });
  }

  searchAlbumArt(...args) {
    return new Promise((resolve, reject) => {
      albumArt(...args, (err, url) => {
        if (!err && url) {
          resolve(url);
        } else {
          reject(err);
        }
      });
    });
  }

  findCover() {
    return new Promise((resolve, reject) => {
      this.searchAlbumArt(this.artist, this.album, 'large').then(url => {
        this.cover = url;
        this.convertCoverToBase64();
        resolve(url);
      }).catch(() => {
        this.searchAlbumArt(this.artist, null, 'large').then(url => {
          this.cover = url;
          this.convertCoverToBase64();
          resolve(url);
        }).catch(() => {
          reject();
        });
      });
    });
  }

  convertCoverToBase64() {
    request.get({
      uri: this.cover,
      encoding: null
    }, (err, response, body) => {
      if (!err && response.statusCode >= 200 && response.statusCode < 400) {
        const type = response.headers['content-type'];
        const base64Body = new Buffer(body).toString('base64');
        this.cover = `data:${type};base64,${base64Body}`;
      }
    });
  }
}

export default File;
