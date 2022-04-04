// initialises sudokuNumbers to 9x9 grid
let darkTheme = false;
let timer = new Timer(document.querySelector("#timer"));
let toast= new Toast(document.querySelector("#toast"))
let sudokuBoard= new SudokuBoard(timer,
    document.querySelector("#new"),
    document.querySelector("#verify"),
    document.querySelector("#solve"),
    document.querySelector("#submit"),
    document.querySelector(".sudokuBoard"),
    document.querySelector("#newMenu"),
    toast
    );


let veryEasyButton=document.querySelector("#veryEasy")
let veryEasyButtonObject= new Button(veryEasyButton, ()=>{
    sudokuBoard.newGeneratedSudoku(72)
})

let easyButton=document.querySelector("#easy")
let easyButtonObject= new Button(easyButton, ()=>{
    sudokuBoard.newGeneratedSudoku(55)
})

let mediumButton=document.querySelector("#medium")
let mediumButtonObject= new Button(mediumButton, ()=>{
    sudokuBoard.newGeneratedSudoku(42)
})

let hardButton=document.querySelector("#hard")
let hardButtonObject= new Button(hardButton, ()=>{
    sudokuBoard.newGeneratedSudoku(35)
})

let cellsInput=document.querySelector("#cellsInput")
let cellsInputObject= new Button(cellsInput, ()=>{
    if(cellsInput.value<81&&cellsInput.value>27){
        sudokuBoard.newGeneratedSudoku(cellsInput.value)
    }
    else{
        toast.activate("Please Enter A Number Between 28 and 80")
    }
})

let inputButton=document.querySelector("#input")
let inputButtonObject= new Button(inputButton, ()=>{
    sudokuBoard.changeMode(sudokuBoard.modes.Creating)
})

let newMenu = new NewMenu([veryEasyButtonObject,easyButtonObject,mediumButtonObject,hardButtonObject,cellsInputObject,inputButtonObject])

let goButton=document.querySelector("#go")
goButton.addEventListener('click', ()=>{
    newMenu.activateButton()
});

let generateButton = document.querySelector("#new");
generateButton.addEventListener('click', ()=>{
    sudokuBoard.changeMode(sudokuBoard.modes.newMenu)
});

let solveButton = document.querySelector("#solve");
solveButton.addEventListener('click', ()=>{
    let sudoku = sudokuBoard.extractLockedValues();
    let solution = sudokuBoard.solveSudoku(sudoku);
    if (solution !== "M" && solution !== "U") {
        sudokuBoard.updateAllSquares(solution,false);
    }
    sudokuBoard.changeMode(sudokuBoard.modes.SolvedIncorrectly)
});

let verifyButton = document.querySelector("#verify");
verifyButton.addEventListener('click', ()=>{
    sudokuBoard.validateSquares();
});

let submitButton=document.querySelector("#submit");
submitButton.addEventListener('click',()=>{
    sudokuBoard.submit();
})
//submitButton.addEventListener



document.addEventListener('keyup', sudokuBoard.keyUp.bind(sudokuBoard));
let darkThemeButton = document.querySelector("#darktheme");
darkThemeButton.addEventListener('click', toggleDarkTheme);

let exitButton=document.querySelector("#exit");
exitButton.addEventListener('click', ()=>{
    sudokuBoard.changeMode(sudokuBoard.previousMode)
});

let okButton=document.querySelector("#ok");
okButton.addEventListener('click', ()=>{
    toast.deactivate()
});


function toggleDarkTheme() {
    let bodyElement = document.querySelector("body");
    if (darkTheme) {
        bodyElement.classList.remove("darkTheme");
        bodyElement.classList.add("lightTheme");
    }
    else {
        bodyElement.classList.add("darkTheme");
        bodyElement.classList.remove("lightTheme");
    }
    darkTheme = !darkTheme;
}


function testTime(cellsRemaining) {
    timeArrays = [];
    for (let i = 0; i < 100; i++) {
        t1 = performance.now();
        generateSudoku(cellsRemaining);
        t2 = performance.now();
        timeArrays.push(t2 - t1);
    }

    const average = (array) => array.reduce((a, b) => a + b) / array.length;
    console.log("Testing with " + cellsRemaining + " cells remaining");
    console.log("Average Time=" + Math.floor(average(timeArrays)) + "ms");
    console.log("Min time=" + Math.floor(timeArrays.min()) + "ms");
    console.log("Max time=" + Math.floor(timeArrays.max()) + "ms");
}
