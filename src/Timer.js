export default class Timer {

    constructor() {

        this.startTime;
        this.endTime;

    }

    start() {
        this.startTime = new Date().getTime();
    }


    stop() {
        this.endTime = new Date().getTime();
    }

    log() {
        console.log("Execution time: " + this.getExecutionTime());
    }

    getExecutionTime() {
        return (this.endTime - this.startTime) / 1000;
    }

}