const boardsElement = document.getElementById("boards");
const notesContainerElement = document.getElementById("notes-container");

const boards = [];

// Return the first activated board, if more than one is activated make them inactive, if not one is active return null
const getActivatedBoard = () => {
    // Get all activated boards
    const activatedBoards = boards.filter(board => board.activated);

    // If more than 1 board is active, keep the first one active and inactive the others
    if (activatedBoards && activatedBoards.length > 1) {
        activatedBoards.forEach((board, index) => {
            if (index) {
                board.activated = false;
            }
        })
    }

    // If no board is active -> activate the first board
    if (boards.length !== 0 && activatedBoards.length === 0) {
        boards[0].activated = true;
        activatedBoards.push(boards[0]);
        renderBoards();
    }

    // Return the first activated board, if no one is active return null
    return activatedBoards ? activatedBoards[0] : null;
}

const renderCurrentBoardNotes = () => {
    const currentBoard = getActivatedBoard();
    if (currentBoard) {
        const currentNotes = currentBoard.notes;
        notesContainerElement.innerHTML = "";

        currentNotes.forEach((note, index) => {
            if (!note.archived) {
                notesContainerElement.insertAdjacentHTML('beforeend', `
                    <div class="sticky-note"
                        style="
                            position: absolute;
                            top: ${note.positionY}px;
                            left: ${note.positionX}px;
                            background-color: ${note.color};
                            width: ${note.width}px;
                            height: ${note.height}px;
                        "> 
                        <p class="note-text" 
                           contenteditable="true" 
                           onblur="editNoteContent(event, ${index})">
                            ${note.content}
                        </p>
                        <div class="Bottom-elements">
                            <p class="note-date">${note.createdDate}</p>
                            <div class="note-colors"> 
                                <div class="color-options">
                                    <div class="color-circle gray" data-color="gray" onclick="changeNoteColor(event, ${index})"></div>
                                    <div class="color-circle red" data-color="red" onclick="changeNoteColor(event, ${index})"></div>
                                    <div class="color-circle green" data-color="green" onclick="changeNoteColor(event, ${index})"></div>
                                    <div class="color-circle blue" data-color="blue" onclick="changeNoteColor(event, ${index})"></div>
                                </div>
                            </div>
                            <button class="delete-btn" onclick="deleteNote(${index})">X</button>
                        </div>
                        <!-- Resizer element -->
                        <div class="resizer" style="background-color:${note.color}"></div>
                    </div>
                `);
                // onblur: is triggered when a user finishes interacting with a contenteditable element

                const noteElement = notesContainerElement.lastElementChild;
                initializeResizer(noteElement, index);
                initializeDragAndDrop(noteElement, index);
            }
        });
    } else {
        console.log('No boards exists');
        alert("Create new board");
    }
}

// Change the background color of a sticky note based on the clicked color circle.
const changeNoteColor = (event, index) => {

    // Define a mapping of color names to their respective hex color values
    const colorValue = {
        gray: '#eee',
        red: '#f28b82',
        green: '#ccff90',
        blue: '#aecbfa'
    };

    // Get the clicked color circle element
    const colorCircle = event.target;
    const color = colorCircle.getAttribute('data-color');

    // Get sticky note whose background color needs to change
    // const note = colorCircle.closest('.sticky-note');

    const currentBoard = getActivatedBoard();
    if (currentBoard) {
        // If a sticky note is found and a valid color is provided -> change the color
        if (color) {
            currentBoard.notes[index].color = colorValue[color];
            // console.log(boards);
        }
    } else {
        console.log('No boards exists');
        alert("Create new board")
    }

    // Update the resizer color to match the note color
    // const resizer = note.querySelector('.resizer');
    // if (resizer) {
    //     resizer.style.backgroundColor = colorValue[color];
    // }

    renderCurrentBoardNotes();
};

// Function to update the "Edited On" date when the note content changes
const changeDate = (index) => {
    // Get the current date
    const currentDate = new Date();

    // Get the abbreviated month (first 3 letters), day, and year
    const month = currentDate.toLocaleString('en-US', { month: 'short' });
    const day = currentDate.getDate();
    const year = currentDate.getFullYear();

    // Format the date as "Month dd, yyyy"
    const formattedDate = `${month} ${day}, ${year}`;

    // Find the note's date paragraph (.note-date)
    // const note = event.target.closest('.sticky-note');
    // const noteDateElement = note.querySelector('.note-date');

    // Update the text content of the .note-date paragraph to "Edited On: <current date>"
    // if (noteDateElement) {
    //     noteDateElement.textContent = `Edited On: ${formattedDate}`;
    // }

    const currentBoard = getActivatedBoard();
    if (currentBoard) {
        currentBoard.notes[index].createdDate = `Edited On: ${formattedDate}`;
    } else {
        console.log('No boards exists');
        alert("Create new board")
    }
    renderCurrentBoardNotes();
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
                onclick="handleBoardClick(${index})"
            >${board.name}</button>
        `);
        // onblur: is triggered when a user finishes interacting with a contenteditable element
    });
    getActivatedBoard();
}

// Wrapper to handle board click 
const handleBoardClick = (index) => {
    // Delay the activation to allow `onblur` to complete
    setTimeout(() => activateBoard(index), 300);
};

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
    activateBoard(index);
};

// Activate board when click on it 
const activateBoard = (index) => {
    // To ensure that just obe board is activated 
    boards.forEach(board => board.activated = false);

    // Activate the new board
    boards[index].activated = true;

    // To see the results
    renderBoards();
    renderCurrentBoardNotes();
};

// Function to enable resizing for a sticky note
const initializeResizer = (note, index) => {
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
        const maxDelta = Math.max(deltaWidth, deltaHeight);

        // Calculate new width and height (maintain the note size within minimum dimensions)
        let newWidth = originalWidth + maxDelta;
        let newHeight = originalHeight + maxDelta;

        // Prevent the note from exceeding the window's right or bottom boundary
        newWidth = Math.min(newWidth, 400);
        newHeight = Math.min(newHeight, 380);

        // Ensure that the note is not too small
        newWidth = Math.max(newWidth, 200);  // Minimum width
        newHeight = Math.max(newHeight, 180); // Minimum height

        // Apply the new width and height to the note
        note.style.width = `${newWidth}px`;
        note.style.height = `${newHeight}px`;

        const currentBoard = getActivatedBoard();
        if (currentBoard) {
            currentBoard.notes[index].width = newWidth;
            currentBoard.notes[index].height = newHeight;
            renderCurrentBoardNotes();
        } else {
            console.log('No boards exists');
            alert("Create new board")
        }
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
const initializeDragAndDrop = (note, index) => {
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

        const currentBoard = getActivatedBoard();
        if (currentBoard) {
            currentBoard.notes[index].positionX = newLeft;
            currentBoard.notes[index].positionY = newTop;
            renderCurrentBoardNotes();
        } else {
            console.log('No boards exists');
            alert("Create new board")
        }
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
    const color = '#eee';

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
        createdDate: `Added On: ${formattedDate}`,
        archived: false
    };

    // For testing only, it should be deleted when handle rendering.
    // {
    // Create a new sticky note element
    // const stickyNoteElement = document.createElement('div');
    // stickyNoteElement.className = 'sticky-note';
    // stickyNoteElement.style.width = `${width}px`;
    // stickyNoteElement.style.height = `${height}px`;
    // stickyNoteElement.style.left = `${randomX}px`;
    // stickyNoteElement.style.top = `${randomY}px`;
    // stickyNoteElement.style.position = 'absolute';
    // stickyNoteElement.style.backgroundColor = '#eee';

    // Add content to the sticky note
    // stickyNoteElement.innerHTML = `
    //   <p class="note-text">New note</p>
    //   <div class="Bottom-elements">
    //   <p class="note-date">Created On: ${formattedDate}</p>
    //   <div class="note-colors">
    //     <div class="color-options">
    //       <div class="color-circle gray" data-color="gray" onclick="changeNoteColor(event)"></div>
    //       <div class="color-circle red" data-color="red" onclick="changeNoteColor(event)"></div>
    //       <div class="color-circle green" data-color="green" onclick="changeNoteColor(event)"></div>
    //       <div class="color-circle blue" data-color="blue" onclick="changeNoteColor(event)"></div>
    //     </div>
    //     </div>
    //     <button class="delete-btn">X</button>
    //   </div>
    //   <!-- Resizer element -->
    //   <div class="resizer"></div>
    // `;

    // Append the sticky note to the board container
    // const boardContainer = document.querySelector('.board-container');
    // boardContainer.appendChild(stickyNoteElement);

    // Initialize resizer and drag-and-drop for the new note
    // initializeResizer(stickyNoteElement);
    // initializeDragAndDrop(stickyNoteElement);

    const currentBoard = getActivatedBoard();
    if (currentBoard) {
        currentBoard.notes.push(noteObject);
        renderCurrentBoardNotes();
        // console.log(noteObject);
    } else {
        console.log('No boards exists');
        alert("Create new board")
    }
};

const addButton = document.querySelector('.add-btn');
addButton.addEventListener('click', () => {
    createStickyNote();
});


// function to edit the content of a note 
const editNoteContent = (event, index) => {

    // Get the edited board name from the element (allowed since the board element is contenteditable)
    const newContent = event.target.textContent.trim();

    // It should edit the note in the current board, so first we get the activated board then edit the note with that index
    const currentBoard = getActivatedBoard();
    if (currentBoard) {
        //Change the note content,  it's possible to let the note empty 
        currentBoard.notes[index].content = newContent;

        // Change the date for the note after editing it
        changeDate(index);
        renderCurrentBoardNotes();
    } else {
        console.log('No boards exists');
        alert("Create new board")
    }

    // console.log(`update note content to: ${newContent}`);
};