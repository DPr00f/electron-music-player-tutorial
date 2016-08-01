import fs from 'fs';
import File from './File';
import WaterFallOver from './WaterFallOver';

class ReadFiles {
  separateDirectoriesFromFiles(inputFiles) {
    const directories = [];
    const files = [];
    let i = 0;
    let file;
    let stat;
    for (i = 0; i < inputFiles.length; i++) {
      file = inputFiles[i];
      stat = fs.statSync(file.path);
      if (stat && stat.isDirectory()) {
        directories.push(file.path);
      } else {
        files.push(new File(file.path));
      }
    }
    return { directories, files };
  }

  getAllAvailableFiles(file) {
    return new Promise(resolve => {
      fs.stat(file, (err, stat) => {
        if (stat && stat.isDirectory()) {
          this.getAllFiles(file).then((res) => {
            resolve(res);
          });
        } else {
          file = new File(file);
          resolve([file]);
        }
      });
    });
  }

  getAllFiles(dir) {
    return new Promise(resolve => {
      let results = [];
      let waterFall, file;
      const onProcessDirectory = (obj) => {
        this.getAllFiles(obj.item).then(res => {
          results = results.concat(res);
          obj.next();
        });
      };
      const onProcessFile = (obj) => {
        file = `${dir}/${obj.item}`;
        this.getAllAvailableFiles(file).then((res) => {
          results = results.concat(res);
          obj.next();
        });
      };
      const onFinishedProcessing = () => {
        waterFall.removeListener('process', onProcessDirectory);
        waterFall.removeListener('process', onProcessFile);
        waterFall = null;
        resolve(results);
      };
      if (Array.isArray(dir)) {
        waterFall = new WaterFallOver(dir);
        waterFall.on('process', onProcessDirectory);
        waterFall.once('finish', onFinishedProcessing);
        waterFall.execute();
      } else {
        fs.readdir(dir, (err, files) => {
          waterFall = new WaterFallOver(files);
          waterFall.on('process', onProcessFile);
          waterFall.once('finish', onFinishedProcessing);
          waterFall.execute();
        });
      }
    });
  }

  filterFilesByType(files, type) {
    return files.filter((file) => (
      file.type.indexOf(type) > -1
    ));
  }
}

export default new ReadFiles();
