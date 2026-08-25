let canvas = document.querySelector('.game-container');
let borderFlag = false;
let rows;
let columns;
let gridSizeValue = 10;
let backgroundColorValue = '#FFFFFF';

function createGrid(gridSize) {
    canvas.replaceChildren();
    for (let i = 0; i < gridSize; i++) {
        let row = document.createElement('div');
        for (let i = 0; i < gridSize; i++) {
            let column = document.createElement('div');
            column.style.background = backgroundColorValue;
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
        columns.forEach(el => {
            if(el.hasAttribute('data-painted')){
                el.style.background = backgroundColorValue;
                el.style.filter = null;
                el.removeAttribute('data-shade');
                el.removeAttribute('data-painted');
                el.removeAttribute('data-shaded');
                el.removeAttribute('data-nonshaded');
                el.removeAttribute('data-rainbowed'); 
            }
        })
    }
})
// Grid Logic end

// Painting logic Start

// Function found online that convert rgba to hex, because 'window.getComputedStyle(e.target).backgroundColor' return a rgb value that input type color doesnt support
const rgbToHex = (rgb) => {
  const [r, g, b] = rgb.match(/\d+/g).map(Number);
  return `#${[r, g, b]
    .map(x => x.toString(16).padStart(2, '0'))
    .join('')}`;
};

function shade(r, g, b, amount) {
    if (amount < 0) {
        const f = 1 + amount;
        return [r * f, g * f, b * f];
    }

    return [
        r + (255 - r) * amount,
        g + (255 - g) * amount,
        b + (255 - b) * amount
    ];
}

function randomColor() {
    return '#' + Math.floor(Math.random() * 16777216)
        .toString(16)
        .padStart(6, '0');
}

let colorPicker = document.querySelector('.color-picker-container');
let colorPickerBtn = document.querySelector('.color-picker-container button');
let penColorValue = '#000000';
let currentColor = '';
let isDrawing =  false;
let picking = false;
let hoverMode = false;
let eraseMode = false;
let rainbowMode = false;
let shadingMode = false;
let lightenMode = false;

colorPicker.addEventListener('input', (e) =>{
    if (e.target.id === 'penColor') {
        picking = false;
        eraseMode = false;
        rainbowMode = false;
        shadingMode = false;
        lightenMode = false;
        arr.slice(1).forEach(el => el.classList.remove('active'));
        colorPickerBtn.classList.remove('active');
        penColorValue = e.target.value
    } else if (e.target.id === 'backColor'){
        backgroundColorValue = e.target.value;
        columns.forEach(el => {
            (el.hasAttribute("data-painted")) ? null : el.style.background = backgroundColorValue;
        })
    }
})

colorPickerBtn.onclick = () => {
    picking = !picking; 
    hoverMode = false;
    eraseMode = false;
    rainbowMode = false;
    shadingMode = false;
    lightenMode = false;
    arr.forEach(el => el.classList.remove('active'));
    colorPickerBtn.classList.toggle('active');
    canvas.classList.toggle('cursored');
}

let modeButtonCont = document.querySelector('.mode-button-container');
let arr = Array.from(modeButtonCont.children);

modeButtonCont.addEventListener('click', (e) => {
    picking = false;
    colorPickerBtn.classList.remove('active');
    canvas.classList.remove('cursored');


    if (e.target.value !== 'hover') {

        arr.slice(1).forEach(el => {
            (el.value !== e.target.value) ? el.classList.remove('active'): null;
        });
    }

    if (e.target.value === 'hover') {
        hoverMode = !hoverMode;
        e.target.classList.toggle('active');
    } else if(e.target.value === 'erase'){
        rainbowMode = false, shadingMode = false, lightenMode = false;
        eraseMode = !eraseMode;
        e.target.classList.toggle('active');
    } else if(e.target.value === 'rainbow'){
       eraseMode = false, shadingMode = false, lightenMode = false; 
       rainbowMode = !rainbowMode;
       e.target.classList.toggle('active');
    } else if(e.target.value === 'shading'){
        eraseMode = false, lightenMode = false, rainbowMode = false;
        shadingMode = !shadingMode;
        e.target.classList.toggle('active');
    } else if(e.target.value === 'lighten'){
        eraseMode = false, shadingMode = false, rainbowMode = false;
        lightenMode = !lightenMode;
        e.target.classList.toggle('active');
    }
})

canvas.onmouseup = () => {
    if(hoverMode) return;
    isDrawing = false;
};

canvas.onmouseleave = () =>{
    if(hoverMode) return;
    isDrawing = false;
}

canvas.onmousemove = (e) => {
    if (hoverMode || isDrawing) {
        if (e.target.classList.contains('column')) {
            if (eraseMode) {
                e.target.removeAttribute('data-shade');
                e.target.removeAttribute('data-painted');
                e.target.removeAttribute('data-shaded');
                e.target.removeAttribute('data-nonshaded');
                e.target.removeAttribute('data-rainbowed'); 
                e.target.style.background = backgroundColorValue;
            } else if(rainbowMode){      
                e.target.setAttribute('data-painted', ''); 
                e.target.removeAttribute('data-shade');
                e.target.removeAttribute('data-nonshaded');
                if (!e.target.hasAttribute('data-rainbowed')) {
                    e.target.style.background = randomColor();
                    e.target.setAttribute('data-rainbowed', '');  
                } else {
                    e.target.onmouseleave = () =>{
                        e.target.removeAttribute('data-rainbowed');                        
                    }
                }
            } else if (shadingMode) {
                
                if (!e.target.hasAttribute('data-shaded')) {
                    if (window.getComputedStyle(e.target).backgroundColor.includes('rgb(0, 0, 0)')) return;
                    e.target.setAttribute('data-painted', '');
                    (!e.target.hasAttribute('data-shade')) ? e.target.setAttribute('data-shade', 0) : null;
                    e.target.setAttribute('data-shaded', '');
                    e.target.dataset.shade = Math.max(Number(e.target.dataset.shade) - 0.1, -1);
                    e.target.dataset.shade = Number(e.target.dataset.shade).toFixed(1);
                    (!e.target.hasAttribute('data-nonshaded')) ? e.target.setAttribute('data-nonshaded', window.getComputedStyle(e.target).backgroundColor) : null;  
                    currentColor = e.target.dataset.nonshaded.match(/\d+/g).map(el => Number(el));
                    currentColor = shade(currentColor[0], currentColor[1], currentColor[2], Number(e.target.dataset.shade));
                    e.target.style.background = `rgb(${currentColor[0]}, ${currentColor[1]}, ${currentColor[2]})`;
                } else {
                    e.target.onmouseleave = () =>{
                        e.target.removeAttribute('data-shaded');
                        e.target.onmouseleave = null;
                    }
                }
            } else if(lightenMode) {
               
                if (!e.target.hasAttribute('data-shaded')) {
                    if (window.getComputedStyle(e.target).backgroundColor.includes('rgb(255, 255, 255)')) return;
                     e.target.setAttribute('data-painted', '');
                    (!e.target.hasAttribute('data-shade')) ? e.target.setAttribute('data-shade', 0) : null;
                    e.target.setAttribute('data-shaded', '');
                    e.target.dataset.shade = Math.min(Number(e.target.dataset.shade) + 0.1, 1);
                    e.target.dataset.shade = Number(e.target.dataset.shade).toFixed(1);
                    (!e.target.hasAttribute('data-nonshaded')) ? e.target.setAttribute('data-nonshaded', window.getComputedStyle(e.target).backgroundColor) : null;  
                    currentColor = e.target.dataset.nonshaded.match(/\d+/g).map(el => Number(el));
                    currentColor = shade(currentColor[0], currentColor[1], currentColor[2], Number(e.target.dataset.shade));
                    e.target.style.background = `rgb(${currentColor[0]}, ${currentColor[1]}, ${currentColor[2]})`;
                } else {
                    e.target.onmouseleave = () =>{
                        e.target.removeAttribute('data-shaded');
                        e.target.onmouseleave = null;
                    }
                }
            } else {
                e.target.setAttribute('data-painted', '');
                e.target.removeAttribute('data-shade');
                e.target.removeAttribute('data-nonshaded');
                e.target.style.background = penColorValue;
            }  
        }   
    }
}

canvas.onmousedown = (e) => {
    if (hoverMode) return;
    if (picking) {
        picking = false
        colorPickerBtn.classList.toggle('active'); 
        canvas.classList.toggle('cursored');        
        penColorValue = window.getComputedStyle(e.target).backgroundColor;
        colorPicker.firstElementChild.firstElementChild.value = rgbToHex(penColorValue);
        return
    }
    if(e.target.classList.contains('column')) {
        if (eraseMode) {
            e.target.removeAttribute('data-shade');
            e.target.removeAttribute('data-painted');
            e.target.removeAttribute('data-shaded');
            e.target.removeAttribute('data-nonshaded');
            e.target.removeAttribute('data-rainbowed'); 
            e.target.style.background = backgroundColorValue;
        } else if(rainbowMode){
            e.target.setAttribute('data-painted', '');
            e.target.removeAttribute('data-nonshaded');
            e.target.removeAttribute('data-shade');
            e.target.style.background = randomColor();
            e.target.setAttribute('data-rainbowed', '');
        } else if (shadingMode) {
            if (!e.target.hasAttribute('data-shaded')) {
                if(window.getComputedStyle(e.target).backgroundColor.includes('rgb(0, 0, 0)')) return;
                 e.target.setAttribute('data-painted', '');
                (!e.target.hasAttribute('data-shade')) ? e.target.setAttribute('data-shade', 0) : null;
                e.target.setAttribute('data-shaded', '');
                e.target.dataset.shade = Math.max(Number(e.target.dataset.shade) - 0.1, -1);
                e.target.dataset.shade = Number(e.target.dataset.shade).toFixed(1);
                (!e.target.hasAttribute('data-nonshaded')) ? e.target.setAttribute('data-nonshaded', window.getComputedStyle(e.target).backgroundColor) : null;              
                currentColor = e.target.dataset.nonshaded.match(/\d+/g).map(el => Number(el));            
                currentColor = shade(currentColor[0], currentColor[1], currentColor[2], Number(e.target.dataset.shade));
                e.target.style.background = `rgb(${currentColor[0]}, ${currentColor[1]}, ${currentColor[2]})`;
            } else {
                e.target.dataset.shade = Math.max(Number(e.target.dataset.shade) - 0.1, -1);
                e.target.dataset.shade = Number(e.target.dataset.shade).toFixed(1);        
                currentColor = e.target.dataset.nonshaded.match(/\d+/g).map(el => Number(el));            
                currentColor = shade(currentColor[0], currentColor[1], currentColor[2], Number(e.target.dataset.shade));
                e.target.style.background = `rgb(${currentColor[0]}, ${currentColor[1]}, ${currentColor[2]})`;
            }
        } else if (lightenMode) {
                if (!e.target.hasAttribute('data-shaded')) {
                    if (window.getComputedStyle(e.target).backgroundColor.includes('rgb(255, 255, 255)')) return;
                    e.target.setAttribute('data-painted', '');
                    (!e.target.hasAttribute('data-shade')) ? e.target.setAttribute('data-shade', 0) : null;
                    e.target.setAttribute('data-shaded', '');
                    e.target.dataset.shade = Math.min(Number(e.target.dataset.shade) + 0.1, 1);
                    e.target.dataset.shade = Number(e.target.dataset.shade).toFixed(1);
                    (!e.target.hasAttribute('data-nonshaded')) ? e.target.setAttribute('data-nonshaded', window.getComputedStyle(e.target).backgroundColor) : null;  
                    currentColor = e.target.dataset.nonshaded.match(/\d+/g).map(el => Number(el));
                    currentColor = shade(currentColor[0], currentColor[1], currentColor[2], Number(e.target.dataset.shade));
                    e.target.style.background = `rgb(${currentColor[0]}, ${currentColor[1]}, ${currentColor[2]})`;
                } else {
                    e.target.dataset.shade = Math.min(Number(e.target.dataset.shade) + 0.1, 1);
                    e.target.dataset.shade = Number(e.target.dataset.shade).toFixed(1);  
                    currentColor = e.target.dataset.nonshaded.match(/\d+/g).map(el => Number(el));
                    currentColor = shade(currentColor[0], currentColor[1], currentColor[2], Number(e.target.dataset.shade));
                    e.target.style.background = `rgb(${currentColor[0]}, ${currentColor[1]}, ${currentColor[2]})`;
                }
        } else {
            e.target.setAttribute('data-painted', '');
            e.target.removeAttribute('data-shade');
            e.target.removeAttribute('data-nonshaded');
            e.target.style.background = penColorValue;
        }
    }
    isDrawing = true;
} 




//mode button









