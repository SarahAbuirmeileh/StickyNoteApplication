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


