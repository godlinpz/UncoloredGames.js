import binarySearch from '../../util/binarySearch.mjs';
// import jest from 'jest-mock';

describe('Binary search', () => {
    test('on empty array returns [false, 0]', () => {        
        expect(binarySearch([], 1)).toEqual([false, 0]);
    });

    test('returns [false, array_len] if the value is bigger than any number in array', () => {        
        expect(binarySearch([3, 4, 5, 6, 7], 9)).toEqual([false, 5]);
    });

    test('returns [false, 0] if the value is less than any number in array', () => {        
        expect(binarySearch([3, 4, 6, 7], 1)).toEqual([false, 0]);
    });

    test('returns [false, place_to_insert] if the value is within array but is not there', () => {        
        expect(binarySearch([3, 4, 6, 7], 5)).toEqual([false, 2]);
    });

    test('returns [true, index] if the value is in array', () => {        
        expect(binarySearch([3, 4, 5, 6, 7], 5)).toEqual([true, 2]);
        expect(binarySearch([3, 4, 5, 6, 7], 3)).toEqual([true, 0]);
        expect(binarySearch([3, 4, 5, 6, 7], 7)).toEqual([true, 4]);
    });

});