import ClientInput from './ClientInput';

class MousetInput extends ClientInput {
    constructor(options) {
        super({ ...options, 
            listeners: {
                mousedown: this.onMouseDown.bind(this),
                mouseup: this.onMouseUp.bind(this),
                mousemove: this.onMouseUp.bind(this),
            },
        });

        Object.assign(this, {
            mouseStateHandlers: {},
            mouseHandlers: {},
            mouseButtons: ['left', 'middle', 'right'],

        });
    }

    onMouseDown(e) {
        const code = this.mouseButtons[e.button];
        if (code) this.mouseHandlers[code] && this.mouseHandlers[code](true);
    }

    onMouseUp(e) {
        const code = this.mouseButtons[e.button];
        if (code) this.mouseHandlers[code] && this.mouseHandlers[code](false);
    }

    onMouseState({ ...handlers }) {
        this.mouseStateHandlers = { ...this.mouseStateHandlers, ...handlers };
    }

    unMouseState([...handlers]) {
        handlers.forEach((h) => delete this.mouseStateHandlers[h]);
    }

    onMouse({ ...handlers }) {
        this.mouseHandlers = { ...this.mouseHandlers, ...handlers };
    }

    unMouse({ ...handlers }) {
        this.mouseHandlers = { ...this.mouseHandlers, ...handlers };
    }
}

export default MousetInput;
