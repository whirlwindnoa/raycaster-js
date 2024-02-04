var precomputedSin = new Array();
var precomputedCos = new Array();

const precomputeTrig = (iterations) => {
    for (let i = 0; i < iterations; i++) {
        precomputedSin.push(Math.sin(i * (Math.PI/180)));
        precomputedCos.push(Math.cos(i * (Math.PI/180)));
    }
}

const sind = (angle) => {
    return precomputedSin[angle];
}

const cosd = (angle) => {
    return precomputedCos[angle];
}

const tand = (angle) => {
    return Math.tan(angle * (Math.PI/180));
}

const abs = (x) => {
    return x < 0 ? x * -1 : x;
}

// turns any whole number into a number between 0 and 359 (inclusive)
const normalizeAngle = (angle) => {
    let alpha = angle % 360;

    if (alpha >= 0) return alpha;
    else return 360 + alpha;
}

const findDistanceSqrt = (a, b) => {
    return Math.sqrt( ((b.x - a.x) * (b.x - a.x)) + ((b.y - a.y) * (b.y - a.y)) );   
}

const findDistanceTrig = (a, b, angle) => {
    let alpha = (360 - angle);
    return abs(a.x - b.x) / cosd(alpha);
}

const whichCloser = (a, b, o) => {
    if (abs(a.x) + abs(a.y) < abs(b.x) + abs(b.y)) return true;
    else return false;
}

class Vertex2D {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}
