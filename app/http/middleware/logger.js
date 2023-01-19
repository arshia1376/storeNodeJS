module.exports = (req, res, next) => {
    if (req.query.name === "saeed")
        return res.send("saeed is blocked")
    next();
}