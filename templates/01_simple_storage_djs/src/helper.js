exports.validate = n => {
    n = +n
    if (n < 0) {
        throw new Error('Number can not be negative.')
    }
    if (!Number.isInteger(n)) {
        throw new Error('Number must be integer.')
    }
    return n
}
