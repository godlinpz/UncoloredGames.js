class EventSource {
    constructor (target) {
        this.target = target;
        this.subscribers = {};
        this.queues = {};
    }

    pushEventHandler (eventName, handler, handlerGroupId, once, queue) {
        if (handler || handlerGroupId) {
            const events = typeof eventName === 'string' 
                ? [{event: eventName, handler, handlerGroupId, queue, once}]
                : eventName;
            const subs = this.subscribers;
    
            if (queue && !this.queues[queue]) 
                this.queues[queue] = [];
    
            for(let i = 0; i < events.length; ++i) {
                const {event, once} = events[i];
                subs[event] || (subs[event] = {once:[], permanent: []});
                const eventSubs = subs[event];
                eventSubs[once ? 'once': 'permanent'].push(events[i]);
                this.trigger('addedEventSubscriber', events[i], 
                    eventSubs.once.length + eventSubs.permanent.length)
            };
        }
    }

    // Event can be either a string name of an event or an array of {event, handler} pairs
    on (event, handler = null, handlerGroupId = null, queue = '') {
        this.pushEventHandler(event, handler, handlerGroupId, false, queue);
    }

    once (event, handler = null, handlerGroupId = null, queue = false) {
        this.pushEventHandler(event, handler, handlerGroupId, true, queue);
    }

    // remove event handler by groupId or by handler function
    un (eventsList, handler = null, handlerGroupId = null) {
        const events = typeof eventsList === 'string' 
            ? [{event: eventsList, handler, handlerGroupId}]
            : eventsList;
        const subs = this.subscribers;

        for(let i = 0; i < events.length; ++i) {
            const {event, handler, handlerGroupId} = events[i];
            if (subs && subs[event]) 
            {
                const eventSubs = subs[event];
                ['once', 'permanent'].forEach(type => {
                    const oldLength = eventSubs[type].length;
                    eventSubs[type] = eventSubs[type].filter(
                        ({handler: hnd, handlerGroupId: grp}) => !(hnd && hnd === handler || grp && grp === handlerGroupId)
                    );
                    if( oldLength !== eventSubs[type].length )
                        this.trigger('removedEventSubscriber', events[i],
                            eventSubs.once.length + eventSubs.permanent.length    
                        );
                });
            }
        }
    }

    trigger (event, ...data) {
        // console.log('trigger', event, data);
        const subs = this.subscribers;
        const call = (sub) => {
            if (sub.queue)
            {
                this.queues[sub.queue].push(
                    ()=> sub.handler(data, sub, this.target) 
                );
            }
            else
                sub.handler(data, sub, this.target);            
        }

        const callEventHandlers = (event) => {
            if (subs && subs[event]) {
                const eventSubs = subs[event];
                // вызываем одноразовые обработчики
                // они имеют преимущетсво перед постоянными обработчиками
                eventSubs.once.forEach(call);
                // удаляем одноразовые обработчики
                eventSubs.once = [];
                // вызываем многоразовые обработчики
                eventSubs.permanent.forEach(call);
            }
        }

        callEventHandlers(event);
        callEventHandlers('any');
    }

    runEventQueue(queue = 'default', numberToRun = 0) {
        const number = numberToRun || this.queues[queue].length;

        for (let i = 0; i < number; ++i)
            this.queues[queue][i]();

        this.queues[queue] = this.queues[queue].slice(number);
    }
};

EventSource.isEventSource = (target) => target._events instanceof EventSource;
EventSource.getEventSource = (target) => target._events;
EventSource.createEventSource = (target) => target._events = new EventSource(target);

export default EventSource;
