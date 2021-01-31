const express = require("express")
const router = express.Router()

router.get("/", (req, res) => {
    // TODO Replace
    res.send("Sample route")
})

module.exports = router