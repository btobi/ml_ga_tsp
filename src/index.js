import GA from "./GA"
import SA from "./SA";
import DataGenerator from "./DataGenerator";
import config from "./config"
import cities60 from "./cities60"
import cities120 from "./cities120";
import cities500 from "./cities500";
import Canvas from "./Canvas";

// const alg = new GA();
// alg.init();

const numberCities = 100;

// const cities = DataGenerator.getRandomCities(numberCities, config.canvas.width, config.canvas.height);
// const cities = cities60;
const cities = cities120;
const initialOrder = DataGenerator.getOrder(cities.length);

const canvas = new Canvas(cities);

// const sa = new SA(cities, initialOrder, canvas);
// sa.run();

const populationSize = 400;
const population = DataGenerator.getRandomPopulation(populationSize, initialOrder);
//
// const ga = new GA(cities, initialOrder, canvas, population, false);
// ga.run();
const sa = new SA(cities, population[0], canvas, 1000, 0.0001);
sa.run();