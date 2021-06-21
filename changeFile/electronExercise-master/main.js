// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs/promises');

function createWindow() {
	// Create the browser window.
	const mainWindow = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			preload: path.join(__dirname, 'preload.js'),
		},
		autoHideMenuBar: true,
	});

	// and load the index.html of the app.
	mainWindow.loadFile('index.html');

	// Open the DevTools.
	// mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
	createWindow();

	app.on('activate', function () {
		// On macOS it's common to re-create a window in the app when the
		// dock icon is clicked and there are no other windows open.
		if (BrowserWindow.getAllWindows().length === 0) createWindow();
	});
});

const deleteFile = async (curPath) => {
	try {
		return await fs.unlink(curPath);
	} catch (err) {
		return Promise.reject(err);
	}
};
const copyFile = async (source, target) => {
	try {
		if (source.indexOf('.png') > -1 && target.indexOf('.jpg') > -1) {
			return await fs.writeFile(
				target.replace('.jpg', '.png'),
				await fs.readFile(source)
			);
		}
		return await fs.writeFile(target, await fs.readFile(source));
	} catch (err) {
		return Promise.reject(err);
	}
};
const moveFile = async (source, target) => {
	try {
		await deleteFile(target);
		await copyFile(source, target);
		return 'success';
	} catch (err) {
		return Promise.reject(err);
	}
};

ipcMain.on('exe', (event, arg) => {
	const source = arg.source;
	const target = arg.target;
	let promises = [];
	for (let i = 0; i < source.length; i++) {
		promises.push(moveFile(source[i], target[i]));
	}
	// 同步事件使用 returnValue 回傳值
	Promise.all(promises)
		.then((re) => (event.returnValue = 'success'))
		.catch((err) => (event.returnValue = err.toString()));
});
// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
	if (process.platform !== 'darwin') app.quit();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
