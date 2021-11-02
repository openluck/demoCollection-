function chart(method) {
    let res = null;
    switch (method) {
        case 'GET':
            res = [20, 30, 50, 12, 60, 19];
            break;
        default:
            res = null;
    }
    return res;
}
module.exports = chart;