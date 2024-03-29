// hidden function
function pushEventHandler (me, eventName, handler, once, queued) {
    if(!me.__eventSourceData) initDataStore(me);

    const events = typeof eventName === 'string' 
        ? [{event: eventName, handler, queued, once}]
        : eventName;
    const subs = me.__eventSourceData.subscribers;

    for(let i = 0; i < events.length; ++i) {
        const {event, once} = events[i];
        subs[event] || (subs[event] = {once:[], permanent: []});
        const eventSubs = subs[event];
        eventSubs[once ? 'once': 'permanent'].push(events[i]);
        me.trigger('addedEventSubscriber', events[i], 
            eventSubs.once.length + eventSubs.permanent.length)
    };
}

function initDataStore(me)
{
    me.__eventSourceData = {
        subscribers: {},
        queue: [],
    };
}

export default {

    // Event can be either a string name of an event or an array of {event, handler} pairs
    on (event, handler = null, queued = false) {
        pushEventHandler(this, event, handler, false, queued);
    },

    once (event, handler = null, queued = false) {
        pushEventHandler(this, event, handler, true, queued);
    },

    un (event, handler = null) {
        if(!this.__eventSourceData) initDataStore(this);

        const events = typeof event === 'string' 
            ? [{event, handler}]
            : event;
        const subs = this.__eventSourceData.subscribers;

        for(let i = 0; i < events.length; ++i) {
            const {event, handler} = events[i];
            if (subs && subs[event]) 
            {
                const eventSubs = subs[event];
                ['once', 'permanent'].forEach(type => {
                    const oldLength = eventSubs[type].length;
                    eventSubs[type] = eventSubs[type].filter(({handler: hnd}) => hnd !== handler);
                    if( oldLength !== eventSubs[type].length )
                        this.trigger('removedEventSubscriber', events[i],
                            eventSubs.once.length + eventSubs.permanent.length    
                        );
                });
            }
        }
    },

    trigger (event, ...data) {
        // console.log('trigger', event, data);
        if(!this.__eventSourceData) initDataStore(this);

        const subs = this.__eventSourceData.subscribers;
        const call = (sub) => {
            if (sub.queued)
            {
                this.__eventSourceData.queue.push(
                    ()=> sub.handler(data, sub, this) 
                );
            }
            else
                sub.handler(data, sub, this);            
        }

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
    },

    runEventQueue()
    {
        const me = this;
        if(!me.__eventSourceData) initDataStore(me);

        // console.log('runEventQueue', this.__eventSourceData.queue);
        this.__eventSourceData.queue.forEach(f => f());
        this.__eventSourceData.queue = [];
    }
};
