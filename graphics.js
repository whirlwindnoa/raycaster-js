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

const drawCircle = (x, y, r, color = "black", doFill = true) => {
    ctx.fillStyle = color;
    ctx.strokeStyle = color;

    ctx.arc(x, y, r, 0, 2*Math.PI);

    if (doFill) {
        ctx.fill();
    }
    else {
        ctx.stroke();
    }
}

const clearCanvas = () => {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}