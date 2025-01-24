// DOM element selection
const itemNameInput = document.getElementById('item');
const addItemButton = document.getElementById('add');
const removeItemButton = document.getElementById('remove');
const toDoList = document.getElementById('toDoList');
const completeList = document.getElementById('completeList');
const moveRightButton = document.getElementById('moveToRight');
const moveLeftButton = document.getElementById('moveToLeft');
const toaster = document.getElementById('toaster');

// Variables for Undo functionality
let lastRemovedItems = []; 
let toasterTimeout;

// Event listeners
addItemButton.addEventListener('click', addItem);
removeItemButton.addEventListener('click', removeSelectedItems);
moveRightButton.addEventListener('click', moveToRight);
moveLeftButton.addEventListener('click', moveToLeft);

// Function to add an item to the To-Do List
function addItem() {
  const itemName = itemNameInput.value.trim();
  if (itemName === '') return showToast('Item name cannot be empty');

  if (isDuplicate(itemName, toDoList) || isDuplicate(itemName, completeList)) {
    return showToast('Item is a duplicate');
  }

  const li = document.createElement('li');
  li.textContent = itemName;
  li.addEventListener('click', () => toggleSelection(li));
  toDoList.appendChild(li);

  itemNameInput.value = '';
  showToast('Item added');
}

// Function to toggle selection of a list item
function toggleSelection(item) {
  item.classList.toggle('selected');
}

// Function to move selected items to the Complete List
function moveToRight() {
  const selectedItems = Array.from(toDoList.querySelectorAll('.selected'));
  if (selectedItems.length === 0) return showToast('No items selected');

  selectedItems.forEach(item => {
    item.classList.remove('selected');
    completeList.appendChild(item);
  });

  showToast('Items moved to complete list');
}

// Function to move selected items back to the To-Do List
function moveToLeft() {
  const selectedItems = Array.from(completeList.querySelectorAll('.selected'));
  if (selectedItems.length === 0) return showToast('No items selected');

  selectedItems.forEach(item => {
    item.classList.remove('selected');
    toDoList.appendChild(item);
  });

  showToast('Items moved to To-Do list');
}

// Function to remove selected items
function removeSelectedItems() {
  const selectedItems = [
    ...toDoList.querySelectorAll('.selected'),
    ...completeList.querySelectorAll('.selected'),
  ];
  if (selectedItems.length === 0) return showToast('No items selected');

  // Store removed items and their parent lists for undo
  lastRemovedItems = selectedItems.map(item => ({
    item,
    parent: item.parentNode,
  }));

  selectedItems.forEach(item => item.remove());

  showToast('Items removed', true);
}

// Function to check if an item already exists in a list
function isDuplicate(itemName, list) {
  return Array.from(list.children).some(item => item.textContent === itemName);
}

// Function to show a toaster message
function showToast(message, undo = false) {
  clearTimeout(toasterTimeout); 

  toaster.innerHTML = message;
  if (undo) {
    const undoButton = document.createElement('button');
    undoButton.textContent = 'Undo';
    undoButton.addEventListener('click', undoLastAction);
    toaster.appendChild(undoButton);
  }

  toaster.style.display = 'block';
  toasterTimeout = setTimeout(() => {
    toaster.style.display = 'none';
  }, 5000); // 5-second display time
}

// Function to undo the last removal action
function undoLastAction() {
  if (lastRemovedItems.length === 0) {
    return showToast('No action to undo');
  }

  lastRemovedItems.forEach(({ item, parent }) => {
    parent.appendChild(item);
  });

  lastRemovedItems = []; // Clear undo history
  showToast('Undo successful');
}
