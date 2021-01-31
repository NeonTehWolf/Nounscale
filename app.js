const express = require("express")
const hbs = require("express-handlebars")
const cors = require("cors")

const app = express()

app.engine("hbs", hbs({ extname: ".hbs" }))
app.set("view engine", "hbs")

app.use(cors())

app.use(express.json())

app.use(express.static("public"))

app.use("/auth", require("./routers/auth"))

app.get("/", (req, res) => {
    res.render("index")
})

const PORT = process.env.PORT || 54879

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`)
})