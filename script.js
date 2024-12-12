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

    // Update the resizer color to match the note color
    const resizer = note.querySelector('.resizer');
    if (resizer) {
        resizer.style.backgroundColor = colorValue[color];
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

// Function to enable resizing for a sticky note
const initializeResizer = (note) => {
    // Find the element responsible for resizing within each note
    const resizer = note.querySelector('.resizer');

    // Variables to store the original dimensions of the note and the initial mouse position
    let originalWidth = 0;
    let originalHeight = 0;
    let originalMouseX = 0;
    let originalMouseY = 0;

    // Function to handle the resizing of the note
    const resize = (event) => {
        // Calculate the change in width and height based on mouse movement
        const deltaWidth = event.clientX - originalMouseX;
        const deltaHeight = event.clientY - originalMouseY;

        // Use the larger change (to maintain square resizing, if required)
        const maxDelta = Math.max(deltaWidth, deltaHeight);

        // Calculate the new width and height of the note (Maintain the normal size and do not reduce the card any more.)
        const newWidth = Math.max(originalWidth, originalWidth + maxDelta);
        const newHeight = Math.max(originalHeight, originalHeight + maxDelta);

        // Apply the new dimensions to the note
        note.style.width = `${newWidth}px`;
        note.style.height = `${newHeight}px`;
    };

    // Function to stop resizing when the mouse is released
    const stopResize = () => {
        window.removeEventListener('mousemove', resize);
        window.removeEventListener('mouseup', stopResize);

        // return the new dimensions of the note as an object
        const newWidth = note.offsetWidth;
        const newHeight = note.offsetHeight;
        return { width: newWidth, height: newHeight };
    };

    // Attach a mousedown event to the resizer element
    resizer.addEventListener('mousedown', (event) => {
        event.preventDefault();
        // Store the original dimensions and mouse position when resizing starts
        originalWidth = note.offsetWidth;
        originalHeight = note.offsetHeight;
        originalMouseX = event.clientX;
        originalMouseY = event.clientY;

        // Add event listeners for mousemove and mouseup to handle resizing
        window.addEventListener('mousemove', resize);
        window.addEventListener('mouseup', stopResize);
    });
};


// Function to enable drag-and-drop functionality for a sticky note
const initializeDragAndDrop = (note) => {
    let offsetX = 0; // Offset between mouse and note's left edge
    let offsetY = 0; // Offset between mouse and note's top edge

    // Function to start dragging
    const startDrag = (event) => {
        event.preventDefault();
        offsetX = event.clientX - note.offsetLeft;
        offsetY = event.clientY - note.offsetTop;

        // Add event listeners for mousemove and mouseup
        window.addEventListener('mousemove', drag);
        window.addEventListener('mouseup', stopDrag);
    };

    // Function to handle dragging
    const drag = (event) => {
        // Calculate the new position of the note
        let newLeft = event.clientX - offsetX;
        let newTop = event.clientY - offsetY;

        // Restrict the note within the window's boundaries
        newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - note.offsetWidth));
        newTop = Math.max(8, Math.min(newTop, window.innerHeight - note.offsetHeight));

        // Apply the new position to the note
        note.style.left = `${newLeft}px`;
        note.style.top = `${newTop}px`;
    };

    // Function to stop dragging
    const stopDrag = () => {
        // Remove the mousemove and mouseup event listeners
        window.removeEventListener('mousemove', drag);
        window.removeEventListener('mouseup', stopDrag);
    };

    // Add mousedown event listener to enable dragging
    note.addEventListener('mousedown', (event) => {
        if (event.target.classList.contains('resizer')) return;
        startDrag(event);
    });
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
      <div class="Bottom-elements">
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
      </div>
      <!-- Resizer element -->
      <div class="resizer"></div>
    `;

    // Append the sticky note to the board container
    const boardContainer = document.querySelector('.board-container');
    boardContainer.appendChild(stickyNoteElement);

    // Initialize resizer and drag-and-drop for the new note
    initializeResizer(stickyNoteElement);
    initializeDragAndDrop(stickyNoteElement);

    return noteObject;
};

const addButton = document.querySelector('.add-btn');
addButton.addEventListener('click', () => {
    createStickyNote();
});
