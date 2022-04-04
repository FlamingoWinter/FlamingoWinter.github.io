class NewMenu{
    constructor(buttons){
        this.buttons=buttons.slice()
        for(let i of this.buttons){
            i.element.addEventListener('click', this.clickedButton.bind(i))
            i.newMenu=this
        }
        this.buttons[0].select()
    }
    clickedButton(){
        for(let i of this.newMenu.buttons){
            i.deselect()
        }
        this.select()
    }
    activateButton(){
        for(let i of this.buttons){
            if(i.selected){
                i.activateFunction()
            }
        }
    }
}