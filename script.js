const boardsElement = document.getElementById("boards");
const notesContainerElement = document.getElementById("notes-container");
const searchBar = document.getElementById('search-bar');
let arch = false;

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

// Function to highlight the matching text
const highlightText = (text, keyword) => {
    if (!keyword) return text;
    const regex = new RegExp(`(${keyword})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
};

// Search function
const searchNotes = (keyword) => {
    const searchInput = keyword.toLowerCase().trim();
    renderCurrentBoardNotes(searchInput);
};

const renderCurrentBoardNotes = (searchKeyword = "") => {
    notesContainerElement.innerHTML = "";

    arch = false;
    const currentBoard = getActivatedBoard();
    if (currentBoard) {
        const currentNotes = currentBoard.notes;
        notesContainerElement.innerHTML = "";

        currentNotes.forEach((note, index) => {
            if (!note.archived) {
                // Check if the search keyword matches the note content
                const matchesSearch = note.content.toLowerCase().includes(searchKeyword);

                if (matchesSearch || !searchKeyword) {
                    notesContainerElement.insertAdjacentHTML('beforeend',
                        `<div class="sticky-note"
                            style="
                                top: ${note.positionY}px;
                                left: ${note.positionX}px;
                                background-color: ${note.color};
                                width: ${note.width}px;
                                height: ${note.height}px;
                            "
                            ondblclick="focusNoteContent(${index})"
                        >
                            <p class="note-text" 
                               contenteditable="true" 
                               id="note-text-${index}" 
                               onblur="editNoteContent(event, ${index})">
                               ${highlightText(note.content, searchKeyword)}
                            </p>
                            <div class="Bottom-elements">
                                <p class="note-date">${note.createdDate}</p>
                                <div class="note-colors"> 
                                    <div class="color-options">
                                        <div class="color-circle gray" data-color="gray" onclick="changeNoteColor(event, '${note.id}','${note.boardID}')"></div>
                                        <div class="color-circle red" data-color="red" onclick="changeNoteColor(event, '${note.id}','${note.boardID}')"></div>
                                        <div class="color-circle green" data-color="green" onclick="changeNoteColor(event, '${note.id}','${note.boardID}')"></div>
                                        <div class="color-circle blue" data-color="blue" onclick="changeNoteColor(event, '${note.id}','${note.boardID}')"></div>
                                    </div>
                                </div>
                                <button class="delete-btn" onclick="archiveNote(${index},'${note.boardID}')">X</button>
                            </div>
                            <div class="resizer" style="background-color:${note.color}"></div>
                        </div>`
                    );

                    // Initialize resizable and draggable functionalities
                    const noteElement = notesContainerElement.lastElementChild;
                    initializeResizer(noteElement, index);
                    initializeDragAndDrop(noteElement, index);
                }
            }
        });
    } else {
        // No boards -> no notes
        notesContainerElement.innerHTML = "";
        console.log("No boards exist");
    }
};

// Function to focus on the note content
const focusNoteContent = (index) => {
    const noteTextElement = document.getElementById(`note-text-${index}`);
    if (noteTextElement) {
        noteTextElement.focus();
    }
};


// Attach event listeners to the search bar when the user has an input and when he clicks 'Enter' 
searchBar.addEventListener('input', (event) => searchNotes(event.target.value));
searchBar.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        // Get the value from the search bar
        const searchKeyword = searchBar.value.trim(); 

    // Call the function with the search keyword
        renderCurrentBoardNotes(searchKeyword); 
    }
});

// Change the background color of a sticky note based on the clicked color circle.
const changeNoteColor = (event, noteID, boardID) => {
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

     // const currentBoard = getActivatedBoard();
     const currentBoard = boards.find(board => board.id === boardID);
     console.log(currentBoard);
     const index = currentBoard.notes.findIndex(note => note.id === noteID);
 
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

    storeData();
    if(arch){
        renderArchivednotes();
    }
    else renderCurrentBoardNotes();
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
    storeData();
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
            <div class="board-item">
                <button 
                    class="board-tab ${board.activated ? "active" : ""}" 
                    
                    ondblclick="editBoardName(event, ${index})"
                    onclick="activateBoard(${index})"
                >
                ${board.name}
                </button>
                <button class="delete-board-btn" onclick="deleteBoard(${index})">X</button>
            </div>
        `);
        //  contenteditable="true" 
        //  onblur: is triggered when a user finishes interacting with a contenteditable element
    });
    if(!arch) getActivatedBoard();

}

//delete the board and its notes if I clicked to delete it
const deleteBoard = (index) => {
    
    if (confirm(`Are you sure you want to delete the board "${boards[index].name}" and all its notes?`)) {
        boards[index].notes = [];

        boards.splice(index, 1);
        // If there is more than one board activate the previous board of the deleted one
        if (index >= 1) {
            activateBoard(index - 1);
        } else if (boards.length > 0) {
            // If we want to delete the first board (no previous), if these is at least one board activate the first board after deletion 
            activateBoard(0);
        }
        storeData();
        renderBoards();
        renderCurrentBoardNotes();
    }
};

// Wrapper to handle board click 
const handleBoardClick = (index) => {
    // Delay the activation to allow `onblur` to complete
    setTimeout(() => activateBoard(index), 300);
};

// Function to create new board and give it :  unique  id, creationDate, name : by default give it a name with this formate 'New Board()' 
const createBoard = () => {
    // Find the highest number in the existing board names
    let maxNumber = 0;

    // Loop through existing boards to extract the highest number
    boards.forEach(board => {
        const match = board.name.match(/New Board\((\d+)\)/); // Check for "New Board(x)" format
        if (match) {
            maxNumber = parseInt(match[1], 10); // Update maxNumber
        }
    });

    // Create a new name with the next number
    const newBoardName = `New Board(${maxNumber + 1})`;

    const newBoard = {
        id: crypto.randomUUID(),
        name: newBoardName,
        creationDate: new Date(),
        notes: [],
        activated: false
    }

    boards.push(newBoard);
    // Activate the last added board
    activateBoard(boards.length - 1);
    storeData();
    renderBoards();
    // console.log(boards);
}

// function to edit the board name 
const editBoardName = (event, index) => {
    /* This is the previous solution to edit the board name using contenteditable and onblur event, but 
       it did not work due to the interference between events, so I changed it to use prompt
       
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

    storeData();
    activateBoard(index);
    */

    // Prompt the user for the new board name
    const newName = prompt(`Enter a new name for the board:`, boards[index].name);

    // Check if the user provided a valid name
    if (newName && newName.trim()) {
        // Update the board name in the boards array
        boards[index].name = newName.trim();

        // Store the updated data
        storeData();

        // Activate the updated board
        activateBoard(index);
    } else {
        // Alert if the name is invalid
        alert("Board name cannot be empty!");
    }
};

// Activate board when click on it 
const activateBoard = (index) => {
    // To ensure that just obe board is activated 
    boards.forEach(board => board.activated = false);

    // Activate the new board
    boards[index].activated = true;

    // To see the results
    storeData();
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

        // Calculate new width and height
        let newWidth = originalWidth + maxDelta;
        let newHeight = originalHeight + maxDelta;

        // Restrict the new width of the note((maximum width(400 px) and Minimum width(200 px))
        newWidth = Math.max(Math.min(newWidth, 400), 200);
        // Restrict the new height of the note ((maximum width(380 px) and Minimum width(180 px))
        newHeight = Math.max(Math.min(newHeight, 380), 180); // Minimum height

        // Apply the new width and height to the note
        note.style.width = `${newWidth}px`;
        note.style.height = `${newHeight}px`;

        const currentBoard = getActivatedBoard();
        if (currentBoard) {
            currentBoard.notes[index].width = newWidth;
            currentBoard.notes[index].height = newHeight;
            storeData();
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

        // Increase z-index to bring the note to the front of other notes
        note.style.zIndex = "1000";

        // Add event listeners for mousemove and mouseup
        window.addEventListener('mousemove', drag);
        window.addEventListener('mouseup', stopDrag);
    };

    // Function to handle dragging
    const drag = (event) => {
        // Get the note's dimensions
        const noteWidth = note.offsetWidth;
        const noteHeight = note.offsetHeight;

        // Get the screen's dimensions
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;

        // Calculate the new position of the note
        let newLeft = event.clientX - offsetX;
        let newTop = event.clientY - offsetY;

        // Restrict the new position for the left (horizontal) axis
        newLeft = Math.max(5, Math.min(newLeft, screenWidth - noteWidth));

        // Restrict the new position for the top (vertical) axis
        newTop = Math.max(8, Math.min(newTop, screenHeight - noteHeight));

        // Apply the new position to the note
        note.style.left = `${newLeft}px`;
        note.style.top = `${newTop}px`;

        const currentBoard = getActivatedBoard();
        if (currentBoard) {
            currentBoard.notes[index].positionX = newLeft;
            currentBoard.notes[index].positionY = newTop;
            storeData();
        } else {
            console.log("No boards exist");
            alert("Create a new board");
        }
    };

    // Function to stop dragging
    const stopDrag = () => {
        // Reset the z-index to its initial value
        note.style.zIndex = "auto";

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
    const currentBoard = getActivatedBoard();
    if(!currentBoard){
        console.log('No boards exists');
        alert("Create new board");
        return;
    }
    console.log(currentBoard.id);
    const noteObject = {
        id : crypto.randomUUID(),
        boardID : currentBoard.id,
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

    
    if (currentBoard) {
        currentBoard.notes.push(noteObject);
        storeData();
        renderCurrentBoardNotes();
        // console.log(noteObject);
    } else {
        console.log('No boards exists');
        alert("Create new board")
    }
};

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
    storeData();
    // console.log(`update note content to: ${newContent}`);
};


// Function to store the current data (boards and notes in local storage with a value of data)
const storeData = () => {
    localStorage.setItem('data', JSON.stringify(boards));
}

// To get the last added data from local storage 
const readData = () => {
    try {
        const strJSON = localStorage.getItem('data');
        return strJSON === null ? [] : JSON.parse(strJSON);
    } catch (error) {
        return [];
    }
}

// >>>>>>>>>>> archive the noote in the archived notes ::: 
// >>>>>>>>>>> warninig !!!!!!!!!! another ikmplementaion for the index in noteObject ,,take it as the UUID 
const archiveNote = (index,currentBoardID) => {
    if (confirm(`Are you sure you want to archive this note ?`)) {
        const currentBoard = boards.find(board => board.id === currentBoardID);
        const currentBoardIdx = boards.findIndex(board => board.id === currentBoardID);
        const newArchivedNote = currentBoard.notes[index];
        console.log(currentBoardID,newArchivedNote);
        
        // >>>>>>>>>>> do this >> put the archive flag to true then render all    
        // >>>>>>>>>>> just render the notes again without the archived ones::::  
        newArchivedNote.archived = true;
        newArchivedNote.activated =false;
    
        boards[currentBoardIdx].notes[index] = newArchivedNote;
        storeData();
        renderCurrentBoardNotes();
    }
}
const renderArchivednotes = ()=>{
    arch = true; 
    boards.forEach(element => {

        element.activated = false;
        console.log(element.activated);
    });
    notesContainerElement.innerHTML = "";   
    renderBoards();

    boards.forEach((board,index) => {
        board.notes.forEach((note,index) => {
            if(note.archived){
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
                            contenteditable="false" 
                            ondblclick="this.focus()"
                            onblur="editNoteContent(event, ${index})">
                            ${note.content}
                        </p>
                        <div class="Bottom-elements">
                            <!--  <p class="note-date">${note.createdDate}</p>
                            <div class="note-colors"> 
                                </div>
                            </div>  -->
                            <button style = "background-color:green" class="delete-btn" onclick="returnNote('${note.id}','${note.boardID}')">✔</button>
                                 </div>
                                  <!-- Resizer element -->
                        <!-- <div class="resizer" style="background-color:${note.color}"></div> -->
                    </div>
                       `);
                // onblur: is triggered when a user finishes interacting with a contenteditable element
                const noteElement = notesContainerElement.lastElementChild;
                //initializeResizer(noteElement, index);
                //initializeDragAndDrop(noteElement, index);

            }
        })
    })
    storeData();
}
const returnNote = (noteID,currentBoardID) => {
    const currentBoard = boards.find(board => board.id === currentBoardID);
    const currentBoardIdx = boards.findIndex(board => board.id === currentBoardID);
    const index = boards[currentBoardIdx].notes.findIndex(note => note.id === noteID);
    const newReturnedNote = currentBoard.notes[index];
    console.log(currentBoardID,newReturnedNote);

    // >>>>>>>>>>> do this >> put the archive flag to false then render all    
    // >>>>>>>>>>> just render the notes again without the returned ones::::  
    newReturnedNote.archived = false;
    boards[currentBoardIdx].notes[index] = newReturnedNote;
    console.log( boards[currentBoardIdx].notes[index]);
    storeData();
    renderArchivednotes();
}



// Get the data from local storage
const boards = readData();


// Initial rendering for board and notes after getting them from local storage
renderBoards();
renderCurrentBoardNotes();

//Function to display the contents of the dropdown menu
const toggleDropdownMenu = () => {
    const dropdownMenu = document.getElementById('dropdown-menu');
    dropdownMenu.classList.toggle('active');
}