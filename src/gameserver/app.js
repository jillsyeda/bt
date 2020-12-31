// 算法导论

/**
 * 插入排序
 * @param {array}arr
 */
function insertSort(arr) {
    let sortArr = [];
    for (let i = 0; i < arr.length; i++) {
        let length = sortArr.length;
        if (length === 0) {
            sortArr.push(arr[i]);
            continue;
        }
        let bInsert = false;
        for (let j = 0; j < length; j++) {
            if (arr[i] <= sortArr[j]) {
                let tmp = sortArr[j];
                sortArr[j] = arr[i];
                sortArr[j + 1] = tmp;
                bInsert = true;
                break;
            }
        }
        if (!bInsert) {
            sortArr.push(arr[i]);
        }
    }
    return sortArr;
}

/**
 * 检讨，insertSort使用了2个数组，改进如下
 * @param {[]}arr
 */
function insertionSort(arr) {
    for (let i = 1; i < arr.length; i++) {
        let key = arr[i];
        let j = i - 1;
        for (; j >= 0 && arr[j] > key; j--) {
            arr[j + 1] = arr[j];
        }
        arr[j + 1] = key;
    }
}

/**
 * 插入配许降序版本
 * @param {[]}arr
 */
function insertSortDesc(arr) {
    for (let i = 1; i < arr.length; i++) {
        let key = arr[i];
        let j = i - 1;
        for (; j >= 0 && arr[j] < key; j--) {
            arr[j + 1] = arr[j];
        }
        arr[j + 1] = key;
    }
}

/**
 * 插入排序
 * @param {[]}arr
 * @param {function}fn
 */
function insertSortByFn(arr, fn) {
    for (let i = 1; i < arr.length; i++) {    // 执行arr.length次 计为n次
        let key = arr[i];                     // n-1
        let j = i - 1;                        // n-1
        for (; j >= 0; j--) {                 //
            if (fn(arr[j], key)) {
                arr[j + 1] = arr[j];
            } else {
                break;
            }
        }
        arr[j + 1] = key;
    }
}

let a = [5, 2, 9, 4, 8, 7, 1];
insertSortByFn(a, (a, b) => {
    return a < b;
});
console.log(a);
