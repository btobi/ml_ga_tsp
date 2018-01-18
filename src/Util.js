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

    static swap(array, i, j) {
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }

    static twoOptSwap(array, i, j) {
        if (i === j) return;

        if (i > j)
            while (i-j>0)
                Util.swap(array, i--, j++);
        else
            while (j-i>0)
                Util.swap(array, i++, j--);
    }

}