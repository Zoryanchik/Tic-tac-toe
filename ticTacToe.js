"use strict"; // Enable strict mode to catch coding errors
const prompt = require('prompt-sync')({ sigint: true }); // Import library for user input

// ===== GAME VARIABLES =====
// Create a board array with 9 empty cells (null = empty, 'X' or 'O' = player mark)
let board = Array(9).fill(null);

// Track whose turn it is ('X' starts first)
let currentPlayer = 'X';

// Store the winner ('X', 'O', 'Draw', or null if game ongoing)
let winner = null;

// Display welcome message to the player
console.log("Welcome to Tic-Tac-Toe!");

console.log("Choose game mode:");
console.log("1 - Player vs Player");
console.log("2 - Player vs AI");

let gameMode;
while (true) {
    const modeInput = prompt("Enter 1 or 2: ");
    if (modeInput === '1' || modeInput === '2') {
        gameMode = modeInput;
        break;
    } else {
        console.log("Invalid choice! Try again.");
    }
}

let aiDifficulty = null;
if (gameMode === '2') {
    console.log("Choose AI difficulty:");
    console.log("1 - Naïve (random)");
    console.log("2 - Intermediate (winning/blocking)");
    console.log("3 - Advanced (Minimax)");

    while (true) {
        const diffInput = prompt("Enter 1, 2, or 3: ");
        if (['1','2','3'].includes(diffInput)) {
            aiDifficulty = diffInput;
            break;
        } else {
            console.log("Invalid choice! Try again.");
        }
    }
}

// ===== AI FUNCTIONS =====

// DIFFICULTY 1: NAÏVE AI (Random Moves)
// This AI simply picks any random empty cell
// Good for beginners - unpredictable but not strategic
function naiveAIMove() {
    // Find all empty cell indices in the board
    const emptyIndices = board
        .map((cell, idx) => cell === null ? idx : null) // Get indices of empty cells
        //
        .filter(idx => idx !== null); // Remove null values

    // Pick a random empty cell
    const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    board[randomIndex] = 'O'; // Place AI's mark
    console.log(`AI plays at position ${randomIndex + 1}`);
}

// DIFFICULTY 2: INTERMEDIATE AI (Winning / Blocking)
// Helper function: Try to find a winning move for a given symbol
// Simulates placing the symbol and checking if it would win
function findWinningMove(symbol) {
    // Try each empty cell
    for (let i = 0; i < 9; i++) {
        if (board[i] === null) {
            // Temporarily place the symbol
            board[i] = symbol;
            
            // Check if this would create a winning condition
            if (checkWinner()) {
                board[i] = null; // Reset the cell
                return i; // Return this winning position
            }
            
            board[i] = null; // Reset if not a winning move
        }
    }
    return null; // No winning move found
}

// Intermediate AI logic: Try to win, block opponent, or move randomly
function intermediateAIMove() {
    // Step 1: Try to win
    let move = findWinningMove('O');
    
    // Step 2: If no winning move, try to block the player
    if (move === null) {
        move = findWinningMove('X');
    }
    
    // Step 3: If neither, pick a random move
    if (move === null) {
        const emptyIndices = board
            .map((cell, idx) => cell === null ? idx : null)
            .filter(idx => idx !== null);
        move = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    }

    board[move] = 'O'; // Place AI's mark
    console.log(`AI plays at position ${move + 1}`);
}

// DIFFICULTY 3: ADVANCED AI (Minimax Algorithm)
// Minimax evaluates all possible future game states to find the optimal move
// The AI tries to maximize its own score while minimizing the player's score

// Recursive minimax function
// isMaximizing: true when it's AI's turn, false when it's player's turn
function minimax(isMaximizing) {
    // Base case: Check if the game is over
    if (checkWinner()) {
        if (winner === 'O') return 1;      // AI won: +1 (best for AI)
        if (winner === 'X') return -1;     // Player won: -1 (worst for AI)
        if (winner === 'Draw') return 0;   // Draw: 0 (neutral)
    }

    if (isMaximizing) {
        // AI's turn: Try to get the highest score
        let bestScore = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === null) {
                board[i] = 'O'; // Try placing AI's mark
                const score = minimax(false); // Recursively evaluate
                board[i] = null; // Undo the move
                bestScore = Math.max(score, bestScore); // Keep best score
            }
        }
        return bestScore;
    } else {
        // Player's turn: Try to get the lowest score (from AI's perspective)
        let bestScore = Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === null) {
                board[i] = 'X'; // Try placing player's mark
                const score = minimax(true); // Recursively evaluate
                board[i] = null; // Undo the move
                bestScore = Math.min(score, bestScore); // Keep lowest score
            }
        }
        return bestScore;
    }
}




// ===== DISPLAY BOARD FUNCTION =====
// This function prints the current board state in a 3x3 grid format
function printBoard() {
    // Loop through board positions: 0, 3, 6 (start of each row)
    for (let i = 0; i < 9; i += 3) {
        // Print the three cells in this row (with | separator between them)
        // || ' ' shows a space if the cell is empty (null)
        console.log(`
 ${board[i] || ' '} | ${board[i + 1] || ' '} | ${board[i + 2] || ' '}`);
        
        // Only print a separator line after rows 1 and 2 (not after row 3)
        if (i < 6) {
            console.log('-----------');
        }
    }
}

// ===== MAKE MOVE FUNCTION =====
// This function places a player's mark on the board at a given position
function makeMove(position) {
    // Convert user input (1-9) to array index (0-8)
    const index = position - 1;
    
    // Check if position is valid (between 1 and 9)
    if (index < 0 || index > 8) {
        console.log("Invalid position! Please enter a number between 1 and 9.");
        return false; // Move failed
    }
    
    // Check if that position is already taken
    if (board[index] !== null) {
        console.log("That position is already taken! Choose another.");
        return false; // Move failed
    }
    
    // Place the current player's mark on the board
    board[index] = currentPlayer;
    return true; // Move succeeded
}

// ===== CHECK WINNER FUNCTION =====
// This function checks if someone won or if it's a draw
function checkWinner() {
    // Define all possible winning combinations (lines of three)
    // Each row: [0,1,2], [3,4,5], [6,7,8]
    // Each column: [0,3,6], [1,4,7], [2,5,8]
    // Each diagonal: [0,4,8], [2,4,6]
    const winPatterns = [
        [0, 1, 2], // Top row
        [3, 4, 5], // Middle row
        [6, 7, 8], // Bottom row
        [0, 3, 6], // Left column
        [1, 4, 7], // Middle column
        [2, 5, 8], // Right column
        [0, 4, 8], // Diagonal (top-left to bottom-right)
        [2, 4, 6]  // Diagonal (top-right to bottom-left)
    ];

    // Check each winning pattern
    for (let pattern of winPatterns) {
        // Destructure the three positions in this pattern
        const [a, b, c] = pattern;
        
        // If all three positions have the same mark and it's not empty, we have a winner!
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            winner = board[a]; // Store who won ('X' or 'O')
            return true; // Game is over
        }
    }

    // Check if board is full (all cells filled) - this means a draw
    // board.every() returns true only if ALL cells are not null
    if (board.every(cell => cell !== null)) {
        winner = 'Draw'; // Mark the game as a draw
        return true; // Game is over
    }

    // If no winner and board not full, game continues
    return false;
} 

function startGame() {
    console.log("Enter a number from 1-9 to place your mark:");
    console.log("\nPositions:");
    console.log(" 1 | 2 | 3 ");
    console.log("-----------");
    console.log(" 4 | 5 | 6 ");
    console.log("-----------");
    console.log(" 7 | 8 | 9 ");
    console.log("\n");
    
    printBoard();
    
    // Game loop continues until someone wins or it's a draw
    while (!winner) {
        console.log(`\nPlayer ${currentPlayer}'s turn`);
        
        // Check if current player is AI (only in PvAI mode and when it's O's turn)
        if (gameMode === '2' && currentPlayer === 'O') {
            // AI Move: Choose based on difficulty level
            if (aiDifficulty === '1') {
                naiveAIMove(); // Easy: Random moves
            } else if (aiDifficulty === '2') {
                intermediateAIMove(); // Medium: Win/Block strategy
            } else if (aiDifficulty === '3') {
                advancedAIMove(); // Hard: Minimax algorithm
            }
        } else {
            // Human Player Move
            const input = prompt("Enter position (1-9): ");
            const position = parseInt(input);
            
            if (isNaN(position)) {
                console.log("Please enter a valid number!");
                continue; // Skip to next iteration if invalid input
            }
            
            // Try to make the move, skip turn if it fails
            if (!makeMove(position)) {
                continue;
            }
        }
        
        // Display the board after the move
        printBoard();
        
        // Check if the game is over
        if (checkWinner()) {
            if (winner === 'Draw') {
                console.log("\nIt's a draw! Game over.");
            } else {
                console.log(`\nPlayer ${winner} wins! Congratulations!`);
            }
            break; // Exit game loop
        }
        
        // Switch turns between X and O
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    }
}

