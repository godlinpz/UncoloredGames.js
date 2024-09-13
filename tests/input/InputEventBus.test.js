import InputEventBus from '../../src/input/InputEventBus.mjs';
import jest from 'jest-mock';


describe('Input Event Bus', () => {

    function init(opts)
    {
        const callback = jest.fn();
        return {
            callback, 
            ieb: new InputEventBus(),
        };
    }

    test('is initialized properly', () => {
        const {ieb} = init();

        expect(ieb.keyboard).toBeTruthy();
        expect(ieb.mouse).toBeTruthy();

    });

    test('runs an event in queue', () => {
        const {callback, ieb} = init();
        const ki = ieb.keyboard;

        ki._events.on('keydown_Space', callback, null, 'default');
        ki.handleDomEvent('keydown', {code: 'Space'});

        expect(typeof ieb.queues.default[0]).toBe('function');

        ieb.popEvent('default');
        expect(callback).toHaveBeenCalled();
    });

    
});