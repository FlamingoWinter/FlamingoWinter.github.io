class Circle {
    constructor(element, value, keypress, sudokuBoard) {
        this.sudokuBoard = sudokuBoard
        this.value = value
        this.element = element;
        this.keypress = keypress;
    }
    select() {
        this.selected = true;
        this.element.classList.add("selected");
        this.sudokuBoard.selectedType="Circle"
    }
    deselect() {
        if(this.value){
            this.sudokuBoard.selectedType="None"
        }
        this.element.classList.remove("selected");
        this.selected = false;
    }
    clickListener() {
        if (this.sudokuBoard.selectedType != "Square") {
            if (this.selected) {
                this.sudokuBoard.deselectCircles();
                this.deselect();
            }
            else {
                this.sudokuBoard.deselectCircles();
                this.select();
            }
        }
        else {
            for (var i = 0; i < 9; i++) {
                for (var j = 0; j < 9; j++) {
                    if (this.sudokuBoard.squareList[i][j].selected) {
                        this.sudokuBoard.squareList[i][j].updateValue(this.value, true);
                        this.flashSelect();
                    }
                }
            }
        }
    }
    flashSelect() {
        this.element.classList.add("selected");
        setTimeout(() => {
            this.element.classList.remove("selected");
            this.selected = false;
        }, 500);
    }
}