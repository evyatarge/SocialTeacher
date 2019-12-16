const Papa = require('papaparse')


const electron = require('electron')
const { ipcRenderer } = electron


const tableBody = document.getElementById('names-table-body')
const inputFile = document.getElementById('file')

const NUM_OF_FREINDS = 3
const allDropDowns = []

inputFile.addEventListener('change', handleFile(inputFile.files), false)
let allNamesList

function handleFile(files){
    const file = files[0]

    if(file){
        Papa.parse(file, {
            complete: function(results) {
                clearList()
                const fileTableContent = parseFileToNamesList(results.data)
                const header = fileTableContent.shift()
                allNamesList = fileTableContent
                
                createTableHeader(header)
                insertNamesToTable(allNamesList)
                document.getElementById('non-friend-container').style.display = 'block'
            }
        });
    }
}

function createTableHeader(header){
    const tr = document.createElement('tr')
    for(name of header){
        const cell = craeteTableDataElement(name, 'th')
        tr.appendChild(cell)
    }
    const friendsHeader = document.createElement('th')
    friendsHeader.innerText='חברים'
    tr.appendChild(friendsHeader)
    tableBody.appendChild(tr)
}

function insertNamesToTable(namesList){
    for(let i=0; i < namesList.length; i++){
        addNameToTable(namesList[i],i)
    }
}

function parseFileToNamesList(fileContent){
    let emptyRows = document.getElementById('emptyRows')
    let namesList = []

    for(element of fileContent){
        let firstName = element[0] || ''
        let lastName = element[1] || ''
        // let fullName = firstName + ' ' + lastName
        if(firstName+lastName === ''){
            if(emptyRows.checked){
                namesList.push([firstName, lastName])
            }
        }
        else{
            namesList.push([firstName, lastName])
        }
    }
    return namesList
}

// Add item from add window
// - this is just an event hendler for events comes from ipcRenderer module
// params: (eventName, callbackFunctionToExecute)
ipcRenderer.on('item:add', addNameToTable)//TODO - need to edit because of change in method 'addName' to get 2 params


function addNameToTable(fullNameAsArray, index){
    const tr = document.createElement('tr')

    for(name of fullNameAsArray){
        const cell = craeteTableDataElement(name, 'td')
        tr.appendChild(cell)
    }
    const dropdown = createNamesDropdown(fullNameAsArray, index)

    const tdDropdowns = createFriensDropdownsTd(dropdown)
    tr.appendChild(tdDropdowns)
    tableBody.appendChild(tr)
}

function createFriensDropdownsTd(dropdown){
    const td = document.createElement('td')
    for(let friend=1; friend <= NUM_OF_FREINDS; friend++){
        const span = document.createElement('span')
        span.innerText = friend + '.'
        const currentDropDown = dropdown.cloneNode(true)
        allDropDowns.push(currentDropDown)
        span.appendChild(currentDropDown)
        td.appendChild(span)
    }
    return td
}

function craeteTableDataElement(name, tag) {
    const tdCell = document.createElement(tag)
    const nameTextNode = document.createTextNode(name)
    tdCell.appendChild(nameTextNode)
    return tdCell
}

function htmlToElement(htmlString) {
    var template = document.createElement('template')
    htmlString = htmlString.trim()
    template.innerHTML = htmlString
    return template.content.firstChild
}

function getAllNamesExcept(name){
    let allNamesExcept = allNamesList.filter(nameInList=> name!==nameInList)
    return allNamesExcept
}

function createNamesDropdown(fullNameAsArray, index){
    const allOtherNames = getAllNamesExcept(fullNameAsArray)
    const dropdown = getSelectElement(index)
    
    allOtherNames.unshift(['',''])
    for(fullNameAsArray of allOtherNames){
        let option = createNameOption(fullNameAsArray)
        dropdown.appendChild(option)
    }
    return dropdown
}

function createNameOption(fullNameAsArray) {
    let text = fullNameAsArray[0]+' '+fullNameAsArray[1]
    let nameElement = `<option value="text">${text}</option>`
    let option = htmlToElement(nameElement)
    return option
}

function getSelectElement(index){
    return htmlToElement(`<select id="dropdown${index}" class="select"></select>`)
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

function calculateNonFriend(){
    let nonFriendNames = []
    for(fullNameAsArray of allNamesList){
        let existInSelected = false
        let fullName = fullNameAsArray[0]+' '+fullNameAsArray[1]
        for(let dropdown=0; !existInSelected && dropdown<allDropDowns.length; dropdown++){
            let elementText = allDropDowns[dropdown].selectedOptions[0].text
            if(elementText===fullName){
                existInSelected = true
            }
        }
        if(!existInSelected){
            nonFriendNames.push(fullName)
        }
    }
    if(nonFriendNames.length > 0){
        const nonFriends = nonFriendNames.reduce((allNames, name)=>{
            return allNames +', '+name
        })
        const nonFriendsInput = document.getElementById('non-friend-calculated')
        nonFriendsInput.value = nonFriends
    }
}

// Remove selected item by double-click
// tableBody.addEventListener('dblclick', removeItem)

// function removeItem(e) {
//     e.target.remove()
// }