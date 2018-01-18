import Canvas from "./Canvas";
import config from "./config"
import DataGenerator from "./DataGenerator";
import Util from "./Util";
import cities from "./cities60"
import citiesRandom from "./citiesrandom"
import SA from "./SA";
import Timer from "./Timer";

export default class GA {

    constructor(cities, initialOrder, canvas, population, infuseSA) {

        this.cities = cities;
        this.initialOrder = initialOrder;
        this.canvas = canvas;
        this.population = population;
        this.infuseSA = infuseSA;

        this.bestSolution = [];
        this.bestDistance = Infinity;
        this.prevBestDistance = Infinity;

        this.fitness = [];

        this.stopCriterion = 1;
        this.mutationRate = 0.05;
        this.maxIterationsNoImprovement = 1000;

        this.maxIterator = 600;
        this.currentIterator = 0;
        this.noImprovementSince = 0;

        this.infuseSAWhenNoImprovementSince = this.maxIterationsNoImprovement * 0.8;

        this.timer = new Timer();
    }

    getSolution() {
        return this.bestSolution;
    }

    run() {
        // console.log("start", this.prevBestDistance === Infinity);
        // document.body.onclick = this.performStep.bind(this);
        this.timer.start();
        this.performStep();
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

        this.prevBestDistance = this.bestDistance;

        if (changeIsSmall)
            this.noImprovementSince++;
        else
            this.noImprovementSince = 0;

        const tooManyIterations = this.noImprovementSince > this.maxIterationsNoImprovement;

        if (this.noImprovementSince > this.infuseSAWhenNoImprovementSince && this.infuseSA) {
            this.performSaOnPopulation();
            this.noImprovementSince = 0;
        }

        if (tooManyIterations)
            console.log("too many iterations");


        // console.log(this.prevBestDistance, this.bestDistance, this.prevBestDistance - this.bestDistance);
        return !hasInitValues && tooManyIterations;
    }

    performStep() {

        if (this.algShouldStop()) {
            console.log("alg stopped");
            document.body.style.backgroundColor = "#b1f9b1";
            this.timer.stop();
            this.timer.log();
            return;
        }

        this.calculateFitness();
        this.normalizeFitness();
        this.nextGeneration();

        // if (this.infuseSA) {
        //     GA.performSaOnPopulation(this.cities, this.population);
        // }

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
        console.log("Next generation");

        let newPopulation = [];
        for (let i = 0; i < this.population.length; i++) {
            let orderA = GA.pickOne(this.population, this.fitness);
            let orderB = GA.pickOne(this.population, this.fitness);
            let order = GA.crossOver(orderA, orderB);
            GA.mutate(order, this.mutationRate);
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

    performSaOnPopulation() {

        console.log("Perform SA...");

        for (let i = 0; i < this.population.length; i++) {
            const sa = new SA(this.cities, this.population[i].slice(0), this.canvas, 50, 0.001);
            sa.run();
            this.population[i] = sa.getSolution().slice(0);
        }

    }

}