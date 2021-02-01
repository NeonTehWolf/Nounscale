const express = require("express")
const hbs = require("express-handlebars")
const cors = require("cors")
const serveIndex = require("serve-index")
const sassMiddleware = require('node-sass-middleware')
const { join } = require("path")
const knex = require("knex")({
    client: "sqlite3",
    connection: {
        filename: "./nounscale.noundb"
    },
    useNullAsDefault: true
})

const session = require("express-session")
const KnexSessionStore = require("connect-session-knex")(session)

const store = new KnexSessionStore({ tablename: "sessions", createtable: true, knex })

if (!knex.schema.hasTable("settings")) {
    knex.schema.createTable("settings", table => {
        table.string("key", 255)
        table.text("value")
    })
}

module.exports = { knex }

const app = express()

app.use(session({
    secret: "eeeeeeeeeee", // change this
    name: "nss",
    resave: false,
    store,
    unset: "destroy",
    saveUninitialized: false
}))

app.engine("hbs", hbs({ extname: ".hbs" }))
app.set("view engine", "hbs")

app.use(cors())

app.use(express.json())

app.use(sassMiddleware({
    src: join(__dirname, 'public'),
    dest: join(__dirname, 'public'),
    outputStyle: 'compressed'
}))

app.use(express.static("public"))

app.use("/admin", require("./routers/admin"))

app.get("/", (req, res) => {
    res.render("index")
})

app.get("/choose", (req, res) => {
    res.render("choose")
})

app.use("/dl", express.static("downloadable"), serveIndex("downloadable", { icons: true }))

const PORT = process.env.PORT || 54879

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`)
})