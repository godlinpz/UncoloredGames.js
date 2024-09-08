import LayersManager from "../../src/layers/LayersManager.mjs";
import jest from 'jest-mock';

describe('Layers Manager', () => {

    function init()
    {
        const callback = jest.fn();
        return {
            callback, 
            layers: new LayersManager(),
        };
    }

    test('adds layer to the set at given position', () => {
        const {callback, layers} = init();

        layers.add(2);
        layers.add(1, 0);
        layers.add(4);
        layers.add(3, 2);

        expect(layers.layers).toEqual([1, 2, 3, 4]);
    });

    test('adds layer to the set at given position', () => {
        const {callback, layers} = init();

        layers.add(2);
        layers.add(1, 0);
        layers.add(4);
        layers.add(3, 2);

        expect(layers.layers).toEqual([1, 2, 3, 4]);
    });

    test('removes layer from the set', () => {
        const {callback, layers} = init();

        layers.add(1);
        layers.add(2);
        layers.add(3);
        layers.remove(2);

        expect(layers.layers).toEqual([1, 3]);
    });

    test('removes layer at given position from the set', () => {
        const {callback, layers} = init();

        layers.add(1);
        layers.add(2);
        layers.add(3);
        layers.removeAt(1);

        expect(layers.layers).toEqual([1, 3]);
    });

    test('moves layer at given position to another position', () => {
        const {callback, layers} = init();

        layers.add(1);
        layers.add(2);
        layers.add(3);
        layers.add(4);
        layers.add(5);

        layers.move(1, 3); // 1, 3, 4, 2, 5
        layers.move(0, 4); // 3, 4, 2, 5, 1
        layers.move(3, 1); // 3, 5, 4, 3, 1

        expect(layers.layers).toEqual([3, 5, 4, 2, 1]);
    });

    test('removes empty position from the set', () => {
        const {callback, layers} = init();

        layers.layers = [null, 1, null, 2, null, null, 3, null];
        layers.compact();
        expect(layers.layers).toEqual([1, 2, 3]);
    });

    test('can iterate through the set', () => {
        const {callback, layers} = init();
        const collect = [];
        layers.layers = [1, 2, 3];

        for(let l of layers)
            collect.push(l);
            
        expect(collect).toEqual([1, 2, 3]);
    });
})