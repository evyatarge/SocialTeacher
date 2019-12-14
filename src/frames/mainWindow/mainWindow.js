const Papa = require('papaparse')


const electron = require('electron')
const { ipcRenderer } = electron
const ul = document.querySelector('ul')


// File read
// function handleFile(files){
//     const currentFile = files[0]
//     document.getElementById('test').innerHTML = hi

//     Papa.parse(currentFile, {
//         complete: function(results) {
//             console.log("Finished:", results.data);
//             document.getElementById('test').innerHTML = results.data
//         }
//     });
// }

const inputFile = document.getElementById('file')
inputFile.addEventListener('change', handleFile(inputFile.files), false)
function handleFile(files){
    const file = files[0]
    // document.getElementById('test').innerText += "hi"

    if(file){
        Papa.parse(file, {
            complete: function(results) {
                clearList()
                console.log("Finished parse csv file:", results);
                // document.getElementById('test').innerHTML = results.data

                handleFileContent(results.data)
            }
        });
    }
}

function handleFileContent(fileContent){
    for(element of fileContent){
        let firstName = element[0] || ''
        let lastName = element[1] || ''
        let fullName = firstName + ' ' + lastName
        addName('',fullName)
    }
}


// Action button
document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.fixed-action-btn')
    var instances = M.FloatingActionButton.init(elems, {
    direction: 'left',
    hoverEnabled: false
    })
})

// Add item from add window
// - this is just an event hendler for events comes from ipcRenderer module
// params: (eventName, callbackFunctionToExecute)
ipcRenderer.on('item:add', addName)


function addName(e, item){
    
    console.log('event e = '+e)

    const li = document.createElement('li')
    li.className = 'collection-item'
    const itemText = document.createTextNode(item)
    li.appendChild(itemText)
    ul.appendChild(li)
}

// clear all list items
ipcRenderer.on('item:clear', function(){
    clearList()
})

function clearList(){
    ul.innerHTML = ''
}

// Remove selected item by double-click
ul.addEventListener('dblclick', removeItem)

function removeItem(e) {
    e.target.remove()
}