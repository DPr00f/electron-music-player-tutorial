import { app, BrowserWindow, Menu, shell, Tray } from 'electron';

let menu;
let template;
let mainWindow = null;
let tray = null;


if (process.env.NODE_ENV === 'development') {
  require('electron-debug')(); // eslint-disable-line global-require
}


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});


const installExtensions = async () => {
  if (process.env.NODE_ENV === 'development') {
    const installer = require('electron-devtools-installer'); // eslint-disable-line global-require
    const extensions = [
      'REACT_DEVELOPER_TOOLS',
      'REDUX_DEVTOOLS'
    ];
    const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
    for (const name of extensions) {
      try {
        await installer.default(installer[name], forceDownload);
      } catch (e) {} // eslint-disable-line
    }
  }
};

app.on('ready', async () => {
  await installExtensions();

  mainWindow = new BrowserWindow({
    show: false,
    width: 318,
    height: 500,
    frame: false,
    resizable: process.env.NODE_ENV === 'development'
  });

  mainWindow.loadURL(`file://${__dirname}/app/app.html`);

  mainWindow.webContents.on('did-finish-load', () => {
    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'Bring to top',
        click() {
          mainWindow.show();
          mainWindow.focus();
        }
      },
      {
        label: 'Quit',
        click() {
          app.quit();
        }
      }
    ]);
    tray = new Tray(`${__dirname}/app/tray.png`);
    tray.setToolTip('Electron Music Player Tutorial');
    mainWindow.show();
    mainWindow.focus();
    tray.setContextMenu(contextMenu);
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.on('context-menu', (e, props) => {
      const { x, y } = props;
      Menu.buildFromTemplate([{
        label: 'Inspect element',
        click() {
          mainWindow.inspectElement(x, y);
        }
      }]).popup(mainWindow);
    });
  }

  if (process.platform === 'darwin') {

    template = [{
      label: 'MusicPlayer',
      submenu: [{
        label: 'About Music Player',
        selector: 'orderFrontStandardAboutPanel:'
      }, {
        type: 'separator'
      }, {
        label: 'Quit',
        accelerator: 'Command+Q',
        click() {
          app.quit();
        }
      }]
    }];

    menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
  } else {
    template = [{
      label: '&File',
      submenu: [{
        label: '&Exit',
        accelerator: 'Alt+f4',
        click() {
          app.quit();
        }
      }]
    }];
    menu = Menu.buildFromTemplate(template);
    mainWindow.setMenu(menu);
  }
});
