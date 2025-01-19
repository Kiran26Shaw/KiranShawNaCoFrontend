// using DOM to select elements by their id 
const itemNameInput = document.getElementById('item');
const addItemButton = document.getElementById('add');
const toDoList = document.getElementById('toDoList');
const completeList = document.getElementById('completeList');
const moveRightButton = document.getElementById('moveToRight');
const moveLeftButton = document.getElementById('moveToLeft');

// Function to make the button interactive- move to the completed list button
function moveToRight() {
  const selectedItems = Array.from(toDoList.querySelectorAll('.selected'));
  selectedItems.forEach(item => {
    item.classList.remove('selected');
    completeList.appendChild(item);
  });
}

// Function to make the button interactive- move to the to-do list button
function moveToLeft() {
  const selectedItems = Array.from(completeList.querySelectorAll('.selected'));
  selectedItems.forEach(item => {
    item.classList.remove('selected');
    toDoList.appendChild(item);
  });
}

// Function to select the list items
function toggleSelection(item) {
    item.classList.toggle('selected');
}

// Function to add the content to be added to respective lists
function addItem() {
    const itemName = itemNameInput.value.trim();
    if (itemName === '') return;
    
    const li = document.createElement('li');
    li.textContent = itemName;
    li.addEventListener('click', () => toggleSelection(li));
    toDoList.appendChild(li);
  
    itemNameInput.value = '';
}

// Adding Event Listeners
addItemButton.addEventListener('click', addItem);
moveRightButton.addEventListener('click', moveToRight);
moveLeftButton.addEventListener('click', moveToLeft);
