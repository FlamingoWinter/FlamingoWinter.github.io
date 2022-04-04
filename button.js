class Button{
    constructor(element, activateFunction){
        this.activateFunction=activateFunction
        this.element=element
        this.selected=false
        this.newMenu=false
    }
    select(){
        this.selected=true
        this.element.classList.add("selected")
    }
    deselect(){
        this.selected=false
        this.element.classList.remove("selected")
    }
}