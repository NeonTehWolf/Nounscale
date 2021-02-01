const express = require("express")
const router = express.Router()

router.get("/login", (req, res) => {
    res.render("admin/login")
})

router.use((req, res, next) => {
    if (!req.session.admin) return res.redirect("/admin/login")
    next()
})

router.get("/", (req, res) => {
    res.send("Sample route")
})


module.exports = router