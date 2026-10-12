let gameArray = [
    ["1","2","3"],
    ["1","2","3"],
    ["1","2","3"],
    ["1","2","3"],
]; //unused at the moment, will be used for storing the state of the game


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

//This function updates the size of the grid every time it is called
let gridContainer = document.getElementById('gridContainer');
function updateGridSize(){
    gridContainer.innerHTML = ''; //reset the grid
    let gridTemplateRowsString = "repeat(" + rowSlider.value + ", 1fr)";
    let gridTemplateColsString = "repeat(" + colSlider.value + ", 30px)";
    gridContainer.style.setProperty("grid-template-rows", gridTemplateRowsString); //set row amount
    gridContainer.style.setProperty("grid-template-columns",gridTemplateColsString); //set column amount

    for (let i = 0; i < rowSlider.value*colSlider.value; i++) { //Generate all the cells within the grid, and make them interactive
        const cell = document.createElement("div");
        cell.classList.add('cell');

        // Anything interactive goes here:
        cell.addEventListener('click', () => {
            cell.classList.toggle('active');
            console.log(`Cell ${i} clicked`);
        });

        gridContainer.appendChild(cell);
    }
}

updateGridSize(); //initial rendering on load



