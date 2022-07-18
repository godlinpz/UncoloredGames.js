const defaultNormalize = (a) => Number(a);

export default function (array, val, normalize = defaultNormalize) 
{
    let left = 0, right = array.length;
    const valNorm = normalize(val);
    let i = 0;    
    while(left < right && left < array.length-1 && right > 0 && i < 10) 
    {
        i++;
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