const drawLine = (a, b, color = "black", width = 1) => {
    ctx.lineWidth = width;
    ctx.strokeStyle = color;

    ctx.beginPath();

    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);

    ctx.stroke();
}

const drawRect = (a, dimension, color = "black", doFill = true, lineWidth = 1) => {
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    if (doFill) {
        ctx.fillRect(a.x, a.y, dimension.x, dimension.y);
    }
    else {
        ctx.lineWidth = lineWidth;
        ctx.strokeRect(a.x, a.y, dimension.x, dimension.y);
    }
}

const drawCircle = (a, r, color = "black", doFill = true) => {
    ctx.fillStyle = color;
    ctx.strokeStyle = color;

    ctx.arc(a.x, a.y, r, 0, 2*Math.PI);

    if (doFill) {
        ctx.fill();
    }
    else {
        ctx.stroke();
    }
}

const clearCanvas = () => {
    ctx.fillStyle = 'rgba(0, 45, 60, 1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height / 2);

    ctx.fillStyle = 'rgba(0, 0, 0, 1.0)';
    ctx.fillRect(0, canvas.height / 2, canvas.width, canvas.height / 2);
}