import InputEventBus from '../../input/InputEventBus.mjs';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
let color = "black";

const bus = new InputEventBus({ mouse: { canvas }, keyboard: { canvas } });
bus.mouse.disableContextMenu();
const mouseHhandlers = [
    {
        event: 'mousedown_left', 
        queue: 'default',
        handler: e => color = "green",
    },
    {
        event: 'mouseup_left', 
        queue: 'default',
        handler: e => color = "black",
    },
    {
        event: 'mousemove', 
        queue: 'default',
        handler: e => {
            // ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = color;
            ctx.fillRect(e[0].layerX-10, e[0].layerY-10, 20, 20);
        }
    },
];
bus.mouse._events.on(mouseHhandlers);


let n = 0;

const kbHandlers = [
    {
        event: 'keydown_Space', 
        handler: e => {
            // ctx.fillStyle = 'red';
            // ctx.fillRect(0, 0, canvas.width, canvas.height);
            console.log(bus.queues.default);
            bus.runEventQueue();
            console.log(bus.queues.default);
        }
    },
    {
        event: 'keyup_Space', 
        queue: 'default',
        handler: e => {
            // ctx.fillStyle = 'black';
            // ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
    },
    // {
    //     event: 'keyup_Enter', 
    //     queue: 'default',
    //     handler: e => {
    //         // Removes listeners on enter
    //         keyboard.un(kbHandlers);
    //     }
    // },
    {
        event: 'keyup_ArrowDown', 
        queue: 'default',
        handler: e => {
            n++;
            console.log('ArrowDown', n);
        }
    },
    {
        event: 'keyup_ArrowUp',
        queue: 'default',
        handler: e => {
            // keyboard.runEventQueue();
            console.log('ArrowUp', n);
        }
    },
];
bus.keyboard._events.on(kbHandlers);

function draw() {
    bus.runEventQueue();
    requestAnimationFrame(draw);
};

draw();