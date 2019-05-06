var plot, data, perceptron, pview;
const e = 2.71828;

const M = Math.random();
const B = 0.5 * (1 - Math.random())

var threshold = (x) => (M * x + B);

function line(x) {
    return (-perceptron.x/perceptron.y)*x + (-perceptron.bias/perceptron.y);
}

class Plot {
    constructor(selector, min, max) {
        this.margin = { top: 0, right: 0, bottom: 0, left: 0 };

        this.min = min;
        this.max = max;

        this.width  = 500 - this.margin.left - this.margin.right;
        this.height = 500 - this.margin.top  - this.margin.bottom;

        this.x = d3.scaleLinear().range([0, this.width]);
        this.y = d3.scaleLinear().range([this.height, 0]);

        this.x.domain([min, max]);
        this.y.domain([min, max]);

        this.svg = d3.select("body").select(selector);

        this.svg.attr("width", this.width + this.margin.left + this.margin.right)
            .attr("height", this.height + this.margin.top + this.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
    }

    drawAxis() {
        this.xAxis = d3.axisBottom(this.x);
        this.yAxis = d3.axisLeft(this.y);

        this.svg.append("g")
            .attr("class", "x axis")
            // .attr("transform", "translate(0," + this.height + ")")
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
            // .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Y-Value")
    }

    clear() {
        this.svg.selectAll("svg > *").remove();
    }

    drawLine(f, data, attr) {
        var line = d3.line()
            .x((d) => this.x(d.x))
            .y((d) => this.y(f(d.x)));

        this.svg.append("path")
            .datum([{'x': this.min}, {'x': this.max}])
            .attr("class", "line")
            .attr("class", attr)
            .attr("d", line);
    }

    scatter(points) {
        this.svg.selectAll(".dot")
            .data(points)
            .enter().append("circle")
            .attr("class", (d) => "dot " + d.color)
            .attr("data-x", (d) => d.x)
            .attr("data-y", (d) => d.y)
            .attr("r", (d)=> d.r || 6)
            .attr("cx", (d) => this.x(d.x))
            .attr("cy", (d) => this.y(d.y));
    }
}
