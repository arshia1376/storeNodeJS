const winston = require("winston")
module.exports = (error, req, res, next) => {
    console.log(error);
    winston.error(error.message, error)
    res.status(500).send(' یه خطلایی سمت ما رخ داده میدل ویر')
}