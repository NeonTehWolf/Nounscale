import { Router } from "express"
import { config } from "../config.js"
import { readdir } from "fs/promises"
import { join, parse } from "path"
import dirname from "es-dirname"
import app from "../app.js"
import util from "util"
import { writeFileSync } from "fs"

const router = Router()

router.get("/login", (req, res) => {
    if (req.session.admin) return res.redirect("/admin")
    res.render("admin/login")
})

router.post("/loginapi", (req, res) => {
    if (!req.body.password) return res.json({ error: "Needs a defined password" })

    if (req.body.password !== config.adminPassword) return res.json({ error: "Incorrect password" })

    req.session.admin = true;
    res.json({ success: true })
})

router.use((req, res, next) => {
    if (!req.session.admin) return res.redirect("/admin/login")
    next()
})

router.get("/", (req, res) => {
    res.render("admin/dashboard")
})

router.get("/ranking", async (req, res) => {
    res.render("admin/ranking")
})

router.get("/settings", async (req, res) => {
    const lists = await readdir(join(dirname(), "..", "downloadable", "word_lists"))
    const wordlists = await app.knex.from("settings").select("value").where({ key: "wordlist" })

    let hasCurrentValue = !!wordlists.length

    const currentValue = wordlists[0]?.value

    res.render("admin/settings", {
        lists: lists.map(l => parse(l).name),
        has_current_value: hasCurrentValue,
        current_value: currentValue
    })
})

router.get("/logout", (req, res) => {
    req.session.destroy((e) => {
        if (e) console.error(e)
    })
    res.redirect("/admin/login")
})

router.post("/api/settings/wordlist", async (req, res) => {
    if (!req.body.newlist) return res.json({ error: "Provide valid list name" })
    const lists = (await readdir(join(dirname(), "..", "downloadable", "word_lists"))).map(x => parse(x).name)
    if (!lists.includes(req.body.newlist)) return res.json({ error: "List not found" })

    const hasCurrentValue = !!(await app.knex.from("settings").select("value").where({ key: "wordlist" })).length

    if (!hasCurrentValue) {
        await app.knex.table("settings").insert({ key: "wordlist", value: req.body.newlist })
    } else {
        await app.knex.table("settings").where({ key: "wordlist" }).update({ value: req.body.newlist })
    }

    res.json({ success: true })
})

export default router