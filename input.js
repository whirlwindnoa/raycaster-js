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
// document.getElementById('movement-type').addEventListener('change', (event) => {
//     movementType = !movementType;
// });