import EventSourceMixin from '../EventSourceMixin';

class ClientInput {
    constructor(options) {
        Object.assign(this, {
            listeners: {},
        }, options);

        this.registerListeners();
    }

    registerListeners()
    {
        if(this.canvas) {
            for (let event in this.listeners) {
                this.canvas.addEventListener(event, 
                    e => this.handleEvent(event, e), 
                    false);
            }
        }
    }

    handleEvent(event, e)
    {
        this.listeners[event](e);
        this.trigger(event, e);
    }
}

Object.assign(ClientInput.prototype, EventSourceMixin);

export default ClientInput;
