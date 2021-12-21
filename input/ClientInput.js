import EventSourceMixin from '../EventSourceMixin';

class ClientInput {
    constructor(options) {
        Object.assign(this, {
            canvasEventListeners: {}, // defined by input handler class
            domCanvasEventListeners: {}, // is used to remove listener from DOM when it is no longer needed
        }, options);

        // custom event subscription handlers
        this.on('addedEventSubscriber', this.onAddedEventSubscriber.bind(this));
        this.on('removedEventSubscriber', this.onRemovedEventSubscriber.bind(this));
    }

    onAddedEventSubscriber(_, [event, sub, once, subsLeft])
    {
        const eventListeners = this.canvasEventListeners[event];
        if (eventListeners && subsLeft === 1 && this.canvas)
        {
            // when new event type is introduced, add DOM event listener
            const listener = this.domCanvasEventListeners[event] = e => this.handleDomEvent(event, e);
            this.canvas.addEventListener(event, 
                listener, 
                false);
        }
    }

    onRemovedEventSubscriber(_, [event, sub, once, subsLeft])
    {
        const listener = this.domCanvasEventListeners[event];
        if(subsLeft === 0 && this.canvas && listener)
            // when there are no more listeners for this event, remove DOM event listener
            this.canvas.removeEventListener(event, listener, false);
        delete this.domCanvasEventListeners[event];
    }

    handleDomEvent(event, e)
    {
        this.canvasEventListeners[event](e);
        this.trigger(event, e);
    }
}

Object.assign(ClientInput.prototype, EventSourceMixin);

export default ClientInput;
