import ClientInput from './ClientInput.mjs';

class KeyboardInput extends ClientInput {
    constructor(options) {
        super(options);

        Object.assign(this, {
            keysPressed: new Set(),
            canvasEventListeners: {
                keydown: this.onKeyDown.bind(this),
                keyup: this.onKeyUp.bind(this),
            },
        });
    }

    onKeyDown(e) {
        this.keysPressed.add(e.code);
        this._events.trigger(`keydown_${e.code}`, e);
    }

    onKeyUp(e) {
        this.keysPressed.delete(e.code);
        this._events.trigger(`keyup_${e.code}`, e);
    }
}

export default KeyboardInput;
