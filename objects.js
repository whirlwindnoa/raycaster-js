// class for a player
class Player {
    constructor(x = 400, y = 300, angle = 0, speed = 2, size = 25) {
        // left bottom cords, center coords
        this.pos = new Array(x, y);
        this.corners = new Array(
            [x - size/2, y - size/2],
            [x + size/2, y + size/2],
        );

        this.angle = angle;
        this.deg = 0;

        this.speed = speed;
        this.size = size;

        this.sinA = 0;
        this.cosA = 1;

        this.range = 200;
        this.FOV = 90;
    }

    update() {
        this.sinA = sind(this.angle);
        this.cosA = cosd(this.angle);

        //this. = this.pos[0] + this.size/2;
        //this. = this.pos[1] + this.size/2;
        
        this.corners[0][0] = this.pos[0] - this.size/2;
        this.corners[0][1] = this.pos[1] - this.size/2;

        this.corners[1][0] = this.pos[0] + this.size/2;
        this.corners[1][1] = this.pos[1] + this.size/2;

        if (keys[0]) { // W
            this.pos[0] += this.speed * this.cosA;
            this.pos[1] += this.speed * this.sinA;
        }
        if (keys[2]) { // S
            this.pos[0] += -this.speed * this.cosA;
            this.pos[1] += -this.speed * this.sinA;
        }
        if (keys[1]) { // A
            this.pos[0] += this.speed * this.sinA;
            this.pos[1] += -this.speed * this.cosA;
        }
        if (keys[3]) { // D
            this.pos[0] += -this.speed * this.sinA;
            this.pos[1] += this.speed * this.cosA;
        }
        
        // control type 1, uses cursor on 2d space to manipulate angle
        
        if (movementType) 
            // control type 1, uses cursor on 2d space to manipulate angle
            this.angle = Math.atan2(mouseY - this.pos[1], mouseX - this.pos[0]) * 180/Math.PI;
        else { 
            // control type 2, uses arrows instead of the cursor
            if (keys[4]) // Left Arrow
                this.angle -= 2;
            if (keys[5]) // Right Arrow
                this.angle += 2;
        }

        if (this.angle > 360) this.angle = 0;
        else if (this.angle < 0) this.angle = 360;
    }

    draw() {
        drawRect(this.corners[0][0], this.corners[0][1], this.size, this.size, "red");

        drawLine(this.pos[0],  this.pos[1],
                 this.pos[0] + this.cosA * this.range * 1.25, 
                 this.pos[1] + this.sinA * this.range * 1.25,
                 "green");
    }

    rayCaster() {
        let startAngle = this.angle - this.FOV / 2;
        let rayAngle = this.FOV / maxRays;
      
        for (let i = 0; i < maxRays; i++) {
            let curAngle = startAngle + (i + 0.5) * rayAngle;

            let sinC = sind(curAngle);
            let cosC = cosd(curAngle);
            let tanC = tand(curAngle);
            
            let Py = this.pos[1];
            let Px = this.pos[0];

            let Ay;
            let Ax;

            let xd = world.tileX / tanC;
            let yd;

            // facing downwards
            if (this.angle > 0 && this.angle <= 180) {
                Ay = Math.floor(Py/world.tileY) * (world.tileY) + world.tileY;
                yd = world.tileY;
            }
            // facing upwards
            else {
                Ay = Math.floor(Py/world.tileY) * (world.tileY) - 1;
                yd = -world.tileY;
            }
            
            Ax = Math.floor(this.pos[0] + (Ay - this.pos[1])/tanC);
            
            drawRect(Ax, Ay, 10, 10, "green");
            let counter = 0;
            while (!world.check(Ax, Ay, "#")[2]) {
                if (counter > 10) break;

                if (this.angle > 0 && this.angle <= 180) {
                    Ax += xd;
                }
                else {
                    Ax -= xd;
                }
                Ay += yd;

                drawRect(Ax, Ay, 10, 10, "green");
                counter++;
            }

            let xt = Ax / world.tileX;
            let yt = Ay / world.tileY;
            
            let rayPos = [
                this.pos[0] + cosd(curAngle) * this.range,
                this.pos[1] + sind(curAngle) * this.range
            ];
        
            //drawLine(this.pos[0], this.pos[1], rayPos[0], rayPos[1], "gray");
        }
    }
}

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

    draw() {
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                if (this.map[i][j] == '#') {
                    drawRect(j * this.tileX, i * this.tileY, this.tileX, this.tileY, "black", true);
                }
                else if (this.map[i][j] == ".") {
                    drawRect(j * this.tileX, i * this.tileY, this.tileX, this.tileY, "lightgray", false);
                }
            }
        }
    }

    check(x, y, forWhat = "#") {
        let xt = Math.floor(x/this.tileX);
        let yt = Math.floor(y/this.tileY);

        try {
            if (this.map[yt][xt] == forWhat) {
                return [xt, yt, true];
            }
            else {
                return [xt, yt, false];
            }
        }
        catch {
            return false;
        }
    }
}