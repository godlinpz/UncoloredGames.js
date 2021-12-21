// hidden function
function pushEvent (me, event, sub, once) {
    const subs = me.__eventSubscribers || (me.__eventSubscribers = {});
    subs[event] || (subs[event] = {once:[], always: []});
    subs[event][once ? 'once': 'always'].push(sub);
    me.trigger('addedEventSubscriber', event, sub, once);
}

export default {
    __eventSubscribers: [],

    on: function (event, callback) {
        pushEvent(this, event, callback, true);
    },

    once: function (event, callback) {
        pushEvent(this, event, callback, false);
    },

    un: function (event, subToUnsubscribe) {
        const subs = this.__eventSubscribers;

        if (subs && subs[event]) 
        {
            const eventSubs = subs[event];
            ['once', 'always'].forEach(type => {
                const oldLength = eventSubs[type].length;
                eventSubs[type] = eventSubs[type].filter((sub) => sub !== subToUnsubscribe);
                if( oldLength !== eventSubs[type].length )
                    this.trigger('removedEventSubscriber', event, subToUnsubscribe, type==='once');
            });
        }

    },

    trigger: function (event, ...data = null) {
        const subs = this.__eventSubscribers;
        const call = (sub) => sub(event, data, this);

        if (subs && subs[event]) {
            const eventSubs = subs[event];
            // вызываем одноразовые обработчики
            eventSubs.once.forEach(call);
            // удаляем одноразовые обработчики
            eventSubs.once = [];
            // вызываем многоразовые обработчики
            eventSubs.always.forEach(call);
        }
    },
};
