"use strict"; // Use strict mode to catch common coding mistakes

// Import the prompt-sync library to get user input in Node.js
// { sigint: true } allows Ctrl+C to exit the program
const prompt = require('prompt-sync')({ sigint: true });

// Ask the user to type something and store it in 'userInput' variable
const userInput = prompt("Please enter something:");

// Check if the user's input is a valid number
// !isNaN(userInput) checks if it's NOT "Not a Number" (meaning it IS a number)
// userInput.trim() !== "" checks that the input is not empty or just spaces
if (!isNaN(userInput) && userInput.trim() !== "") {
    // If it's a number, print confirmation message
    console.log(`${userInput} is a number.`);
} else {
    // If it's not a number or is empty, print this message
    console.log(`${userInput} is not a number.`);
}


// Create an empty array to represent the tic-tac-toe board
const board = [];

// Loop to fill the board with numbers 1 through 9
// This represents the 9 positions on the tic-tac-toe grid
for (let i = 1; i <= 9; i++) {
    board.push(i); // Add each number to the board array
}

// Display the board array in the console (shows: [1, 2, 3, 4, 5, 6, 7, 8, 9])
console.log(board);

// Function to print the current state of the board in a grid format
function printBoard() {
    for (let i = 0; i < 9; i += 3) {
        console.log(`
 ${board[i] || ' '} | ${board[i + 1] || ' '} | ${board[i + 2] || ' '}`);
        
        // Only print separator if NOT the last row
        if (i < 6) {
            console.log('-----------');
        }
    }
}

// Call the function to display the board
printBoard();
