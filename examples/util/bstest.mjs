import { binarySearch } from '../../util/binarySearch.mjs';

function runTests() {
    // console.log(binarySearch([], 9));
    // console.log(binarySearch([3, 4, 5, 6, 7], 9));
    // console.log(binarySearch([3, 4, 6, 7], 1));
    console.log(binarySearch([3, 4, 6, 7], 5));

    // console.log(binarySearch([3, 4, 6, 7], 5));
    // console.log(binarySearch([3, 4, 5, 6, 7], 5));
    // console.log(binarySearch([3, 4, 5, 6, 7], 3));
    // console.log(binarySearch([3, 4, 5, 6, 7], 7));

    // console.log(binarySearch([{id: 3}, {id: 4}, {id: 5}, {id: 6}, {id: 7}], {id: 5}, v => v.id));
}

window.binarySearch = binarySearch;
window.runTests = runTests;