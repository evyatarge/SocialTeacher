
const electron = require('electron')
const { ipcRenderer } = electron

const form = document.querySelector('form')
form.addEventListener('submit', submitForm)

function submitForm(e){
    e.preventDefault();
    const nameToSend = document.querySelector('#name').value
    if(nameToSend != ''){
        ipcRenderer.send('item:add', nameToSend)
    }
}
    