import KeyboardInput from '../../input/KeyboardInput.mjs';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const keyboard = new KeyboardInput({canvas});

let n = 0;

const handlers = [
    {
        event: 'keydown_Space', 
        handler: e => {
            ctx.fillStyle = 'red';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
    },
    {
        event: 'keyup_Space', 
        handler: e => {
            ctx.fillStyle = 'black';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
    },
    {
        event: 'keyup_Enter', 
        handler: e => {
            // Removes listeners on enter
            keyboard.un(handlers);
        }
    },
    {
        event: 'keyup_ArrowDown', 
        queued: true,
        handler: e => {
            n++;
            // console.log('ArrowDown', n);
        }
    },
    {
        event: 'keyup_ArrowUp',
        handler: e => {
            keyboard.runEventQueue();
            // console.log('ArrowUp', n);
        }
    },
];
keyboard.on(handlers);
