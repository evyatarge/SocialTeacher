const Papa = require('papaparse')


const electron = require('electron')
const { ipcRenderer } = electron

const tableBody = document.getElementById('list')


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
    let emptyRows = document.getElementById('emptyRows')

    // let firstElement = fileContent.shift()

    for(element of fileContent){
        let firstName = element[0] || ''
        let lastName = element[1] || ''
        // let fullName = firstName + ' ' + lastName
        if(firstName+lastName === ''){
            if(emptyRows.checked){
                addName([firstName, lastName])
            }
        }
        else{
            addName([firstName, lastName])
        }
        
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
ipcRenderer.on('item:add', addName)//TODO - need to edit because of change in method 'addName' to get 2 params


function addName(nameArray){
    const tr = document.createElement('tr')

    for(name of nameArray){
        const cell = document.createElement('td')
        const nameText = document.createTextNode(name)
        cell.appendChild(nameText)
        tr.appendChild(cell)
    }

    tableBody.appendChild(tr)
}

// clear all list items
ipcRenderer.on('item:clear', function(){
    clearList()
    clearFile()
})

function clearList(){
    tableBody.innerHTML = ''
}

function clearFile() {
    inputFile.value = ''
}

// Remove selected item by double-click
tableBody.addEventListener('dblclick', removeItem)

function removeItem(e) {
    e.target.remove()
}