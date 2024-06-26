"use strict";

// some constants and globals
const DEG = Math.PI/180;
const RAD = 180/Math.PI;

const map1 = [
    '################', 
    '###..##..##..###', 
    '###..##..##..###', 
    '#..............#', 
    '#..............#', 
    '#.#..........#.#', 
    '#.#..........#.#', 
    '#..............#', 
    '#..............#', 
    '###..##..##..###', 
    '###..##..##..###', 
    '################'
]
const map2 = [
    '................', 
    '................',  
    '................',  
    '................',
    '................',  
    '................',  
    '................',  
    '................',  
    '................',  
    '................',  
    '................',  
    '................'
]

// game globals
let          FPS = 0;
let       frames = 0;
let      maxRays = 160;
let      renderingDistance = 11;

let  gameRunning = true;
let movementType = false;

// object globals
var        world;
var       player;
var      player2;
var       canvas;
var          ctx;

var   lastCalled;

// initialization function, runs when the window loads
const init = () => {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');

    ctx.globalCompositeOperation = 'source-over'; 
    precomputeTrig(360);

    player = new Player(canvas.width/2, canvas.height/2, 0, 2, 10);
    world = new World(16, 12, map1);

    lastCalled = performance.now();

    window.requestAnimationFrame(mainLoop);
}

window.onload = init;

const mainLoop = (timestamp) => {
    clearCanvas();

    player.update();
    player.rayCaster();

    //player.draw();
    //world.draw();
    frames++;
    if (gameRunning) window.requestAnimationFrame(mainLoop);
}
