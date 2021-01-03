const sort = require('./sort');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

function rand(max) {
    return Math.floor(Math.random() * max);
}

let o = {};
let arr = [];
let len = 30;
while (arr.length < len) {
    let n = rand(len) + 1;
    if (!o[n]) {
        o[n] = 1;
        arr.push(n)
    }
}

let obj = {};
sort.insertSort(arr, (a, b) => {
    return a > b
}, obj);

// 矩阵数字初始化
let max = 0;
for (let number of arr) {
    if (number > max)
        max = number
}

// 起始位置 画矩形
let startX = 20;
let startY = 500;
let width = 20;
let padding = 25;
let maxH = 200;
let time = 50;
let frameCnt = 20;

function drawArr(ctx, curArr) {
    for (let i = 0; i < curArr.length; i++) {
        let x = startX + i * padding;
        let y = startY;
        let number = parseInt(curArr[i] / max * maxH);
        ctx.strokeStyle = '#000000';
        drawMatrix(ctx, x, y, width, number);
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

let i = 0;

// 动画
function drawNode(ctx, [fx, fy, fh, fx1, fy1, fh1], curArr, x, y) {
    if (i > frameCnt) {
        i = 0;
        return;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawArr(ctx, curArr);
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
    if (x1 < x) {
        i = 0;
    } else {
        i++;
        window.requestAnimationFrame(drawNode.bind(this, ctx, [fx, fy, fh], curArr, x, y));
    }
}

function run() {
    let cnt = 0;
    let curArr = [...obj.data];
    let focus0, focus1, focus2, focus3;
    for (let index = 0; index < obj.process.length; index++) {
        let data = obj.process[index];
        let idx = data[1];
        let value = data[2];
        let x = startX + idx * padding;
        let h = parseInt(value / max * maxH);
        let y = startY - h;
        if (data[0] == 0) {
            focus0 = data[1];
            focus1 = data[2];
            focus2 = data[3];
            focus3 = data[4];
        } else {
            if (data[0] == 2) {
                curArr[data[1]] = data[2]
            }
            let fx = startX + focus0 * padding;
            let fh = parseInt(focus1 / max * maxH);
            let fx1 = startX + focus2 * padding;
            let fh1 = parseInt(focus3 / max * maxH);
            setAction(ctx, [fx, fh, fx1, fh1], [...curArr], x, y, time, cnt);
            if (data[0] == 1) {
                focus0 = idx;
            }
            ++cnt;
        }
    }
    // 最后去掉焦点图形
    setTimeout(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawArr(ctx, curArr);
    }, time * cnt);

    function setAction(ctx, [fx, fh, fx1, fh1], tmp, x, y, time, cnt) {
        setTimeout(() => {
            drawNode(ctx, [fx, startY, fh, fx1, startY, fh1], tmp, x, y)
        }, time * cnt)
    }
}

run();

