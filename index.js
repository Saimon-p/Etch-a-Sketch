let canvas = document.querySelector('.game-container');
let borderFlag = false;
let rows;
let columns;
let gridSizeValue = 10;

function createGrid(gridSize) {
    canvas.replaceChildren();
    for (let i = 0; i < gridSize; i++) {
        let row = document.createElement('div');
        for (let i = 0; i < gridSize; i++) {
            let column = document.createElement('div');
            column.classList.add('column');
            row.appendChild(column);
        }
        row.classList.add('row');
        canvas.appendChild(row);
    }
    rows = document.querySelectorAll('.row');
    columns = document.querySelectorAll('.column');
    if(borderFlag) {
        rows.forEach(el => el.classList.add('row-bordered'));
        columns.forEach(el => el.classList.add('column-bordered'));
    }
}

createGrid(gridSizeValue);

let gridSize = document.querySelector('#grid-size-input');
let sizeSpan = document.querySelectorAll('.grid-button-container label span');

gridSize.addEventListener('input', (e) => {
    gridSizeValue = e.target.value;
    createGrid(gridSizeValue);
    sizeSpan.forEach(el => el.textContent = gridSizeValue);
})

let GridButtonContainer = document.querySelector('.grid-button-container');

GridButtonContainer.addEventListener('click', (e) => {
    if(e.target.nodeName !== 'BUTTON') return;
    
    if (e.target.value === 'gridLines') {
        borderFlag = !borderFlag;      
        e.target.classList.toggle('active');
        rows.forEach(el => el.classList.toggle('row-bordered'));
        columns.forEach(el => el.classList.toggle('column-bordered'));
    } else if (e.target.value === 'clear'){
        createGrid(gridSizeValue);
    }
})
// Grid Logic end

// Painting logic Start

let penColor = document.querySelector('#penColor');
let penColorValue = '#000000';
let isDrawing =  false;


penColor.addEventListener('input', (e) => {
    penColorValue = e.target.value;
}) 

canvas.addEventListener('mousedown', () => {isDrawing = true;})

canvas.addEventListener('mouseup', (e) =>{isDrawing = false;})

canvas.addEventListener('mousemove', (e) =>{
    if (isDrawing) {        
        if(e.target.classList.value === 'column' || e.target.classList.value === 'column column-bordered'){            
            e.target.style.background = penColorValue;
        }
    }
})



