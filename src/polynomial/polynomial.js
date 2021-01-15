// 多项式编程计算！！！
// 诸如(a+b)(c+d)->a*c+a*d+b*c+b*d形式计算
let opSet = new Set();
opSet.add('*');
opSet.add('/');
opSet.add('+');
opSet.add('-');
const regExp = /[+\-*/]/;

class Polynomial {
    constructor(expression) {
        this.deserialize(expression);
    }

    get data() {
        return this._data;
    }

    get node() {
        return this._node;
    }

    serialize() {

    }

    deserialize(exp) {
        if (typeof exp == 'string') {
            function loop(exp, data, left, right, x = 0, y = 0) {
                if (left.length <= 0) {
                    exp.length > 0 && data.push(x > 0 || y > 0 ? exp.substring(x, y) : exp);
                    return;
                }
                if (left[0] >= 1) {
                    data.push(exp.substring(x, left[0]));
                }
                let inner = [];
                data.push(inner);
                loop(exp, inner, left.slice(1), right.slice(0, right.length - 1), left[0] + 1, right[right.length - 1]);
            }

            let i = -1;
            let data = [];
            // 先找括号
            let left = [];
            let right = [];
            while (i++ < exp.length) {
                if (exp[i] === '(') {
                    if (right.length > 0) {
                        loop(exp, data, left, right);
                        let start = right[right.length - 1] + 1;
                        exp = exp.substring(start, exp.length);
                        left = [];
                        right = [];
                        if (exp.length <= 0) {
                            break;
                        }
                        i = i - start;
                    }
                    left.push(i);
                } else if (exp[i] === ')') {
                    right.push(i);
                }
            }
            if (right.length > 0) {
                loop(exp, data, left, right);
            }
            this._node = this.genNode(data);
            this._data = this.deserializeDetail(data);
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

    genNode(data, clazz = TreeNode) {
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
                tag |= 4;
            } else {
                if (detail.match(regExp) && detail.length > 1) {
                    arr[i] = this.analysis(detail, clazz);
                    tag |= 2;
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
                    tag = 4;
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
                    node = new TreeNode('*', leftNode, rightNode);
                }

                nArr[i] = node;
                lastIndex = i;
                tag = 4;
            }
        }
        return nArr[lastIndex] || arr[lastIndex];
    }

    /**
     *
     * @param exp 当前表达式
     * @param clazz 树模型
     */
    analysis(exp, clazz = TreeNode) {
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
        str += this._root && this._root.toString() || '';
        str += this._right && this._right.toString() || '';
        str += this._suffix;
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


let polynomial = new Polynomial("(a+(c+b)(e+f))(a+d)");
console.log(polynomial.data);
console.log(polynomial.node.toString());