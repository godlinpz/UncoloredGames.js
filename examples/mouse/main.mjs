import MouseInput from '../../input/MouseInput.mjs';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
let color = "black";

const mouse = new MouseInput({canvas});
mouse.disableContextMenu();
const handlers = [
    {
        event: 'mousedown_left', 
        handler: e => color = "red",
    },
    {
        event: 'mouseup_left', 
        handler: e => color = "black",
    },
    {
        event: 'mousemove', 
        handler: e => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = color;
            ctx.fillRect(mouse.x-10, mouse.y-10, 20, 20);
        }
    },
];
mouse.on(handlers);