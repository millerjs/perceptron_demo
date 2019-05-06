const width = 500;
const height = 500;

class Point {
    constructor(x, y, classification) {
        this.x = x;
        this.y = y;
    }
}

function randInt(max) {
    return Math.floor(Math.random() * (max + 1));
}

function randomPoints(count, width, height) {
    return Array.from({length: count}, () => (
        new Point(randInt(width), randInt(height))
    ));
}

class Plot {
    constructor() {
        this.margin = { top: 20, right: 20, bottom: 30, left: 40 };

        this.width  = 960 - this.margin.left - this.margin.right;
        this.height = 500 - this.margin.top  - this.margin.bottom;

        this.x = d3.scale.linear().range([0, width]);
        this.y = d3.scale.linear().range([height, 0]);

        this.xAxis = d3.svg.axis()
            .scale(this.x)
            .orient("bottom");

        this.yAxis = d3.svg.axis()
            .scale(this.y)
            .orient("left");

        this.svg = d3.select("body").select("#svg");

        this.svg.attr("width", this.width + this.margin.left + this.margin.right)
            .attr("height", this.height + this.margin.top + this.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

    }

    drawAxis() {
        this.svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + this.height + ")")
            .call(this.xAxis)
            .append("text")
            .attr("class", "label")
            .attr("x", this.width)
            .attr("y", -6)
            .style("text-anchor", "end")
            .text("X-Value");

        this.svg.append("g")
            .attr("class", "y axis")
            .call(this.yAxis)
            .append("text")
            .attr("class", "label")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Y-Value")

    }

    clear() {
        this.svg.selectAll("svg > *").remove();
    }

    drawLine(f) {
        return d3.svg.line()
            .x((d) => this.x(d.x))
            .y((d) => this.y(f(d.x)));
    }
}

function createPlot(width, height) {
    return d3.select("body")
	    .append("svg")
	    .attr("width", width)
	    .attr("height", height);
}

function render() {
    var plot = new Plot();
    var data = randomPoints(100, width, height);

    var threshold = (x) => (100 + 0.3 * x);

    plot.x.domain(d3.extent(data, function(d) {
        return d.x;
    }));

    plot.y.domain(d3.extent(data, function(d) {
        return d.y;
    }));

    line = plot.drawLine(threshold);
    plot.clear();
    plot.drawAxis();
    plot.svg.selectAll(".dot")
        .data(data)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("class", function(d){
            console.log(d.x, threshold(d.x), d.y)
            if (threshold(d.x) > d.y) {
                return "blue";
            } else {
                return "red"
            }
        })
        .attr("r", 3.5)
        .attr("cx", function(d) {
            return plot.x(d.x);
        })
        .attr("cy", function(d) {
            return plot.y(d.y);
        });

    plot.svg.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("d", line);
}
