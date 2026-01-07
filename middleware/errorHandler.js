// module.exports = (err, req, res, next) => {
//     const statusCode = err.statusCode || 500;
//     res.status(statusCode).json({
//         success: false,
//         message: err.message || "Server Error"
//     });
// };

// error handling middleware (err, req, res, next)
module.exports = (err, req, res, next) => {
    res.status(err.statusCode || 500).json({
        message: err.message || "Server Error"
    });
};