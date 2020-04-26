const express = require('express')
const bodyParser = require('body-parser')
const Actions = require('./actions')

const cors = require('cors')
// const { PrismaClient } = require('@prisma/client')

// const prisma = new PrismaClient()
const app = express()

app.use(bodyParser.json())

app.use(cors())
app.post('/action', async(req, res) => {

    try {
        Actions[req.body.action](req, res)
    }
    catch (err) {
        res.json({
            status: "400",
            message: err.message,
            data: req.body.action
        })
    }
})

const server = app.listen(3000, () =>
    console.log(
        '🚀 Server ready at: http://84.201.146.38:3000',
    ),
)
