//Initialize grid container
let gridContainer = document.getElementById('gridContainer');

//Initialize the altruist / egoist / hooligan buttons
let altruistButton = document.getElementById("altruistButton");
let egoistButton = document.getElementById("egoistButton");
let hooliganButton = document.getElementById("hooliganButton");
altruistButton.style.setProperty("background-color","#d3d3d3");
egoistButton.style.setProperty("background-color","#FFFFFF");
hooliganButton.style.setProperty("background-color","#FFFFFF");

//Global variable for determining which agent to update a cell with (draw mode)
let updateID = "A";

//Event listeners for when the altruist/egoist buttons are clicked
altruistButton.addEventListener("click", () => {
    selectAltruists();
});
egoistButton.addEventListener("click", () => {
    selectEgoists();
});
hooliganButton.addEventListener("click", () => {
    selectHooligans();
});
//Self-explanatory I feel. Mostly style stuff
function selectAltruists() {
    console.log("Altruist mode engaged");
    updateID = "A";
    altruistButton.style.setProperty("background-color","#d3d3d3");
    egoistButton.style.setProperty("background-color","#FFFFFF");
    hooliganButton.style.setProperty("background-color","#FFFFFF");
}
function selectEgoists() {
    console.log("Egoist mode engaged");
    updateID = "E";
    altruistButton.style.setProperty("background-color","#FFFFFF");
    egoistButton.style.setProperty("background-color","#d3d3d3");
    hooliganButton.style.setProperty("background-color","#FFFFFF");
}
function selectHooligans() {
    console.log("Hooligan mode engaged");
    updateID = "H";
    altruistButton.style.setProperty("background-color","#FFFFFF");
    egoistButton.style.setProperty("background-color","#FFFFFF");
    hooliganButton.style.setProperty("background-color","#d3d3d3");
}

//Keyboard support
let body = document.querySelector("body");
body.addEventListener("keydown", (e) => {
    if (e.key === "a") selectAltruists();
    if (e.key === "e") selectEgoists();
    if (e.key === "h") selectHooligans();
    if (e.code === "Space") { //Runs the program on space
        if (!running) {
            running = true;
            runButton.innerHTML = "<p><strong>Stop</strong></p>";
        } else {
            running = false;
            runButton.innerHTML = "<p><strong>Run</strong></p>";
        }
        clearInterval(intervalId);
        intervalId = null;
        updateInterval(5);
    }
    if (e.code === "Enter") {
        advanceGameState();
        updateCells();
    }
});

//setup for dealing with slider changes in updateArray()
let startRowSlider = 10;
let startColSlider = 10;
let endRowSlider = 10;
let endColSlider = 10;

//Initialize the row slider
//var rowSliderValue is the text object that says what the value of the row slider is
//var rowSlider is the document object of the slider
let rowSliderValue = document.querySelector("#rowValue");
let rowSlider = document.querySelector("#rowSlider");
rowSlider.value = 10;
rowSliderValue.textContent = rowSlider.value;

//Initialize the col slider
//var colSliderValue is the text object that says what the value of the col slider is
//var colSlider is the document object of the slider
let colSliderValue = document.querySelector("#colValue");
let colSlider = document.querySelector("#colSlider");
colSlider.value = 10;
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
    let speedValue = parseInt(event.target.value, 10); //weirdly the only casting method I could get this to work
    clearInterval(intervalId);
    intervalId = null;
    updateInterval(speedValue);
});

//Sliders for generating a random grid
let altruistSliderValue = document.querySelector("#altruistValue");
let egoistSliderValue = document.querySelector("#egoistValue");
let hooliganSliderValue = document.querySelector("#hooliganValue");
let altruistSlider = document.querySelector("#altruistSlider");
let egoistSlider = document.querySelector("#egoistSlider");
let hooliganSlider = document.querySelector("#hooliganSlider");
altruistSliderValue.textContent = altruistSlider.value.toString();
egoistSliderValue.textContent = egoistSlider.value.toString();
hooliganSliderValue.textContent = hooliganSlider.value.toString();
let sliderSelector = 0; //0 for altruist, 1 for egoist, 2 for hooligan
function updateSliders() {
    //Function to normalize all 3 sliders to add up to 100
    //It's not perfect, but it works well enough.
    let aValue = Number(altruistSlider.value);
    let eValue = Number(egoistSlider.value);
    let hValue = Number(hooliganSlider.value);

    let total = aValue + eValue + hValue;
    console.log(total);
    if (total !== 100) {
        altruistSlider.value = Math.floor((aValue / total) * 100);
        egoistSlider.value = Math.floor((eValue / total) * 100);
        hooliganSlider.value = 100 - Number(altruistSlider.value) - Number(egoistSlider.value);
    }
    altruistSliderValue.textContent = altruistSlider.value.toString();
    egoistSliderValue.textContent = egoistSlider.value.toString();
    hooliganSliderValue.textContent = hooliganSlider.value.toString();
}
//Event listener for updating the sliders
altruistSlider.addEventListener("input", () => {
    sliderSelector = 0;
    updateSliders();
});
egoistSlider.addEventListener("input", () => {
    sliderSelector = 1;
    updateSliders();
});
hooliganSlider.addEventListener("input", () => {
    sliderSelector = 2;
    updateSliders();
});

//Button to generate a random grid given the slider values
let generateButton = document.getElementById("generateButton");
generateButton.style.setProperty("background-color","#FFFFFF");
generateButton.addEventListener("click", () => {
    randomizeGameArray(altruistSlider.value,egoistSlider.value,hooliganSlider.value);
    updateCells();
});

//Event listener for when the mouse is down or not (click and drag functionality)
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
//Sets things back to the initial state on load
let resetButton = document.getElementById("resetButton");
resetButton.addEventListener("click", () => {
    gameArray = [
        ["","","","","","","","","",""],
        ["","","","","","","","","",""],
        ["","","","","","","","","",""],
        ["","","","","","","","","",""],
        ["","","","","","","","","",""],
        ["","","","","","","","","",""],
        ["","","","","","","","","",""],
        ["","","","","","","","","",""],
        ["","","","","","","","","",""],
        ["","","","","","","","","",""]
    ];
    scoreArray = [
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
    ];
    rowSlider.value = 10;
    rowSliderValue.textContent = "10";
    colSlider.value = 10;
    colSliderValue.textContent = "10";
    startRowSlider = 10;
    startColSlider = 10;endRowSlider = 10;
    endColSlider = 10;
    updateGridSize();
});

//Looping button functionality (enable / disable looping walls)
let loopWalls = 1;
let loopButton = document.getElementById("loopButton");
loopButton.style.setProperty("background-color","#c3c3c3");
loopButton.addEventListener("click", () => {
    if (loopWalls === 1){
        loopWalls = 0;
        loopButton.style.setProperty("background-color","#FFFFFF");
        return;
    }
    if (loopWalls === 0){
        loopWalls = 1;
        loopButton.style.setProperty("background-color","#c3c3c3");
    }
})
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

//Now we get into the actual code for the simulation

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

let costOfA = 1/16; //Must be less than 1/8

//This function updates the size of the grid every time it is called
function updateGridSize(){
    gridContainer.innerHTML = ''; //reset the grid
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
    if (updateID === "H") gameArray[cellRow][cellCol] = "H";
}
//Given a cell and a parameter (akin to updateID), update that cell according to the parameter.
function updateCell(cell, param){
    if (param === "A") {
        cell.classList.add("altruistCell");
        cell.classList.remove("egoistCell");
        cell.classList.remove("hooliganCell");
        cell.innerHTML = "<span><strong>A</strong></span>";
    }
    if (param === "E") {
        cell.classList.add("egoistCell");
        cell.classList.remove("altruistCell");
        cell.classList.remove("hooliganCell");
        cell.innerHTML = "<span><strong>E</strong></span>";
    }
    if (param === "H") {
        cell.classList.add("hooliganCell");
        cell.classList.remove("altruistCell");
        cell.classList.remove("egoistCell");
        cell.innerHTML = "<span><strong>H</strong></span>";
    }
    else if (param === "") {
        cell.classList.remove("altruistCell");
        cell.classList.remove("egoistCell");
        cell.classList.remove("hooliganCell");
        cell.innerHTML = "";
    }
}

//Update all of the cells on screen with the data from gameArray;
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

//Calculates the score using a score matrix
function score(mainAgent, i,j) {
    let scoreTable = [
        /*Empty*/   [-10,-10,-10,-10], //Empty cells need to have a score of < -8 otherwise they could get imitated
        /*Altruist*/[0,1-costOfA,-costOfA,-costOfA],
        /*Egoist*/  [0,1,0,-1],
        /*Hooligan*/[0,1,1,-1]
    ];
    if (i < 0 || i >= Number(rowSlider.value)) return 0;
    if (j < 0 || j >= Number(colSlider.value)) return 0;
    let neighbor = getAgent(i,j);
    let mainIndex = 0;
    let neighborIndex = 0;
    switch (mainAgent) {
        case "":
            mainIndex = 0;
            break;
        case "A":
            mainIndex = 1;
            break;
        case "E":
            mainIndex = 2;
            break;
        case "H":
            mainIndex = 3;
            break;
    }
    switch (neighbor) {
        case "":
            neighborIndex = 0;
            break;
        case "A":
            neighborIndex = 1;
            break;
        case "E":
            neighborIndex = 2;
            break;
        case "H":
            neighborIndex = 3;
            break;
    }
    return scoreTable[mainIndex][neighborIndex];

}

//Given a cell position, find the total score given to it by all its neighbors using the score function
function sumOfNeighbors(i,j) {
    //All of this stuff is to account for edge cases (literally)
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
    //Here's the actual logic for calculating it. It probably could be done in a less brute force way but this works
    return(
        score(mainAgent, iSubMod,jSubMod) +
        score(mainAgent, iSubMod,jMod) +
        score(mainAgent, iSubMod,jPlusMod)

        +   score(mainAgent, iMod,jSubMod) + //skip your own cell
        score(mainAgent, iMod,jPlusMod)

        +   score(mainAgent, iPlusMod,jSubMod) +
        score(mainAgent, iPlusMod,jMod) +
        score(mainAgent, iPlusMod,jPlusMod));
}

//Same thing as sumOfNeighbors but without the modular looping logic
function sumOfNeighborsNoLoop(i,j){
    let mainAgent = getAgent(i,j);
    return(
        score(mainAgent, i-1,j-1) +
        score(mainAgent, i-1,j) +
        score(mainAgent, i-1,j+1)

        +   score(mainAgent, i,j-1) +
        score(mainAgent, i,j+1)

        +   score(mainAgent, i+1,j-1) +
        score(mainAgent, i+1,j) +
        score(mainAgent, i+1,j+1));
}

//Updates the scoreArray for all cells
function updateScores() {
    for (let i = 0; i < rowSlider.value; i++) {
        for (let j = 0; j < colSlider.value; j++) {
            if (loopWalls){
                scoreArray[i][j] = sumOfNeighbors(i,j);
            }
            else{
                scoreArray[i][j] = sumOfNeighborsNoLoop(i,j);
            }
        }
    }
    console.log(scoreArray); //debug purposes
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
            if (loopWalls){
                tempGameArray[i][j] = imitateNeighbors(i,j);
            }
            else{
                tempGameArray[i][j] = noLoopImitate(i,j);
            }
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

    let scoreMax = -100;
    let returnAgent = getAgent(i, j);

    let bestAgents = [];
    for (let d = -1; d <= 1; d++) {
        for (let e = -1; e <= 1; e++) {
            if (d === 0 && e === 0) { //skip over your own cell
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
    return evaluateBestAgents(bestAgents, i, j);
}

//Same thing as imitateNeighbors but without the modular looping logic
function noLoopImitate(i,j) {
    let scoreMax = -100;
    let returnAgent = getAgent(i, j);
    let bestAgents = [];
    for (let d = -1; d <= 1; d++) {
        for (let e = -1; e <= 1; e++) {
            if (d === 0 && e === 0) { //skip over your own cell
                continue;
            }
            let iTemp = i + d;
            let jTemp = j + e;
            if (iTemp >= rowSlider.value || jTemp >= colSlider.value || iTemp < 0 || jTemp < 0) continue;

            if (scoreArray[iTemp][jTemp] > scoreMax) {
                scoreMax = scoreArray[iTemp][jTemp];
                returnAgent = getAgent(iTemp, jTemp);
                bestAgents = [getAgent(iTemp,jTemp)];
            } else if (scoreArray[iTemp][jTemp] === scoreMax) {
                bestAgents.push(getAgent(iTemp, jTemp));
            }
        }
    }
    if (getAgent(i,j) === "") {
        for (let a of bestAgents){
            if (a!=="") return a;
        }
    }
    return evaluateBestAgents(bestAgents, i, j);
}

function evaluateBestAgents(bestAgents, i, j){
    if (bestAgents.length === 0) {
        return getAgent(i, j);
    }
    if (bestAgents.length === 1) {
        return bestAgents[0];
    }
    if (bestAgents.length === 8) {
        return bestAgents[0];
    }
    //If there's a tie, go against the status quo. If that's not possible (all agents are the same), stick with it.
    for (let a of bestAgents){
        if (a !== getAgent(i,j)){
            return a;
        }
    }
    return getAgent(i,j);
}

//Advances the game state by one timestep
function advanceGameState(){
    updateGameArray();
    updateCells();
}

//Function for advancing the game state on a loop
function updateInterval(speed) {
    console.log("activated");
    if (running) {
        //Only start if an interval isn't already running
        if (intervalId == null) {
            intervalId = setInterval(advanceGameState, (1000/speed));
        }
    } else {
        clearInterval(intervalId);
        intervalId = null;
    }
}

//Function for randomizing the gameArray given an altruistWeight, egoistWeight, and the hooliganWeight can be inferred
function randomizeGameArray(aWeight, eWeight) {
    for (let i = 0; i < rowSlider.value; i++) {
        for (let j = 0; j < colSlider.value; j++) {
            let randomValue = Math.floor(Math.random()*100);
            if (randomValue < aWeight) {
                gameArray[i][j]="A";
            }
            else if (randomValue < Number(aWeight) + Number(eWeight)) {
                gameArray[i][j]="E";
            }
            else {
                gameArray[i][j]="H";
            }
        }
    }
}

updateGridSize(); //initial rendering on load