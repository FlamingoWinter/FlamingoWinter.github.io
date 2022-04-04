class Timer{
    constructor(display){
        this.seconds=0
        this.display=display
        this.active=true
        setInterval(this.increaseSeconds.bind(this),1000)
    }
    setActive(){
        this.active=true
        this.display.classList.remove("failed")
        this.display.classList.remove("completed")
    }
    setFailed(){
        this.active=false
        this.display.classList.add("failed")
        this.display.classList.remove("completed")
    }
    setCompleted(){
        this.active=false
        this.display.classList.remove("failed")
        this.display.classList.add("completed")
    }
    addZeroes(num){
        if(num<10){
            return "0"+String(num)
        }
        else{
            return String(num)
        }
    }
    increaseSeconds(){
        if(this.active){
            this.seconds+=1; 
        }
        this.display.innerHTML=`${this.addZeroes((this.seconds-this.seconds%60)/60)}:${this.addZeroes(this.seconds%60)}`;
    }
}