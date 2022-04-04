class Square {
    constructor(element, value, locked = false, sudokuBoard) {
        this.sudokuBoard = sudokuBoard
        this.element = element
        this.value = value
        this.candidateNumbers = [false, false, false, false, false, false, false, false, false];
        this.locked = locked;
        this.updateValue();
        this.correct=false;
        this.incorrect=false;
        this.updateCandidateNumbers();
        if (locked && value !== 0) { this.lock(); }
        else { this.unlock(); }
    }
    reset(){
        this.setCorrect(false)
        this.setIncorrect(false)
        this.unlock()
        this.resetCandidateNumbers()
    }
    setCorrect(newValue){
        this.correct=newValue
        if(this.correct){
            this.element.classList.add("correct")
            this.lock()
        }
        else{
            this.element.classList.remove("correct")
        }
    }
    setIncorrect(newValue){
        this.incorrect=newValue
        if(this.incorrect){
            this.element.classList.add("incorrect")
        }
        else{
            this.element.classList.remove("incorrect")
        }
    }
    clickListener() {
        if (!this.locked) {
            if (this.sudokuBoard.selectedType !== "Circle") {
                if (this.selected) {
                    this.sudokuBoard.deselectSquares();
                    this.deselect();
                }
                else {
                    this.sudokuBoard.deselectSquares();
                    this.select();
                }
            }
            else {
                for (let i of this.sudokuBoard.circleList) {
                    if (i.selected) {
                        this.updateValue(i.value, true);
                        this.flashSelect();
                    }
                }
            }
        }
    }
    lock() {
        this.locked = true;
        this.element.classList.add("locked");
    }
    unlock() {
        this.locked = false;
        this.element.classList.add("locked");
        if(this.sudokuBoard.mode!==this.sudokuBoard.modes.Creating){
            this.element.classList.remove("locked");
        }
    }
    select() {
        this.sudokuBoard.selectedType="Square"
        this.selected = true;
        this.element.classList.add("selected");
    }
    deselect() {
        this.element.classList.remove("selected");
        this.sudokuBoard.selectedType="None"
        this.selected = false;
    }
    flashSelect() {
        this.element.classList.add("selected");
        setTimeout(() => {
            this.element.classList.remove("selected");
            this.selected = false;
        }, 500);
    }
    updateValue(value, toggle) {
        this.setIncorrect(false)
        let old=this.value;
        if (this.sudokuBoard.candidateNumbersButton.selected) {
            if (value === 0) {
                this.resetCandidateNumbers();
            }
            if (value) {
                this.value = 0;
            }
            this.candidateNumbers[value - 1] = !this.candidateNumbers[value - 1];
        }
        else {
            if (value || value === 0) {
                if (value === this.value && toggle) { this.value = 0; }
                else { this.value = value;}
                this.resetCandidateNumbers();
            }
            
            if (this.value === 0) { this.element.children[0].children[0].innerHTML = ""; }
            else{
                this.element.children[0].children[0].innerHTML = this.value;
                if(this.value!==old){
                if(this.sudokuBoard){this.sudokuBoard.checkComplete();}
                }
            }
        }
        this.updateCandidateNumbers();
        
    }
    resetCandidateNumbers() {
        for (let i = 0; i < 9; i++) {
            this.candidateNumbers[i] = false;
        }
        this.updateCandidateNumbers();
    }
    updateCandidateNumbers(toggleDigit) {
        if (toggleDigit) {
            this.value = 0;
            this.candidateNumbers[toggleDigit - 1] = !this.candidateNumbers[toggleDigit - 1];
        }
        if (this.value === 0) {
            this.element.children[0].children[0].classList.add("displayNone");
            this.element.children[0].children[1].classList.remove("displayNone");
            for (let i = 0; i < 9; i++) {
                if (this.candidateNumbers[i]) {
                    this.element.children[0].children[1].children[i].classList.remove("displayHidden");
                }
                else {
                    this.element.children[0].children[1].children[i].classList.add("displayHidden");
                }
            }
        }
        else {
            this.element.children[0].children[0].classList.remove("displayNone");
            this.element.children[0].children[1].classList.add("displayNone");
        }
    }
}