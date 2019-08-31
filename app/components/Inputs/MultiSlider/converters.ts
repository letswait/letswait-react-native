// Find closest index for a given value
const closest = (array: number[], n: number) => {
  let minI = 0;
  let maxI = array.length - 1;

  if (array[minI] > n) {
    return minI;
  }
  if (array[maxI] < n) {
    return maxI;
  }
  if (array[minI] <= n && n <= array[maxI]) {
    let closestIndex = null;

    while (closestIndex === null) {
      const midI = Math.round((minI + maxI) / 2);
      const midVal = array[midI];

      if (midVal === n) {
        closestIndex = midI;
      } else if (maxI === minI + 1) {
        const minValue = array[minI];
        const maxValue = array[maxI];
        const deltaMin = Math.abs(minValue - n);
        const deltaMax = Math.abs(maxValue - n);

        closestIndex = deltaMax <= deltaMin ? maxI : minI;
      } else if (midVal < n) {
        minI = midI;
      } else if (midVal > n) {
        maxI = midI;
      } else {
        closestIndex = -1;
      }
    }

    return closestIndex;
  }

  return -1;
};

export function valueToPosition(value: number, valuesArray: number[], sliderLength: number) {
  const index = closest(valuesArray, value);

  const arrLength = valuesArray.length - 1;
  const validIndex = index === -1 ? arrLength : index;

  return (sliderLength * validIndex) / arrLength;
}

export function positionToValue(position: number, valuesArray: number[], sliderLength: number) {
  let arrLength;
  let index;

  if (position < 0 || sliderLength < position) {
    return null;
  }
  arrLength = valuesArray.length - 1;
  index = (arrLength * position) / sliderLength;
  return valuesArray[Math.round(index)];
}

export function createArray(start: number, end: number, step: number) {
  let i;
  let length;
  const direction = start - end > 0 ? -1 : 1;
  const result: number[] = [];
  if (!step) {
    return result;
  }
  length = Math.abs((start - end) / step) + 1;
  for (i = 0; i < length; i++) {
    result.push(start + i * Math.abs(step) * direction);
  }
  return result;
}
