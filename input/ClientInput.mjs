import EventSourceMixin from '../EventSourceMixin.mjs';

function extractEventNameBase(event)
{
    return event.split('_')[0];
}

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

    onAddedEventSubscriber([{event}, subsLeft])
    {
        const baseEvent = extractEventNameBase(event);
        const eventListener = this.canvasEventListeners[baseEvent];

        if (eventListener && subsLeft === 1 && this.canvas)
        {
            // when new event type is introduced, add DOM event listener
            const listener = this.domCanvasEventListeners[baseEvent] = e => this.handleDomEvent(baseEvent, e);
            this.canvas.addEventListener(baseEvent, 
                listener, 
                false);
        }
    }

    onRemovedEventSubscriber([{event}, subsLeft])
    {
        const baseEvent = extractEventNameBase(event);
        const listener = this.domCanvasEventListeners[baseEvent];

        if(subsLeft === 0 && this.canvas && listener)
            // when there are no more listeners for this event, remove DOM event listener
            this.canvas.removeEventListener(baseEvent, listener, false);
        delete this.domCanvasEventListeners[baseEvent];
    }

    handleDomEvent(event, e)
    {
        this.canvasEventListeners[event](e);
        this.trigger(event, e);
    }
}

Object.assign(ClientInput.prototype, EventSourceMixin);

export default ClientInput;
