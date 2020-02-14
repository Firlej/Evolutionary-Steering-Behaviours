let canvas, ctx;

let width, height;

let windowWidth, windowHeight;

let mouseX, mouseY;
let keyCode;

let images = [];

const HALF_PI = Math.PI / 2;
const PI = Math.PI;
const TWO_PI = Math.PI * 2;
let frameCount = 0;

const KEY = {
    SPACE: 32,
    ZERO: 48,
    ONE: 49,
    TWO: 50,
    THREE: 51,
    FOUR: 52,
    FIVE: 53,
    SIX: 54,
    SEVEN: 55,
    EIGHT: 56,
    NINE: 57,
    W: 119,
    A: 97,
    S: 115,
    D: 100
};

function setup() {}

window.onload = function () {

    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.imageSmoothingEnabled = false;
    // ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.stroke();

    addEventListeners();

    setLibValues();

    setup(() => {
        draw();
        setInterval(() => {
            draw();
            frameCount++;
        }, 1000 / 60);
    });
}

function redraw() {
    draw();
}

function setLibValues() {
    width = canvas.width;
    height = canvas.height;

    windowWidth = window.innerWidth;
    windowHeight = window.innerHeight;
}

let sources = {};

function imagesLoaded() {}

function loadImages(sources) {

    let numImages = 0;
    for (src in sources) {
        numImages++;
    }
    let loadedImages = 0;
    for (src in sources) {
        images[src] = new Image();
        images[src].onload = function () {
            loadedImages++;
            if (loadedImages == numImages) {
                //console.log("Images loaded!");
                imagesLoaded();
            }
        };
        images[src].src = sources[src];
    }
}

function image(img, x, y, width, height) {
    ctx.drawImage(img, x, y, width, height);
}

function resizeCanvas(width, height) {
    ctx.canvas.width = width;
    ctx.canvas.height = height;
    canvas.width = width;
    canvas.height = height;

    setLibValues();
}

function background(color) {
    fill(color);
    rect(0, 0, canvas.width, canvas.height);
}

function clearBackground() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function font(f) {
    ctx.font = f;
}

function textAlign(a) {
    ctx.textAlign = a;
}

function text(text, x, y) {
    fillText(text, x, y);
}

function fillText(text, x, y) {
    ctx.fillText(text, x, y);
}

function randomRgb() {
    return rgba(random(0, 256), random(0, 256), random(0, 256));
}

function fill(color) {
    ctx.fillStyle = color;
}
function noFill() {
    ctx.fillStyle = "rgba(0, 0, 0, 0)";
}

function stroke(color) {
    ctx.strokeStyle = color;
}

function strokeStyle(color) {
    ctx.strokeStyle = color;
}

function noStroke() {
    ctx.strokeStyle = "rgba(0, 0, 0, 0)";
}

function ellipse(x, y, rx, ry = rx) {
    ctx.beginPath();
    // ctx.arc(x, y, r, 0, Math.PI * 2, true);
    ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
}

function rect(x, y, width, height) {
    ctx.fillRect(x, y, width, height);
}

function strokeRect(x, y, width, height) {
    ctx.strokeRect(x, y, width, height);
}

function lineWidth(x) {
    ctx.lineWidth = x;
}

function line(x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

function globalAlpha(a = 1) {
    ctx.globalAlpha = a;
}

function push() {
    ctx.save()
};

function rotate(a) {
    ctx.rotate(a);
}

function translate(x, y) {
    ctx.translate(x, y);
}

function pop() {
    ctx.restore();
}

function beginShape() {
    ctx.beginPath();
}

function vertex(x, y) {
    ctx.lineTo(x, y);
}

function endShape() {
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
}

let loadPixels = () => {
    return ctx.getImageData(0, 0, width, height);
}

let setPixels = (imageData) => {
    ctx.putImageData(imageData, 0, 0);
}

function rgb(r, g, b) {
    return rgba(r, g, b, 1);
}

function rgba(r, g, b, a = 1) {
    return "rgba(" + floor(r) + ", " + floor(g) + ", " + floor(b) + ", " + a + ")";
}

function hsl(h, s, l) {
    return hsla(h, s, l, 1);
}

function hsla(h, s, l, a = 1) {
    return "hsl(" + floor(h) + ", " + floor(s) + "%, " + floor(l) + "%, " + a + ")";
}

function lerpColor(a, b, amount) {

    var ah = parseInt(a.replace(/#/g, ''), 16),
        ar = ah >> 16,
        ag = ah >> 8 & 0xff,
        ab = ah & 0xff,
        bh = parseInt(b.replace(/#/g, ''), 16),
        br = bh >> 16,
        bg = bh >> 8 & 0xff,
        bb = bh & 0xff,
        rr = ar + amount * (br - ar),
        rg = ag + amount * (bg - ag),
        rb = ab + amount * (bb - ab);

    return '#' + ((1 << 24) + (rr << 16) + (rg << 8) + rb | 0).toString(16).slice(1);
}

function rgbToHsl(r, g, b) {
    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b),
        min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if (max == min) {
        h = s = 0; // achromatic
    } else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
        }
        h /= 6;
    }

    return [h, s, l];
}

function hslToRgb(h, s, l) {
    // Must be fractions of 1
    s /= 100;
    l /= 100;

    let c = (1 - Math.abs(2 * l - 1)) * s,
        x = c * (1 - Math.abs((h / 60) % 2 - 1)),
        m = l - c / 2,
        r = 0,
        g = 0,
        b = 0;

    if (0 <= h && h < 60) {
        r = c;
        g = x;
        b = 0;
    } else if (60 <= h && h < 120) {
        r = x;
        g = c;
        b = 0;
    } else if (120 <= h && h < 180) {
        r = 0;
        g = c;
        b = x;
    } else if (180 <= h && h < 240) {
        r = 0;
        g = x;
        b = c;
    } else if (240 <= h && h < 300) {
        r = x;
        g = 0;
        b = c;
    } else if (300 <= h && h < 360) {
        r = c;
        g = 0;
        b = x;
    }
    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    return [r, g, b];
}

function lerp(start, end, rate) {
    return (end - start) * rate + start;
}

// function factorial(n) {
//     let res = 1;
//     for (let i = 2; i <=n; i++) {
//         res *= i;
//         // console.log(res);
//     }
//     return res;
// }

// MATH SHORTS

function pow(a, b) {
    return Math.pow(a, b);
}

function sqrt(a) {
    return Math.sqrt(a);
}

function floor(a) {
    return Math.floor(a);
}

function ceil(a) {
    return Math.ceil(a);
}

function round(a) {
    return Math.round(a);
}

function abs(a) {
    return Math.abs(a);
}

function random(a, b) {
    return Math.random() * (b - a) + a;
}

function min(a, b) {
    return a < b ? a : b;
}

function max(a, b) {
    return a > b ? a : b;
}

function constrain(n, min, max) {
    return n > max ? max : n < min ? min : n;
}

function map(x, fromA, fromB, toA, toB) {
    return (x - fromA) / (fromB - fromA) * (toB - toA) + toA;
}

// ARRAY PROTOTYPES

Array.prototype.random = function () {
    return this[Math.floor((Math.random() * this.length))];
}
Array.prototype.first = function () {
    return this[0];
}
Array.prototype.last = function () {
    return this[this.length - 1];
}

function isContained(x, y, x1, y1, x2, y2) {
    return (x > x1 && x < x2 && y > y1 && y < y2);
}

function mouseContained(x1, y1, x2, y2) {
    return isContained(mouseX, mouseY, x1, y1, x2, y2);
}

// STORAGE PROTOTYPES

Storage.prototype.hasKey = function (key) {
    return this.getItem(key) !== null;
}
Storage.prototype.getParsed = function (key) {
    return JSON.parse(this.getItem(key));
}

// EVENT LISTENERS

function mousePressed() {}

function mouseReleased() {}

function mouseMoved() {}

function windowResized() {}

function keyPressed() {}

function addEventListeners() {
    canvas.addEventListener("mousedown", mousePressed);
    canvas.addEventListener("mouseup", mouseReleased);
    canvas.addEventListener('mousemove', updateMouseMove);

    window.addEventListener("keypress", function (evt) {
        keyCode = evt.keyCode;
        keyPressed(keyCode);
    });

    window.addEventListener('touchstart', function (evt) {
        updateTouchMove(evt)
        mousePressed(evt);
        evt.preventDefault();
    });
    window.addEventListener('touchend', mouseReleased);
    window.addEventListener('touchmove', function (evt) {
        evt.preventDefault();
        updateTouchMove(evt);
    });

    window.onresize = function (event) {
        setLibValues();
        windowResized();
    };

    function updateMouseMove(evt) {
        let rect = canvas.getBoundingClientRect();
        let root = document.documentElement;
        mouseX = evt.clientX - rect.left - root.scrollLeft;
        mouseY = evt.clientY - rect.top - root.scrollTop;
        mouseMoved(evt);
    }

    function updateTouchMove(evt) {
        let rect = canvas.getBoundingClientRect();
        let root = document.documentElement;
        mouseX = evt.touches[0].clientX - rect.left - root.scrollLeft;
        mouseY = evt.touches[0].clientY - rect.top - root.scrollTop;
        mouseMoved(evt);
    }
}

// VECTOR

class Vector {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    add(v) {
        this.x += v.x;
        this.y += v.y;
        return this;
    }

    sub(v) {
        this.x -= v.x;
        this.y -= v.y;
        return this;
    }

    mult(n) {
        this.x *= n;
        this.y *= n;
        return this;
    }

    div(n) {
        this.x /= n;
        this.y /= n;
        return this;
    }

    set(x, y) {
        this.x = x;
        this.y = y;
        return this;
    }

    copy() {
        return new Vector(this.x, this.y);
    }

    dot(v) {
        return this.x * v.x + this.y * v.y;
    }

    magSq() {
        return this.x * this.x + this.y * this.y;
    }

    mag() {
        return Math.sqrt(this.magSq());
    }

    limit(n) {
        if (this.mag() > n) {
            this.setMag(n);
        }
    }

    normalize() {
        var len = this.mag();
        if (len !== 0) this.mult(1 / len);
        return this;
    }

    setMag(n) {
        this.normalize().mult(n);
        return this;
    }

    heading() {
        return Math.atan2(this.y, this.x);
    }

    rotate(a) {
        var newHeading = this.heading() + a;
        var mag = this.mag();
        this.x = Math.cos(newHeading) * mag;
        this.y = Math.sin(newHeading) * mag;
        return this;
    }
}

function vec(x = 0, y = 0) {
    return new Vector(x, y);
}

function distSq(x1, y1, x2, y2) {
    return (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2);
}

function dist(x1, y1, x2, y2) {
    return Math.sqrt(distSq(x1, y1, x2, y2));
}

function loadJSON(file, callback) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', file, true);
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            callback(xobj.responseText);
        }
    }
    xobj.send(null);
}