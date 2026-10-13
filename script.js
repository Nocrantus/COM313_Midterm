

let gameArray = [
    ["","",""],
    ["","",""],
    ["","",""],
]; //unused at the moment, will be used for storing the state of the game

//Initialize grid container
let gridContainer = document.getElementById('gridContainer');

//Initialize the buttons
let altruistButton = document.getElementById("altruistButton");
let egoistButton = document.getElementById("egoistButton");
let hooliganButton = document.getElementById("hooliganButton");
altruistButton.style.setProperty("background-color","#d3d3d3");
egoistButton.style.setProperty("background-color","#FFFFFF");
hooliganButton.style.setProperty("background-color","#FFFFFF");

//Global variable for determining which agent to update the cell with
let updateID = "A";

altruistButton.addEventListener("click", () => {
    console.log("Altruist mode engaged");
    updateID = "A";
    altruistButton.style.setProperty("background-color","#d3d3d3");
    egoistButton.style.setProperty("background-color","#FFFFFF");
    hooliganButton.style.setProperty("background-color","#FFFFFF");
});
egoistButton.addEventListener("click", () => {
    console.log("Egoist mode engaged");
    updateID = "E";
    altruistButton.style.setProperty("background-color","#FFFFFF");
    egoistButton.style.setProperty("background-color","#d3d3d3");
    hooliganButton.style.setProperty("background-color","#FFFFFF");
});
hooliganButton.addEventListener("click", () => {
    console.log("Hooligan mode engaged");
    updateID = "H";
    altruistButton.style.setProperty("background-color","#FFFFFF");
    egoistButton.style.setProperty("background-color","#FFFFFF");
    hooliganButton.style.setProperty("background-color","#d3d3d3");
});

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
    updateGridSize();
});

//Event listener for updating the column slider
colSlider.addEventListener("input", (event) => {
    colSliderValue.textContent = event.target.value;
    updateGridSize();
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
    updateGridSize(); //Currently just deletes the grid and re-draws it.
    //When the gameArray is connected to the cells, this won't work.
    // we'll need a function to clear the gameArray instead y
});

//This function updates the size of the grid every time it is called
function updateGridSize(){
    gridContainer.innerHTML = ''; //reset the grid
    gridContainer.style.setProperty("top", 15*(15-rowSlider.value) + "px");
    let gridTemplateRowsString = "repeat(" + rowSlider.value + ", 1fr)";
    let gridTemplateColsString = "repeat(" + colSlider.value + ", 30px)";
    gridContainer.style.setProperty("grid-template-rows", gridTemplateRowsString); //set row amount
    gridContainer.style.setProperty("grid-template-columns",gridTemplateColsString); //set column amount

    for (let i = 0; i < rowSlider.value*colSlider.value; i++) { //Generate all the cells within the grid, and make them interactive
        const cell = document.createElement("div");
        cell.classList.add('cell');

        // Anything interactive goes here:

        cell.addEventListener("mouseover", (e) => { //For dragging functionality
            e.preventDefault(); //prevents browser from thinking we're dragging the cell around
            console.log("entered a cell");
            if (mouseDown){
                updateCell(cell);
                console.log(`Cell clicked`);
            }
        });
        cell.addEventListener("mousedown", (e) => { //For clicking functionality
            e.preventDefault(); //prevents browser from thinking we're dragging the cell around
            updateCell(cell);
            console.log(`Cell clicked`);
        })

        gridContainer.appendChild(cell);
    }
}

//according to the variable updateID, update the cell that's being clicked on
function updateCell(cell) {
    if (updateID === "A") {
        cell.classList.add("altruistCell");
        cell.classList.remove("egoistCell");
        cell.classList.remove("hooliganCell");
        cell.innerHTML = "<span><strong>A</strong></span>";
    }
    if (updateID === "E") {
        cell.classList.add("egoistCell");
        cell.classList.remove("altruistCell");
        cell.classList.remove("hooliganCell");
        cell.innerHTML = "<span><strong>E</strong></span>";
    }
    if (updateID === "H") {
        cell.classList.add("hooliganCell");
        cell.classList.remove("altruistCell");
        cell.classList.remove("egoistCell");
        cell.innerHTML = "<span><strong>H</strong></span>";
    }
}

updateGridSize(); //initial rendering on load



