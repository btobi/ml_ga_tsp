export default class Util {

    static calcDistance(cities, order) {
        var distance = 0;
        for (let i = 0; i < order.length - 1; i++) {
            const cityAIndex = order[i];
            const cityA = cities[cityAIndex];
            const cityBIndex = order[i + 1];
            const cityB = cities[cityBIndex];
            const d = this.euclidianDistance(cityA.x, cityA.y, cityB.x, cityB.y);
            distance += d;
        }
        return Math.round(distance * 1000) / 1000;
    }

    static euclidianDistance(ax, ay, bx, by) {
        return Math.hypot(ax - bx, ay - by);
    }

}