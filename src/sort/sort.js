module.exports = {
    insertSort: insertSort,
    mergeSort: mergeSort,
    quickSort: quickSort,
    heapSort: heapSort
};

/**
 * 插入排序
 * @param {[]}arr
 * @param {function}fn true:asc false:desc
 * @param {[]}dArr 比较细节
 */
function insertSort(arr, fn, dArr) {
    for (let i = 1; i < arr.length; i++) {
        let value = arr[i];
        let j = i - 1;
        for (; j >= 0; j--) {
            dArr && dArr.push([0, i, value, j, arr[j]]);
            if (fn(arr[j], value)) {
                arr[j + 1] = arr[j];
                dArr && dArr.push([2, j + 1, arr[j]])
            } else {
                break
            }
        }
        arr[j + 1] = value;
        dArr && dArr.push([2, j + 1, value]);
    }
}

/**
 * 归并排序
 * @param {[]}arr
 * @param {function}fn
 * @param {[]}dArr
 */
function mergeSort(arr, fn, dArr) {
    loop(arr, 0, arr.length - 1);

    function loop(arr, p, r) {
        if (p < r) {
            let q = parseInt((p + r) / 2);
            loop(arr, p, q);
            loop(arr, q + 1, r);
            merge(arr, p, q, r);
        }
    }

    function merge(arr, k, q, r) {
        // 2个数组合并排序
        // [k,q],[q+1,r]
        let left = [];
        for (let j = k; j <= q; j++) {
            left.push(arr[j]);
        }
        let right = [];
        for (let j = q + 1; j <= r; j++) {
            right.push(arr[j]);
        }
        let leftIndex = 0;
        let rightIndex = 0;
        for (let i = k; i <= r; i++) {
            let leftElement = left[leftIndex];
            let rightElement = right[rightIndex];
            if (dArr) {
                let lTmpIndex = leftIndex + k,
                    lTmpValue = leftElement,
                    rTmpIndex = rightIndex + q + 1,
                    rTmpValue = rightElement;
                if (leftElement === undefined) {
                    lTmpIndex--;
                    lTmpValue = left[leftIndex - 1];
                }
                if (rightElement === undefined) {
                    rTmpIndex--;
                    rTmpValue = right[rightIndex - 1];
                }
                dArr.push([0, lTmpIndex, lTmpValue, rTmpIndex, rTmpValue]);
            }
            if (leftIndex >= q - k + 1 || (rightIndex < r - q && fn(leftElement, rightElement))) {
                arr[i] = right[rightIndex++];
            } else if (rightIndex >= r - q || (leftIndex < q - k + 1 && !fn(leftElement, rightElement))) {
                arr[i] = left[leftIndex++];
            }
            dArr && dArr.push([2, i, arr[i]]);
        }
    }
}

/**
 * 快速排序
 * @param {[]}arr
 * @param {function}fn
 * @param {[]}dArr
 */
function quickSort2(arr, fn, dArr) {
    loop(arr, 0, arr.length - 1, 0);
    function loop(arr, p, q, r) {
        let leftIndex = p - 1;
        let value = arr[r];
        for (let i = p; i <= q; i++) {
            dArr && dArr.push([0, r, value, i, arr[i]]);
            if (fn(value, arr[i])) {
                leftIndex++;
                if (i !== leftIndex) {
                    swap(arr, leftIndex, i);
                    dArr && dArr.push([2, leftIndex, arr[leftIndex]]);
                    dArr && dArr.push([2, i, arr[i]]);
                }
            }
        }
        if (leftIndex > p) {
            loop(arr, p, leftIndex, p);
        }
        if (leftIndex === p - 1) {
            leftIndex++;
        }
        if (leftIndex + 1 < q) {
            loop(arr, leftIndex + 1, q, leftIndex + 1);
        }
    }
}

/**
 *
 * @param {[]}arr
 * @param {function}fn
 * @param {[]}dArr
 */
function quickSort(arr, fn, dArr) {
    loop(arr, 0, arr.length - 1);
    function loop(arr, p, q) {
        if (p >= q) {
            return;
        }
        let base = arr[p];
        let low = p;
        let high = q;
        while (low < high) {
            while (base <= arr[high]) {
                dArr && dArr.push([0, p, base, high, arr[high]]);
                high--;
                if (low >= high) {
                    break;
                }
            }
            while (low < high && arr[low] <= base) {
                dArr && dArr.push([0, p, base, low, arr[low]]);
                low++;
                if (low >= high) {
                    break;
                }
            }
            if (low < high) {
                swap(arr, low, high);
                dArr.push([2, low, arr[low]]);
                dArr.push([2, high, arr[high]]);
            }
        }
        if (arr[p] != arr[low]) {
            arr[p] = arr[low];
            arr[low] = base;
            dArr.push([2, p, arr[p]]);
            dArr.push([2, low, arr[low]]);
        }

        loop(arr, p, low - 1);
        loop(arr, low + 1, q);
    }
}

function swap(arr, i, j) {
    let tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
}

/**
 * 堆排序
 * @param {[]}arr
 * @param {function}fn
 * @param {[]}dArr
 */
function heapSort(arr, fn, dArr) {
    GenMaxOrMinHeap(arr, arr.length - 1);
    let i = arr.length;
    while (i-- > 0) {
        loopHeap(arr, 0, i);
        swap(arr, 0, i);
        dArr && dArr.push([2, 0, arr[0]]);
        dArr && dArr.push([2, i, arr[i]]);
    }
    function GenMaxOrMinHeap(arr, element) {
        if (element < 0) {
            return;
        }
        let root = Math.round(element / 2) - 1;
        loopHeap(arr, root, arr.length - 1);
        GenMaxOrMinHeap(arr, element - 1 === root * 2 + 1 ? element - 2 : element - 1);
    }

    function loopHeap(arr, root, end) {
        let left = root * 2 + 1;
        let right = left + 1;
        if (left <= end) {
            let next = compHeapElement(arr, left, right, root, end);
            if (next !== undefined) {
                loopHeap(arr, next, end);
            }
        }
    }

    function compHeapElement(arr, left, right, root, rightMax) {
        let max = left;
        if (right <= rightMax) {
            dArr && dArr.push([0, left, arr[left], right, arr[right]]);
            if (fn(arr[right], arr[left])) {
                max = right;
            }
        }
        if (root >= 0) {
            dArr && dArr.push([0, max, arr[max], root, arr[root]]);
            if (fn(arr[max], arr[root])) {
                swap(arr, max, root);
                dArr && dArr.push([2, max, arr[max]]);
                dArr && dArr.push([2, root, arr[root]]);
                return max;
            }
        }
    }
}