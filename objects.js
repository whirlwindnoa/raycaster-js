// class for a player
class Player {
    constructor(x = 400, y = 300, angle = 0, speed = 2, size = 25) {
        // left bottom cords, center coords
        this.pos = new Vertex2D(x, y);
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
        this.FOV = 45;
    }

    // update players position according to the pressed keys
    update() {
        this.sinA = sind(this.angle);
        this.cosA = cosd(this.angle);

        //this. = this.pos.x + this.size/2;
        //this. = this.pos.y + this.size/2;
        
        this.corners[0][0] = this.pos.x - this.size/2;
        this.corners[0][1] = this.pos.y - this.size/2;

        this.corners[1][0] = this.pos.x + this.size/2;
        this.corners[1][1] = this.pos.y + this.size/2;

        if (keys[0]) { // W
            this.pos.x += this.speed * this.cosA;
            this.pos.y += this.speed * this.sinA;
        }
        if (keys[2]) { // S
            this.pos.x += -this.speed * this.cosA;
            this.pos.y += -this.speed * this.sinA;
        }
        if (keys[1]) { // A
            this.pos.x += this.speed * this.sinA;
            this.pos.y += -this.speed * this.cosA;
        }
        if (keys[3]) { // D
            this.pos.x += -this.speed * this.sinA;
            this.pos.y += this.speed * this.cosA;
        }
        
        if (movementType) 
            // control type 1, uses cursor on 2d space to manipulate angle
            this.angle = Math.atan2(mouseY - this.pos.y, mouseX - this.pos.x) * 180/Math.PI;
        else { 
            // control type 2, uses arrows instead of the cursor
            if (keys[4]) // Left Arrow
                this.angle -= 2;
            if (keys[5]) // Right Arrow
                this.angle += 2;
        }

        if (this.angle >= 360) this.angle = 0;
        else if (this.angle < 0) this.angle = 359;
    }

    // draws the player
    draw() {
        drawRect(new Vertex2D(this.corners[0][0], this.corners[0][1]), new Vertex2D(this.size, this.size), "red");

        // drawLine(this.pos,
        //          new Vertex2D(this.pos.x + this.cosA * this.range * 1.25, 
        //          this.pos.y + this.sinA * this.range * 1.25),
        //          "blue");
    }

    // (probably) faster raycasting algorithm for tiled worlds
    rayCaster() {
        let startAngle = this.angle - this.FOV / 2;
        let rayAngle = this.FOV / maxRays;

        drawRect(new Vertex2D(0, 300), new Vertex2D(800, 300), "rgb(255 255 255)");
        for (let i = 0; i < maxRays; i++) {
            let curAngle = normalizeAngle(startAngle + (i + 0.5) * rayAngle);

            let sinC = sind(curAngle);
            let cosC = cosd(curAngle);
            let tanC = tand(curAngle);

            let horizIntersect = new Vertex2D();
            let vertIntersect = new Vertex2D();

            let horizDist = new Vertex2D(world.tileX / tanC, world.tileX);
            let vertDist = new Vertex2D(world.tileY, world.tileY * tanC);
            
            // HORIZONTAL INTERSECTIONS
            // facing downwards
            if (curAngle > 0 && curAngle <= 180) {
                horizIntersect.y = Math.floor(this.pos.y/world.tileY) * (world.tileY) + world.tileY;
                horizDist.y = world.tileY;

                horizDist.x = world.tileX / tanC
            }
            // facing upwards
            else if (curAngle > 180 && curAngle <= 360) {
                horizIntersect.y = Math.floor(this.pos.y/world.tileY) * (world.tileY) - 1;
                horizDist.y = -world.tileY;

                horizDist.x = -1 * (world.tileX / tanC);
            }
            
            // VERTICAL INTERSECTIONS
            // facing left
            if (curAngle >= 90 && curAngle < 270) {
                vertIntersect.x = Math.floor(this.pos.x/world.tileX) * (world.tileX) - 1;
                vertDist.x = -world.tileX;
                vertDist.y = -vertDist.y;
            }
            // facing right
            else {
                vertIntersect.x = Math.floor(this.pos.x/world.tileX) * (world.tileX) + world.tileX;
                vertDist.x = world.tileX;
            }
            
            horizIntersect.x = this.pos.x + ((horizIntersect.y - this.pos.y)/tanC);
            vertIntersect.y = this.pos.y - ((this.pos.x - vertIntersect.x)*tanC);
            
            let counter = 0;

            while (!world.check(horizIntersect.x, horizIntersect.y, "#")[2]) {
                if (counter > renderingDistance) break;
                
                horizIntersect.x += horizDist.x;
                horizIntersect.y += horizDist.y;

                counter++;
            }

            counter = 0;

            while (!world.check(vertIntersect.x, vertIntersect.y, "#")[2]) {
                if (counter > renderingDistance) break;
                
                vertIntersect.x += vertDist.x;
                vertIntersect.y += vertDist.y;

                counter++;
            }

            let cosbeta = cosd((this.FOV / maxRays) * i - 30);
            let disthIntersect = findDistanceSqrt(this.pos, horizIntersect);
            let distvIntersect = findDistanceSqrt(this.pos, vertIntersect);

            let dist;
            if (disthIntersect < distvIntersect) {
                //drawLine(this.pos, horizIntersect, "green", 2);
                dist = disthIntersect;
            }
            else {
                //drawLine(this.pos, vertIntersect, "green", 2);
                dist = distvIntersect;
            }

            let projHeight = world.tileX / dist * (400/tand(this.FOV/2));
            let scale = 800 / maxRays;

            var projectiond = new Vertex2D(scale, world.tileX / dist * 692);
            var projectionp = new Vertex2D(i * scale, 300 - projectiond.y/2);

            let opacity = dist / 500;
            drawRect(projectionp, projectiond, `rgb(0 0 0 / ${opacity * 100}%)`);
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
                    drawRect(new Vertex2D(j * this.tileX, i * this.tileY), 
                             new Vertex2D(this.tileX, this.tileY, "black", true));
                }
                else if (this.map[i][j] == ".") {
                    drawRect(new Vertex2D(j * this.tileX, i * this.tileY), 
                             new Vertex2D(this.tileX, this.tileY), "lightgray", false);
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
