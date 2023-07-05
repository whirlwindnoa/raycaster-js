"use strict";

// some constants and globals
const DEG = 0.017;

// game globals
let          FPS = 0;
let       frames = 0;

let  gameRunning = true;
let movementType = false;


// object globals
var        world;
var       player;
var       canvas;
var          ctx;

var startingTime;

// #########################################################################
// USER INPUT
// #########################################################################

// boolean array with pressed keys, ordered as below
// W, A, S, D, ArrowLeft, ArrowRight
let keys = new Array(6).fill(false);

// double event handler to check for keys and update keys array
['keydown', 'keyup'].forEach(evt => {
    window.addEventListener(evt, (event) => {
        if (event.defaultPrevented) {
            return;
        }
        
        const updateKey = (x) => {
            if (evt === 'keydown')
                keys[x] = true;
            else if (evt === 'keyup')
                keys[x] = false;
        }

        switch (event.key) {
            case "w":
                updateKey(0);
                break;
            case "a":
                updateKey(1);
                break;
            case "s":
                updateKey(2);
                break;
            case "d":
                updateKey(3);
                break;
            case "ArrowLeft":
                updateKey(4);
                break;
            case "ArrowRight":
                updateKey(5);
                break;
        }
    }, true);
});

// position of the mouse on the canvas
let mouseX;
let mouseY;

// update mouseX and mouseY whenever the mouse moves
window.addEventListener('mousemove', (event) => {
    let cRect = canvas.getBoundingClientRect();

    mouseX = Math.round(event.clientX - cRect.left);
    mouseY = Math.round(event.clientY - cRect.top);
});

// change movement type whenever state of the checkbox changes
document.getElementById('movement-type').addEventListener('change', (event) => {
    movementType = !movementType;
});

// #########################################################################
// DRAWING / GRAPHICS
// #########################################################################

// draws a line from (x1, y1) to (x2, y2)
const drawLine = (x1, y1, x2, y2, color = "black", width = 1) => {
    ctx.lineWidth = width;
    ctx.strokeStyle = color;

    ctx.beginPath();

    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);

    ctx.stroke();
}

const drawRect = (x, y, w, h, color = "black", doFill = true, lineWidth = 1) => {
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    if (doFill) {
        ctx.fillRect(x, y, w, h);
    }
    else {
        ctx.lineWidth = lineWidth;
        ctx.strokeRect(x, y, w, h);
    }
}

const clearCanvas = () => {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// #########################################################################
// PLAYER
// #########################################################################

// class for a player
class Player {
    constructor(x = 400, y = 300, angle = 0, speed = 2, size = 25) {
        this.x = x;
        this.y = y;
        this.angle = angle;

        this.speed = speed;
        this.size = size;

        this.sinA = 0;
        this.cosA = 1;
    }

    movement() {
        this.sinA = Math.sin(this.angle);
        this.cosA = Math.cos(this.angle);

        if (keys[0]) { // W
            this.x += this.speed * this.cosA;
            this.y += this.speed * this.sinA;
        }
        if (keys[2]) { // S
            this.x += -this.speed * this.cosA;
            this.y += -this.speed * this.sinA;
        }
        if (keys[1]) { // A
            this.x += this.speed * this.sinA;
            this.y += -this.speed * this.cosA;
        }
        if (keys[3]) { // D
            this.x += -this.speed * this.sinA;
            this.y += this.speed * this.cosA;
        }
        
        // control type 1, uses cursor on 2d space to manipulate angle
        
        if (movementType) 
            // control type 1, uses cursor on 2d space to manipulate angle
            this.angle = Math.atan2(mouseY - this.y, mouseX - this.x);
        else { 
            // control type 2, uses arrows instead of the cursor
            if (keys[4]) // Left Arrow
                this.angle -= DEG * 2;
            if (keys[5]) // Right Arrow
                this.angle += DEG * 2;
        }
    }

    draw() {
        drawRect(this.x, this.y, this.size, this.size, "red");
        drawLine(this.x+12.5, this.y+12.5, this.x+12.5+this.cosA*100, this.y+12.5+this.sinA*100);
    }
}

// #########################################################################
// WORLD
// #########################################################################

const emptyTile = '.';
const fullTile = '#';

class World {
    constructor(width, height, map = null) {
        this.width = width;
        this.height = height;

        this.map = new Array(height).fill;

        this.tileX = canvas.width/this.width;
        this.tileY = canvas.height/this.height;

        this.map[0] = this.map[height-1] = fullTile.repeat(width);
        if (!map) {
            for (let i = 1; i < height-1; i++) {
                this.map[i] = fullTile + emptyTile.repeat(width-2) + fullTile;
            }
        }
        else {
            this.map = map;
        }
    } 
}

const pointInMap = () => {
    
}

const map1 = [
    '################', 
    '###..##..##..###', 
    '###..##..##..###', 
    '#..............#', 
    '#..............#', 
    '###..##..##..###', 
    '###..##..##..###', 
    '#..............#', 
    '#..............#', 
    '###..##..##..###', 
    '###..##..##..###', 
    '################'
]

// #########################################################################
// GAME ESSENTIALS
// #########################################################################

// initialization function, runs when the window loads
const init = () => {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');

    player = new Player(400, 300, 0, 2, 25);
    world = new World(16, 12, map1);

    startingTime = performance.now();

    window.requestAnimationFrame(mainLoop);
}

window.onload = init;


const mainLoop = (timestamp) => {
    clearCanvas();
    
    FPS = frames / ((performance.now()-startingTime)/1000);
    document.getElementById('fps').innerHTML = "FPS: " + Math.round(FPS);
    
    player.movement();
    player.draw();

    for (let i = 0; i < world.height; i++) {
        for (let j = 0; j < world.width; j++) {
            if (world.map[i][j] == '#') {
                drawRect(j * world.tileX, i * world.tileY, world.tileX, world.tileY);
            }
        }
    }

    frames++;
    if (gameRunning) window.requestAnimationFrame(mainLoop);
}