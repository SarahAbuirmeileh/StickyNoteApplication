/*
  Function to change the background color of a sticky note
  based on the color selected by clicking a color circle.
*/
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
