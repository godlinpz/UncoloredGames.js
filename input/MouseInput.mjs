import ClientInput from './ClientInput.mjs';

class MousetInput extends ClientInput {
    constructor(options) {
        super(options);

        Object.assign(this, {
            mouseButtons: ['left', 'middle', 'right'],
            x: 0,
            y: 0,
            canvasEventListeners: {
                mousedown: this.onMouseDown.bind(this),
                mouseup: this.onMouseUp.bind(this),
                mousemove: this.onMouseMove.bind(this),
            },
        });
    }

    onMouseDown(e) {
        const code = this.mouseButtons[e.button];
        if (code) this.trigger(`mousedown_${code}`);
    }

    onMouseUp(e) {
        const code = this.mouseButtons[e.button];
        if (code) this.trigger(`mouseup_${code}`);
    }

    onMouseMove(e) {
        this.x = e.layerX;
        this.y = e.layerY;
    }

    disableContextMenu()
    {
        this.canvas.addEventListener("contextmenu", e => e.preventDefault());
    }

}

export default MousetInput;
