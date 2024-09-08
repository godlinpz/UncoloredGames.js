import EventSource from '../util/EventSource.mjs';

const extractEventNameBase = (event) => event.split('_')[0];

class ClientInput {
    constructor(options) {
        Object.assign(this, {
            canvasEventListeners: {}, // defined by input handler class
            domCanvasEventListeners: {}, // is used to remove listener from DOM when it is no longer needed
            queued: false, // this flag is used to defines if the events should be queued instead of triggered immediately
        }, options);

        EventSource.createEventSource(this);

        // custom event subscription handlers
        this._events.on('addedEventSubscriber', (...args) => this.onAddedEventSubscriber(...args));
        this._events.on('removedEventSubscriber', (...args) => this.onRemovedEventSubscriber(...args));
    }

    onAddedEventSubscriber([{event}, subsLeft])
    {
        const domEvent = extractEventNameBase(event);
        const eventListener = this.canvasEventListeners[domEvent];
        const domListener = this.domCanvasEventListeners[domEvent] 

        if (!domListener && eventListener && subsLeft === 1 && this.canvas)
        {
            // console.log('adding DOM listener', event);
            // when new event type is introduced, add DOM event listener
            const listener = this.domCanvasEventListeners[domEvent] 
                = e => this.handleDomEvent(domEvent, e);
            this.canvas.addEventListener(domEvent, 
                listener, 
                false);
        }
    }

    onRemovedEventSubscriber([{event}, subsLeft])
    {
        const domEvent = extractEventNameBase(event);
        const listener = this.domCanvasEventListeners[domEvent];

        if(subsLeft === 0 && this.canvas && listener)
            // when there are no more listeners for this event, remove DOM event listener
            this.canvas.removeEventListener(domEvent, listener, false);
        delete this.domCanvasEventListeners[domEvent];
    }

    handleDomEvent(domEvent, e)
    {
        // console.log('handleDomEvent', domEvent, e)
        this.canvasEventListeners[domEvent](e);
        this._events.trigger(domEvent, e);
    }
}

export default ClientInput;
