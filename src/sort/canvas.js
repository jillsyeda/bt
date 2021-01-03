const sort = require('./sort');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

function rand(max) {
    return Math.floor(Math.random() * max);
}

// 配置参数
let len = 1000;
// 起始位置 画矩形
let startXs = [10, 10];
let startYs = [740, 530];
let width = 0;
let padding = 1;
let maxH = 200;
let time = 1;
let frameCnt = 50;

let o = {};
let arr = [];
while (arr.length < len) {
    let n = rand(len) + 1;
    if (!o[n]) {
        o[n] = 1;
        arr.push(n)
    }
}

let jobArr = [];
for (let k in sort) {
    let obj = {};
    sort[k]([...arr], (a, b) => {
        return a > b
    }, obj);
    jobArr.push(obj);
}

/**
 * 批量显示多个任务
 * @param {[]}jobs
 */
function batchRun(jobs) {
    let cnts = [];
    let curArrs = [];
    let maxs = [];
    let focus0s = [], focus1s = [], focus2s = [], focus3s = [];
    for (let index = 0; index < jobs.length; index++) {
        cnts.push(0);
        curArrs.push([...jobs[index].data]);
        for (let number of arr) {
            if (!maxs[index] || number > maxs[index])
                maxs[index] = number
        }
    }
    let cnt = Math.pow(2, jobs.length) - 1;
    let tmp = Math.pow(2, jobs.length) - 1;
    for (let index = 0; ; index++) {
        if (cnt <= 0) {
            break;
        }
        for (let jobIndex = 0; jobIndex < jobs.length; jobIndex++) {
            if (index >= jobs[jobIndex].process.length) {
                cnt &= tmp - Math.pow(2, jobIndex);
                continue;
            }
            let data = jobs[jobIndex].process[index];
            let idx = data[1];
            let value = data[2];
            let x = startXs[jobIndex] + idx * padding;
            let h = parseInt(value / maxs[jobIndex] * maxH);
            let y = startYs[jobIndex] - h;
            if (data[0] == 0) {
                focus0s[jobIndex] = data[1];
                focus1s[jobIndex] = data[2];
                focus2s[jobIndex] = data[3];
                focus3s[jobIndex] = data[4];
            } else {
                if (data[0] == 2) {
                    curArrs[jobIndex][data[1]] = data[2]
                }
                let fx = startXs[jobIndex] + focus0s[jobIndex] * padding;
                let fh = parseInt(focus1s[jobIndex] / maxs[jobIndex] * maxH);
                let fx1 = startXs[jobIndex] + focus2s[jobIndex] * padding;
                let fh1 = parseInt(focus3s[jobIndex] / maxs[jobIndex] * maxH);
                setAction(
                    ctx,
                    [fx, startYs[jobIndex], fh, fx1, startYs[jobIndex], fh1],
                    [...curArrs[jobIndex]],
                    x,
                    y,
                    startXs[jobIndex],
                    startYs[jobIndex],
                    maxs[jobIndex],
                    time,
                    cnts[jobIndex]
                );
                ++cnts[jobIndex];
            }

            if (index === jobs[jobIndex].process.length - 1) {
                // 最后去掉焦点图形
                if (time) {
                    setTimeout(() => {
                        ctx.clearRect(0, startYs[jobIndex] - maxH - 1, canvas.width, maxH + 2);
                        drawArr(ctx, curArrs[jobIndex], startXs[jobIndex], startYs[jobIndex], maxs[jobIndex]);
                    }, time * cnts[jobIndex]);
                } else {
                    ctx.clearRect(0, startYs[jobIndex] - maxH - 1, canvas.width, maxH + 2);
                    drawArr(ctx, curArrs[jobIndex], startXs[jobIndex], startYs[jobIndex], maxs[jobIndex]);
                }
            }
        }
    }
}

// 画矩形
function drawMatrix(ctx, x, y, w, h) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    w && ctx.lineTo(x + w, y);
    let newVar = w && h;
    newVar && ctx.lineTo(x + w, y - h);
    h && ctx.lineTo(x, y - h);
    newVar && ctx.lineTo(x, y);
    ctx.stroke();
}

function drawArr(ctx, curArr, sx, sy, max) {
    for (let i = 0; i < curArr.length; i++) {
        let x = sx + i * padding;
        let y = sy;
        let number = parseInt(curArr[i] / max * maxH);
        ctx.strokeStyle = '#000000';
        drawMatrix(ctx, x, y, width, number);
    }
}

function setAction(ctx, [fx, fy, fh, fx1, fy1, fh1], tmp, x, y, sx, sy, max, time, cnt) {
    if (time) {
        setTimeout(() => {
            drawNode(ctx, [fx, fy, fh, fx1, fy1, fh1], tmp, x, y, sx, sy, max);
        }, time * cnt);
    } else {
        drawNode(ctx, [fx, fy, fh, fx1, fy1, fh1], tmp, x, y, sx, sy, max)
    }
}

// 动画
function drawNode(ctx, [fx, fy, fh, fx1, fy1, fh1], curArr, x, y, sx, sy, max, i = 0) {
    if (i > frameCnt) {
        return;
    }
    ctx.clearRect(0, sy - maxH - 1, canvas.width, maxH + 2);
    drawArr(ctx, curArr, sx, sy, max);
    if (Number.isNaN(fx) || Number.isNaN(fy)) {
        return;
    }
    ctx.strokeStyle = 'red';
    let x1 = fx - i * (fx - x) / frameCnt;
    drawMatrix(ctx, x1, fy, width, fh);
    if (fx1 || fh1) {
        drawMatrix(ctx, fx1, fy1, width, fh1);
        // 横线比较
        let w = fx - fx1;
        if (w > 0) {
            w += width;
        }
        drawMatrix(ctx, fx1, fy1 - fh1, w, 0);
        return;
    }
    if (x1 > x) {
        i++;
        window.requestAnimationFrame(drawNode.bind(this, ctx, [fx, fy, fh], curArr, x, y, i));
    }
}

batchRun(jobArr);