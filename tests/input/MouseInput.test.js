import MouseInput from '../../input/MouseInput.mjs';
import jest from 'jest-mock';


describe('Mouse input', () => {

    function init(opts)
    {
        const callback = jest.fn();
        return {
            callback, 
            ci: new MouseInput({
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

    test('triggers mouse down', () => {


    });

});