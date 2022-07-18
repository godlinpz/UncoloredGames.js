import { binarySearch, binarySearchInsert } from '../../util/binarySearch.mjs';

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

    test('uses normalisation function and returns [true, index] if the value is in array', () => {        
        expect(binarySearch([{id: 3}, {id: 4}, {id: 5}, {id: 6}, {id: 7}], {id: 5}, v => v.id)).toEqual([true, 2]);
    });

    test('inserts value at appropriate position', () => {        
        expect(binarySearchInsert([3, 4, 5, 6, 7], 2)).toEqual([2, 3, 4, 5, 6, 7]);
        expect(binarySearchInsert([3, 4, 5, 6, 7], 5)).toEqual([3, 4, 5, 5, 6, 7]);
        expect(binarySearchInsert([3, 4, 5, 6, 7], 9)).toEqual([3, 4, 5, 6, 7, 9]);
        expect(binarySearchInsert([3, 4, 5, 7, 8], 6)).toEqual([3, 4, 5, 6, 7, 8]);
    });

});