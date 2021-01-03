/**
 * 寻找最大子数组
 * @param {[]}arr
 */
module.exports.findSubArray = function (arr) {
    function loop() {

    }

};


function a() {
    return new Promise(((resolve, reject) => {
        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                console.log('a' + i);
            }, 100);
            resolve();
        }
    }));
}

function b() {
    return new Promise(((resolve, reject) => {
        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                console.log('b' + i);
            }, 100);
        }
        resolve();
    }));
}

async function test() {
    await Promise.all(a(), b());
}

test();