// Import required modules
const express = require('express');
const cors = require('cors');

// Create a new Express application instance
const app = express();

// Enable Cross-Origin Resource Sharing (CORS) to allow requests from different origins
app.use(cors());

// Server configuration - set hostname and port
const hostname = '127.0.0.1';
const port = 3000;

// Start the server and listen on the specified port and hostname
app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
// Route 1: Handle GET request on root path (/)
// Responds with a simple text message
app.get('/', (req, res) => {
    res.end('Hello, World!!!\n');
});
// Route 2: Handle GET request on /question with query parameter 'q'
// Validates the length of the query parameter and responds accordingly
app.get('/question', (req, res) => {
    // Construct a URL object to parse query parameters
    const requestUrl = new URL(req.url,
        `http://${req.headers.host}`);
    
    // Extract the 'q' query parameter from the URL
    const nameValue = requestUrl.searchParams.get('q');
    
    // Check if the parameter exists
    if (nameValue != null) {
        console.log('Info-> ' + nameValue);
        // If parameter is less than 10 characters, prompt for more input
        if (nameValue.length < 10) {
            res.end('Keep on typing');
        } else {
            // If parameter is 10 or more characters, stop
            res.end('That\'s enough - stop!!!!');
        }
    } else {
        // If no parameter was provided, notify the user
        res.end('No parameter found - did something go wrong?');
    }
})
//Handle GET request on /axios-ajax.html
app.get("/axios-ajax.html", (req, res) => {
    res.sendFile(__dirname + "/axios-ajax.html", function (err) {
        if (err) {
            console.log('Error sending file-> ' + err);
            res.end('Error sending file-> ' + err);
        } else {
            console.log('Sent File OK');
        }
    }
    )
})


// Helper function: Count the number of times a target character appears in the board string
function countChar(board, target) {
    if (target == 'B') return (board.match(/B/g) || []).length;
    else if (target == 'X') return (board.match(/X/g) || []).length;
    else if (target == 'O') return (board.match(/O/g) || []).length;
    else return -1;
}

// Route 3: Handle GET request on /tictactoe with 'board' parameter
// Updates the board state with server's move (random for now) and returns the updated board
app.get("/tictactoe", (req, res) => {
    // Construct a URL object to parse query parameters
    const requestUrl = new URL(req.url,
        `http://${req.headers.host}`);
    
    // Extract the 'board' query parameter from the URL
    const boardValue = requestUrl.searchParams.get('board');
    
    // Check if the parameter exists and has exactly 9 characters
    if (boardValue == null) {
        res.end('Error: board parameter is missing');
    } else if (boardValue.length != 9) {
        res.end('Error: board must have exactly 9 characters');
    } else {
        console.log('Board received-> ' + boardValue);
        
        // Check if the board is blank (all B's)
        if (countChar(boardValue, 'B') == 9) {
            // Blank board - make a random first move
            var arr = [...boardValue]; // spread string to array
            arr[Math.floor(Math.random() * arr.length)] = 'X'; // random move
            res.end(arr.join('')); // join array to string and return
        } else {
            // Board already has moves - would implement game logic here
            // For now, return OK to indicate valid board
            res.end('OK');
        }
    }
});
//the diff btw res.send and res.end is that res.send can send a string, an object, or an array, while res.end can only send a string. res.send also automatically sets the Content-Type header based on the type of data being sent, while res.end does not. Additionally, res.send can be used to send a response body and end the response in one step, while res.end requires you to call it separately after sending the response body.