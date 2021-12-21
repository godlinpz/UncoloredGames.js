import EventSourceMixin from '../EventSourceMixin';

class ClientInput {
    constructor(options) {
        Object.assign(this, {
            userCanvasEventListeners: {},
            inputCanvasEventListeners: {},
        }, options);

        this.on('addedEventSubscriber', this.onAddedEventSubscriber.bind(this));
        this.on('removedEventSubscriber', this.onRemovedEventSubscriber.bind(this));
    }

    onAddedEventSubscriber(_, [event, sub, once, subsLeft])
    {
        const eventListeners = this.userCanvasEventListeners[event];
        if (eventListeners && subsLeft === 1 && this.canvas)
        {
            const listener = this.inputCanvasEventListeners[event] = e => this.handleEvent(event, e);
            this.canvas.addEventListener(event, 
                listener, 
                false);
        }
    }

    onRemovedEventSubscriber(_, [event, sub, once, subsLeft])
    {
        const listener = this.inputCanvasEventListeners[event];
        if(subsLeft === 0 && this.canvas && listener)
            this.canvas.removeEventListener(event, listener, false);
    }

    handleEvent(event, e)
    {
        this.userCanvasEventListeners[event](e);
        this.trigger(event, e);
    }
}

Object.assign(ClientInput.prototype, EventSourceMixin);

export default ClientInput;
