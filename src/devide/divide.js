let a = [100, 113, 110, 85, 105, 102, 86, 63, 81, 101, 94, 106, 101, 79, 94, 90, 97];
let b =       [13,  -3,-25,  20,  -3,-16,-23, 18,  20, -7,  12,  -5,-22, 15, -4,  7];

// 最大子数组
function maxSumSubArray(arr) {
    return loop(arr, 0, arr.length - 1);
    function loop(arr, low, high) {
        if (low === high) {
            return [low, high, arr[low]];
        }
        let mid = Math.floor((high + low) / 2);
        let [leftLow, leftHigh, leftSum] = loop(arr, low, mid);
        let [rightLow, rightHigh, rightSum] = loop(arr, mid + 1, high);
        let [midLow, midHigh, midSum] = findMid(arr, mid, low, high);
        if (leftSum >= rightSum && leftSum >= midSum) {
            return [leftLow, leftHigh, leftSum];
        }
        else if (rightSum >= leftSum && rightSum >= midSum) {
            return [rightLow, rightHigh, rightSum];
        }
        return [midLow, midHigh, midSum];
    }

    function findMid(arr, mid, low, high) {
        let leftSum = Number.MIN_VALUE;
        let maxLeft;
        let rightSum = Number.MIN_VALUE;
        let maxRight;
        let sum = 0;
        for (let i = mid; i >=low; i--) {
            sum += arr[i];
            if (sum > leftSum) {
                leftSum = sum;
                maxLeft = i;
            }
        }
        sum = 0;
        for (let i = mid + 1; i <= high; i++) {
            sum += arr[i];
            if (sum > rightSum) {
                rightSum = sum;
                maxRight = i;
            }
        }
        return [maxLeft, maxRight, leftSum + rightSum];
    }
}