//Used for storing the state of the game board
let gameArray = [
    ["","","","","","","","","",""],
    ["","","","","","","","","",""],
    ["","","","","","","","","",""],
    ["","","","","","","","","",""],
    ["","","","","","","","","",""],
    ["","","","","","","","","",""],
    ["","","","","","","","","",""],
    ["","","","","","","","","",""],
    ["","","","","","","","","",""],
    ["","","","","","","","","",""],
];

//Used for storing the score each agent on the board receives each round
let scoreArray = [
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0]
]

let cost = 1/10; //Interesting behavior for odd values

//Initialize grid container
let gridContainer = document.getElementById('gridContainer');

//Initialize the altruist / egoist buttons
let altruistButton = document.getElementById("altruistButton");
let egoistButton = document.getElementById("egoistButton");
altruistButton.style.setProperty("background-color","#d3d3d3");
egoistButton.style.setProperty("background-color","#FFFFFF");

//Global variable for determining which agent to update a cell with (draw mode)
let updateID = "A";

//Event listeners for when the altruist/egoist buttons are clicked
altruistButton.addEventListener("click", () => {
    console.log("Altruist mode engaged");
    updateID = "A";
    altruistButton.style.setProperty("background-color","#d3d3d3");
    egoistButton.style.setProperty("background-color","#FFFFFF");
});
egoistButton.addEventListener("click", () => {
    console.log("Egoist mode engaged");
    updateID = "E";
    altruistButton.style.setProperty("background-color","#FFFFFF");
    egoistButton.style.setProperty("background-color","#d3d3d3");
});

//Initialize the random distribution buttons
let button1 = document.getElementById("2575Button");
let button2 = document.getElementById("5050Button");
let button3 = document.getElementById("7525Button");
button1.style.setProperty("background-color","#FFFFFF");
button2.style.setProperty("background-color","#FFFFFF");
button3.style.setProperty("background-color","#FFFFFF");

//Event listeners for the random distribution buttons
button1.addEventListener("click", () => {
    randomizeGameArray(25);
    updateCells();
    randomSliderValue.textContent = "25";
    randomSlider.value = 25;
});
button2.addEventListener("click", () => {
    randomizeGameArray(50);
    updateCells();
    randomSliderValue.textContent = "50";
    randomSlider.value = 50;
});
button3.addEventListener("click", () => {
    randomizeGameArray(75);
    updateCells();
    randomSliderValue.textContent = "75";
    randomSlider.value = 75;
});

//logic for dealing with slider changes
let startRowSlider = 10;
let startColSlider = 10;
let endRowSlider = 10;
let endColSlider = 10;

//Initialize the row slider
//var rowSliderValue is the text object that says what the value of the row slider is
//var rowSlider is the document object of the slider
let rowSliderValue = document.querySelector("#rowValue");
let rowSlider = document.querySelector("#rowSlider");
rowSliderValue.textContent = rowSlider.value;

//Initialize the col slider
//var colSliderValue is the text object that says what the value of the col slider is
//var colSlider is the document object of the slider
let colSliderValue = document.querySelector("#colValue");
let colSlider = document.querySelector("#colSlider");
colSliderValue.textContent = colSlider.value;

//Event listener for updating the row slider
rowSlider.addEventListener("input", (event) => {
    rowSliderValue.textContent = event.target.value;
    updateArray();
    updateGridSize();
});

//Event listener for updating the column slider
colSlider.addEventListener("input", (event) => {
    colSliderValue.textContent = event.target.value;
    updateArray();
    updateGridSize();
});

//Slider for adjusting simulation speed
let intervalId = null;
let speedSliderValue = document.querySelector("#speedValue");
let speedSlider = document.querySelector("#speedSlider");
speedSliderValue.textContent = speedSlider.value;
speedSlider.addEventListener("input", (event) => {
    speedSliderValue.textContent = event.target.value;
    let speedValue = parseInt(event.target.value, 10); //weirdly the only casting way I could get this to work
    clearInterval(intervalId);
    intervalId = null;
    updateInterval(speedValue);
});

//Slider for generating a random grid
let randomSliderValue = document.querySelector("#randomValue");
let randomSlider = document.querySelector("#randomSlider");
randomSliderValue.textContent = randomSlider.value;

//Event listener for updating the random slider
randomSlider.addEventListener("input", (event) => {
    randomSliderValue.textContent = event.target.value;
    randomizeGameArray(randomSlider.value);
    updateCells();
});

//Button to generate a random grid given the slider value
let generateButton = document.getElementById("generateButton");
generateButton.style.setProperty("background-color","#FFFFFF");
generateButton.addEventListener("click", () => {
    randomizeGameArray(randomSlider.value);
    updateCells();
});

//Event listener for when the mouse is down or not
let mouseDown = false;
gridContainer.addEventListener("mousedown", (e) => {
    e.preventDefault(); //prevents browser from thinking we're dragging the cell around
    mouseDown = true;
});
gridContainer.addEventListener("mouseup", (e) => {
    e.preventDefault(); //prevents browser from thinking we're dragging the cell around
    mouseDown = false;
});

//Reset button declaration and functionality
let resetButton = document.getElementById("resetButton");
resetButton.addEventListener("click", () => {
    for (let i = 0; i < rowSlider.value; i++) {
        for (let j = 0; j < colSlider.value; j++) {
            gameArray[i][j] = "";
            scoreArray[i][j] = 0;
        }
    }
});

//Advance button initialization (used to advance the game by one timestep)
let advanceButton = document.getElementById("advanceButton");
advanceButton.addEventListener("click", () => {
    advanceGameState();
})

//Run button, used to run and pause the simulation
let running = false;
let runButton = document.getElementById("runButton");
runButton.addEventListener("click", () => {
    if (!running) {
        running = true;
        runButton.innerHTML = "<p><strong>Stop</strong></p>";
    } else {
        running = false;
        runButton.innerHTML = "<p><strong>Run</strong></p>";
    }
    updateInterval(Number(speedSlider.value));
});

//This function updates the size of the grid every time it is called
function updateGridSize(){
    gridContainer.innerHTML = ''; //reset the grid
    gridContainer.style.setProperty("top", 15*(15-rowSlider.value)+80 + "px");
    let gridTemplateRowsString = "repeat(" + rowSlider.value + ", 1fr)";
    let gridTemplateColsString = "repeat(" + colSlider.value + ", 30px)";
    gridContainer.style.setProperty("grid-template-rows", gridTemplateRowsString); //set row amount
    gridContainer.style.setProperty("grid-template-columns",gridTemplateColsString); //set column amount

    for (let i = 0; i < rowSlider.value*colSlider.value; i++) { //Generate all the cells within the grid, and make them interactive
        const cell = document.createElement("div");
        cell.classList.add('cell');
        cell.id = i.toString();
        // Anything interactive goes here:

        cell.addEventListener("mouseover", (e) => { //For dragging functionality
            e.preventDefault(); //prevents browser from thinking we're dragging the cell around
            if (mouseDown){
                cellClick(cell);
            }
        });
        cell.addEventListener("mousedown", (e) => { //For clicking functionality
            e.preventDefault(); //prevents browser from thinking we're dragging the cell around
            cellClick(cell);
        })

        gridContainer.appendChild(cell);
    }
    updateCells();
}

//according to the variable updateID, update the cell that's being clicked on
function cellClick(cell) {
    let cellRow = Math.floor(cell.id / colSlider.value);
    let cellCol = cell.id % colSlider.value;
    updateCell(cell, updateID);
    if (updateID === "A") gameArray[cellRow][cellCol] = "A";
    if (updateID === "E") gameArray[cellRow][cellCol] = "E";
}

function updateCell(cell, param){
    if (param === "A") {
        cell.classList.add("altruistCell");
        cell.classList.remove("egoistCell");
        cell.innerHTML = "<span><strong>A</strong></span>";
    }
    if (param === "E") {
        cell.classList.add("egoistCell");
        cell.classList.remove("altruistCell");
        cell.innerHTML = "<span><strong>E</strong></span>";
    }
    else if (param === "") {
        cell.classList.remove("altruistCell");
        cell.classList.remove("egoistCell");
        cell.innerHTML = "";
    }
}

function updateCells() {
    for (let i = 0; i < rowSlider.value; i++) {
        for (let j = 0; j < colSlider.value; j++) {
            let Str = (Number(colSlider.value) * i + j).toString();
            let cell = document.getElementById(Str);
            updateCell(cell, getAgent(i,j));
        }
    }
}

function updateArray(){
    //old slider vs new slider
    //set start to 10 bc this is the initial size of the grid
    //set end to the number the slider is placed on
    //subtract the end from start to see if the amount went up or down
    endRowSlider = rowSlider.value;
    endColSlider = colSlider.value;

    let newRow=endRowSlider - startRowSlider;
    let newCol=endColSlider - startColSlider;

    //if it is pos remove a row/array
    if(newRow<0){
        for(let i=0; i<Math.abs(newRow);i++){
            gameArray.pop();
            scoreArray.pop();
        }
        //if new row val is greater add a row(asked AI for method and syntax help)
    }else if(newRow>0){
        for(let i=0; i<newRow;i++){
            let subGameArray = new Array("");
            let subScoreArray = [0];
            for (let j = 1; j<colSlider.value;j++){
                subGameArray.push("");
                subScoreArray.push(0);
            }
            gameArray.push(subGameArray);
            scoreArray.push(subScoreArray);
        }
    }
    //if new col value is pos remove a sting from all arrays
    if(newCol<0){
        for(let i=0; i<Math.abs(newCol);i++){
            gameArray.forEach(subArray => {
                subArray.pop();
            });
            scoreArray.forEach(subArray => {
                subArray.pop();
            });
        }

        //if new col is neg add empty string to all arrays
    }else if(newCol>0){
        for(let i=0; i<newCol;i++){
            gameArray.forEach(subArray => {
                subArray.push("");
            });
            scoreArray.forEach(subArray => {
                subArray.push(0);
            });
        }
    }
    startRowSlider = endRowSlider;
    startColSlider = endColSlider;

}

function getAgent(i,j){
    return gameArray[i][j];
}

//This function can be improved by using a matrix to encode the game table and just indexing it to find the score.
//I'll do that later
function score(mainAgent, neighbor) {
    if (mainAgent === "A" && neighbor === "A") {
        return 1-cost;
    }
    if (mainAgent === "A" && neighbor === "E") {
        return -cost;
    }
    if (mainAgent === "E" && neighbor === "A") {
        return 1;
    }
    if (mainAgent === "E" && neighbor === "E") {
        return 0;
    }
    else {
        return 0;
    }
}

//Given a cell position, find the total score given to it by all its neighbors using the score function
function sumOfNeighbors(i,j) {
    let rowMod = Number(rowSlider.value);
    let colMod = Number(colSlider.value);

    let mainAgent = getAgent(i,j);

    let iSubMod = (i-1) % rowMod;
    if (iSubMod < 0) {
        iSubMod = iSubMod + rowMod;
    }
    let iMod = i % rowMod;
    if (iMod < 0) {
        iMod = iMod + rowMod;
    }
    let iPlusMod = (i+1) % rowMod;
    if (iPlusMod < 0) {
        iPlusMod = iPlusMod + rowMod;
    }

    let jSubMod = (j-1) % colMod;
    if (jSubMod < 0) {
        jSubMod += colMod;
    }
    let jMod = j % colMod;
    if (jMod < 0) {
        jMod += colMod;
    }
    let jPlusMod = (j+1) % colMod;
    if (jPlusMod < 0) {
        jPlusMod += colMod;
    }

    return(
        score(mainAgent, getAgent(iSubMod,jSubMod)) +
        score(mainAgent, getAgent(iSubMod,jMod)) +
        score(mainAgent, getAgent(iSubMod,jPlusMod))

        +   score(mainAgent, getAgent(iMod,jSubMod)) +
        score(mainAgent, getAgent(iMod,jPlusMod))

        +   score(mainAgent, getAgent(iPlusMod,jSubMod)) +
        score(mainAgent, getAgent(iPlusMod,jMod)) +
        score(mainAgent, getAgent(iPlusMod,jPlusMod)));
}

//Updates the scoreArray for all cells
function updateScores() {
    for (let i = 0; i < rowSlider.value; i++) {
        for (let j = 0; j < colSlider.value; j++) {
            scoreArray[i][j] = sumOfNeighbors(i,j);
        }
    }
}

//Given the score array, update the gameArray using imitation dynamics
function updateGameArray() {
    //Here is just to create a snapshot of the gameArray array. This was the only way I could manage to do it
    let tempGameArray = [];

    for (let i = 0; i < rowSlider.value; i++) {
        let subArray = [];
        for (let i = 0; i < colSlider.value; i++) {
            subArray.push("");
        }
        tempGameArray.push(subArray);
    }

    for (let i = 0; i < rowSlider.value; i++) {
        for (let j = 0; j < colSlider.value; j++) {
            tempGameArray[i][j] = gameArray[i][j];
        }
    }

    updateScores();

    //Imitation dynamics
    for (let i = 0; i < rowSlider.value; i++) {
        for (let j = 0; j < colSlider.value; j++) {
            tempGameArray[i][j] = imitateNeighbors(i,j);
        }
    }
    //Copying the result onto the gameArray
    for (let i = 0; i < rowSlider.value; i++) {
        for (let j = 0; j < colSlider.value; j++) {
            gameArray[i][j] = tempGameArray[i][j];
        }
    }
}

//lots of modulus stuff to just allow for screen wrapping
//Given a cell position, imitate the immediate neighbor with the highest score
function imitateNeighbors(i, j) {
    let rowMod = Number(rowSlider.value);
    let colMod = Number(colSlider.value);

    let scoreMax = -10;
    let returnAgent = getAgent(i, j);

    let bestAgents = [];
    for (let d = -1; d <= 1; d++) {
        for (let e = -1; e <= 1; e++) {
            if (d === 0 && e === 0) {
                continue;
            }
            let iMod = (i + d) % rowMod;
            let jMod = (j + e) % colMod;
            if (iMod < 0){
                iMod += rowMod;
            }
            if (jMod < 0){
                jMod += colMod;
            }
            if (getAgent(iMod, jMod) === "") continue;

            if (scoreArray[iMod][jMod] > scoreMax) {
                scoreMax = scoreArray[iMod][jMod];
                returnAgent = getAgent(iMod, jMod);
                bestAgents = [getAgent(iMod,jMod)];
            } else if (scoreArray[iMod][jMod] === scoreMax) {
                bestAgents.push(getAgent(iMod, jMod));
            }
        }
    }
    if (bestAgents.length === 0) {
        return getAgent(i, j);
    }
        return bestAgents[Math.floor(Math.random() * bestAgents.length)];

}

//Advances the game state by one timestep
function advanceGameState(){
    updateGameArray();
    updateCells();
    console.log(gameArray);
    console.log(scoreArray);
}

//Function for advancing the game state on a loop
function updateInterval(speed) {
    console.log("activated");
    console.log(running);
    if (running) {
        // Only start if an interval isn't already running
        if (intervalId == null) {
            intervalId = setInterval(advanceGameState, (1000/speed)); // Runs every 1000ms
            console.log(intervalId);
        }
    } else {
        clearInterval(intervalId);
        intervalId = null;
    }
}
//Function for randomizing the gameArray given an altruistWeight (% of altruists
function randomizeGameArray(altruistWeight) {
    for (let i = 0; i < rowSlider.value; i++) {
        for (let j = 0; j < colSlider.value; j++) {
            let randomValue = Math.floor(Math.random()*100);
            if (randomValue < altruistWeight) {
                gameArray[i][j] = "A";
            }
            else {
                gameArray[i][j] = "E";
            }
        }
    }
}

updateGridSize(); //initial rendering on load