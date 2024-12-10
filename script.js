const boardsElement = document.getElementById("boards");

const boards = [];


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

/*

    Board : {
        id          -> unique
        name        -> At first 'new board'
        createDate  -> current date
        notes       -> notes inside this board
        activated   -> when click it should be true  
    }
        
*/


// Function to render all boards
const renderBoards = () => {
    boardsElement.innerHTML = "";

    boards.forEach((board, index) => {
        boardsElement.insertAdjacentHTML('beforeend', `
            <button 
                class="board-tab ${board.activated ? "active" : ""}" 
                contenteditable="true" 
                onblur="editBoardName(event, ${index})"
            >${board.name}</button>
        `);
        // onblur: is triggered when a user finishes interacting with a contenteditable element
    });
}

// Function to create new board and give it :  unique  id, creationDate, name : by default give it a name with this formate 'New Board()' 
const createBoard = () => {

    // Get the number of board who has 'New Board' as a first part of their name (# of boards the user did not change their default name)
    let numberOfBoardsWithNewBoardName = boards.filter(board => board.name.startsWith("New Board")).length;

    /* Create new name for the board in this formate 'New Board()'and the number between brackets is given according to the 
       number of already existing boards with 'New Board' name */
    let newBoardName = `New Board${numberOfBoardsWithNewBoardName ? `(${numberOfBoardsWithNewBoardName})` : ""}`;

    const newBoard = {
        id: crypto.randomUUID(),
        name: newBoardName,
        creationDate: new Date(),
        notes: [],
        activated: false
    }

    boards.push(newBoard);
    renderBoards();
    // console.log(boards);
}

// function to edit the board name 
const editBoardName = (event, index) => {

    // Get the edited board name from the element (allowed since the board element is contenteditable)
    const newName = event.target.textContent.trim();

    // Change if the user write a name
    if (newName) {
        // Update the board name in the boards array
        boards[index].name = newName;
        // console.log(`update board name to: ${newName}`);
    } else {
        alert("Board name cannot be empty!")
    }
};