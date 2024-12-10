// Change the background color of a sticky note based on the clicked color circle.
// TODO: To be changed to edit on notes object in the array
const changeNoteColor = (event) => {

  // Define a mapping of color names to their respective hex color values
  const colorValue = {
    gray: '#eee',
    red: '#f28b82',
    green: '#ccff90',
    blue: '#aecbfa'
  };

  // Get the clicked color circle element
  const colorCircle = event.target;

  // Get sticky note whose background color needs to change
  const note = colorCircle.closest('.sticky-note');

  const color = colorCircle.getAttribute('data-color');

  // If a sticky note is found and a valid color is provided -> change the color
  if (note && color) {
    note.style.backgroundColor = colorValue[color];
  }
};

// Function to update the "Edited On" date when the note content changes
// TODO: To be changed to edit on notes object in the array
const changeDate = (event) => {
  // Get the current date
  const currentDate = new Date();

  // Get the abbreviated month (first 3 letters), day, and year
  const month = currentDate.toLocaleString('en-US', { month: 'short' });
  const day = currentDate.getDate();
  const year = currentDate.getFullYear();

  // Format the date as "Month dd, yyyy"
  const formattedDate = `${month} ${day}, ${year}`;

  // Find the note's date paragraph (.note-date)
  const note = event.target.closest('.sticky-note');
  const noteDateElement = note.querySelector('.note-date');

  // Update the text content of the .note-date paragraph to "Edited On: <current date>"
  if (noteDateElement) {
    noteDateElement.textContent = `Edited On: ${formattedDate}`;
  }
};

// Function to create a new sticky note
const createStickyNote = () => {
  // Generate random position and size
  const randomX = Math.floor(Math.random() * (window.innerWidth - 200));
  const randomY = Math.floor(Math.random() * (window.innerHeight - 230));
  const width = 200;
  const height = 180;
  const color = 'gray';

  // Get the current date
  const currentDate = new Date();
  const month = currentDate.toLocaleString('en-US', { month: 'short' });
  const day = currentDate.getDate();
  const year = currentDate.getFullYear();
  const formattedDate = `${month} ${day}, ${year}`;

  // Create a sticky note object
  const noteObject = {
    content: '',
    color: color,
    width: width,
    height: height,
    positionX: randomX,
    positionY: randomY,
    createdDate: formattedDate,
    archived: false
  };

  // For testing only, it should be deleted when handle rendering.
  // {
  // Create a new sticky note element
  const stickyNoteElement = document.createElement('div');
  stickyNoteElement.className = 'sticky-note';
  stickyNoteElement.style.width = `${width}px`;
  stickyNoteElement.style.height = `${height}px`;
  stickyNoteElement.style.left = `${randomX}px`;
  stickyNoteElement.style.top = `${randomY}px`;
  stickyNoteElement.style.position = 'absolute';
  stickyNoteElement.style.backgroundColor = '#eee';

  // Add content to the sticky note
  stickyNoteElement.innerHTML = `
    <p class="note-text" contenteditable="true">New note</p>
    <p class="note-date">Created On: ${formattedDate}</p>
    <div class="note-colors">
      <div class="color-options">
        <div class="color-circle gray" data-color="gray" onclick="changeNoteColor(event)"></div>
        <div class="color-circle red" data-color="red" onclick="changeNoteColor(event)"></div>
        <div class="color-circle green" data-color="green" onclick="changeNoteColor(event)"></div>
        <div class="color-circle blue" data-color="blue" onclick="changeNoteColor(event)"></div>
      </div>
      <button class="delete-btn">X</button>
    </div>
  `;

  // Append the sticky note to the board container
  const boardContainer = document.querySelector('.board-container');
  boardContainer.appendChild(stickyNoteElement);
  // }

  return noteObject;
};

const addButton = document.querySelector('.add-btn');
addButton.addEventListener('click', () => {
  createStickyNote();
});