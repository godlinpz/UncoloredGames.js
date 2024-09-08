import EventSource from '../../src/util/EventSource.mjs';
import { jest } from '@jest/globals';
import jestMock from 'jest-mock';

describe('Test EventSource', () => {
    let es = null;
    let target = {};
    let callback = jestMock.fn();

    beforeEach(() => {
        target = {};
        es = new EventSource(target);
    });

    afterEach(() => {
        jest.resetAllMocks();
    })

    test('adds permanent subscriber to an event', () => {
        es.on('test', callback);
        expect(es.subscribers['test'].permanent[0]).toEqual({
            event: 'test', handler: callback, queue: '', once: false, handlerGroupId: null,
        });
    });

    test('adds one-off subscriber to an event', () => {
        es.once('test', callback);
        expect(es.subscribers['test'].once[0]).toEqual({
            event: 'test', handler: callback, queue: false, once: true, handlerGroupId: null,
        });
    });

    test('adds queued subscriber to an event', () => {
        es.on('test', callback, null, 'default');
        es.trigger('test');
        expect(es.subscribers['test'].permanent[0]).toEqual({
            event: 'test', handler: callback, queue: 'default', once: false, handlerGroupId: null,
        });
        expect(callback).not.toHaveBeenCalled();
    });

    test('runs queued subscribers', () => {
        es.on('test', callback, null, 'default');
        es.trigger('test');
        es.runEventQueue('default');
        expect(callback).toHaveBeenCalled();
    });

    test('un removes subscriber from an event', () => {
        es.once('test', callback);
        es.un('test', callback);
        expect(es.subscribers['test'].once.length).toBe(0);
    });

    test('calls subscriber on an event trigger', () => {
        es.on('test', callback);
        es.trigger('test', 1);
        expect(callback).toHaveBeenCalledWith([1], 
            es.subscribers['test'].permanent[0],
            es.target
        );
    });

    test('calls subscriber on an ANY event trigger', () => {
        es.on('any', callback);
        es.trigger('test', 1);
        expect(callback).toHaveBeenCalledWith([1], 
            es.subscribers['any'].permanent[0],
            es.target
        );
    });

    test('triggers addedEventSubscriber event', () => {
        es.on('addedEventSubscriber', callback);
        
        expect(callback).toHaveBeenCalledWith(
            [es.subscribers['addedEventSubscriber'].permanent[0], 1],
            es.subscribers['addedEventSubscriber'].permanent[0],
            es.target
        );
    });

    test('triggers removedEventSubscriber event by handler', () => {
        es.on('removedEventSubscriber', callback);
        const callbackStub = ()=>{};
        es.on('test', callbackStub);
        const subObject = es.subscribers['removedEventSubscriber'].permanent[0];

        es.un('test', callbackStub);

        expect(callback).toHaveBeenCalledWith(
            [{event: 'test', handler: callbackStub, handlerGroupId: null}, 0],
            subObject,
            es.target
        );
    });

    test('triggers removedEventSubscriber event by handlerGroupId', () => {
        es.on('removedEventSubscriber', callback);
        es.on('test', null, 'group');
        const subObject = es.subscribers['removedEventSubscriber'].permanent[0];

        es.un('test', null, 'group');

        expect(callback).toHaveBeenCalledWith(
            [{event: 'test', handler: null, handlerGroupId: 'group'}, 0],
            subObject,
            es.target
        );
    });

    
});
