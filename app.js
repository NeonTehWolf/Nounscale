import express from "express"
import hbs from "express-handlebars"
import cors from "cors"
import serveIndex from "serve-index"
import sassMiddleware from 'node-sass-middleware'
import { join } from "path"
import session from "express-session"
import { config } from "./config.js"
import __KnexSessionStore from "connect-session-knex"
import __knex from "knex"
import dirname from "es-dirname"


const KnexSessionStore = __KnexSessionStore(session)
const knex = __knex({
    client: "sqlite3",
    connection: {
        filename: "./nounscale.noundb"
    },
    useNullAsDefault: true
})

const store = new KnexSessionStore({ tablename: "sessions", createtable: true, knex })

if (!await knex.schema.hasTable("settings")) {
    await knex.schema.createTable("settings", table => {
        table.string("key", 255)
        table.text("value")
    })
}

export default { knex }

import apiRoute from "./routers/api.js"
import adminRoute from "./routers/admin.js"

const app = express()

app.use(session({
    secret: config.cookieSecret,
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
    src: join(dirname(), 'public'),
    dest: join(dirname(), 'public'),
    outputStyle: 'compressed'
}))

app.use(express.static("public"))

app.use("/admin", adminRoute)
app.use("/api", apiRoute)

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