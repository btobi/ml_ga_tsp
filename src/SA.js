import DataGenerator from "./DataGenerator";
import Canvas from "./Canvas";
import Util from "./Util";
import config from "./config"
import cities from "./cities500"
import Timer from "./Timer";

export default class SA {

    constructor(cities, initialOrder, canvas, initialTemp, coolRate) {

        this.cities = cities;
        this.initialOrder = initialOrder;
        this.canvas = canvas;

        this.bestSolution = this.initialOrder;
        this.bestDistance = Infinity;
        this.prevBestDistance = Infinity;

        this.currentSolution = this.initialOrder;

        this.currentIterator = 0;
        this.noImprovementSince = 0;
        this.maxIterationsNoImprovement = 400;
        this.stopCriterion = 5;

        this.coolRate = coolRate || 0.0001;
        this.initialTemp = initialTemp || this.cities.length * 3.5;
        this.currentTemp = this.initialTemp;

        this.graphicalUpdateStep = Math.round(this.initialTemp / 2);

        this.timer = new Timer();

        document.body.onclick = () => {
            console.log("clicked");
            this.currentSolution = this.bestSolution.slice(0);
            this.currentIterator = 0;
            this.initialTemp *= 0.5;
            this.coolRate *= 0.5;
            this.currentTemp = this.initialTemp;
            this.run();
        }
    }

    run() {
        this.timer.start();
        if (this.canvas)
            this.runGraphical();
        else
            this.runWhile();

    }

    runWhile() {
        console.log("run in loop");
        while (!this.algShouldStop()) {
            this.performStep();
        }
        console.log("alg stopped");
        document.body.style.backgroundColor = "#b1f9b1";
        this.timer.stop();
        this.timer.log();
    }

    runGraphical() {
        this.performStep();
        if (!this.algShouldStop()) {
            if (this.canvas && this.currentIterator % this.graphicalUpdateStep === 0)
                setTimeout(() => {this.runGraphical()}, 1);
            else
                this.runGraphical();
        } else {
            console.log("Alg stopped");
        }
    }

    getSolution() {
        return this.bestSolution;
    }

    performStep() {

        const currentEnergy = Util.calcDistance(this.cities, this.currentSolution);

        const randomCityA = DataGenerator.random(0, this.cities.length - 1);
        const randomCityB = DataGenerator.random(0, this.cities.length - 1);

        Util.swap(this.currentSolution, randomCityA, randomCityB);

        const newEnergy = Util.calcDistance(this.cities, this.currentSolution);

        // if solution is not accepted, then swap cities back
        if (!this.acceptSolution(currentEnergy, newEnergy, this.currentTemp))
            Util.swap(this.currentSolution, randomCityA, randomCityB);

        if (newEnergy < this.bestDistance) {
            this.bestSolution = this.currentSolution.slice(0);
            this.bestDistance = newEnergy;
        }

        this.currentTemp *= (1 - this.coolRate);

    }

    acceptSolution(currentEnergy, newEnergy, currentTemp) {
        if (newEnergy < currentEnergy)
            return true;

        const rand = 0.3;
        const energyChange = Math.exp((currentEnergy - newEnergy) / currentTemp);

        return energyChange > rand;
    }


    algShouldStop() {
        this.currentIterator++;

        if (this.canvas) {
            if (this.bestDistance < this.prevBestDistance) {
                document.getElementById("generation").innerText = `${this.currentIterator} | ${this.currentTemp}`;
                setTimeout(() => {
                    this.canvas.drawCurrentSolution(this.bestSolution);
                }, 1);
                document.getElementById("best").innerText = this.bestDistance;
            }
            // console.log("New best solution ", Math.round(this.bestDistance), Math.round(this.prevBestDistance), Math.round(this.prevBestDistance - this.bestDistance));
        }

        // const hasInitValues = this.prevBestDistance === Infinity || this.bestDistance === Infinity;
        // const changeIsSmall = this.prevBestDistance - this.bestDistance < this.stopCriterion;
        //
        // if (changeIsSmall)
        //     this.noImprovementSince++;
        // else
        //     this.noImprovementSince = 0;
        //
        // const tooManyIterations = this.noImprovementSince > this.maxIterationsNoImprovement;
        //
        // if (tooManyIterations)
        //     console.log("too many iterations");
        //
        this.prevBestDistance = this.bestDistance;
        //
        // // console.log(this.prevBestDistance, this.bestDistance, this.prevBestDistance - this.bestDistance);
        // return !hasInitValues && tooManyIterations;

        return this.currentTemp < 1;
    }

}