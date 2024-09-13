import EventSource from '../util/EventSource.mjs';
import KeyboardInput from './KeyboardInput.mjs';
import MousetInput from './MouseInput.mjs';

export default class InputEventBus extends EventSource{
    constructor(options = {}, target = null) {
        super(target, { [options.queueName || 'default']: [] });
        
        this.keyboard = new KeyboardInput({ queues: this.queues, ...options.keyboard });
        this.mouse = new MousetInput({ queues: this.queues, ...options.mouse });
    }
}