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

// to be It should be modified into an array of objects.
const notes = document.querySelectorAll('.sticky-note');
notes.forEach(note => {
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
});
