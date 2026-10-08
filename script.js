const col = 5;
const row = 4;
let gameArray = [
    ["1","2","3"],
    ["1","2","3"],
    ["1","2","3"],
    ["1","2","3"],
];
console.log(gameArray.length);
console.log(gameArray);

function generateTable(array2D) { //Generates a table on the HTML out of a 2d array

  let table = document.createElement("table");
  document.getElementById("tableContainer").appendChild(table);
  array2D.forEach(rowData => {
    const row = table.insertRow();

    rowData.forEach(colData => {
      const cell = row.insertCell();
      cell.textContent = colData;
    });
  });
}

generateTable(gameArray);