function filterDataByRange(data, min, max) {
    return data.filter(item => item.x >= min && item.x <= max);
};

const filterDataByTwoRanges = (data, xDomain, yDomain) => {
    if (xDomain === null || yDomain === null) {
        return null;
    } else {
        return data.filter(
            (d) =>
                d.x >= xDomain[0] &&
                d.x <= xDomain[1] &&
                d.y >= yDomain[0] &&
                d.y <= yDomain[1]
            );
    }
};

function arraysAreEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) {
      return false;
    }

    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) {
        return false;
      }
    }

    return true;
};

function findMinMax(arr, key) {
    let min = arr[0][key];
    let max = arr[0][key];
  
    for (const obj of arr) {
      if (obj[key] < min) {
        min = obj[key];
      }
      if (obj[key] > max) {
        max = obj[key];
      }
    }
  
    return [min, max];
};