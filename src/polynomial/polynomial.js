// 多项式编程计算！！！
// 诸如(a+b)(c+d)->a*c+a*d+b*c+b*d形式计算
class Polynomial {
    constructor(expression) {
        this.deserialize(expression);
    }

    get data() {
        return this._data;
    }

    serialize() {

    }

    deserialize(exp) {
        // (a+b)(c+d)=>  [multi,[add,a,b],[add,c,d]];
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
                        i = i-start;
                    }
                    left.push(i);
                }else if (exp[i] === ')') {
                    right.push(i);
                }
            }
            if (right.length > 0) {
                loop(exp, data, left, right);
            }
            // this.deserializeDetail(data);
            this._data = data;
        }
    }

    /**
     * 反虚拟化四则运算和PolynomialParameter对象
     * 没有乘法运算符的处理函数
     */
    deserializeDetail(data) {
        for (let i = 0; i < data.length; i++) {
            if (typeof data[i] != 'object') {
                data[i] = this.deserializePolynomialParameter(data[i]);
            } else {
                // object
                // 查看前一个和后一个的
            }
        }
    }

    deserializePolynomialParameter(exp) {

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


// xing 18180986598


let polynomial = new Polynomial("a(m+n)-(f-b)");
console.log(polynomial.data);