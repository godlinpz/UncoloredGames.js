import EventSourceMixin from '../EventSourceMixin.mjs';
import jest from 'jest-mock';

class EventSourceMixinTest {}
Object.assign(EventSourceMixinTest.prototype, EventSourceMixin);


describe('Test EventSourceMixin', () => {

    function init()
    {
        const callback = jest.fn();
        return {
            callback, 
            es: new EventSourceMixinTest(),
        };
    }

    test('adds permanent subscriber to an event', () => {
        const {callback, es} = init();
        es.on('test', callback);
        expect(es.__eventSourceData.subscribers['test'].permanent[0]).toEqual({
            event: 'test', handler: callback, queued: false, once: false
        });
    });

    test('adds one-off subscriber to an event', () => {
        const {callback, es} = init();
        es.once('test', callback);
        expect(es.__eventSourceData.subscribers['test'].once[0]).toEqual({
            event: 'test', handler: callback, queued: false, once: true
        });
    });

    test('adds queued subscriber to an event', () => {
        const {callback, es} = init();
        es.on('test', callback, true);
        es.trigger('test');
        expect(es.__eventSourceData.subscribers['test'].permanent[0]).toEqual({
            event: 'test', handler: callback, queued: true, once: false
        });
        expect(callback).not.toHaveBeenCalled();
    });

    test('runs queued subscriber to an event', () => {
        const {callback, es} = init();
        es.on('test', callback, true);
        es.trigger('test');
        es.runEventQueue();
        expect(callback).toHaveBeenCalled();
    });

    test('un removes subscriber from an event', () => {
        const {callback, es} = init();
        es.once('test', callback);
        es.un('test', callback);
        expect(es.__eventSourceData.subscribers['test'].once.length).toBe(0);
    });

    test('calls subscriber on event trigger', () => {
        const {callback, es} = init();
        es.on('test', callback);
        es.trigger('test', 1);
        expect(callback).toHaveBeenCalledWith([1], 
            es.__eventSourceData.subscribers['test'].permanent[0],
            es
        );
    });

    test('triggers addedEventSubscriber event', () => {
        const {callback, es} = init();
        es.on('addedEventSubscriber', callback);
        
        expect(callback).toHaveBeenCalledWith(
            [es.__eventSourceData.subscribers['addedEventSubscriber'].permanent[0], 1],
            es.__eventSourceData.subscribers['addedEventSubscriber'].permanent[0],
            es
        );
    });

    test('triggers removedEventSubscriber event', () => {
        const {callback, es} = init();
        es.on('removedEventSubscriber', callback);
        const callbackStub = ()=>{};
        es.on('test', callbackStub);
        const subObject = es.__eventSourceData.subscribers['removedEventSubscriber'].permanent[0];

        es.un('test', callbackStub);

        expect(callback).toHaveBeenCalledWith(
            [{event: 'test', handler: callbackStub}, 0],
            subObject,
            es
        );
    });
    
    
});
