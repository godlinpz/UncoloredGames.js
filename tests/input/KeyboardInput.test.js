import KeyboardInput from '../../input/KeyboardInput.mjs';
import jest from 'jest-mock';


describe('Keyboard input', () => {

    function init()
    {
        const callback = jest.fn();
        return {
            callback, 
            ki: new KeyboardInput({
                canvas: {
                    addEventListener: jest.fn(),
                    removeEventListener: jest.fn(),
                },
            }),
        };
    }

    test('triggers key down with button specified', () => {
        const {callback, ki} = init();

        ki._events.on('keydown_Space', callback);
        ki.handleDomEvent('keydown', {code: 'Space'});

        expect(callback).toHaveBeenCalled();
    });

    test('triggers key up with button specified', () => {
        const {callback, ki} = init();

        ki._events.on('keyup_Space', callback);
        ki.handleDomEvent('keyup', {code: 'Space'});

        expect(callback).toHaveBeenCalled();
    });
});