import MouseInput from '../../input/MouseInput.mjs';
import jest from 'jest-mock';


describe('Mouse input', () => {

    function init()
    {
        const callback = jest.fn();
        return {
            callback, 
            mi: new MouseInput({
                canvas: {
                    addEventListener: jest.fn(),
                    removeEventListener: jest.fn(),
                },
            }),
        };
    }

    test('triggers mouse down with button specified', () => {
        const {callback, mi} = init();

        mi._events.on('mousedown_left', callback);
        mi.handleDomEvent('mousedown', {button: 0});

        expect(callback).toHaveBeenCalled();
    });

    test('triggers mouse up with button specified', () => {
        const {callback, mi} = init();

        mi._events.on('mouseup_left', callback);
        mi.handleDomEvent('mouseup', {button: 0});

        expect(callback).toHaveBeenCalled();
    });

    test('remembers x and y on mouse move', () => {
        const {mi} = init();

        mi.handleDomEvent('mousemove', {layerX: 1, layerY: 2});

        expect(mi.x).toBe(1);
        expect(mi.y).toBe(2);
        expect(mi.isInside).toBe(true);
    });

    test('remembers mouse entered the canvas', () => {
        const {mi} = init();

        expect(mi.isInside).toBe(false);

        mi.handleDomEvent('mouseenter', {});
        expect(mi.isInside).toBe(true);
    });

    test('remembers mouse is out of the canvas', () => {
        const {mi} = init();
        mi.isInside = true;
        mi.handleDomEvent('mouseout', {});
        expect(mi.isInside).toBe(false);
    });

    test('remembers mouse left the canvas', () => {
        const {mi} = init();
        mi.isInside = true;
        mi.handleDomEvent('mouseleave', {});
        expect(mi.isInside).toBe(false);
    });

    test('disables context menu for the canvas', () => {
        const {mi} = init();
        
        mi.disableContextMenu();

        expect(mi.canvas.addEventListener).toBeCalledWith("contextmenu", expect.any(Function));
    });

});