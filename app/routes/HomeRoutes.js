const express = require("express")
const router = express.Router();
router.get("/", (req, res) => {
    res.render("welcome", { title: "welcome", name: "node js project", message: "welcome to nodeJs" })
});

module.exports = router;