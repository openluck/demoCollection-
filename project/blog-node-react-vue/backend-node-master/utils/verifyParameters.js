module.exports = (err, req, res, next) => {
    if (err.isJoi) {
        res.json({
            code: 100,
            msg: err.message
        })
    } else {
        next(err)
    }
}