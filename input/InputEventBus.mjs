import EventSource from '../util/EventSource.mjs';
import KeyboardInput from './KeyboardInput.mjs';
import MousetInput from './MouseInput.mjs';

let busId = 1000; 

export default class InputEventBus {
    constructor(options) {
        this.id = `inputBus${busId++}`;
        
        if(options._events) {
            this._events = options._events;
        } else {
            EventSource.createEventSource(this);
        }

        if (options.keyboard) {
            this.keyboard = new KeyboardInput();
            this.keyboard._events.on('any', this.handleEvent.bind(this), this.id);
        }
        if (options.mouse) {
            this.mouse = new MousetInput();
            this.mouse._events.on('any', this.handleEvent.bind(this), this.id);
        }
    }

    handleEvent(...args) {
        console.log(args);
    }

    destroy() {
        if (this.keyboard) {
            this.keyboard._events.un('any', null, this.id);
            delete this.keyboard;
        }
        if (this.mouse) {
            this.mouse._events.un('any', null, this.id);
            delete this.mouse;
        }
    }
}