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
