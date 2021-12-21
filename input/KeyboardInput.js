import Input from './ClientInput';

class KeyboardInput extends Input {
    constructor(options) {
        super({ ...options, 
            listeners: {
                keydown: this.onKeyDown.bind(this),
                keyup: this.onKeyUp.bind(this),
            },
        });

        Object.assign(this, {
            keysPressed: new Set(),
            keyStateHandlers: {},
            keyHandlers: {},

        });

    }

    onKeyDown(e) {
        this.keysPressed.add(e.code);
        this.keyHandlers[e.code] && this.keyHandlers[e.code](true);
        this.trigger('keydown', e);
    }

    onKeyUp(e) {
        this.keysPressed.delete(e.code);
        this.keyHandlers[e.code] && this.keyHandlers[e.code](false);
        this.trigger('keyup', e);
    }

    onMouseDown(e) {
        const code = this.mouseButtons[e.button];
        if (code) this.mouseHandlers[code] && this.mouseHandlers[code](true);
        this.trigger('mousedown', e);
    }

    onMouseUp(e) {
        const code = this.mouseButtons[e.button];
        if (code) this.mouseHandlers[code] && this.mouseHandlers[code](false);
        this.trigger('mouseup', e);
    }

    onKeyState({ ...handlers }) {
        this.keyStateHandlers = { ...this.keyStateHandlers, ...handlers };
    }

    unKeyState([...handlers]) {
        handlers.forEach((h) => delete this.keyStateHandlers[h]);
    }

    onKey({ ...handlers }) {
        this.keyHandlers = { ...this.keyHandlers, ...handlers };
    }

    unKey({ ...handlers }) {
        this.keyHandlers = { ...this.keyHandlers, ...handlers };
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

    checkKeys() {
        if (this.keysPressed.size) {
            for (let key of Array.from(this.keysPressed))
                if (this.keyStateHandlers[key]) {
                    this.keyStateHandlers[key]();
                    break;
                }
        }
    }
}

export default ClientInput;
