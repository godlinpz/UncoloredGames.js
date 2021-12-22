import MouseInput from '../../input/MouseInput.mjs';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
let color = "black";

const mouse = new MouseInput({canvas});
mouse.disableContextMenu();
mouse.on({
    mousedown_left: e => color = "red",
    mouseup_left: e => color = "black",
    mousemove: e => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = color;
        ctx.fillRect(mouse.x-10, mouse.y-10, 20, 20);
    },
});