import express, { json } from "express"
import app from "../app.js"
import fs from "fs/promises"
import dirname from "es-dirname"
import path from "path"

const router = express.Router()

router.get("/words", async (req, res) => {
    const wordlistname_list = await app.knex.table("settings").select("value").where({ key: "wordlist" })

    const wordlistname = wordlistname_list[0]?.value

    // FIXME throw an error instead of giving placeholders
    if (!wordlistname) return res.json(["Error", "No word list loaded"])

    const wordlist = JSON.parse((await fs.readFile(path.join(dirname(), "..", "downloadable", "word_lists", wordlistname + ".json"))).toString())

    let wordA
    let wordB

    do {
        wordA = wordlist[Math.floor(Math.random() * wordlist.length)]
        wordB = wordlist[Math.floor(Math.random() * wordlist.length)]
    } while (wordA === wordB) // prevent having the choice between the same word twice

    res.json([wordA, wordB])
})

export default router