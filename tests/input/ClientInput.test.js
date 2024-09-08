import ClientInput from '../../src/input/ClientInput.mjs';
import jest from 'jest-mock';


describe('Client input', () => {

    function init(opts)
    {
        const callback = jest.fn();
        return {
            callback, 
            ci: new ClientInput({
                canvasEventListeners: {
                    test: jest.fn(),
                },
                canvas: {
                    addEventListener: jest.fn(),
                    removeEventListener: jest.fn(),
                },
                ...opts
            }),
        };
    }

    test('adds DOM event listeners on subscribe', () => {
        const {callback, ci} = init();
        jest.spyOn(ci, 'onAddedEventSubscriber');

        ci._events.on('test', callback);
        
        expect(ci._events.subscribers['addedEventSubscriber'].permanent[0].event).toBe('addedEventSubscriber');
        expect(ci.onAddedEventSubscriber).toHaveBeenCalledWith(
            [ expect.objectContaining({ event: 'test' }), 1],
            expect.anything(),
            expect.anything(),
        );
        expect(ci.canvas.addEventListener).toHaveBeenCalledWith("test", ci.domCanvasEventListeners['test'], false);
        expect(ci.domCanvasEventListeners['test']).toBeInstanceOf(Function);

    });

    test('adds DOM event listeners on subscribe using base name of an event', () => {
        const {callback, ci} = init();
        jest.spyOn(ci, 'onAddedEventSubscriber');

        ci._events.on('test_t', callback);

        expect(ci.canvas.addEventListener).toHaveBeenCalledWith("test", ci.domCanvasEventListeners['test'], false);
    });

    test('removes DOM event listeners on unsubscribe', () => {
        const {callback, ci} = init();
        jest.spyOn(ci, 'onRemovedEventSubscriber');

        ci._events.on('test', callback);
        
        const listener = ci.domCanvasEventListeners['test'];

        ci._events.un('test', callback);

        
        expect(ci._events.subscribers['removedEventSubscriber'].permanent[0].event).toBe('removedEventSubscriber');
        expect(ci.onRemovedEventSubscriber).toHaveBeenCalledWith(
            [ expect.objectContaining({ event: 'test' }), 0],
            expect.anything(),
            expect.anything(),
        );
        expect(ci.canvas.removeEventListener).toHaveBeenCalledWith("test", listener, false);
        expect(ci.domCanvasEventListeners['test']).toBeFalsy();
    });
    
    test('calls event handler on DOM event', () => {
        const {callback, ci} = init();
        const params = {};
        jest.spyOn(ci, 'onRemovedEventSubscriber');

        ci._events.on('test', callback);
        ci.domCanvasEventListeners['test'](params);
        
        expect(ci.canvasEventListeners['test']).toHaveBeenCalledWith(params);
        expect(callback).toHaveBeenCalledWith([params], expect.anything(), expect.anything());
    });
    
});