const { insertSort } = require('./sort')
let canvas = document.getElementById('canvas')
let ctx = canvas.getContext('2d')

let arr = [9, 1, 8, 2, 7, 3, 6, 4, 5]

let obj = {}
insertSort(arr, (a, b) => {return a > b}, obj)

// 矩阵数字初始化
let max = 0
let min = Number.MAX_VALUE
for (let number of arr) {
  if (number > max)
    max = number
  if (number < min)
    min = number
}

// 起始位置 画矩形
let startX = 50
let startY = 500
let width = 20
let padding = 50

for (let i = 0; i < obj.data.length; i++) {
  // 画矩形
  // 高度基数 200
  let x = startX + i * padding
  let y = startY
  let number = parseInt(obj.data[i] / max * 200)
  drawMatrix(x, y, width, number)
}

function drawMatrix (x, y, w, h) {
  ctx.strokeStyle = '#000000'
  ctx.beginPath()
  ctx.moveTo(x, y)
  ctx.lineTo(x + w, y)
  ctx.lineTo(x + w, y - h)
  ctx.lineTo(x, y - h)
  ctx.lineTo(x, y)
  ctx.stroke()
}

setTimeout(() => {
  let d = []
  let dd = []
  for (let v of obj.process) {
    if (v[0] == 0 && d.length > 0) {
      dd.push([...d])
      d = []
    }
    d.push(v)
  }

  for (let data of dd) {
    actionFns[data[0][0]]()

    function draw () {

      window.requestAnimationFrame(draw.bind(this))
    }
    break
  }

}, 1000)

let actionFns = [
  // p[0]==0的情况
  (data) => {
    // 抹去原来的图形
    let index = data[0][1]
    let value = data[0][2]
    let h = parseInt(value / max * 200)
    let x = startX + index * padding
    let y = startY - h
    ctx.clearRect(x - 1, y - 1, width + 2, h + 2)
  },
]

// 开始排序
// function doAction (p, ms) {
//   setTimeout(() => {
//
//
//
//   }, ms)
// }
//
// // 刷新频率 半秒一刷新
// let i = 500
// let totalTime = 500 * obj.process.length
// setInterval(() => {
//   let n = 0
//   for (let p of obj.process) {
//     ++n
//     doAction(p, i * n)
//   }
// }, totalTime)



