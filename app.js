
// include node modules

const {app, BrowserWindow, ipcMain, Menu} = require('electron');

const path = require('path');
const url = require('url');


var lvWindow;
var projWindow;

// init electron windows
function createLiveViewWindow(){


	// init Live View window
	lvWindow = new BrowserWindow({
		width: 400,
		height: 680,
		minHeight: 500,
  		minWidth: 400,
  		maxHeight: 1000,
		titleBarStyle: 'hidden'
	});
	lvWindow.loadURL('file://' + __dirname + '/lv/liveview.html')

	lvWindow.setPosition(100, 200 );


	lvWindow.on('close', function (event) {
	    event.preventDefault();
	    lvWindow.hide();
		// lvWindow = null
	})

}
function createProjectWindow(){

	// init main window
	projWindow = new BrowserWindow({
		width: 1150,
		height: 806,
		minHeight: 566,
		minWidth: 650,
		show: true,
		titleBarStyle: 'hidden'
  	});
  	projWindow.loadURL('file://' + __dirname + '/projects/projects.html')
  	projWindow.openDevTools();
  	
	projWindow.on('close', function () {
		//event.preventDefault();
	    // projWindow.hide();
	})

	projWindow.setPosition(530, 200 );
	
};


const menuTemplate = [
	{
		label: 'blokdots',
		submenu: [
			{
				role: 'about'
			},
			{
				type: 'separator'
			},
			{
				role: 'services',
				submenu: []
			},
			{
				type: 'separator'
			},
			{
				role: 'hide'
			},
			{
				role: 'hideothers'
			},
			{
				role: 'unhide'
			},
			{
				type: 'separator'
			},
			{
				role: 'quit'
			}
		]
	},
	/*
	{
		label: 'blokdots',
		submenu: [
			{
				label: 'Hide LiveView',
				accelerator: 'Shift+CmdOrCtrl+H',
				click() {
					lvWindow.hide();
				}
			},
			{
				label: 'Show LiveView',
				accelerator: 'Shift+CmdOrCtrl+H',
				click() {
					lvWindow.show();
				}
			}
		]
	},
	*/
	{
		role: 'window',
		submenu: [
			{
				role: 'minimize'
			},
			{
				role: 'close'
			}
		]
	},
	{
		role: 'help',
		submenu: [
			{
				label: 'Learn More',
				click () { require('electron').shell.openExternal('http://blokdots.com') }
			}
		]
	}
];


function ipcCommunicationInit(){

	// If Component is connected to LV
	ipcMain.on('componentConnected', function( evt , slotObj ) {
	    projWindow.webContents.send('componentConnected',slotObj);
	});

	// If Button Use is pressed in LV
	ipcMain.on('use', function( evt , slotObj ) {
	    projWindow.webContents.send('use',slotObj);
	});
	// If Button Use is pressed in Project
	ipcMain.on('useProject', function( evt , slotNum ) {
	    lvWindow.webContents.send('useProject',slotNum);
	});

	// If Comp is disconnected in LV
	ipcMain.on('disconnectSlotLV', function( evt , slotNum ) {
	    projWindow.webContents.send('disconnectSlotLV',slotNum);
	});


	ipcMain.on('closeBoard', function() {
	    lvWindow.webContents.send('closeBoard');
	});
	ipcMain.on('initBoard', function() {
	    lvWindow.webContents.send('initBoard');
	});


	ipcMain.on('startProject', function() {
	    lvWindow.webContents.send('startProject');
	});
	ipcMain.on('stopProject', function() {
	    lvWindow.webContents.send('stopProject');
	});


	ipcMain.on('showLiveView', function() {
	    lvWindow.show();
	});


}

const menu = Menu.buildFromTemplate(menuTemplate);

app.on('ready', function(){

	// Menu.setApplicationMenu(menu);

	createLiveViewWindow();
	createProjectWindow();
	ipcCommunicationInit();

});


app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
})

app.on('activate', function () {
  if (projWindow === null) {
    // createProjectWindow();
  }
  lvWindow.show();
})

app.commandLine.appendSwitch('--enable-viewport-meta', 'true');








