import "dotenv/config"

import express from "express";

const app = express()
app.use(express.json())

app.get("/", (_req, res) => {
    console.log("someone pinged here!!")
    res.send('pong')
})

app.listen(process.env.PORT,() => {
    console.log(`Server running on port ${process.env.PORT}`)
})