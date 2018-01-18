import DataGenerator from "./DataGenerator";
import Canvas from "./Canvas";
import Util from "./Util";
import config from "./config"
import cities from "./cities500"

export default class SA {

    init() {

        const numberCities = 500;

        // this.cities = DataGenerator.getRandomCities(numberCities, config.canvas.width, config.canvas.height);
        this.cities = cities;
        this.initialOrder = DataGenerator.getOrder(this.cities.length);

        this.bestSolution = [];
        this.bestDistance = Infinity;
        this.prevBestDistance = Infinity;

        this.currentSolution = DataGenerator.shuffle(this.initialOrder.slice(0));

        this.currentIterator = 0;
        this.noImprovementSince = 0;
        this.maxIterationsNoImprovement = 400;
        this.stopCriterion = 5;

        this.canvas = new Canvas(this.cities);

        this.coolRate = 0.00001;
        this.initialTemp = this.cities.length * 3.5;
        this.currentTemp = this.initialTemp;

        console.log(JSON.stringify(this.cities));

        this.graphicalUpdateStep = Math.round(this.initialTemp / 2);

        this.performStep();

    }

    performStep() {

        if (this.algShouldStop()) {
            console.log("alg stopped");
            document.body.style.backgroundColor = "#b1f9b1";
            return;
        }

        const currentEnergy = Util.calcDistance(this.cities, this.currentSolution);

        const randomCityA = DataGenerator.random(0, this.cities.length - 1);
        const randomCityB = DataGenerator.random(0, this.cities.length - 1);

        Util.twoOptSwap(this.currentSolution, randomCityA, randomCityB);

        const newEnergy = Util.calcDistance(this.cities, this.currentSolution);

        // if solution is not accepted, then swap cities back
        if (!this.acceptSolution(currentEnergy, newEnergy, this.currentTemp))
            Util.twoOptSwap(this.currentSolution, randomCityA, randomCityB);

        if (newEnergy < this.bestDistance) {
            this.bestSolution = this.currentSolution.slice(0);
            this.bestDistance = newEnergy;
        }

        this.currentTemp *= (1 - this.coolRate);

        if (this.currentIterator % this.graphicalUpdateStep === 0)
            setTimeout(() => {this.performStep()}, 1);
        else
            this.performStep();

        //
        // this.performStep();
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

        document.getElementById("generation").innerText = `${this.currentIterator} | ${this.currentTemp}`

        if (this.bestDistance < this.prevBestDistance) {
            this.canvas.drawCurrentSolution(this.bestSolution);
            document.getElementById("best").innerText = this.bestDistance;
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