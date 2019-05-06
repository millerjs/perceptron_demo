var points;

function classify() {
    for (let point of data) {
        point.classification = threshold(point.x) > point.y ? 1.0 : 0.0;
    };
}

function test() {
    for (let point of data) {
        if (perceptron.predict(point) === 1) {
            if (point.classification === 1) {
                point.color = 'blue'
            } else {
                point.color = 'magenta'
            }
        } else {
            if (point.classification === 1) {
                point.color = 'darkmagenta'
            } else {
                point.color = 'white'
            }
        }

    };
}

function step() {
    perceptron.step(data)
    test();
    render();
}

function setup() {
    setupKnobs();

    perceptron = new Perceptron(activation_step);
    plot       = new Plot("#svg", -.5, 1.5);
    pview      = new Plot("#perceptron", -1, 1);

    data = randomPoints(100, 1.0, 1.0);
    points = data;

    data.sort((a, b) => (a.x - b.x)*10 + a.y - b.y)
    classify();
    drawImages();
    render();
}

function drawImages() {
    for (let point of data) {
        image = $('<div class="image"><div class="x pixel"></div><div class="y pixel"></div></div>')
        let x = ((point.x + 1.0) / 2.0 * 254).toFixed(0);
        let y = ((point.y + 1.0) / 2.0 * 254).toFixed(0);
        image.find('.x').css('background-color', "rgb(" + x + ',' + x + ','+ x + ')');
        image.find('.y').css('background-color', "rgb(" + y + ',' + y + ','+ y + ')');
        if (point.classification == 1) {
            $('#imagesA').append(image);
        } else {
            $('#imagesB').append(image);
        }

    };
}

function render(skipDials) {
    plot.clear();
    plot.drawAxis();
    plot.scatter(data);
    drawBorder();
    plot.drawLine(threshold, data, 'solid');
    plot.drawLine(line, data, 'thick');
    if (!skipDials) {
        showPerceptronDetails();
    }
}

function showPerceptronDetails() {
    $("#error").text("error : " + perceptron.last_error)
    scale = (x) => 100 * x + 50

    $('#knobX').val(perceptron.x.toFixed(2)).trigger('change');
    $('#knobY').val(perceptron.y.toFixed(2)).trigger('change');
    $('#knobBias').val(perceptron.bias.toFixed(2)).trigger('change');
}

function highlight(point, wrong) {
    point.r = 20
    test();
    if (wrong) {
        point.color = 'red'
    }
    $("#xValue").text("x1 : " + point.x.toFixed(2))
    $("#yValue").text("x2 : " + point.y.toFixed(2))
    $("#evaluation").text("activation = "
                          + perceptron.bias.toFixed(2) + " + "
                          + point.x.toFixed(2) + " * (" + perceptron.x.toFixed(2) + ") + "
                          + point.y.toFixed(2) + " * (" + perceptron.y.toFixed(2) + ")"
                          + " = " + perceptron.activation(point).toFixed(2));
    render();
    point.r = 6
}

function drawBorder() {
    plot.drawLine((x)=>0, data, 'dashed');
    plot.drawLine((x)=>1, data, 'dashed');
    plot.drawLine((x)=>x*1000, data, 'dashed');
    plot.drawLine((x)=>(x -1)*1000, data, 'dashed');
}

function set(attr, value) {
    perceptron[attr] = value;
    test();
    render(true);
}

function setupKnobs() {
    $("#knobX").knob({ change: function(v) { set('x', v) } });
    $("#knobY").knob({ change: function(v) { set('y', v) } });
    $("#knobBias").knob({ change: function(v) { set('bias', v) } });
    // $("#knobX").knob();
    // $("#knobY").knob();
    // $("#knobBias").knob();
}
