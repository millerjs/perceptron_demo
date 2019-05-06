class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.classification = null;
        this.vector = [this.x, this.y];
    }
}

function rand(max) {
    return Math.random() * max;
}

function randomPoints(count, width, height) {
    return Array.from({length: count}, () => (
        new Point(rand(width), rand(height))
    ));
}
