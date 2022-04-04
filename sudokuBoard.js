class SudokuBoard {
    constructor(timer, newButton, verifyButton, solveButton, submitButton, sudokuBoard, newMenu, toast) {
        this.modes = {
            Solving: "Solving",
            SolvedCorrectly: "SolvedCorrectly",
            SolvedIncorrectly: "SolvedIncorrectly",
            Creating: "Creating",
            SolvingAndVerified: "SolvingAndVerified",
            newMenu: "NewMenu"
        }
        this.newButton = newButton;
        this.verifyButton = verifyButton;
        this.solveButton = solveButton;
        this.submitButton = submitButton;
        this.sudokuBoard = sudokuBoard;
        this.newMenu = newMenu;
        this.timer = timer;
        this.candidateNumbersButton = this.extractCandidateNumbersButton();
        this.squareList = this.generateSquares(this.create9x9Array(0));
        this.circleList = this.generateCircles();
        this.selectedType = "None";
        this.mode = this.modes.Solving;
        this.previousMode = this.modes.Solving;
        this.toast = toast
        this.changeMode(this.modes.Solving)
        this.updateAllSquares(this.generateSudoku(32), true);
    }
    submit() {
        if (this.countValues(this.extractValues()) < 28) {
            this.toast.activate("Please Enter At Least 28 Numbers")
        }
        else if (this.sudokuIsImpossible(this.extractValues())){
            this.toast.activate("Please Enter A Valid Sudoku")
        }
        else {
            let solveAttempt = this.solveSudoku(this.extractValues())
            if (solveAttempt === "U") {
                this.toast.activate("This Sudoku Has No Solutions")
            }
            else if (solveAttempt === "M") {
                this.toast.activate("This Sudoku Has Multiple Solutions")
            }
            else {
                for (var i = 0; i < 9; i++) {
                    for (var j = 0; j < 9; j++) {
                        if (this.squareList[i][j].value !== 0) {
                            this.squareList[i][j].lock()
                        }
                    }
                }
                this.changeMode(this.modes.Solving)
            }
        }
    }
    newGeneratedSudoku(cellsRemaining) {
        this.changeMode(this.modes.Solving)
        this.resetSquares()
        this.updateAllSquares(this.generateSudoku(cellsRemaining), true);
        this.changeMode(this.modes.Solving)
        this.timer.seconds = 0
    }
    validateSquares() {
        let sudoku = this.extractLockedValues();
        let solution = this.solveSudoku(sudoku);
        for (var i = 0; i < 9; i++) {
            for (var j = 0; j < 9; j++) {
                if (this.squareList[i][j].value !== solution[i][j] && this.squareList[i][j].value !== 0) {
                    this.squareList[i][j].setIncorrect(true);
                }
            }
        }
        this.changeMode(sudokuBoard.modes.SolvingAndVerified)
    }
    checkComplete() {
        let sudokuPassed = true
        for (var i = 0; i < 9; i++) {
            for (var j = 0; j < 9; j++) {
                if (this.squareList[i][j].value === 0) {
                    sudokuPassed = false
                }
            }
        }
        if (sudokuPassed) {
            let sudoku = this.extractValues();
            if (!this.sudokuIsImpossible(sudoku)) {
                this.setUnlockedCellsToCorrect();
                this.changeMode(this.modes.SolvedCorrectly)
                this.lockAllSquares()
            }
        }
    }
    resetSquares() {
        for (var i = 0; i < 9; i++) {
            for (var j = 0; j < 9; j++) {
                this.squareList[i][j].reset()
            }
        }
    }
    lockAllSquares() {
        for (var i = 0; i < 9; i++) {
            for (var j = 0; j < 9; j++) {
                this.squareList[i][j].lock()
            }
        }
    }
    unlockAllSquares() {
        for (var i = 0; i < 9; i++) {
            for (var j = 0; j < 9; j++) {
                this.squareList[i][j].unlock()
            }
        }
    }
    changeMode(mode) {
        if (this.mode !== this.modes.newMenu) {
            this.previousMode = this.mode
        }
        this.mode = mode
        this.verifyButton.classList.remove("displayNone")
        this.solveButton.classList.remove("displayNone")
        this.submitButton.classList.remove("displayNone")
        this.newButton.classList.remove("displayNone")
        if (this.mode == this.modes.newMenu) {
            this.sudokuBoard.classList.add("displayNone")
            this.newMenu.classList.remove("displayNone")
        }
        else {
            this.sudokuBoard.classList.remove("displayNone")
            this.newMenu.classList.add("displayNone")
        }
        if (this.mode == this.modes.SolvedCorrectly || this.mode == this.modes.SolvedIncorrectly || this.mode == this.modes.Creating) {
            this.verifyButton.classList.add("displayNone")
            this.solveButton.classList.add("displayNone")
        }
        if (this.mode !== this.modes.Creating) {
            this.submitButton.classList.add("displayNone")
        }
        if (this.mode == this.modes.Creating) {
            this.resetSquares()
            timer.seconds = 0
            timer.setCompleted()
        }
        if (this.mode == this.modes.Solving) {
            timer.setActive()
        }
        if (this.mode == this.modes.SolvedIncorrectly || this.mode == this.modes.SolvingAndVerified) {
            timer.setFailed()
        }
        if (this.mode == this.modes.SolvedCorrectly) {
            timer.setCompleted()
        }
        if (this.mode == this.modes.Creating) {
            this.updateAllSquares(this.create9x9Array(0), true);
            this.unlockAllSquares();
        }
    }
    create9x9Array(value) {
        let tempArray = [];
        for (var i = 0; i < 9; i++) {
            tempArray[i] = [];
            for (var j = 0; j < 9; j++) {
                tempArray[i][j] = value;
            }
        }
        return tempArray;
    }
    generateSquares(sudokuNumbers) {
        let squareList = [];
        for (var i = 0; i < 9; i++) {
            squareList[i] = [];
        }
        for (let tempLargeRow = 0; tempLargeRow < 3; tempLargeRow++) {
            //Generate Squares
            let newLargeRow = document.createElement('div');
            newLargeRow.classList.add('largeRow', 'row');
            this.sudokuBoard.appendChild(newLargeRow);
            for (let tempLargeSquare = 0; tempLargeSquare < 3; tempLargeSquare++) {
                let newLargeSquare = document.createElement('div');
                newLargeSquare.classList.add('largeSquare', 'square');
                newLargeRow.appendChild(newLargeSquare);
                for (let tempSmallRow = 0; tempSmallRow < 3; tempSmallRow++) {
                    let newSmallRow = document.createElement('div');
                    newSmallRow.classList.add('smallRow', 'row');
                    newLargeSquare.appendChild(newSmallRow);
                    for (let tempSmallSquare = 0; tempSmallSquare < 3; tempSmallSquare++) {
                        let newSmallSquare = document.createElement('div');
                        newSmallSquare.classList.add('smallSquare', 'square');
                        if ((tempLargeSquare * 3 + tempSmallSquare + tempLargeRow * 3 + tempSmallRow) % 2) {
                            newSmallSquare.classList.add('smallSquareChecker1');
                        }
                        else {
                            newSmallSquare.classList.add('smallSquareChecker2');
                        }
                        newSmallRow.appendChild(newSmallSquare);
                        let numberHover = document.createElement('div');
                        numberHover.classList.add('numberHover');
                        newSmallSquare.appendChild(numberHover);

                        let numberDisplay = document.createElement('span');
                        numberDisplay.classList.add('numberDisplay');
                        numberHover.appendChild(numberDisplay);
                        let newCandidateNumberHolder = document.createElement('div');
                        newCandidateNumberHolder.classList.add('candidateNumberHolder');
                        numberHover.appendChild(newCandidateNumberHolder);
                        for (let i = 1; i < 10; i++) {
                            let newCandidateNumber = document.createElement('span');
                            newCandidateNumber.classList.add('candidateNumber');
                            newCandidateNumberHolder.appendChild(newCandidateNumber);
                            newCandidateNumber.innerHTML = i;
                        }
                        let newSquare = new Square(newSmallSquare, sudokuNumbers[tempLargeSquare * 3 + tempSmallSquare][tempLargeRow * 3 + tempSmallRow], true, this);
                        //newSmallSquare.squareObject = newSquare;
                        newSmallSquare.addEventListener('click', newSquare.clickListener.bind(newSquare));
                        squareList[tempLargeSquare * 3 + tempSmallSquare][tempLargeRow * 3 + tempSmallRow] = newSquare;
                    }
                }
            }
        }
        return squareList;
    }
    generateCircles() {
        let circleList = [];
        const CirclesInner = ["1", "2", "3", "4", "5", "6", "7", "8", "9",
            `<svg id="binIcon" xmlns="http://www.w3.org/2000/svg" width="0.9em" height="0.9em" fill="black" class="bi bi-trash-fill" viewBox="0 0 16 16">
         <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
       </svg>`];
        const CirclesInnerValues = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
        const CirclesKeyPress = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
        let rightCircleHolder = document.querySelector(".circleHolder")
        for (let circle = 0; circle < 10; circle++) {
            //Generate Squares
            let newCircle = document.createElement('div');
            newCircle.classList.add('circle');
            let newSpan = document.createElement('span');
            newSpan.classList.add("innerCircle");
            newSpan.innerHTML = CirclesInner[circle];
            newCircle.appendChild(newSpan);
            rightCircleHolder.appendChild(newCircle);
            let newCircleObject = new Circle(newCircle, CirclesInnerValues[circle], CirclesKeyPress[circle], this)
            newCircle.circleObject = newCircleObject;
            newCircle.addEventListener('click', newCircleObject.clickListener.bind(newCircleObject));
            circleList.push(newCircleObject);
        }
        return circleList;
    }
    extractCandidateNumbersButton() {
        let candidateNumbersButton = document.querySelector(".candidateNumbersButton");
        let newClickable = new Circle(candidateNumbersButton, null, "candidateNumbersButtonSelected", this);
        candidateNumbersButton.addEventListener('click', this.candidateNumbersButtonClicked.bind(this));
        return newClickable;
    }
    candidateNumbersButtonClicked() {
        if (!this.candidateNumbersButton.selected) {
            this.candidateNumbersButton.select();
        }
        else {
            this.candidateNumbersButton.deselect();
        }
    }
    updateAllSquares(sudoku, lockNumbers) {
        for (var i = 0; i < 9; i++) {
            for (var j = 0; j < 9; j++) {
                let oldValue = this.squareList[i][j].value;
                this.squareList[i][j].updateValue(sudoku[i][j], false);
                if (lockNumbers && this.squareList[i][j].value !== 0) {
                    this.squareList[i][j].lock();
                }
                else if (oldValue !== this.squareList[i][j].value) {
                    if (!this.squareList[i][j].correct) {
                        this.squareList[i][j].unlock();
                    }
                }
                if (oldValue !== this.squareList[i][j].value && this.squareList[i][j].value !== 0 && (!this.squareList[i][j].locked || lockNumbers)) {
                    this.squareList[i][j].flashSelect();
                }
            }
        }
    }
    extractLockedValues() {
        let sudoku = []
        for (var i = 0; i < 9; i++) {
            sudoku[i] = [];
            for (var j = 0; j < 9; j++) {
                if (this.squareList[i][j].locked) {
                    sudoku[i][j] = this.squareList[i][j].value;
                }
                else {
                    sudoku[i][j] = 0;
                }
            }
        }
        return sudoku;
    }
    extractValues() {
        let sudoku = []
        for (var i = 0; i < 9; i++) {
            sudoku[i] = [];
            for (var j = 0; j < 9; j++) {
                sudoku[i][j] = this.squareList[i][j].value;

            }
        }
        return sudoku;
    }
    clone2DArray(array) {
        let newArray = [];
        for (let i = 0; i < array.length; i++) {
            newArray[i] = array[i].slice();
        }
        return newArray;
    }
    generateRandInt(max, min) {
        //max is exclusive
        return Math.floor(Math.random() * (max - min)) + min;
    }
    removeNthItemFromSudoku(sudoku, n) {
        let count = 0;
        let tempSudoku = this.clone2DArray(sudoku);
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (sudoku[i][j]) {
                    if (count === n) {
                        tempSudoku[i][j] = 0;
                    }
                    count += 1;
                }
            }
        }
        return tempSudoku;
    }
    countValues(sudoku) {
        let count = 0;
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (sudoku[i][j]) {
                    count += 1;
                }
            }
        }
        return count;
    }
    generateSudoku(cellsRemaining = 71, sudoku = 0) {
        if (sudoku === 0) {
            sudoku = this.generateFullSudoku()
        }

        let solveAttempt = this.solveSudoku(sudoku);
        if (solveAttempt === "U" || solveAttempt === "M") {
            return "U";
        }
        if (this.countValues(sudoku) <= cellsRemaining) {
            return sudoku
        }
        let tempSudoku = this.clone2DArray(sudoku);
        let sequence = this.randomiseSequence(this.createOrderedArray(this.countValues(sudoku)));
        for (let digitIndex = 0; digitIndex < sequence.length; digitIndex++) {
            let newSudoku = this.removeNthItemFromSudoku(tempSudoku, sequence[digitIndex]);
            let generateAttempt = this.generateSudoku(cellsRemaining, newSudoku);
            if (generateAttempt !== "U") {
                return generateAttempt;
            }
        }

        return "U";
    }
    solveSudoku(sudoku) {
        if (this.sudokuIsImpossible(sudoku)) {
            return "U";
        }
        let solvedSudoku = 0;
        let solutionsFound = 0;
        let tempSudoku = this.clone2DArray(sudoku);
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (tempSudoku[i][j] === 0) {
                    for (let digitAttempt = 1; digitAttempt < 10; digitAttempt++) {
                        tempSudoku[i][j] = digitAttempt;
                        let solveAttempt = this.solveSudoku(tempSudoku);
                        if (solveAttempt === "U") { }
                        else {
                            solvedSudoku = solveAttempt
                            solutionsFound += 1
                            if (solutionsFound > 1) {
                                return "M"
                            }
                        }
                    }
                    if (solutionsFound == 0) {
                        return "U"
                    }
                    return solvedSudoku;
                }
            }
        }
        return tempSudoku
    }
    generateFullSudoku(sudoku = false) {
        if (sudoku === false) {
            sudoku = this.create9x9Array(0);
        }
        if (this.sudokuIsImpossible(sudoku)) {
            return "U";
        }
        let tempSudoku = this.clone2DArray(sudoku);
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (tempSudoku[i][j] === 0) {
                    let digits = this.generateRandom9DigitSequence();
                    for (let digitIndex = 0; digitIndex < 9; digitIndex++) {
                        tempSudoku[i][j] = digits[digitIndex];
                        let generateAttempt = this.generateFullSudoku(tempSudoku);
                        if (generateAttempt !== "U") {
                            return generateAttempt;
                        }
                    }
                    return "U";
                }
            }
        }
        return tempSudoku;
    }
    checkIfNumbersCanBeFilled(sudoku) {
        for (var digit = 1; digit < 10; digit++) {
            let spacesForValues = 0;
            let digitsAlreadyFilled = 0;
            let possibleSquaresForDigits = this.create9x9Array(true);
            for (var i = 0; i < 9; i++) {
                for (var j = 0; j < 9; j++) {
                    if (sudoku[i][j] === digit) {
                        for (let k = 0; k < 9; k++) {
                            //remove row from pool
                            possibleSquaresForDigits[i][k] = false;
                            //remove column from pool
                            possibleSquaresForDigits[k][j] = false;
                            //remove box from pool
                            boxOfDigits = Math.floor(i / 3) * 3 + Math.floor(j / 3);
                            possibleSquaresForDigits[Math.floor(boxOfDigits / 3) * 3 + Math.floor(k / 3)][(boxOfDigits % 3) * 3 + k % 3] = false;
                        }
                    }
                }
            }
            for (var i = 0; i < 9; i++) {
                for (var j = 0; j < 9; j++) {
                    if (sudoku[i][j] == digit) {
                        digitsAlreadyFilled += 1;
                    }
                    if (possibleSquaresForDigits[i][j]) {
                        spacesForValues += 1;
                    }
                }
            }
            if (spacesForValues + digitsAlreadyFilled < 9) {
                return false;
            }
        }
        return true;
    }
    createOrderedArray(range) {
        let newArray = [];
        for (let i = 0; i < range; i++) {
            newArray.push(i);
        }
        return newArray;
    }
    generateRandom9DigitSequence() {
        const unorderedSequence = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        return this.randomiseSequence(unorderedSequence);
    }
    randomiseSequence(sequence) {
        let randomisedSequence = [];
        let tempSequence = sequence.slice();
        for (let i = 0; i < sequence.length; i++) {
            let sequenceIndex = this.generateRandInt(0, tempSequence.length);
            randomisedSequence.push(tempSequence[sequenceIndex]);
            tempSequence.splice(sequenceIndex, 1);
        }
        return randomisedSequence;
    }
    sudokuIsImpossible(sudoku) {
        //check rows
        for (let row = 0; row < 9; row++) {
            let digits = [];
            for (let i = 0; i < 9; i++) {
                if (digits.indexOf(sudoku[row][i]) !== -1 && sudoku[row][i] !== 0) {
                    return true;
                }
                digits.push(sudoku[row][i]);
            }
        }
        //check colums
        for (let column = 0; column < 9; column++) {
            let digits = []
            for (let i = 0; i < 9; i++) {
                if (digits.indexOf(sudoku[i][column]) !== -1 && sudoku[i][column] !== 0) {
                    return true;
                }
                digits.push(sudoku[i][column]);
            }
        }
        //check boxes
        for (let box = 0; box < 9; box++) {
            let digits = []
            for (let i = 0; i < 9; i++) {
                if (digits.indexOf(sudoku[Math.floor(box / 3) * 3 + Math.floor(i / 3)][(box % 3) * 3 + i % 3]) !== -1 && sudoku[Math.floor(box / 3) * 3 + Math.floor(i / 3)][(box % 3) * 3 + i % 3] !== 0) {
                    return true;
                }
                digits.push(sudoku[Math.floor(box / 3) * 3 + Math.floor(i / 3)][(box % 3) * 3 + i % 3]);
            }
        }
        return false;
    }
    deselectCircles() {
        for (let i = 0; i < 10; i++) {
            if (this.circleList.length > 8) {
                this.circleList[i].deselect()
            }
        }
    }
    deselectSquares() {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (this.squareList.length > 8) {
                    this.squareList[i][j].deselect()
                }

            }
        }
    }
    keyUp(e) {
        if (e.key === " ") {
            if (!this.candidateNumbersButton.selected) {
                this.candidateNumbersButton.select();
            }
            else {
                this.candidateNumbersButton.deselect();
            }
        }
        if (this.selectedType === "Square") {
            let selectedSquareColumn = 0;
            let selectedSquareRow = 0;
            let selected = false;
            for (let i = 0; i < 9; i++) {
                for (let j = 0; j < 9; j++) {
                    if (this.squareList[i][j].selected) {
                        selectedSquareColumn = i;
                        selectedSquareRow = j;
                    }
                }
            }
            switch (e.key) {
                case "ArrowRight":
                    while (!selected && selectedSquareRow !== 9) {
                        while (selectedSquareColumn !== 8 && !selected) {
                            if (!this.squareList[selectedSquareColumn + 1][selectedSquareRow].locked) {
                                this.deselectSquares();
                                this.deselectCircles();
                                selected = true;
                                this.squareList[selectedSquareColumn + 1][selectedSquareRow].select();
                            }
                            selectedSquareColumn++;
                        }
                        selectedSquareRow++;
                        selectedSquareColumn = -1;
                    }
                    break;
                case "ArrowLeft":
                    while (!selected && selectedSquareRow !== -1) {
                        while (selectedSquareColumn !== 0 && !selected) {
                            if (!this.squareList[selectedSquareColumn - 1][selectedSquareRow].locked) {
                                this.deselectSquares();
                                this.deselectCircles();
                                selected = true;
                                this.squareList[selectedSquareColumn - 1][selectedSquareRow].select();
                            }
                            selectedSquareColumn--;
                        }
                        selectedSquareRow--;
                        selectedSquareColumn = 9;
                    }
                    break;
                case "ArrowUp":
                    while (!selected && selectedSquareColumn !== -1) {
                        while (selectedSquareRow !== 0 && !selected) {
                            if (!this.squareList[selectedSquareColumn][selectedSquareRow - 1].locked) {
                                this.deselectSquares();
                                this.deselectCircles();
                                selected = true;
                                this.squareList[selectedSquareColumn][selectedSquareRow - 1].select();
                            }
                            selectedSquareRow--;
                        }
                        selectedSquareColumn--;
                        selectedSquareRow = 9;
                    }
                    break;
                case "ArrowDown":
                    while (!selected && selectedSquareColumn !== 9) {
                        while (selectedSquareRow !== 8 && !selected) {
                            if (!this.squareList[selectedSquareColumn][selectedSquareRow + 1].locked) {
                                this.deselectSquares();
                                this.deselectCircles();
                                selected = true;
                                this.squareList[selectedSquareColumn][selectedSquareRow + 1].select();
                            }
                            selectedSquareRow++;
                        }
                        selectedSquareColumn++;
                        selectedSquareRow = -1;
                    }
                    break;
                case "Enter":
                    this.squareList[selectedSquareColumn][selectedSquareRow].deselect();
                default:
                    for (let i = 0; i < this.circleList.length; i++) {
                        if (this.circleList[i].keypress === e.key) {
                            this.circleList[i].clickListener();
                        }
                    }
            }
        }
        else {
            switch (e.key) {
                case "ArrowRight":
                case "ArrowLeft":
                case "ArrowUp":
                case "ArrowDown":
                    let selectedSquareColumn = -1;
                    let selectedSquareRow = 0;
                    let selected = false;
                    while (!selected && !selectedSquareRow !== 8) {
                        while (selectedSquareColumn !== 8 && !selected) {
                            if (!this.squareList[selectedSquareColumn + 1][selectedSquareRow].locked) {
                                this.deselectSquares();
                                this.deselectCircles();
                                selected = true;
                                this.squareList[selectedSquareColumn + 1][selectedSquareRow].select();
                            }
                            selectedSquareColumn++;
                        }
                        selectedSquareRow++;
                        selectedSquareColumn = -1;
                    }
                    break;
            }
        }
    }
    setUnlockedCellsToCorrect() {
        for (var i = 0; i < 9; i++) {
            for (var j = 0; j < 9; j++) {
                this.squareList[i][j].setCorrect(!this.squareList[i][j].locked)

            }
        }
    }
}