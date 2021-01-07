// 多项式编程计算！！！
// 诸如(a+b)(c+d)->a*c+a*d+b*c+b*d形式计算
class Polynomial {
    constructor(expressions) {

        // 存储格式思考
        // 比如 m=(a+b)(c+d)
        let m = ["multi", ["add", "a", "b"], ["add", "c", "d"]];
        // 必须要一个基础机构
        // 计算["add", "a", "b"] 返回一个基础机构
        // 这个机构可以进行+=*/运算,(a+b)*2=>2a+2b
        // 如何计算m
        this.calc(m);
    }
    multiFn(a,b) {
        let isANumber = typeof a == 'number';
        let isAString = false, isAObject = false;
        if (!isANumber) {
            isAString = typeof a == 'string';
            if (isAString) {
                isAObject = typeof a == 'object';
            }
        }
        let isBNumber = typeof b == 'number';
        let isBString = false, isBObject = false;
        if (!isBNumber) {
            isBString = typeof b == 'string';
            if (isBString) {
                isBObject = typeof b == 'object';
            }
        }
        if (isANumber) {
            if (isBNumber) {
                return a * b
            }
            if (isBObject) {
                // 2(3+4)
                return this.calc(a, b);
            }
        }
        if (isAObject) {

        }
        return ["multi", a, b];
    }
    addFn() {

    }
    subFn() {

    }

    calc(polynomial) {
        if (typeof polynomial == 'object') {
            return this[`${polynomial[0]}Fn`](polynomial[1], polynomial[2]);
        }
        return polynomial;
    }



    /**
     * 多项式转换
     * @param {[]}exps
     */
    transfer(exps) {
        for (let exp of exps) {

        }
    }


    /**
     * 多项式变换
     */
    transferLessMultiply(arr) {
        // 统计元素个数
    }



}

/**
 * 多项式参数，分为两个部分，一个是整数或者自然数部分，一个为参数部分(多个),且只能乘积在一起
 */
class PolynomialParam {
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
        if (this.check(a, b)) {
            let molecule = a.molecule * b.denominator + b.molecule * a.denominator;
            let denominator = a.denominator * b.denominator;
            [molecule, denominator] = this.commonDivisor(molecule, denominator);
            return new PolynomialParam(a.param, molecule, denominator);
        }
    }

    sub(a, b) {
        if (this.check(a, b)) {
            let molecule = a.molecule * b.denominator - b.molecule * a.denominator;
            let denominator = a.denominator * b.denominator;
            [molecule, denominator] = this.commonDivisor(molecule, denominator);
            return new PolynomialParam(a.param, molecule, denominator);
        }
    }

    multi(a, b) {
        if (this.check(a, b)) {
            let molecule = a.molecule * b.molecule;
            let denominator = a.denominator * b.denominator;
            [molecule, denominator] = this.commonDivisor(molecule, denominator);
            return new PolynomialParam(a.param, molecule, denominator);
        }
    }

    div(a, b) {
        if (this.check(a, b)) {
            let molecule = a.molecule * b.molecule;
            let denominator = a.denominator * b.denominator;
            [molecule, denominator] = this.commonDivisor(molecule, denominator);
            return new PolynomialParam(a.param, molecule, denominator);
        }
    }

    check(a, b) {
        let bCheck = a instanceof PolynomialParam && b instanceof PolynomialParam;
        bCheck = bCheck && ((!a.key && !b.key) || a.key === b.key);
        return bCheck;
    }

    commonDivisor(a, b) {
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
