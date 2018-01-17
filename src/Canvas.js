import paper from "paper"

export default class Canvas {

    constructor(cities) {

        this.canvas = Canvas.getCanvas();

        while(typeof this.canvas === "undefined")
            this.canvas = Canvas.getCanvas();

        this.cities = cities;

        this.points = [];
        this.paths = [];

        console.log(this.canvas);

        paper.setup(this.canvas);

        this.drawPoints();

        paper.view.draw();
    }

    static getCanvas() {
        const canvas = document.getElementById("mycanvas");
        if (typeof canvas === "undefined")
            console.log("WARNING! CANVAS UNDEFINED");
        return canvas;
    }

    drawCurrentSolution(order) {
        // Get a reference to the canvas object

        for (let path of this.paths) {
            path.remove();
        }

        this.paths = [];

        for (let i = 0; i < order.length - 1; i++) {
            const from = this.points[order[i]];
            const to = this.points[order[i+1]];

            const path = new paper.Path.Line(from, to);
            path.strokeColor = "black";

            this.paths.push(path);
        }

        paper.view.update();

    }



    drawPoints() {
        for (let c of this.cities) {
            this.drawPoint(c);
        }
    }

    drawPoint(city) {
        const point = new paper.Point(city.x, city.y);
        this.points.push(point);

        let circle = new paper.Shape.Circle(point, 7);
        circle.fillColor = "red";
        Canvas.addText(point, city.number);
    }

    static addText(point, value) {
        var text = new paper.PointText(point);
        text.justification = 'left';
        text.fillColor = 'black';
        text.content = value;
        text.position.x += 20;
        text.fontSize = 20;
    }

}