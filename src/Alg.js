import Canvas from "./Canvas";
import config from "./config"
import DataGenerator from "./DataGenerator";
import Util from "./Util";
import cities from "./cities60"
import citiesRandom from "./citiesrandom"

export default class Alg {

    init() {
        console.log(config);
        const numberCities = 500;
        this.cities = DataGenerator.getRandomCities(numberCities, config.canvas.width, config.canvas.height);
        // this.cities = citiesRandom;
        this.initialOrder = DataGenerator.getOrder(numberCities);
        this.population = DataGenerator.getRandomPopulation(config.populationSize, this.initialOrder);

        this.bestSolution = [];
        this.bestDistance = Infinity;
        this.prevBestDistance = Infinity;

        this.fitness = [];

        this.stopCriterion = 5;
        this.mutationRate = 0.05;
        this.maxIterationsNoImprovement = 400;

        this.maxIterator = 600;
        this.currentIterator = 0;
        this.noImprovementSince = 0;

        console.log(numberCities);

        console.log(JSON.stringify(this.cities));


        this.canvas = new Canvas(this.cities);

        this.performAlg();
    }

    performAlg() {
        console.log("start", this.prevBestDistance === Infinity);
        document.body.onclick = this.performStep.bind(this);
    }

    algShouldStop() {
        this.currentIterator++;

        document.getElementById("generation").innerText = this.currentIterator;

        if (this.bestDistance < this.prevBestDistance) {
            this.canvas.drawCurrentSolution(this.bestSolution);
            document.getElementById("best").innerText = this.bestDistance;
            console.log("New best solution ", Math.round(this.bestDistance), Math.round(this.prevBestDistance), Math.round(this.prevBestDistance - this.bestDistance));
        }

        const hasInitValues = this.prevBestDistance === Infinity || this.bestDistance === Infinity;
        const changeIsSmall = this.prevBestDistance - this.bestDistance < this.stopCriterion;

        if (changeIsSmall)
            this.noImprovementSince++;
        else
            this.noImprovementSince = 0;

        const tooManyIterations = this.noImprovementSince > this.maxIterationsNoImprovement;

        if (tooManyIterations)
            console.log("too many iterations");

        this.prevBestDistance = this.bestDistance;

        // console.log(this.prevBestDistance, this.bestDistance, this.prevBestDistance - this.bestDistance);
        return !hasInitValues && tooManyIterations;
    }

    performStep() {

        if (this.algShouldStop()) {
            console.log("alg stopped");
            document.body.style.backgroundColor = "#b1f9b1";
            return;
        }

        console.log("next gen");

        this.calculateFitness();
        this.normalizeFitness();
        this.nextGeneration();


        setTimeout(() => {this.performStep()}, 1);
    }

    calculateFitness() {
        let currentBestDistance = Infinity;
        let currentBestSolution = [];
        for (let i = 0; i < this.population.length; i++) {
            const d = Util.calcDistance(this.cities, this.population[i]);
            if (d <= this.bestDistance) {
                this.bestDistance = d;
                this.bestSolution = this.population[i].slice(0);
            }
            if (d <= currentBestDistance) {
                currentBestDistance = d;
                currentBestSolution = this.population[i].slice(0);
            }


            // This fitness function has been edited from the original video
            // to improve performance, as discussed in The Nature of Code 9.6 video,
            // available here: https://www.youtube.com/watch?v=HzaLIO9dLbA
            this.fitness[i] = 1 / (Math.pow(d, 20) + 1);
        }
    }

    normalizeFitness() {
        var sum = 0;
        for (var i = 0; i < this.fitness.length; i++) {
            sum += this.fitness[i];
        }
        for (var i = 0; i < this.fitness.length; i++) {
            this.fitness[i] = this.fitness[i] / sum;
        }
    }

    nextGeneration() {
        let newPopulation = [];
        for (let i = 0; i < this.population.length; i++) {
            let orderA = Alg.pickOne(this.population, this.fitness);
            let orderB = Alg.pickOne(this.population, this.fitness);
            let order = Alg.crossOver(orderA, orderB);
            Alg.mutate(order, this.mutationRate);
            newPopulation[i] = order;
        }
        this.population = newPopulation;

    }

    static pickOne(list, fitness) {
        let index = 0;
        let r = Math.random();

        while (r > 0) {
            r = r - fitness[index];
            index++;
        }
        index--;
        return list[index].slice();
    }

    static crossOver(orderA, orderB) {
        let start = Math.floor(DataGenerator.random(0, orderA.length));
        let end = Math.floor(DataGenerator.random(start + 1, orderA.length));
        let neworder = orderA.slice(start, end);
        // var left = totalCities - neworder.length;
        for (let i = 0; i < orderB.length; i++) {
            let city = orderB[i];
            if (!neworder.includes(city)) {
                neworder.push(city);
            }
        }
        return neworder;
    }


    static mutate(order, mutationRate) {
        for (let i = 0; i < order.length; i++) {
            if (Math.random() < mutationRate) {
                const indexA = DataGenerator.random(0, order.length - 1);
                const indexB = (indexA + 1) % (order.length - 1);
                Util.swap(order, indexA, indexB);
            }
        }
    }

}