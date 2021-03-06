const { app, BrowserWindow } = require('electron');

const path = require('path');
const url = require('url');
const { spawn } = require('child_process');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
const detectionApp = spawn('./detection/main.exe');
detectionApp.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

detectionApp.stderr.on('data', (data) => {
  console.log(`stderr: ${data}`);
});

detectionApp.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 600,
    // prod stuff
    // fullscreen: true,
    autoHideMenuBar: true,
    titleBarStyle: 'hidden',
  });

  mainWindow.setMenu(null);
  // mainWindow.webContents.openDevTools(); // Open the DevTools.

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true,
  }));

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    detectionApp.kill();
    mainWindow = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  app.quit();
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});
