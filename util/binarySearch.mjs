const defaultNormalize = (a) => Number(a);

export function binarySearch (array, val, normalize = defaultNormalize) 
{
    let left = 0, right = array.length;
    const valNorm = normalize(val);
    while(left < right && left < array.length-1) 
    {
        const mid = (left + right) >> 1;
        const midVal = normalize(array[mid]);
        if( midVal > valNorm )
            right = mid + 1;
        else if (midVal === valNorm)
            left = right = mid;
        else left = mid; 
        // console.log(left, mid, right);
    }

    const leftVal = array.length && normalize(array[left]);

    const valueIsFound = !!(array.length) && leftVal === valNorm;
    const valuePosition = 
        left + ((!array.length || valueIsFound || leftVal > valNorm) ? 0 : 1);

    return [valueIsFound, valuePosition];
}

export function binarySearchInsert (array, val, normalize = defaultNormalize) 
{
    const [isFound, pos] = binarySearch(array, val, normalize);
    array.splice(pos, 0, val);
    return array;
}