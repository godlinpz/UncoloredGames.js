// hidden function
function pushEvent (me, eventName, subscriber, once) {
    const events = typeof eventName === 'string' ? {[eventName]: subscriber}: eventName;
    const subs = me.__eventSubscribers;

    for(let event in events) {
        const sub = events[event];
        subs[event] || (subs[event] = {once:[], always: []});
        const eventSubs = subs[event];
        eventSubs[once ? 'once': 'always'].push(sub);
        me.trigger('addedEventSubscriber', event, sub, once, 
            eventSubs.once.length + eventSubs.always.length)
    };
}

export default {
    __eventSubscribers: {},

    on: function (event, callback = null) {
        pushEvent(this, event, callback, false);
    },

    once: function (event, callback = null) {
        pushEvent(this, event, callback, true);
    },

    un: function (eventName, subToUnsubscribe = null) {
        const events = typeof eventName === 'string' ? {eventName: subToUnsubscribe}: eventName;
        const subs = this.__eventSubscribers;

        for(let event in events) {
            if (subs && subs[event]) 
            {
                const subToUn = events[event];
                const eventSubs = subs[event];
                ['once', 'always'].forEach(type => {
                    const oldLength = eventSubs[type].length;
                    eventSubs[type] = eventSubs[type].filter((sub) => sub !== subToUn);
                    if( oldLength !== eventSubs[type].length )
                        this.trigger('removedEventSubscriber', event, subToUn, type==='once',
                            eventSubs.once.length + eventSubs.always.length    
                        );
                });
            }
        }
    },

    trigger: function (event, ...data) {
        const subs = this.__eventSubscribers;
        const call = (sub) => sub(data, event, this);

        if (subs && subs[event]) {
            const eventSubs = subs[event];
            // вызываем одноразовые обработчики
            // они имеют преимущетсво перед постоянными обработчиками
            eventSubs.once.forEach(call);
            // удаляем одноразовые обработчики
            eventSubs.once = [];
            // вызываем многоразовые обработчики
            eventSubs.always.forEach(call);
        }
    },
};
