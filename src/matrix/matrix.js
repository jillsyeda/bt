class Matrix {
    constructor() {
        this.data = [];
    }

    getRow(i) {
        return this.data[i];
    }

    squareMatrixMultiply(a, b) {
        // c[i][j]= a[i][k]*b[k][j]
        let c = [];
        for (let i = 0; i < a.length; i++) {
            for (let k = 0; k < a[i].length; k++) {
                if (a[i].length !== b.length) {
                    throw new Error("matrix multiply length error");
                }
                for (let j = 0; j < b[k].length; j++) {
                    if (c[i] == null) {
                        c[i] = [];
                    }
                    if (c[i][j] == null) {
                        c[i][j] = 0;
                    }
                    c[i][j] += a[i][k] * b[k][j];
                }
            }
        }
        return c;
    }
}
