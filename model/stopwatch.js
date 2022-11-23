class Stopwatch {
    time = 0
    delay = 1000
    constructor(){}
    setTime(time) {
        this.time = time
    }
    getTime() {
        return this.time
    }
    tick() {
        time++
    }
}