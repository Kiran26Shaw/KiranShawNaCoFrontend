// Using DOM to select elements by their ID
const itemNameInput = document.getElementById('item'); 
const addItemButton = document.getElementById('add'); 
const removeItemButton = document.getElementById('remove');
const toDoList = document.getElementById('toDoList');
const completeList = document.getElementById('completeList'); 
const moveRightButton = document.getElementById('moveToRight'); 
const moveLeftButton = document.getElementById('moveToLeft');
const toaster = document.getElementById('toaster'); 

// Variables for Undo functionality
let lastRemovedItem = null;
let lastRemovedFrom = null;

// Adding event listeners to buttons
addItemButton.addEventListener('click', addItem); 
removeItemButton.addEventListener('click', removeSelectedItems); 
moveRightButton.addEventListener('click', moveToRight); 
moveLeftButton.addEventListener('click', moveToLeft); 

// Function to add item to the List
function addItem() {
  const itemName = itemNameInput.value.trim(); 
  if (itemName === '') return showToast('Item name cannot be empty'); 

  // Checking duplicate items
  if (isDuplicate(itemName, toDoList) || isDuplicate(itemName, completeList)) {
    return showToast('Item is duplicate'); 
  }

  // Create a new list item element
  const li = document.createElement('li');
  li.textContent = itemName; 
  li.addEventListener('click', () => toggleSelection(li)); 
  toDoList.appendChild(li); 

  itemNameInput.value = ''; 
  showToast('Item added'); // Show success message
}

// Function to toggle selection of an item
function toggleSelection(item) {
  item.classList.toggle('selected'); 
}

// Function to move selected items from To-Do List to Complete List
function moveToRight() {
  const selectedItems = Array.from(toDoList.querySelectorAll('.selected')); 
  if (selectedItems.length === 0) return showToast('No items selected'); 

  // Move each selected item to the Complete List
  selectedItems.forEach(item => {
    item.classList.remove('selected'); 
    completeList.appendChild(item); 
  });

  showToast('Items moved to complete list'); // Show success message
}

// Function to move selected items from Complete List to To-Do List
function moveToLeft() {
  const selectedItems = Array.from(completeList.querySelectorAll('.selected')); 
  if (selectedItems.length === 0) return showToast('No items selected');

  // Move each selected item to the To-Do List
  selectedItems.forEach(item => {
    item.classList.remove('selected'); 
    toDoList.appendChild(item); 
  });

  showToast('Items moved to To-Do list'); // Show success message
}

// Function to remove selected items from both lists
function removeSelectedItems() {
  const selectedItems = [...toDoList.querySelectorAll('.selected'), ...completeList.querySelectorAll('.selected')];
  if (selectedItems.length === 0) return showToast('No items selected'); 

  // Remove each selected item
  selectedItems.forEach(item => {
    lastRemovedItem = item; 
    lastRemovedFrom = item.parentNode; 
    item.remove(); 
  });

  showToast('Item removed', true); // Show success message with Undo option
}

// Function to check if an item is a duplicate in a given list
function isDuplicate(itemName, list) {
  return Array.from(list.children).some(item => item.textContent === itemName); 
}

// Function to display a toaster message
function showToast(message, undo = false) {
  toaster.innerHTML = message; 
  if (undo) {
    // If Undo is available, add an Undo button
    const undoButton = document.createElement('button');
    undoButton.textContent = 'Undo'; 
    undoButton.addEventListener('click', undoLastAction); 
    toaster.appendChild(undoButton); 
  }

  toaster.style.display = 'block'; // Show the toaster
  setTimeout(() => {
    toaster.style.display = 'none'; // Hide the toaster after 8 seconds
  }, 8000);
}

// Function to undo the last remove action
function undoLastAction() {
  if (lastRemovedItem && lastRemovedFrom) {
    lastRemovedFrom.appendChild(lastRemovedItem); 
    lastRemovedItem = null; 
    lastRemovedFrom = null; 
    showToast('Undo successful'); // Show success message
  }
}
