import EventSource from '../util/EventSource.mjs';
import KeyboardInput from './KeyboardInput.mjs';
import MousetInput from './MouseInput.mjs';

let busId = 1000; 

export default class InputEventBus {
    constructor(options) {
        this.id = `inputBus${busId++}`;
        const defaultQueue = [];
        const queuesInit = { default: defaultQueue };
        
        EventSource.createEventSource(this, queuesInit);

        this.keyboard = new KeyboardInput({ queues: queuesInit });
        this.mouse = new MousetInput({ queues: queuesInit });
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