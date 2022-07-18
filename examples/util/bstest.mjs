import binarySearch from '../../util/binarySearch.mjs';

console.log(binarySearch([], 9));
console.log(binarySearch([3, 4, 5, 6, 7], 9));
console.log(binarySearch([3, 4, 6, 7], 1));
console.log(binarySearch([3, 4, 6, 7], 5));
console.log(binarySearch([3, 4, 5, 6, 7], 5));
console.log(binarySearch([3, 4, 5, 6, 7], 3));
console.log(binarySearch([3, 4, 5, 6, 7], 7));

window.binarySearch = binarySearch;