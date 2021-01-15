// 多项式编程计算！！！
// 诸如(a+b)(c+d)->a*c+a*d+b*c+b*d形式计算
let opSet = new Set();
opSet.add('*');
opSet.add('/');
opSet.add('+');
opSet.add('-');
const regExp = /[+\-*/]/;

class Polynomial {
    constructor(expression, nodeClazz = TreeNode) {
        this.deserialize(expression, nodeClazz);
    }

    get data() {
        return this._data;
    }

    get node() {
        return this._node;
    }

    serialize() {
        return this.node.toString();
    }

    deserialize(exp, nodeClazz) {
        if (typeof exp == 'string') {
            function bracketsHandle(exp, data, leftIndex, rightIndex) {
                // 获取最近的括号并处理
                data[rightIndex] = exp.substring(leftIndex + 1, rightIndex);
                data[leftIndex] = {end: rightIndex};
            }

            let i = -1;
            let dt = [];
            // 先找括号
            let leftBrackets = [];
            while (i++ < exp.length) {
                if (exp[i] === '(') {
                    leftBrackets.push(i);
                } else if (exp[i] === ')') {
                    if (leftBrackets.length === 0) {
                        throw new Error("表达式非法");
                    }
                    bracketsHandle(exp, dt, leftBrackets.pop(), i);
                }
            }
            if (leftBrackets.length > 0) {
                throw new Error("表达式非法");
            }

            function loop(exp, data, result, start, end) {
                let lastStartIndex = start;
                for (let j = start; j < end;) {
                    let value = data[j];
                    if (value && value.end) {
                        j > lastStartIndex && result.push(exp.substring(lastStartIndex, j));
                        let inner = [];
                        result.push(inner);
                        // 去掉括号,遍历括号内数据
                        loop(exp, data, inner, j + 1, value.end - 1);
                        j = value.end + 1;
                        lastStartIndex = j;
                    } else {
                        j++;
                    }
                }
                if (lastStartIndex === start) {
                    result.push(exp.substring(lastStartIndex, end + 1));
                }
            }

            let dd = [];
            loop(exp, dt, dd, 0, exp.length);

            this._node = this.genNode(dd, nodeClazz);
            this._data = this.deserializeDetail(dd);
        }
    }

    /**
     * 反虚拟化四则运算和PolynomialParameter对象
     * 没有乘法运算符的处理函数
     */
    deserializeDetail(data) {
        if (!data || typeof data != 'object') {
            return;
        }
        let arr = [];
        for (let i = 0; i < data.length; i++) {
            if (typeof data[i] == 'string') {
                if (data[i].match(regExp)) {
                    let index = 0;
                    for (let j = 0; j < data[i].length; j++) {
                        if (data[i][j].match(regExp)) {
                            j > index && arr.push(data[i].substring(index, j));
                            arr.push(data[i][j]);
                            index = j + 1;
                        }
                    }
                    index < data[i].length && arr.push(data[i].substring(index));
                } else {
                    arr.push(data[i]);
                }
            } else {
                let detail = this.deserializeDetail(data[i]);
                detail && arr.push(detail);
            }
        }
        return arr;
    }

    deserializePolynomialParameter(exp) {

    }

    genNode(data, clazz) {
        let arr = [];
        let nArr = [];
        let tag = 0;
        let lastIndex = 0;
        for (let i = 0; i < data.length; i++) {
            let detail = data[i];
            if (typeof detail == 'object') {
                arr[i] = this.genNode(detail, clazz);
                arr[i].prefix = "(";
                let node = arr[i].treeLoop('right');
                node.suffix = ")";
            } else {
                if (detail.match(regExp) && detail.length > 1) {
                    arr[i] = this.analysis(detail, clazz);
                } else {
                    arr[i] = detail;
                    tag |= 1;
                }
            }

            if (tag & 1) {
                if (i === lastIndex + 2) {
                    let node = arr[i - 1];  // 符号位
                    node.left = nArr[i - 2] || arr[i - 2];
                    node.right = arr[i];

                    nArr[i] = node;
                    lastIndex = i;
                    tag = 0;
                }
            } else if (i === lastIndex + 1) {
                let node;
                let leftNode = nArr[i - 1] || arr[i - 1];
                let rightNode = arr[i];
                if (leftNode.isOperator && !leftNode.right) {
                    node = leftNode;
                    node.right = rightNode;
                }else if (rightNode.isOperator && !rightNode.left) {
                    node = rightNode;
                    node.left = leftNode;
                } else {
                    node = new clazz('*', leftNode, rightNode);
                }

                nArr[i] = node;
                lastIndex = i;
                tag = 0;
            }
        }
        return nArr[lastIndex] || arr[lastIndex];
    }

    /**
     *
     * @param exp 当前表达式
     * @param clazz 树模型
     */
    analysis(exp, clazz) {
        // 解析最简单的表达式 不包含括号
        // step1 关键字解析 暂时省略
        // step2 提取
        let param = '';
        let arr = [];
        let curNodeIndex;
        for (let i = 0; i < exp.length; i++) {
            if (opSet.has(exp[i])) {
                if (curNodeIndex == null) {
                    let left = new clazz(param);
                    param = '';
                    arr[i] = new clazz(exp[i], left, null);
                    curNodeIndex = i;
                } else {
                    arr[i] = new clazz(exp[i]);
                    if (!arr[curNodeIndex].right && param !== '') {
                        arr[curNodeIndex].right = new clazz(param);
                        param = '';
                    }
                    arr[i].left = arr[curNodeIndex];
                    curNodeIndex = i;
                }

            } else {
                param += exp[i];
            }
        }
        if (curNodeIndex != null && !arr[curNodeIndex].right && param !== '') {
            arr[curNodeIndex].right = new clazz(param);
        }
        return arr[curNodeIndex];
    }
}

/**
 * 多项式参数，分为两个部分，一个是整数或者自然数部分，一个为参数部分(多个),且只能乘积在一起
 */
class PolynomialParameter {
    constructor(param, molecule = 1, denominator = 1) {
        this._molecule = molecule;// 分子
        this._denominator = denominator;// 分母
        this._num = molecule / denominator;
        if (param && param instanceof Array) {
            param.sort((a, b) => {
                return a > b
            });
            let key = '';
            for (let p of param) {
                key += p;
            }
            this._key = key;
            this._param = [...param];
        } else if (param && typeof param == 'string') {
            this._key = param;
            this._param = [param];
        }
    }

    get key() {
        return this._key;
    }

    get param() {
        return this._param;
    }

    get num() {
        return this._num;
    }

    get denominator() {
        return this._denominator;
    }

    get molecule() {
        return this._molecule;
    }

    add(a, b) {
        if (this._check(a, b)) {
            let molecule = a.molecule * b.denominator + b.molecule * a.denominator;
            let denominator = a.denominator * b.denominator;
            [molecule, denominator] = this._commonDivisor(molecule, denominator);
            return new PolynomialParameter(a.param, molecule, denominator);
        }
    }

    sub(a, b) {
        if (this._check(a, b)) {
            let molecule = a.molecule * b.denominator - b.molecule * a.denominator;
            let denominator = a.denominator * b.denominator;
            [molecule, denominator] = this._commonDivisor(molecule, denominator);
            return new PolynomialParameter(a.param, molecule, denominator);
        }
    }

    multi(a, b) {
        if (this._check(a, b)) {
            let molecule = a.molecule * b.molecule;
            let denominator = a.denominator * b.denominator;
            [molecule, denominator] = this._commonDivisor(molecule, denominator);
            return new PolynomialParameter(a.param, molecule, denominator);
        }
    }

    _check(a, b) {
        let bCheck = this._checkType(a, b);
        bCheck = bCheck && ((!a.key && !b.key) || a.key === b.key);
        return bCheck;
    }

    _checkType(a, b) {
        return a instanceof PolynomialParameter && b instanceof PolynomialParameter;
    }

    _commonDivisor(a, b) {
        let min = b, max = a;
        let isAMin = a < b;
        if (isAMin) {
            min = a;
            max = b;
        }
        let k = 2;
        let rMin = min, rMax = max;
        while (min > 1 && k <= min) {
            let cnt = 0;
            while (min % k === 0) {
                min = min / k;
                cnt++;
            }
            let maxCnt = 0;
            while (maxCnt < cnt && max % k === 0) {
                max = max / k;
                maxCnt++;
            }
            if (maxCnt > 0) {
                let cd = Math.pow(k, maxCnt);
                rMin = rMin / cd;
                rMax = rMax / cd;
            }
            if (k > 2) {
                k += 2;
            } else {
                k++;
            }
        }
        return isAMin ? [rMin, rMax] : [rMax, rMin];
    }
}

class TreeNode {
    constructor(root, left, right, prefix = '', suffix = '') {
        this._isOperator = opSet.has(root);
        this._root = root;
        this._left = left;
        this._right = right;
        this._prefix = prefix;
        this._suffix = suffix;
        this._isDisplayMultiplyOperator = false;
    }

    set isDisplayMultiplyOperator(value) {
        this._isDisplayMultiplyOperator = !!value;
    }

    set left(node) {
        this._left = node;
    }

    set right(node) {
        this._right = node;
    }

    set prefix(prefix) {
        this._prefix = prefix;
    }

    set suffix(suffix) {
        this._suffix = suffix;
    }

    get isOperator() {
        return this._isOperator;
    }

    get left() {
        return this._left;
    }

    get right() {
        return this._right;
    }

    toString() {
        let str = this._prefix;
        str += this._left && this._left.toString() || '';
        str += this._root &&  this._root.toString() || '';
        str += this._right && this._right.toString() || '';
        str += this._suffix;
        if (!this._isDisplayMultiplyOperator) {
            str = str.replace("*", "");
        }
        return str;
    }

    treeLoop(leftOrRight) {
        if (this[leftOrRight]) {
            return this.treeLoop(this[leftOrRight]);
        } else {
            return this;
        }
    }
}


let polynomial = new Polynomial("(a-(c-(b-(e-(f+k)))))(e+f)");
console.log(polynomial.data);
console.log(polynomial.node.toString());