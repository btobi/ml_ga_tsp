import City from "./City";

const padding = 30;

export default class DataGenerator {

    static getRandomCities(number, maxWidth, maxHeight) {
        let cities = [];
        for (let i = 0; i < number; i++) {
            cities[i] = new City(this.random(padding, maxWidth - padding), this.random(padding, maxHeight - padding), i);
        }
        return cities;
    }

    static getRandomCities2(number, maxWidth, maxHeight) {
        let cities = [];
        let stepRight = 70;
        let stepDown = -5;
        let skewDown = -7;
        let skewRight = 7;
        cities[0] = new City(maxWidth / 2, padding, 0);
        for (let i = 1; i < number; i++) {
            cities[i] = new City(cities[i-1].x + stepRight, cities[i-1].y - stepDown, i);
            stepRight -= skewRight;
            stepDown += skewDown;
            if (i / 10 === 2) skewRight = -1 * skewRight;
            if (i / 10 === 1) skewDown = -1 * skewDown;
        }
        return cities;
    }

    static getRandomCities3(number, maxWidth, maxHeight) {
        let cities = [];
        let stepRight = 70;
        let stepDown = -5;
        let skewDown = -7;
        let skewRight = 7;
        const randomCities = 10;
        cities[0] = new City(maxWidth / 2, padding, 0);
        for (let i = 1; i < number - randomCities; i++) {
            cities[i] = new City(cities[i-1].x + stepRight, cities[i-1].y - stepDown, i);
            stepRight -= skewRight;
            stepDown += skewDown;
            if (i / 10 === 2) skewRight = -1 * skewRight;
            if (i / 10 === 1) skewDown = -1 * skewDown;
        }
        cities[number-1] = new City(maxWidth / 2, maxHeight / 2, number-1);

        for (let i = number - randomCities; i < number; i++) {
            cities[i] = new City(this.random(padding, maxWidth - padding), this.random(padding, maxHeight - padding), i);
        }

        return cities;
    }

    static getOrder(number) {
        let order = [];
        for (let i = 0; i < number; i++) {
            order[i] = i;
        }
        return order;
    }

    static getRandomPopulation(size, order) {
        let population = [];
        for (let i = 0; i < size; i++) {
            population[i] = this.shuffle(order);
        }
        return population;
    }

    static random(from, to) {
        return Math.floor(Math.random() * (to - from + 1) + from);
    }

    static shuffle(array) {
        array = array.slice(0);
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
}