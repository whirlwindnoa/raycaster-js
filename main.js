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
let      maxRays = 2;

let  gameRunning = true;
let movementType = false;

// object globals
var        world;
var       player;
var       canvas;
var          ctx;

var startingTime;

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
    
    world.draw();

    player.update();
    player.draw();
    player.rayCaster();


    frames++;
    if (gameRunning) window.requestAnimationFrame(mainLoop);
}