module.exports = (req, res, next) => {
    res.status(404).json({
        status: 'fail',
        message: `Page not found.`
})};