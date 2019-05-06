function activation_step(x, y, wx, wy, bias) {
    let activation = x*wx + y*wy + bias;
    return activation > 0 ? 1 : 0;
}

class Perceptron {
    constructor(activation) {
        this.activation = activation;
        this.rate = 0.005;
        this.bias = 0.02;
        this.x    = 0.3;
        this.y    = 0.1;

        this.total_error = 100;
        this.last_error = 100;
    }

    predict(p) {
        return (this.activation(p.x, p.y, this.x, this.y, this.bias) > 0.0) ? 1.0 : 0.0;
    }

    error(p) {
        return p.classification - this.predict(p);
    }

    trainOn(p) {
        let error = this.error(p);

        this.bias += this.rate * error;
        this.x    += this.rate * error * p.x;
        this.y    += this.rate * error * p.y;

        this.total_error += error ** 2;

        if (error**2 > 0) {
            highlight(p, error**2 > 0);
        }
    }

    step(points) {
        var i = 0;
        this.last_error = this.total_error;
        this.total_error = 0;

        var doStep = ()=> {
            let error = this.trainOn(points[i++]);
            if (i < points.length) {
                setTimeout(doStep, 1);
            }
        };

        doStep();
    }

    computeTotalError(points) {
        var this_error = 0.0;
        for (let point of points) {
            this_error += this.error(point) ** 2;
        }
        return this_error;
    }

    computeTotalErrorAt(p, x, y) {
        let previous_x = this.x; let previous_y = this.y; this.x = x; this.y = y;
        let this_error = this.computeTotalError(p);
        this.x = previous_x; this.y = previous_y;
        return this_error;
    }
}
