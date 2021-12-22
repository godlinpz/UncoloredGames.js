import KeyboardInput from '../../input/KeyboardInput.mjs';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const keyboard = new KeyboardInput({canvas});
keyboard.on({
    keydown_Space: e => {
        ctx.fillStyle = 'red';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    },
    keyup_Space: e => {
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    },
});