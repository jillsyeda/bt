/**
 * 插入排序
 * @param {[]}arr
 * @param {function}fn true:asc false:desc
 * @param {{}}detail 比较细节
 */
module.exports.insertSort = function (arr, fn, detail) {
    let dArr;
    if (detail) {
        detail.data = [...arr];
        detail.process = [];
        dArr = detail.process;
    }
    for (let i = 1; i < arr.length; i++) {
        let value = arr[i];
        dArr && dArr.push([0, i, value]);
        let j = i - 1;
        for (; j >= 0; j--) {
            dArr && dArr.push([1, j, arr[j]]);
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
};

/**
 * 归并排序
 * @param {[]}arr
 * @param {function}fn
 */
function mergeSort(arr, fn) {
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
        let i = k;
        while (i <= r) {
            if (leftIndex >= q - k + 1 || (rightIndex < r - q && fn(left[leftIndex], right[rightIndex]))) {
                arr[i] = right[rightIndex++];
            } else if (rightIndex >= r - q || (leftIndex < q - k + 1 && !fn(left[leftIndex], right[rightIndex]))) {
                arr[i] = left[leftIndex++];
            }
            i++;
        }
    }
}