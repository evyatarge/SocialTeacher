const electron = require('electron')
const url = require('url')
const path = require('path')

const { app, BrowserWindow, Menu, ipcMain } = electron;

let mainWindow;

//listen for app ready
app.on('ready', function(){
    //Create new window
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        }
    });
    //load HTML into the window
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, './frames/mainWindow/mainWindow.html'),
        protocol: 'file',
        slashes: true
    }));// that mean we are loading 'file://currentDirName/mainWindow.html' to the 'browser' window

    // Quit whole app when close main window
    mainWindow.on('closed', function(){
        app.quit()
    })

    //Build menu from template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate)
    // Insert the menu
    Menu.setApplicationMenu(mainMenu)
});

// Handle Create AddName window
function createAddNameWindow(){

    //Create new window
    addNameWindow = new BrowserWindow({
        width: 300,
        height: 200,
        webPreferences: {
            nodeIntegration: true
        }
    });
    // addNameWindow.setMenu(null)
    addNameWindow.setMenuBarVisibility(false)
    //load HTML into the window
    addNameWindow.loadURL(url.format({
        pathname: path.join(__dirname, './frames/mainWindow/addNameWindow/addNameWindow.html'),
        protocol: 'file',
        slashes: true
    }));
    // Garbage collection handle 
    addNameWindow.on('close', function(){
        addNameWindow = null
    })
}

ipcMain.on('item:add', (e, item)=>{
    mainWindow.webContents.send('item:add', item)
    addNameWindow.close()
})

// Create menu template to use it by the app
const mainMenuTemplate = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Add Name',
                accelerator: process.platform == 'darwin' ? 'Command+N' : 'Ctrl+N',
                click(){
                    createAddNameWindow()
                }
            },
            {
                label: 'הוסף רשימה (לא עובד)'
            },
            {
                label: 'Clear List',
                click(){
                    mainWindow.webContents.send('item:clear')
                }
            },
            {
                label: 'Quit',
                accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
                click(){
                    app.quit()
                }
            }
        ]
    }
]

// if on Mac - add empty obj to menu to have the real menu object istead default
if(process.platform == 'darwin'){
    mainMenuTemplate.unshift({})
}

// Add DeveloperTools meun when NOT in production mode
if(process.env.NODE_ENV !== 'production'){
    mainMenuTemplate.push({
        label: 'Developer Tools',
        submenu: [
            {
                label: 'Toggle DevTools',
                accelerator: 'F12',
                click(item, focusedWindow){
                    focusedWindow.toggleDevTools()
                }
            },
            {
                role: 'reload',

            }
        ]
    })
}